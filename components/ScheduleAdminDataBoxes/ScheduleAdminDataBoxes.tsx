import { useReducer, useMemo, useState, useCallback, useEffect } from "react";
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
  | { type: "ROLLBACK"; schedules: ScheduleItem[] };

function deriveOrphans(schedules: ScheduleItem[]): LocalSchedule[] {
  return schedules
    .filter((s) => {
      const hasUsa = !!(s.idUsa || s.usaPlayerId);
      const hasUssr = !!(s.idUssr || s.ussrPlayerId);
      return hasUsa !== hasUssr;
    })
    .map((s) => {
      const hasUsa = !!(s.idUsa || s.usaPlayerId);
      return {
        scheduleId: s.id,
        gameCode: s.gameCode,
        dueDate: s.dueDate,
        usaPlayer: hasUsa
          ? { userId: s.idUsa || s.usaPlayerId, fullName: s.nameUsa, tldCode: s.countryUsa }
          : null,
        ussrPlayer: hasUsa
          ? null
          : { userId: s.idUssr || s.ussrPlayerId, fullName: s.nameUssr, tldCode: s.countryUssr },
        removed: false,
      };
    });
}

function scheduleAdminReducer(
  state: ScheduleAdminState,
  action: ScheduleAdminAction
): ScheduleAdminState {
  console.log("state", state)
  switch (action.type) {
    case "INIT_ORPHANS":
    case "ROLLBACK":
      return { schedules: deriveOrphans(action.schedules) };

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
      if (destPlayer) return state;

      if (action.source.side === "usa") sourceSchedule.usaPlayer = null;
      else sourceSchedule.ussrPlayer = null;

      if (action.dest.side === "usa") destSchedule.usaPlayer = sourcePlayer;
      else destSchedule.ussrPlayer = sourcePlayer;

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
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: slotId,
    data: { player, side },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid var(--border)",
        background: isDragging ? "var(--bg-main)" : "var(--bg-card)",
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
        minWidth: "160px",
        transition: "box-shadow 0.15s, transform 0.15s",
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
  const [persistMessage, setPersistMessage] = useState("");

  // ─── Reducer ────────────────────────────────────────────────────────────

  const [state, dispatch] = useReducer(
    scheduleAdminReducer,
    schedules,
    (s) => ({ schedules: deriveOrphans(s) })
  );

  // Sync when base schedules change (if no local edits)
  const initialSchedules = useMemo(() => deriveOrphans(schedules), [schedules]);

  const hasChanges = useMemo(() => {
    if (state.schedules.length !== initialSchedules.length) return true;
    return state.schedules.some((s, i) => {
      const ini = initialSchedules[i];
      return (
        s.usaPlayer?.userId !== ini.usaPlayer?.userId ||
        s.ussrPlayer?.userId !== ini.ussrPlayer?.userId ||
        s.removed !== ini.removed
      );
    });
  }, [state.schedules, initialSchedules]);

  useEffect(() => {
    if (!hasChanges) {
      dispatch({ type: "INIT_ORPHANS", schedules });
    }
  }, [schedules]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Derived data from base schedules ───────────────────────────────────

  // USA/USSR game counts per player (from ALL schedules, not just orphans)
  const playerGameCounts = useMemo(() => {
    const counts = new Map<string, { usa: number; ussr: number; fullName: string; tldCode: string }>();
    for (const game of schedules) {
      const usaId = game.idUsa || game.usaPlayerId;
      const ussrId = game.idUssr || game.ussrPlayerId;
      if (usaId) {
        const c = counts.get(usaId) || { usa: 0, ussr: 0, fullName: game.nameUsa, tldCode: game.countryUsa };
        c.usa += 1;
        counts.set(usaId, c);
      }
      if (ussrId) {
        const c = counts.get(ussrId) || { usa: 0, ussr: 0, fullName: game.nameUssr, tldCode: game.countryUssr };
        c.ussr += 1;
        counts.set(ussrId, c);
      }
    }
    return counts;
  }, [schedules]);

  // Players below target games
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

  // Previous opponents map (for auto-fix)
  const previousOpponents = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const game of schedules) {
      const usaId = game.idUsa || game.usaPlayerId;
      const ussrId = game.idUssr || game.ussrPlayerId;
      if (usaId && ussrId) {
        if (!map[usaId]) map[usaId] = [];
        if (!map[ussrId]) map[ussrId] = [];
        map[usaId].push(ussrId);
        map[ussrId].push(usaId);
      }
    }
    return map;
  }, [schedules]);

  // ─── Derived data from local state ──────────────────────────────────────

  // Game count adjustments from drag-and-drop (initial vs current local state)
  const localGameAdjustments = useMemo(() => {
    const adjustments = new Map<string, { games: number; usa: number; ussr: number }>();

    for (let i = 0; i < initialSchedules.length; i++) {
      const ini = initialSchedules[i];
      const cur = state.schedules[i];
      if (!cur) continue;

      if (!ini.usaPlayer && cur.usaPlayer) {
        const adj = adjustments.get(cur.usaPlayer.userId) || { games: 0, usa: 0, ussr: 0 };
        adj.games += 1; adj.usa += 1;
        adjustments.set(cur.usaPlayer.userId, adj);
      } else if (ini.usaPlayer && !cur.usaPlayer) {
        const adj = adjustments.get(ini.usaPlayer.userId) || { games: 0, usa: 0, ussr: 0 };
        adj.games -= 1; adj.usa -= 1;
        adjustments.set(ini.usaPlayer.userId, adj);
      }

      if (!ini.ussrPlayer && cur.ussrPlayer) {
        const adj = adjustments.get(cur.ussrPlayer.userId) || { games: 0, usa: 0, ussr: 0 };
        adj.games += 1; adj.ussr += 1;
        adjustments.set(cur.ussrPlayer.userId, adj);
      } else if (ini.ussrPlayer && !cur.ussrPlayer) {
        const adj = adjustments.get(ini.ussrPlayer.userId) || { games: 0, usa: 0, ussr: 0 };
        adj.games -= 1; adj.ussr -= 1;
        adjustments.set(ini.ussrPlayer.userId, adj);
      }
    }
    return adjustments;
  }, [state.schedules, initialSchedules]);

  // Merged game counts (base + local adjustments)
  const mergedGameCounts = useMemo(() => {
    const merged = new Map<string, { usa: number; ussr: number }>();
    for (const [userId, counts] of playerGameCounts) {
      merged.set(userId, { usa: counts.usa, ussr: counts.ussr });
    }
    for (const [userId, adj] of localGameAdjustments) {
      const existing = merged.get(userId) || { usa: 0, ussr: 0 };
      existing.usa += adj.usa;
      existing.ussr += adj.ussr;
      merged.set(userId, existing);
    }
    return merged;
  }, [playerGameCounts, localGameAdjustments]);

  // Players with missing opponents (from local state — still orphaned, not removed)
  const playersWithMissingOpponents = useMemo(() => {
    const result: {
      player: PlayerInfo;
      usaGames: number;
      ussrGames: number;
      gameCode: string;
      scheduleId: string;
    }[] = [];

    for (const schedule of state.schedules) {
      if (schedule.removed) continue;
      const hasUsa = !!schedule.usaPlayer;
      const hasUssr = !!schedule.ussrPlayer;
      if (hasUsa !== hasUssr) {
        const player = (hasUsa ? schedule.usaPlayer : schedule.ussrPlayer)!;
        const counts = mergedGameCounts.get(player.userId) || { usa: 0, ussr: 0 };
        result.push({
          player,
          usaGames: counts.usa,
          ussrGames: counts.ussr,
          gameCode: schedule.gameCode,
          scheduleId: schedule.scheduleId,
        });
      }
    }
    return result;
  }, [state.schedules, mergedGameCounts]);
console.log("playersWithMissingOpponents", playersWithMissingOpponents)
  // Orphan partners (for display in players below target)
  const orphanPartners = useMemo(() => {
    const partnerMap = new Map<string, { partnerName: string; gameCode: string } | null>();

    for (const ls of state.schedules) {
      if (ls.removed) {
        if (ls.usaPlayer) partnerMap.delete(ls.usaPlayer.userId);
        if (ls.ussrPlayer) partnerMap.delete(ls.ussrPlayer.userId);
        continue;
      }
      if (ls.usaPlayer && ls.ussrPlayer) {
        partnerMap.set(ls.usaPlayer.userId, { partnerName: ls.ussrPlayer.fullName, gameCode: ls.gameCode });
        partnerMap.set(ls.ussrPlayer.userId, { partnerName: ls.usaPlayer.fullName, gameCode: ls.gameCode });
      } else {
        const existing = ls.usaPlayer || ls.ussrPlayer;
        if (existing) partnerMap.set(existing.userId, null);
      }
    }
    return partnerMap;
  }, [state.schedules]);

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
      const ini = initialSchedules[i];
      if (!ini) return false;
      return (
        s.usaPlayer?.userId !== ini.usaPlayer?.userId ||
        s.ussrPlayer?.userId !== ini.ussrPlayer?.userId
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

    const result = autoFixSchedules({
      players: allPlayers,
      previousOpponents,
      schedulesWithoutPair: orphanedSchedulesForAutoFix,
      playersBelowTarget: playersBelowTarget.map((p) => ({ ...p, rating: 0 })),
      targetGamesPerPlayer: TARGET_GAMES,
      tournamentId,
      tournamentName,
    });

    setAutoFixResult(result);
    setPersistMessage("");
  };

  const handleUndoPreview = () => {
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

    const newSchedules = autoFixResult.newPairings.map((p) => ({
      usa: p.usaPlayerId,
      ussr: p.ussrPlayerId,
      t: Number(tournamentId),
      d: new Date(p.dueDate),
      r: p.randomSides,
      gc: p.gameCode,
      randomSides: p.randomSides,
    }));

    try {
      await createSchedulesBulkMutation.mutateAsync([...updatedSchedules, ...newSchedules]);
      setAutoFixResult(null);
      setPersistMessage(`Persisted ${updatedSchedules.length} updated + ${newSchedules.length} new schedules`);
    } catch (err: any) {
      setPersistMessage(err?.response?.data?.message || "Failed to persist schedules");
    }
    setTimeout(() => setPersistMessage(""), 5000);
  };
console.log("state.schedules", state.schedules)
  return (
    <>
      {/* Players With Missing Opponents */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <div style={{ ...boxStyle, flex: 1, height: "auto", maxHeight: "400px" }}>
          <div style={titleStyle}>
            Players With Missing Opponents ({playersWithMissingOpponents.length})
          </div>
          {playersWithMissingOpponents.map((p) => {
            const partner = orphanPartners.has(p.player.userId) ? orphanPartners.get(p.player.userId) : undefined;
            return (
              <div key={p.player.userId} style={rowStyle} title={p.player.fullName}>
                <div>
                  {p.player.fullName} — USA {p.usaGames}, USSR {p.ussrGames}
                  {partner && (
                    <span style={{ opacity: 0.6 }}> — {partner.gameCode}</span>
                  )}
                </div>
                {partner !== undefined && (
                  <div style={{ fontSize: "10px", opacity: 0.7, marginLeft: "8px" }}>
                    {partner
                      ? `↳ Scheduled with: ${partner.partnerName} (${partner.gameCode})`
                      : `↳ No opponent yet`}
                  </div>
                )}
              </div>
            );
          })}
          {playersWithMissingOpponents.length === 0 && (
            <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
          )}
        </div>
      </div>

      {/* Schedules With Missing Players — Drag & Drop */}
      <section style={sectionStyle}>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--primary-text)" }}>
          Schedules With Missing Players ({state.schedules.filter((s) => !s.removed).length})
        </h4>
        <p style={{ fontSize: "12px", opacity: 0.6, margin: "0 0 12px 0", color: "var(--primary-text)" }}>
          Drag players between slots to pair them. Changes are saved locally until you click &quot;Save Schedules&quot;.
        </p>

        {state.schedules.length === 0 ? (
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
                {state.schedules.map((schedule) => (
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
      </div>
    </>
  );
};

export default ScheduleAdminDataBoxes;
