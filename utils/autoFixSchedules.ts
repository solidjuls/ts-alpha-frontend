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
  removedOrphanIds: string[];
  warnings: string[];
}

function generateGameCode(): string {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numbers = String(Math.floor(100 + Math.random() * 900));
  return `${letter}${numbers}`;
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
      gameCount.set(pid, 0);
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
  console.log('[AutoFix] Players below target details:', playersBelowTarget.map(p => `${p.fullName}(${p.currentGames})`).join(', '));

  // ── Phase 0: Pair orphan players with each other ─────────────────────
  // Match USA orphans with USSR orphans to fill without external opponents
  const removedOrphanIds: string[] = [];
  const filledOrphans: FilledOrphan[] = [];
  
  // Separate orphans by side
  const usaOrphans = schedulesWithoutPair.filter(o => o.existingPlayer.side === 'usa');
  const ussrOrphans = schedulesWithoutPair.filter(o => o.existingPlayer.side === 'ussr');
  
  console.log(`[AutoFix] Phase 0: ${usaOrphans.length} USA orphans, ${ussrOrphans.length} USSR orphans`);
  
  // Track which orphans have been processed
  const processedOrphanIds = new Set<string>();
  
  // Try to match each USA orphan with a USSR orphan
  for (const usaOrphan of usaOrphans) {
    if (processedOrphanIds.has(usaOrphan.scheduleId)) continue;
    
    const usaPlayer = usaOrphan.existingPlayer;
    const usaId = usaPlayer.userId;
    
    // Skip if USA player already at target
    if ((gameCount.get(usaId) ?? 0) >= targetGamesPerPlayer) {
      console.log(`[AutoFix] Phase 0: Skip USA orphan ${usaOrphan.scheduleId} — ${usaPlayer.fullName} already at target`);
      continue;
    }
    
    // Find a matching USSR orphan
    let bestMatch: typeof ussrOrphans[0] | null = null;
    
    for (const ussrOrphan of ussrOrphans) {
      if (processedOrphanIds.has(ussrOrphan.scheduleId)) continue;
      
      const ussrPlayer = ussrOrphan.existingPlayer;
      const ussrId = ussrPlayer.userId;
      
      // Skip if USSR player already at target
      if ((gameCount.get(ussrId) ?? 0) >= targetGamesPerPlayer) continue;
      
      // Skip if they've played each other
      const pk = pairKey(usaId, ussrId);
      if (usedPairs.has(pk)) continue;
      
      // Found a match!
      bestMatch = ussrOrphan;
      break;
    }
    
    if (bestMatch) {
      const ussrPlayer = bestMatch.existingPlayer;
      const ussrId = ussrPlayer.userId;
      
      // Fill the USA orphan with the USSR player
      usedPairs.add(pairKey(usaId, ussrId));
      gameCount.set(usaId, (gameCount.get(usaId) ?? 0) + 1);
      gameCount.set(ussrId, (gameCount.get(ussrId) ?? 0) + 1);
      
      filledOrphans.push({
        scheduleId: usaOrphan.scheduleId,
        gameCode: usaOrphan.gameCode,
        dueDate: usaOrphan.dueDate,
        existingPlayerId: usaId,
        existingPlayerSide: 'usa',
        opponentPlayerId: ussrId,
        randomSides: false,
      });
      
      // Mark the USSR orphan for removal
      removedOrphanIds.push(bestMatch.scheduleId);
      processedOrphanIds.add(usaOrphan.scheduleId);
      processedOrphanIds.add(bestMatch.scheduleId);
      
      console.log(`[AutoFix] Phase 0: ✅ Paired orphans — ${usaOrphan.scheduleId} filled (${usaPlayer.fullName} vs ${ussrPlayer.fullName}), ${bestMatch.scheduleId} removed`);
    }
  }
  
  console.log(`[AutoFix] Phase 0 Summary: ${filledOrphans.length} orphans paired, ${removedOrphanIds.length} orphans removed`);
  
  // ── Phase 1: Fill remaining orphaned schedules ────────────────────────
  // For remaining orphans, find an opponent from playersBelowTarget
  const remainingOrphans = schedulesWithoutPair.filter(o => !processedOrphanIds.has(o.scheduleId));

  const sortedOrphans = [...remainingOrphans].sort((a, b) => {
    const gamesA = gameCount.get(a.existingPlayer.userId) ?? 0;
    const gamesB = gameCount.get(b.existingPlayer.userId) ?? 0;
    return gamesA - gamesB;
  });

  console.log(`[AutoFix] Phase 1: ${remainingOrphans.length} remaining orphans to fill with external opponents`);

  for (const orphan of sortedOrphans) {
    const existingPlayer = orphan.existingPlayer;
    const existingId = existingPlayer.userId;

    // Skip if existing player already at target
    if ((gameCount.get(existingId) ?? 0) >= targetGamesPerPlayer) {
      console.log(`[AutoFix] Phase 1: Skip orphan ${orphan.scheduleId} — existing player ${existingPlayer.fullName} already at target (${gameCount.get(existingId)} games)`);
      continue;
    }

    let bestOpponent: ScheduleAdminPlayer | null = null;
    let bestDiff = Infinity;
    const skipReasons = { samePlayer: 0, atTarget: 0, previousOpponent: 0, available: 0 };

    for (const p of playersBelowTarget) {
      if (p.userId === existingId) {
        skipReasons.samePlayer++;
        continue;
      }
      if ((gameCount.get(p.userId) ?? 0) >= targetGamesPerPlayer) {
        skipReasons.atTarget++;
        continue;
      }

      const pk = pairKey(existingId, p.userId);
      if (usedPairs.has(pk)) {
        skipReasons.previousOpponent++;
        continue;
      }

      skipReasons.available++;
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

      console.log(`[AutoFix] Phase 1: ✅ Filled orphan ${orphan.scheduleId} — ${existingPlayer.fullName} vs ${bestOpponent.fullName} (rating diff: ${bestDiff})`);
    } else {
      console.log(`[AutoFix] Phase 1: ❌ Could not fill orphan ${orphan.scheduleId} for ${existingPlayer.fullName} (games: ${gameCount.get(existingId)})`);
      console.log(`   Skip reasons: samePlayer=${skipReasons.samePlayer}, atTarget=${skipReasons.atTarget}, previousOpponent=${skipReasons.previousOpponent}, available=${skipReasons.available}`);
    }
  }

  const phase1Fills = filledOrphans.length - removedOrphanIds.length;
  console.log(`[AutoFix] Phase 1 Summary: ${phase1Fills}/${remainingOrphans.length} remaining orphans filled with external opponents`);

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
      gameCode: generateGameCode(),
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
  console.log(`[AutoFix] Done: ${filledOrphans.length} orphans filled (${removedOrphanIds.length} by orphan-to-orphan pairing, ${phase1Fills} by external opponents), ${newPairings.length} new pairings created, ${removedOrphanIds.length} orphans removed`);

  return { filledOrphans, newPairings, removedOrphanIds, warnings };
}
