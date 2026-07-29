import { ScheduleAdminPlayer } from 'services/tournaments.service';

export interface AutoFixInput {
  players: ScheduleAdminPlayer[];
  previousOpponents: Record<string, string[]>;
  schedulesWithoutPair: {
    scheduleId: string;
    gameCode: string;
    dueDate: string;
    existingPlayer: ScheduleAdminPlayer & { side: string };
  }[];
  playersBelowTarget: {
    userId: string;
    fullName: string;
    rating: number;
    tldCode: string;
    currentGames: number;
    gamesNeeded: number;
  }[];
  targetGamesPerPlayer: number;
  tournamentId: string;
  tournamentName: string;
}

export interface FilledOrphan {
  scheduleId: string;
  gameCode: string;
  dueDate: string;
  existingPlayerId: string;
  existingPlayerSide: string;
  opponentPlayerId: string;
  randomSides: boolean;
}

export interface NewPairing {
  usaPlayerId: string;
  ussrPlayerId: string;
  gameCode: string;
  randomSides: boolean;
  dueDate: string;
}

export interface AutoFixResult {
  filledOrphans: FilledOrphan[];
  newPairings: NewPairing[];
  warnings: string[];
}

export function autoFixSchedules(input: AutoFixInput): AutoFixResult {
  const {
    players,
    previousOpponents,
    schedulesWithoutPair,
    playersBelowTarget,
    targetGamesPerPlayer,
  } = input;

  const warnings: string[] = [];
  const playerMap = new Map(players.map(p => [p.userId, p]));

  // Build game count per player
  const gameCount = new Map<string, number>();
  for (const p of playersBelowTarget) {
    gameCount.set(p.userId, p.currentGames);
  }
  for (const s of schedulesWithoutPair) {
    const pid = s.existingPlayer.userId;
    if (!gameCount.has(pid)) {
      gameCount.set(pid, targetGamesPerPlayer - 1);
    }
  }

  const pairKey = (a: string, b: string) =>
    a < b ? `${a}:${b}` : `${b}:${a}`;

  const usedPairs = new Set<string>();
  for (const [userId, opponents] of Object.entries(previousOpponents)) {
    for (const oppId of opponents) {
      usedPairs.add(pairKey(userId, oppId));
    }
  }

  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 30);

  console.log('[AutoFix] Players below target:', playersBelowTarget.length);
  console.log('[AutoFix] Schedules without pair:', schedulesWithoutPair.length);
  console.log('[AutoFix] Previous opponent pairs blocked:', usedPairs.size);
  console.log('[AutoFix] Game counts:', Object.fromEntries(gameCount));

  // ── Phase 1: Fill orphaned schedules ──────────────────────────────────
  // For each scheduleWithoutPair, find an opponent from playersBelowTarget
  const filledOrphans: FilledOrphan[] = [];

  const sortedOrphans = [...schedulesWithoutPair].sort((a, b) => {
    const gamesA = gameCount.get(a.existingPlayer.userId) ?? 0;
    const gamesB = gameCount.get(b.existingPlayer.userId) ?? 0;
    return gamesA - gamesB;
  });

  for (const orphan of sortedOrphans) {
    const existingPlayer = orphan.existingPlayer;
    const existingId = existingPlayer.userId;

    let bestOpponent: ScheduleAdminPlayer | null = null;
    let bestDiff = Infinity;

    for (const p of playersBelowTarget) {
      if (p.userId === existingId) continue;
      if ((gameCount.get(p.userId) ?? 0) >= targetGamesPerPlayer) continue;

      const pk = pairKey(existingId, p.userId);
      if (usedPairs.has(pk)) continue;

      const diff = Math.abs(existingPlayer.rating - p.rating);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestOpponent = p as ScheduleAdminPlayer;
      }
    }

    if (bestOpponent) {
      const opponentId = bestOpponent.userId;
      usedPairs.add(pairKey(existingId, opponentId));
      gameCount.set(existingId, (gameCount.get(existingId) ?? 0) + 1);
      gameCount.set(opponentId, (gameCount.get(opponentId) ?? 0) + 1);

      filledOrphans.push({
        scheduleId: orphan.scheduleId,
        gameCode: orphan.gameCode,
        dueDate: orphan.dueDate,
        existingPlayerId: existingId,
        existingPlayerSide: existingPlayer.side,
        opponentPlayerId: opponentId,
        randomSides: false,
      });

      console.log(`[AutoFix] Phase 1: Filled orphan ${orphan.scheduleId} — ${existingPlayer.fullName} vs ${bestOpponent.fullName} (rating diff: ${bestDiff})`);
    } else {
      console.log(`[AutoFix] Phase 1: Could not fill orphan ${orphan.scheduleId} for ${existingPlayer.fullName} (rating: ${existingPlayer.rating})`);
    }
  }

  // ── Phase 2: Create new pairings among remaining playersBelowTarget ───
  const newPairings: NewPairing[] = [];

  const remainingBelowTarget = playersBelowTarget
    .filter(p => (gameCount.get(p.userId) ?? 0) < targetGamesPerPlayer)
    .sort((a, b) => {
      const gamesA = gameCount.get(a.userId) ?? 0;
      const gamesB = gameCount.get(b.userId) ?? 0;
      const neededA = targetGamesPerPlayer - gamesA;
      const neededB = targetGamesPerPlayer - gamesB;
      return neededB - neededA;
    });

  console.log('[AutoFix] Phase 2: Remaining players below target:', remainingBelowTarget.length);
  console.log('[AutoFix] Phase 2: Game counts after phase 1:', Object.fromEntries(
    remainingBelowTarget.map(p => [p.fullName, gameCount.get(p.userId) ?? 0])
  ));

  while (true) {
    let bestPair: [typeof remainingBelowTarget[0], typeof remainingBelowTarget[0]] | null = null;
    let bestDiff = Infinity;

    for (let i = 0; i < remainingBelowTarget.length; i++) {
      const a = remainingBelowTarget[i];
      const gamesA = gameCount.get(a.userId) ?? 0;
      if (gamesA >= targetGamesPerPlayer) continue;

      for (let j = i + 1; j < remainingBelowTarget.length; j++) {
        const b = remainingBelowTarget[j];
        const gamesB = gameCount.get(b.userId) ?? 0;
        if (gamesB >= targetGamesPerPlayer) continue;

        const pk = pairKey(a.userId, b.userId);
        if (usedPairs.has(pk)) continue;

        const diff = Math.abs(a.rating - b.rating);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestPair = [a, b];
        }
      }
    }

    if (!bestPair) break;

    const [a, b] = bestPair;
    const usaPlayer = a.rating >= b.rating ? a : b;
    const ussrPlayer = a.rating >= b.rating ? b : a;

    newPairings.push({
      usaPlayerId: usaPlayer.userId,
      ussrPlayerId: ussrPlayer.userId,
      gameCode: '',
      randomSides: false,
      dueDate: defaultDueDate.toISOString(),
    });

    usedPairs.add(pairKey(a.userId, b.userId));
    gameCount.set(a.userId, (gameCount.get(a.userId) ?? 0) + 1);
    gameCount.set(b.userId, (gameCount.get(b.userId) ?? 0) + 1);
  }

  // ── Check for players still below target ──────────────────────────────
  const stillBelow = playersBelowTarget.filter(
    p => (gameCount.get(p.userId) ?? 0) < targetGamesPerPlayer
  );

  if (stillBelow.length > 0) {
    console.log('[AutoFix] Still below target after both phases:', stillBelow.map(p => `${p.fullName}(${gameCount.get(p.userId)}/${targetGamesPerPlayer})`));
    warnings.push(
      `${stillBelow.length} player(s) still below ${targetGamesPerPlayer} games: ${stillBelow.map(p => `${p.fullName} (${gameCount.get(p.userId)}/${targetGamesPerPlayer})`).join(', ')}`
    );
  }

  const totalGenerated = filledOrphans.length + newPairings.length;
  console.log(`[AutoFix] Done: ${filledOrphans.length} orphans filled, ${newPairings.length} new pairings created (${totalGenerated} total)`);

  return { filledOrphans, newPairings, warnings };
}
