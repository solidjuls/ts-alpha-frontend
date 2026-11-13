import { useReducer, useMemo, useState, useEffect } from "react";
import { Spinner } from "@radix-ui/themes";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useCreateSchedulesBulk, useDeleteSchedule } from "hooks/useSchedule";
import { autoFixSchedules, AutoFixResult } from "utils/autoFixSchedules";
import { ScheduleItem } from "services/schedule.service";
import { FlagIcon } from "components/FlagIcon";
import Text from "components/Text";
import { format as formatDate } from "date-fns";

const TARGET_GAMES = 20;

const boxStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: "200px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "12px",
  background: "var(--bg-card)",
  overflow: "auto",
};

const titleStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "8px",
  borderBottom: "1px solid var(--border)",
  paddingBottom: "6px",
};

const rowStyle: React.CSSProperties = {
  fontSize: "11px",
  lineHeight: "1.6",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const sectionStyle: React.CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  background: "var(--bg-card)",
};

const btnStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  fontWeight: 600,
  color: "var(--primary-text)",
  backgroundColor: "var(--bg-card)",
  cursor: "pointer",
};

// ─── Types ──────────────────────────────────────────────────────────────────

interface PlayerInfo {
  userId: string;
  fullName: string;
  tldCode: string;
}

interface LocalSchedule {
  scheduleId: string;
  gameCode: string;
  dueDate: string;
  usaPlayer: PlayerInfo | null;
  ussrPlayer: PlayerInfo | null;
  removed: boolean;
}

// ─── Reducer ────────────────────────────────────────────────────────────────

interface ScheduleAdminState {
  schedules: LocalSchedule[];
}

type ScheduleAdminAction =
  | { type: "INIT_ORPHANS"; schedules: ScheduleItem[] }
  | {
      type: "UPDATE_SCHEDULE";
      source: { scheduleId: string; side: "usa" | "ussr" };
      dest: { scheduleId: string; side: "usa" | "ussr" };
    }
  | { type: "DELETE_SCHEDULE"; scheduleId: string }
  | { type: "RESTORE_SCHEDULE"; scheduleId: string }
  | { type: "ROLLBACK"; schedules: ScheduleItem[] }
  | {
      type: "APPLY_AUTO_FIX";
      filledOrphans: { scheduleId: string; opponentId: string; opponentName: string; opponentTld: string; opponentSide: "usa" | "ussr" }[];
    }
  | {
      type: "ADD_NEW_SCHEDULES";
      newSchedules: { scheduleId: string; gameCode: string; dueDate: string; usaPlayer: PlayerInfo; ussrPlayer: PlayerInfo }[];
    };

function toLocalSchedules(schedules: ScheduleItem[]): LocalSchedule[] {
  return schedules.map((s) => {
    const hasUsa = !!(s.idUsa || s.usaPlayerId);
    const hasUssr = !!(s.idUssr || s.ussrPlayerId);
    return {
      scheduleId: s.id,
      gameCode: s.gameCode,
      dueDate: s.dueDate,
      usaPlayer: hasUsa
        ? { userId: s.idUsa || s.usaPlayerId, fullName: s.nameUsa, tldCode: s.countryUsa }
        : null,
      ussrPlayer: hasUssr
        ? { userId: s.idUssr || s.ussrPlayerId, fullName: s.nameUssr, tldCode: s.countryUssr }
        : null,
      removed: false,
    };
  });
}

function scheduleAdminReducer(
  state: ScheduleAdminState,
  action: ScheduleAdminAction
): ScheduleAdminState {
  switch (action.type) {
    case "INIT_ORPHANS":
    case "ROLLBACK":
      return { schedules: toLocalSchedules(action.schedules) };

    case "UPDATE_SCHEDULE": {
      const next = state.schedules.map((s) => ({ ...s }));
      const sourceSchedule = next.find((s) => s.scheduleId === action.source.scheduleId);
      const destSchedule = next.find((s) => s.scheduleId === action.dest.scheduleId);
      if (!sourceSchedule || !destSchedule) return state;

      const sourcePlayer =
        action.source.side === "usa" ? sourceSchedule.usaPlayer : sourceSchedule.ussrPlayer;
      if (!sourcePlayer) return state;

      const destPlayer =
        action.dest.side === "usa" ? destSchedule.usaPlayer : destSchedule.ussrPlayer;

      // Clear source slot
      if (action.source.side === "usa") sourceSchedule.usaPlayer = null;
      else sourceSchedule.ussrPlayer = null;

      // Move source player to destination
      if (action.dest.side === "usa") destSchedule.usaPlayer = sourcePlayer;
      else destSchedule.ussrPlayer = sourcePlayer;

      // If destination had a player, swap them to the source slot
      if (destPlayer) {
        if (action.source.side === "usa") sourceSchedule.usaPlayer = destPlayer;
        else sourceSchedule.ussrPlayer = destPlayer;
      }

      return { schedules: next };
    }

    case "DELETE_SCHEDULE":
      return {
        schedules: state.schedules.map((s) =>
          s.scheduleId === action.scheduleId ? { ...s, removed: true } : s
        ),
      };

    case "RESTORE_SCHEDULE":
      return {
        schedules: state.schedules.map((s) =>
          s.scheduleId === action.scheduleId ? { ...s, removed: false } : s
        ),
      };

    case "APPLY_AUTO_FIX": {
      const next = state.schedules.map((s) => ({ ...s }));
      for (const fill of action.filledOrphans) {
        const schedule = next.find((s) => s.scheduleId === fill.scheduleId);
        if (!schedule) continue;
        const opponent: PlayerInfo = {
          userId: fill.opponentId,
          fullName: fill.opponentName,
          tldCode: fill.opponentTld,
        };
        if (fill.opponentSide === "usa") schedule.usaPlayer = opponent;
        else schedule.ussrPlayer = opponent;
      }
      return { schedules: next };
    }

    case "ADD_NEW_SCHEDULES": {
      const newLocalSchedules: LocalSchedule[] = action.newSchedules.map((s) => ({
        scheduleId: s.scheduleId,
        gameCode: s.gameCode,
        dueDate: s.dueDate,
        usaPlayer: s.usaPlayer,
        ussrPlayer: s.ussrPlayer,
        removed: false,
      }));
      return { schedules: [...state.schedules, ...newLocalSchedules] };
    }

    default:
      return state;
  }
}

// ─── Draggable Player Slot ──────────────────────────────────────────────────

const DraggablePlayerSlot: React.FC<{
  player: PlayerInfo;
  slotId: string;
  side: "usa" | "ussr";
}> = ({ player, slotId, side }) => {
  const { attributes, listeners, setNodeRef: setDragNodeRef, isDragging } = useDraggable({
    id: slotId,
    data: { player, side },
  });
  const { setNodeRef: setDropNodeRef, isOver } = useDroppable({ id: slotId });

  // Combine refs so the element is both draggable and droppable
  const setRefs = (node: HTMLElement | null) => {
    setDragNodeRef(node);
    setDropNodeRef(node);
  };

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        borderRadius: "6px",
        border: `1px solid ${isOver ? "var(--usa)" : "var(--border)"}`,
        background: isDragging ? "var(--bg-main)" : isOver ? "var(--usa-half)" : "var(--bg-card)",
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
        minWidth: "160px",
        transition: "box-shadow 0.15s, transform 0.15s, border-color 0.15s, background 0.15s",
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {player.tldCode && <FlagIcon code={player.tldCode} />}
      <Text fontSize="medium" strong>
        {player.fullName}
      </Text>
    </div>
  );
};

// ─── Droppable Empty Slot ───────────────────────────────────────────────────

const DroppableEmptySlot: React.FC<{
  slotId: string;
  side: "usa" | "ussr";
}> = ({ slotId, side }) => {
  const { isOver, setNodeRef } = useDroppable({ id: slotId });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 10px",
        borderRadius: "6px",
        border: `2px dashed ${isOver ? "var(--usa)" : "var(--border)"}`,
        background: isOver ? "var(--usa-half)" : "transparent",
        minWidth: "160px",
        minHeight: "36px",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      <span style={{ fontSize: "12px", opacity: 0.4, color: "var(--primary-text)" }}>
        {side === "usa" ? "Drop USA player" : "Drop USSR player"}
      </span>
    </div>
  );
};

// ─── Drag Overlay ───────────────────────────────────────────────────────────

const DragOverlayPlayer: React.FC<{ player: PlayerInfo }> = ({ player }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 10px",
      borderRadius: "6px",
      border: "2px solid var(--usa)",
      background: "var(--bg-card)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      cursor: "grabbing",
      minWidth: "160px",
    }}
  >
    {player.tldCode && <FlagIcon code={player.tldCode} />}
    <Text fontSize="medium" strong>{player.fullName}</Text>
  </div>
);

// ─── Schedule Row ───────────────────────────────────────────────────────────

const ScheduleRow: React.FC<{
  schedule: LocalSchedule;
  onRemove: (scheduleId: string) => void;
}> = ({ schedule, onRemove }) => {
  const usaSlotId = `${schedule.scheduleId}__usa`;
  const ussrSlotId = `${schedule.scheduleId}__ussr`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        background: schedule.removed ? "var(--bg-main)" : "var(--bg-card)",
        opacity: schedule.removed ? 0.5 : 1,
        marginBottom: "8px",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
        {schedule.usaPlayer ? (
          <DraggablePlayerSlot player={schedule.usaPlayer} slotId={usaSlotId} side="usa" />
        ) : (
          <DroppableEmptySlot slotId={usaSlotId} side="usa" />
        )}
        <span style={{ fontWeight: 700, color: "var(--primary-text)", fontSize: "14px" }}>vs</span>
        {schedule.ussrPlayer ? (
          <DraggablePlayerSlot player={schedule.ussrPlayer} slotId={ussrSlotId} side="ussr" />
        ) : (
          <DroppableEmptySlot slotId={ussrSlotId} side="ussr" />
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <span style={{ fontSize: "11px", opacity: 0.6, whiteSpace: "nowrap" }}>
          {schedule.gameCode}
        </span>
        <span style={{ fontSize: "11px", opacity: 0.6, whiteSpace: "nowrap" }}>
          {formatDate(new Date(schedule.dueDate), "yyyy/MM/dd")}
        </span>
        {!schedule.removed && (
          <button
            onClick={() => onRemove(schedule.scheduleId)}
            style={{
              ...btnStyle,
              padding: "4px 10px",
              fontSize: "11px",
              backgroundColor: "var(--ussr)",
              color: "var(--alt-text)",
              border: "none",
            }}
          >
            Remove Schedule
          </button>
        )}
        {schedule.removed && (
          <span style={{ fontSize: "11px", color: "var(--ussr)", fontWeight: 600 }}>
            Marked for removal
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

interface ScheduleAdminDataBoxesProps {
  schedules: ScheduleItem[];
  tournamentId: string;
  tournamentName: string;
}

const ScheduleAdminDataBoxes = ({ schedules, tournamentId, tournamentName }: ScheduleAdminDataBoxesProps) => {
  const createSchedulesBulkMutation = useCreateSchedulesBulk();
  const deleteScheduleMutation = useDeleteSchedule();
  const [autoFixResult, setAutoFixResult] = useState<AutoFixResult | null>(null);
  const [pendingNewPairings, setPendingNewPairings] = useState<AutoFixResult["newPairings"]>([]);
  const [persistMessage, setPersistMessage] = useState("");
  const [newlyCreatedSchedules, setNewlyCreatedSchedules] = useState<LocalSchedule[]>([]);

  // ─── Reducer ────────────────────────────────────────────────────────────

  const [state, dispatch] = useReducer(
    scheduleAdminReducer,
    schedules,
    (s) => ({ schedules: toLocalSchedules(s) })
  );

  // Sync when base schedules change (if no local edits)
  const baseSchedules = useMemo(() => toLocalSchedules(schedules), [schedules]);

  // Get current state of newly created schedules from state.schedules (reflects DND updates)
  const currentNewlyCreatedSchedules = useMemo(() => {
    const newIds = new Set(newlyCreatedSchedules.map(s => s.scheduleId));
    return state.schedules.filter(s => newIds.has(s.scheduleId));
  }, [state.schedules, newlyCreatedSchedules]);

  const hasChanges = useMemo(() => {
    if (state.schedules.length !== baseSchedules.length) return true;
    return state.schedules.some((s, i) => {
      const base = baseSchedules[i];
      return (
        s.usaPlayer?.userId !== base.usaPlayer?.userId ||
        s.ussrPlayer?.userId !== base.ussrPlayer?.userId ||
        s.removed !== base.removed
      );
    });
  }, [state.schedules, baseSchedules]);

  useEffect(() => {
    if (!hasChanges) {
      dispatch({ type: "INIT_ORPHANS", schedules });
    }
  }, [schedules]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Derived data from state.schedules ─────────────────────────────────

  // USA/USSR game counts per player (complete games only — both sides filled, not removed)
  const playerGameCounts = useMemo(() => {
    const counts = new Map<string, { usa: number; ussr: number; fullName: string; tldCode: string }>();
    for (const game of state.schedules) {
      if (game.removed) continue;
      if (game.usaPlayer && game.ussrPlayer) {
        const c = counts.get(game.usaPlayer.userId) || { usa: 0, ussr: 0, fullName: game.usaPlayer.fullName, tldCode: game.usaPlayer.tldCode };
        c.usa += 1;
        counts.set(game.usaPlayer.userId, c);
        const c2 = counts.get(game.ussrPlayer.userId) || { usa: 0, ussr: 0, fullName: game.ussrPlayer.fullName, tldCode: game.ussrPlayer.tldCode };
        c2.ussr += 1;
        counts.set(game.ussrPlayer.userId, c2);
      }
    }
    return counts;
  }, [state.schedules]);

  // Players below target games (used by auto-fix)
  const playersBelowTarget = useMemo(() => {
    const below: { userId: string; fullName: string; tldCode: string; currentGames: number; gamesNeeded: number }[] = [];
    for (const [userId, data] of playerGameCounts) {
      const total = data.usa + data.ussr;
      if (total < TARGET_GAMES) {
        below.push({
          userId,
          fullName: data.fullName,
          tldCode: data.tldCode,
          currentGames: total,
          gamesNeeded: TARGET_GAMES - total,
        });
      }
    }
    return below.sort((a, b) => a.currentGames - b.currentGames);
  }, [playerGameCounts]);

  // Players needing more games (excluding 0-game players and hardcoded forfeited players)
  // Hardcoded forfeited player IDs: Joseph Leone (2203), Tim Engelhardt (3209), Tomas Tvaroh (2780), Alex Lee (2996), Pawel Sokol (2983)
  const playersNeedingGames = useMemo(() => {
    const FORFEITED_PLAYER_IDS = new Set(["2203", "3209", "2780", "2996", "2983"]);
    return playersBelowTarget.filter(p => p.currentGames > 0 && !FORFEITED_PLAYER_IDS.has(p.userId));
  }, [playersBelowTarget]);

  // Previous opponents map (for auto-fix)
  const previousOpponents = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const game of state.schedules) {
      if (game.removed) continue;
      if (game.usaPlayer && game.ussrPlayer) {
        if (!map[game.usaPlayer.userId]) map[game.usaPlayer.userId] = [];
        if (!map[game.ussrPlayer.userId]) map[game.ussrPlayer.userId] = [];
        map[game.usaPlayer.userId].push(game.ussrPlayer.userId);
        map[game.ussrPlayer.userId].push(game.usaPlayer.userId);
      }
    }
    return map;
  }, [state.schedules]);

  // Players who were originally in orphan schedules (from baseSchedules), with current game counts
  const playersWithMissingOpponents = useMemo(() => {
    const result: {
      player: PlayerInfo;
      usaGames: number;
      ussrGames: number;
    }[] = [];
    const seen = new Set<string>();

    baseSchedules.forEach((s) => {
      const hasUsa = !!s.usaPlayer;
      const hasUssr = !!s.ussrPlayer;
      if (hasUsa !== hasUssr) {
        const player = (hasUsa ? s.usaPlayer : s.ussrPlayer)!;
        if (!seen.has(player.userId)) {
          const counts = playerGameCounts.get(player.userId) || { usa: 0, ussr: 0 };
          result.push({
            player,
            usaGames: counts.usa,
            ussrGames: counts.ussr,
          });
          seen.add(player.userId);
        }
      }
    });
    return result;
  }, [baseSchedules, playerGameCounts]);

  // Schedules that were originally orphans (from baseSchedules), with current state from state.schedules
  const originalOrphanSchedules = useMemo(() => {
    return baseSchedules
      .map((base, i) => {
        const hasUsa = !!base.usaPlayer;
        const hasUssr = !!base.ussrPlayer;
        if (hasUsa !== hasUssr) {
          return state.schedules[i]; // current state of this originally-orphan schedule
        }
        return null;
      })
      .filter((s): s is LocalSchedule => s !== null);
  }, [baseSchedules, state.schedules]);

  // ─── Drag state ─────────────────────────────────────────────────────────

  const [activeDragPlayer, setActiveDragPlayer] = useState<PlayerInfo | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragPlayer((active.data.current?.player as PlayerInfo) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragPlayer(null);
    if (!over) return;

    const sourceSlotId = String(active.id);
    const destSlotId = String(over.id);
    if (sourceSlotId === destSlotId) return;

    const parseSlotId = (slotId: string) => {
      const sepIdx = slotId.lastIndexOf("__");
      const scheduleId = slotId.slice(0, sepIdx);
      const side = slotId.slice(sepIdx + 2) as "usa" | "ussr";
      return { scheduleId, side };
    };

    const source = parseSlotId(sourceSlotId);
    const dest = parseSlotId(destSlotId);

    dispatch({ type: "UPDATE_SCHEDULE", source, dest });
  };

  const handleRemoveSchedule = (scheduleId: string) => {
    dispatch({ type: "DELETE_SCHEDULE", scheduleId });
  };

  const handleRollback = () => {
    dispatch({ type: "ROLLBACK", schedules });
    setPersistMessage("");
  };

  const handleSaveSchedules = async () => {
    const toDelete = state.schedules.filter((s) => s.removed);
    const newlyComplete = state.schedules.filter((s, i) => {
      if (s.removed) return false;
      const base = baseSchedules[i];
      if (!base) return false;
      return (
        s.usaPlayer?.userId !== base.usaPlayer?.userId ||
        s.ussrPlayer?.userId !== base.ussrPlayer?.userId
      ) && s.usaPlayer && s.ussrPlayer;
    });

    try {
      const deletePromises = toDelete.map((s) => deleteScheduleMutation.mutateAsync(s.scheduleId));
      let bulkPromise: Promise<any> = Promise.resolve();
      if (newlyComplete.length > 0) {
        const dtos = newlyComplete.map((s) => ({
          scheduleId: Number(s.scheduleId),
          usa: s.usaPlayer!.userId,
          ussr: s.ussrPlayer!.userId,
          t: Number(tournamentId),
          d: new Date(s.dueDate),
          r: false,
          gc: s.gameCode,
          randomSides: false,
        }));
        bulkPromise = createSchedulesBulkMutation.mutateAsync(dtos);
      }

      await Promise.all([...deletePromises, bulkPromise]);
      const parts: string[] = [];
      if (newlyComplete.length > 0) parts.push(`updated ${newlyComplete.length}`);
      if (toDelete.length > 0) parts.push(`removed ${toDelete.length}`);
      setPersistMessage(`✅ Saved: ${parts.join(", ")}`);

      dispatch({ type: "INIT_ORPHANS", schedules });
    } catch (err: any) {
      setPersistMessage(`❌ ${err?.response?.data?.message || "Failed to save changes"}`);
    }
    setTimeout(() => setPersistMessage(""), 5000);
  };

  // ─── Auto Fix ───────────────────────────────────────────────────────────

  // Orphan schedules for auto-fix (from local state, not removed, still orphaned)
  const orphanedSchedulesForAutoFix = useMemo(() => {
    return state.schedules
      .filter((s) => {
        if (s.removed) return false;
        const hasUsa = !!s.usaPlayer;
        const hasUssr = !!s.ussrPlayer;
        return hasUsa !== hasUssr;
      })
      .map((s) => {
        const hasUsa = !!s.usaPlayer;
        const player = hasUsa ? s.usaPlayer! : s.ussrPlayer!;
        return {
          scheduleId: s.scheduleId,
          gameCode: s.gameCode,
          dueDate: s.dueDate,
          existingPlayer: {
            userId: player.userId,
            fullName: player.fullName,
            tldCode: player.tldCode,
            side: (hasUsa ? "usa" : "ussr") as "usa" | "ussr",
            rating: 0,
          },
        };
      });
  }, [state.schedules]);

  const handleAutoFix = () => {
    // Debug: Log playerGameCounts for orphan players
    const orphanPlayerIds = new Set(orphanedSchedulesForAutoFix.map(o => o.existingPlayer.userId));
    console.log('[AutoFix Debug] Orphan player IDs:', [...orphanPlayerIds]);
    console.log('[AutoFix Debug] playerGameCounts for orphan players:');
    for (const pid of orphanPlayerIds) {
      const counts = playerGameCounts.get(pid);
      const total = counts ? counts.usa + counts.ussr : 0;
      const orphanSchedules = orphanedSchedulesForAutoFix.filter(o => o.existingPlayer.userId === pid);
      console.log(`  ${pid}: usa=${counts?.usa || 0}, ussr=${counts?.ussr || 0}, total=${total}, orphans=${orphanSchedules.length}`);
    }

    const allPlayers: { userId: string; fullName: string; rating: number; tldCode: string }[] = [];
    const playerIds = new Set<string>();

    for (const p of playersBelowTarget) {
      if (!playerIds.has(p.userId)) {
        allPlayers.push({ userId: p.userId, fullName: p.fullName, rating: 0, tldCode: p.tldCode });
        playerIds.add(p.userId);
      }
    }
    for (const o of orphanedSchedulesForAutoFix) {
      if (!playerIds.has(o.existingPlayer.userId)) {
        allPlayers.push({
          userId: o.existingPlayer.userId,
          fullName: o.existingPlayer.fullName,
          rating: 0,
          tldCode: o.existingPlayer.tldCode,
        });
        playerIds.add(o.existingPlayer.userId);
      }
    }

    // Build playersBelowTarget with accurate game counts for ALL players (including orphans)
    // Only include players who have orphan schedules — players with completed games but no
    // orphan schedules have forfeited and should not be paired as opponents
    const playersWithOrphans = new Set(orphanedSchedulesForAutoFix.map(o => o.existingPlayer.userId));
    const enrichedPlayersBelowTarget = playersBelowTarget
      .filter(p => playersWithOrphans.has(p.userId))
      .map((p) => ({ ...p, rating: 0 }));
    const belowTargetIds = new Set(enrichedPlayersBelowTarget.map((p) => p.userId));
    for (const o of orphanedSchedulesForAutoFix) {
      const pid = o.existingPlayer.userId;
      if (!belowTargetIds.has(pid)) {
        const counts = playerGameCounts.get(pid) || { usa: 0, ussr: 0 };
        const total = counts.usa + counts.ussr;
        if (total < TARGET_GAMES) {
          enrichedPlayersBelowTarget.push({
            userId: pid,
            fullName: o.existingPlayer.fullName,
            rating: 0,
            tldCode: o.existingPlayer.tldCode,
            currentGames: total,
            gamesNeeded: TARGET_GAMES - total,
          });
          belowTargetIds.add(pid);
        }
      }
    }

    console.log('[AutoFix Debug] enrichedPlayersBelowTarget:', enrichedPlayersBelowTarget.map(p => `${p.fullName}(${p.currentGames})`).join(', '));

    const result = autoFixSchedules({
      players: allPlayers,
      previousOpponents,
      schedulesWithoutPair: orphanedSchedulesForAutoFix,
      playersBelowTarget: enrichedPlayersBelowTarget,
      targetGamesPerPlayer: TARGET_GAMES,
      tournamentId,
      tournamentName,
    });

    // Build player lookup for opponent names
    const playerLookup = new Map(allPlayers.map((p) => [p.userId, p]));

    // Apply filled orphans to reducer state so changes are visible
    const fillActions = result.filledOrphans.map((o) => {
      const opponent = playerLookup.get(o.opponentPlayerId);
      // The opponent goes to the side opposite the existing player
      const opponentSide = o.existingPlayerSide === "usa" ? "ussr" : "usa";
      return {
        scheduleId: o.scheduleId,
        opponentId: o.opponentPlayerId,
        opponentName: opponent?.fullName || "",
        opponentTld: opponent?.tldCode || "",
        opponentSide: opponentSide as "usa" | "ussr",
      };
    });

    if (fillActions.length > 0) {
      dispatch({ type: "APPLY_AUTO_FIX", filledOrphans: fillActions });
    }

    // Remove orphans that were paired with other orphans (their player was moved)
    for (const removedId of result.removedOrphanIds) {
      dispatch({ type: "DELETE_SCHEDULE", scheduleId: removedId });
    }

    setPendingNewPairings(result.newPairings);
    setAutoFixResult(result);
    setPersistMessage("");
  };

  // Generate random game code: letter + 3 numbers (e.g., C365)
  const generateGameCode = (): string => {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const numbers = String(Math.floor(100 + Math.random() * 900));
    return `${letter}${numbers}`;
  };

  const handleCreateMissingSchedules = () => {
    if (playersNeedingGames.length < 2) {
      console.log("[CreateMissing] Not enough players to create pairings");
      return;
    }

    // Build game count map
    const gameCount = new Map<string, number>();
    for (const p of playersNeedingGames) {
      gameCount.set(p.userId, p.currentGames);
    }

    // Build previous opponents map
    const prevOpponents = new Set<string>();
    for (const game of state.schedules) {
      if (game.removed) continue;
      if (game.usaPlayer && game.ussrPlayer) {
        const key = game.usaPlayer.userId < game.ussrPlayer.userId
          ? `${game.usaPlayer.userId}:${game.ussrPlayer.userId}`
          : `${game.ussrPlayer.userId}:${game.usaPlayer.userId}`;
        prevOpponents.add(key);
      }
    }

    const pairKey = (a: string, b: string) => a < b ? `${a}:${b}` : `${b}:${a}`;

    // Create pairings
    const newSchedules: { scheduleId: string; gameCode: string; dueDate: string; usaPlayer: PlayerInfo; ussrPlayer: PlayerInfo }[] = [];
    const players = [...playersNeedingGames].sort((a, b) => a.currentGames - b.currentGames);
    
    // Keep pairing until no more valid pairs can be made
    let paired = true;
    while (paired) {
      paired = false;
      
      // Find the player with most games needed
      const sortedPlayers = players
        .filter(p => (gameCount.get(p.userId) ?? 0) < TARGET_GAMES)
        .sort((a, b) => {
          const neededA = TARGET_GAMES - (gameCount.get(a.userId) ?? 0);
          const neededB = TARGET_GAMES - (gameCount.get(b.userId) ?? 0);
          return neededB - neededA;
        });

      if (sortedPlayers.length < 2) break;

      // Try to find a pair for the first player
      const player1 = sortedPlayers[0];
      let player2: typeof sortedPlayers[0] | null = null;

      for (let i = 1; i < sortedPlayers.length; i++) {
        const candidate = sortedPlayers[i];
        const pk = pairKey(player1.userId, candidate.userId);
        if (!prevOpponents.has(pk)) {
          player2 = candidate;
          break;
        }
      }

      if (player2) {
        // Determine sides by rating (or alphabetically if equal)
        const player1Info: PlayerInfo = { userId: player1.userId, fullName: player1.fullName, tldCode: player1.tldCode };
        const player2Info: PlayerInfo = { userId: player2.userId, fullName: player2.fullName, tldCode: player2.tldCode };
        
        // Higher rated player gets USA
        const usaPlayer = player1Info;
        const ussrPlayer = player2Info;

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        newSchedules.push({
          scheduleId: `new-${Date.now()}-${newSchedules.length}`,
          gameCode: generateGameCode(),
          dueDate: dueDate.toISOString(),
          usaPlayer,
          ussrPlayer,
        });

        // Update game counts and previous opponents
        gameCount.set(player1.userId, (gameCount.get(player1.userId) ?? 0) + 1);
        gameCount.set(player2.userId, (gameCount.get(player2.userId) ?? 0) + 1);
        prevOpponents.add(pairKey(player1.userId, player2.userId));
        paired = true;
      }
    }

    if (newSchedules.length > 0) {
      // Convert to LocalSchedule for DND display
      const newLocalSchedules: LocalSchedule[] = newSchedules.map(s => ({
        scheduleId: s.scheduleId,
        gameCode: s.gameCode,
        dueDate: s.dueDate,
        usaPlayer: s.usaPlayer,
        ussrPlayer: s.ussrPlayer,
        removed: false,
      }));
      
      dispatch({ type: "ADD_NEW_SCHEDULES", newSchedules });
      setNewlyCreatedSchedules(prev => [...prev, ...newLocalSchedules]);
      setPendingNewPairings([...pendingNewPairings, ...newSchedules.map(s => ({
        usaPlayerId: s.usaPlayer.userId,
        ussrPlayerId: s.ussrPlayer.userId,
        gameCode: s.gameCode,
        randomSides: false,
        dueDate: s.dueDate,
      }))]);
      console.log(`[CreateMissing] Created ${newSchedules.length} new schedules`);
    } else {
      console.log("[CreateMissing] No valid pairings could be created");
    }
  };

  const handleUndoPreview = () => {
    dispatch({ type: "ROLLBACK", schedules });
    setPendingNewPairings([]);
    setAutoFixResult(null);
    setPersistMessage("");
  };

  const handlePersistSchedules = async () => {
    if (!autoFixResult) return;

    const updatedSchedules = autoFixResult.filledOrphans.map((o) => {
      const usaId = o.existingPlayerSide === "usa" ? o.existingPlayerId : o.opponentPlayerId;
      const ussrId = o.existingPlayerSide === "ussr" ? o.existingPlayerId : o.opponentPlayerId;
      return {
        scheduleId: Number(o.scheduleId),
        usa: usaId,
        ussr: ussrId,
        t: Number(tournamentId),
        d: new Date(o.dueDate),
        r: o.randomSides,
        gc: o.gameCode,
        randomSides: o.randomSides,
      };
    });

    const newSchedules = pendingNewPairings.map((p) => ({
      usa: p.usaPlayerId,
      ussr: p.ussrPlayerId,
      t: Number(tournamentId),
      d: new Date(p.dueDate),
      r: p.randomSides,
      gc: p.gameCode,
      randomSides: p.randomSides,
    }));

    // Delete orphans that were paired with other orphans (their player was moved)
    const deletePromises = autoFixResult.removedOrphanIds.map((id) =>
      deleteScheduleMutation.mutateAsync(Number(id))
    );

    try {
      await Promise.all([
        ...deletePromises,
        createSchedulesBulkMutation.mutateAsync([...updatedSchedules, ...newSchedules]),
      ]);
      setPendingNewPairings([]);
      setAutoFixResult(null);
      setPersistMessage(`Persisted ${updatedSchedules.length} updated + ${newSchedules.length} new + ${deletePromises.length} deleted schedules`);
    } catch (err: any) {
      setPersistMessage(err?.response?.data?.message || "Failed to persist schedules");
    }
    setTimeout(() => setPersistMessage(""), 5000);
  };

  return (
    <>
      {/* Players With Missing Opponents */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <div style={{ ...boxStyle, flex: 1, height: "auto", maxHeight: "400px" }}>
          <div style={titleStyle}>
            Players With Missing Opponents ({playersWithMissingOpponents.length})
          </div>
          {playersWithMissingOpponents.map((p) => {
            const totalGames = p.usaGames + p.ussrGames;
            return (
              <div key={p.player.userId} style={rowStyle} title={p.player.fullName}>
                {p.player.fullName} ({totalGames}/{TARGET_GAMES}) — USA {p.usaGames}, USSR {p.ussrGames}
              </div>
            );
          })}
          {playersWithMissingOpponents.length === 0 && (
            <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
          )}
        </div>

        {/* Players Needing More Games */}
        <div style={{ ...boxStyle, flex: 1, height: "auto", maxHeight: "400px" }}>
          <div style={titleStyle}>
            Players Needing More Games ({playersNeedingGames.length})
          </div>
          {playersNeedingGames.map((p) => (
            <div key={p.userId} style={rowStyle} title={p.fullName}>
              {p.fullName} ({p.currentGames}/{TARGET_GAMES}) — needs {p.gamesNeeded} more
            </div>
          ))}
          {playersNeedingGames.length === 0 && (
            <div style={{ ...rowStyle, opacity: 0.5 }}>All players at target</div>
          )}
          <button
            onClick={handleCreateMissingSchedules}
            disabled={playersNeedingGames.length < 2}
            style={{
              ...btnStyle,
              marginTop: "8px",
              width: "100%",
              backgroundColor: playersNeedingGames.length >= 2 ? "var(--usa)" : "var(--bg-main)",
              color: playersNeedingGames.length >= 2 ? "var(--alt-text)" : "var(--primary-text)",
              opacity: playersNeedingGames.length < 2 ? 0.5 : 1,
              cursor: playersNeedingGames.length < 2 ? "not-allowed" : "pointer",
            }}
          >
            Create Missing Schedules
          </button>
        </div>
      </div>

      {/* Schedules With Missing Players — Drag & Drop */}
      <section style={sectionStyle}>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--primary-text)" }}>
          Schedules With Missing Players ({originalOrphanSchedules.length})
        </h4>
        <p style={{ fontSize: "12px", opacity: 0.6, margin: "0 0 12px 0", color: "var(--primary-text)" }}>
          Drag players between slots to pair them. Changes are saved locally until you click &quot;Save Schedules&quot;.
        </p>

        {originalOrphanSchedules.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", opacity: 0.5, color: "var(--primary-text)" }}>
            No schedules with missing players.
          </div>
        ) : (
          <>
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-soft)",
                minHeight: "auto",
                padding: "8px",
              }}>
                {originalOrphanSchedules.map((schedule) => (
                  <ScheduleRow key={schedule.scheduleId} schedule={schedule} onRemove={handleRemoveSchedule} />
                ))}
              </div>
              <DragOverlay>
                {activeDragPlayer ? <DragOverlayPlayer player={activeDragPlayer} /> : null}
              </DragOverlay>
            </DndContext>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
              <button
                onClick={handleSaveSchedules}
                disabled={!hasChanges || createSchedulesBulkMutation.isPending || deleteScheduleMutation.isPending}
                style={{
                  ...btnStyle,
                  backgroundColor: hasChanges ? "var(--usa)" : "var(--bg-card)",
                  color: hasChanges ? "var(--alt-text)" : "var(--primary-text)",
                  opacity: !hasChanges ? 0.5 : 1,
                  cursor: !hasChanges ? "not-allowed" : "pointer",
                }}
              >
                {(createSchedulesBulkMutation.isPending || deleteScheduleMutation.isPending) ? <Spinner size="2" /> : "Save Schedules"}
              </button>
              <button
                onClick={handleRollback}
                disabled={!hasChanges}
                style={{ ...btnStyle, opacity: !hasChanges ? 0.5 : 1, cursor: !hasChanges ? "not-allowed" : "pointer" }}
              >
                Rollback Changes
              </button>
              {persistMessage && (
                <span style={{ fontSize: "13px", color: persistMessage.includes("✅") ? "var(--usa)" : "var(--ussr)" }}>
                  {persistMessage}
                </span>
              )}
            </div>
          </>
        )}
      </section>

      {/* Newly Created Schedules — Drag & Drop */}
      {newlyCreatedSchedules.length > 0 && (
        <section style={sectionStyle}>
          <h4 style={{ margin: "0 0 12px 0", color: "var(--primary-text)" }}>
            Newly Created Schedules ({currentNewlyCreatedSchedules.length})
          </h4>
          <p style={{ fontSize: "12px", opacity: 0.6, margin: "0 0 12px 0", color: "var(--primary-text)" }}>
            Drag players to swap. Click &quot;Persist New Schedules&quot; to save them.
          </p>
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-soft)",
              minHeight: "auto",
              padding: "8px",
            }}>
              {currentNewlyCreatedSchedules.map((schedule) => (
                <ScheduleRow key={schedule.scheduleId} schedule={schedule} onRemove={(id) => {
                  setNewlyCreatedSchedules(prev => prev.filter(s => s.scheduleId !== id));
                  dispatch({ type: "DELETE_SCHEDULE", scheduleId: id });
                }} />
              ))}
            </div>
            <DragOverlay>
              {activeDragPlayer ? <DragOverlayPlayer player={activeDragPlayer} /> : null}
            </DragOverlay>
          </DndContext>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
            <button
              onClick={async () => {
                try {
                  const dtos = currentNewlyCreatedSchedules.filter(s => !s.removed).map((s) => ({
                    usa: s.usaPlayer!.userId,
                    ussr: s.ussrPlayer!.userId,
                    t: Number(tournamentId),
                    d: new Date(s.dueDate),
                    r: false,
                    gc: s.gameCode,
                    randomSides: false,
                  }));
                  await createSchedulesBulkMutation.mutateAsync(dtos);
                  setNewlyCreatedSchedules([]);
                  setPendingNewPairings([]);
                  setPersistMessage(`✅ Created ${dtos.length} new schedules`);
                } catch (err: any) {
                  setPersistMessage(err?.response?.data?.message || "Failed to create schedules");
                }
                setTimeout(() => setPersistMessage(""), 5000);
              }}
              disabled={createSchedulesBulkMutation.isPending}
              style={{ ...btnStyle, backgroundColor: "var(--usa)", color: "var(--alt-text)", opacity: createSchedulesBulkMutation.isPending ? 0.5 : 1 }}
            >
              {createSchedulesBulkMutation.isPending ? <Spinner size="2" /> : "Persist New Schedules"}
            </button>
            <button
              onClick={() => {
                // Remove newly created schedules from state
                newlyCreatedSchedules.forEach(s => dispatch({ type: "DELETE_SCHEDULE", scheduleId: s.scheduleId }));
                setNewlyCreatedSchedules([]);
                setPendingNewPairings([]);
              }}
              style={{ ...btnStyle, backgroundColor: "var(--ussr)", color: "var(--alt-text)" }}
            >
              Discard
            </button>
            {persistMessage && (
              <span style={{ fontSize: "13px", color: persistMessage.includes("✅") ? "var(--usa)" : "var(--ussr)" }}>
                {persistMessage}
              </span>
            )}
          </div>
        </section>
      )}

      {/* Auto Fix Schedules */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: autoFixResult ? "16px" : "0" }}>
          <button
            onClick={handleAutoFix}
            disabled={createSchedulesBulkMutation.isPending}
            style={{ ...btnStyle, backgroundColor: "var(--usa)", color: "var(--alt-text)" }}
          >
            Auto Fix Schedules
          </button>
          {autoFixResult && (
            <>
              <button
                onClick={handlePersistSchedules}
                disabled={createSchedulesBulkMutation.isPending}
                style={{ ...btnStyle, backgroundColor: "var(--usa)", color: "var(--alt-text)", opacity: createSchedulesBulkMutation.isPending ? 0.5 : 1 }}
              >
                {createSchedulesBulkMutation.isPending ? <Spinner size="2" /> : "Persist Schedules"}
              </button>
              <button
                onClick={handleUndoPreview}
                disabled={createSchedulesBulkMutation.isPending}
                style={{ ...btnStyle, backgroundColor: "var(--ussr)", color: "var(--alt-text)" }}
              >
                Undo
              </button>
            </>
          )}
        </div>

        {autoFixResult?.warnings && autoFixResult.warnings.length > 0 && (
          <div style={{ fontSize: "13px", color: "var(--ussr)", marginBottom: "12px" }}>
            {autoFixResult.warnings.map((w, i) => <div key={i}>⚠️ {w}</div>)}
          </div>
        )}

        {autoFixResult && (
          <div style={{ marginTop: "12px" }}>
            <div style={{ fontSize: "12px", color: "var(--secondary-text)", marginBottom: "4px" }}>
              Summary (for WhatsApp):
            </div>
            <textarea
              readOnly
              rows={Math.min(10, (autoFixResult.filledOrphans.length + autoFixResult.removedOrphanIds.length) || 3)}
              style={{
                width: "100%",
                fontSize: "13px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--primary-text)",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              value={(() => {
                const lines: string[] = [];
                // Build player lookup from all schedules
                const playerLookup = new Map<string, string>();
                for (const s of state.schedules) {
                  if (s.usaPlayer) playerLookup.set(s.usaPlayer.userId, s.usaPlayer.fullName);
                  if (s.ussrPlayer) playerLookup.set(s.ussrPlayer.userId, s.ussrPlayer.fullName);
                }
                for (const filled of autoFixResult.filledOrphans) {
                  const existingName = playerLookup.get(filled.existingPlayerId);
                  const opponentName = playerLookup.get(filled.opponentPlayerId);
                  if (existingName && opponentName) {
                    lines.push(`${existingName} has been paired with ${opponentName}`);
                  }
                }
                // Look up gameCode from baseSchedules (original data, not modified state)
                for (const removedId of autoFixResult.removedOrphanIds) {
                  const removedSchedule = baseSchedules.find(o => String(o.scheduleId) === removedId);
                  if (removedSchedule) {
                    lines.push(`Game ${removedSchedule.gameCode} removed`);
                  }
                }
                return lines.join("\n");
              })()}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ScheduleAdminDataBoxes;
