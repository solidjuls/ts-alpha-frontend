import { useState, useMemo, useCallback } from "react";
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
import { useCreateSchedulesBulk, useDeleteSchedule, useSchedules } from "hooks/useSchedule";
import { autoFixSchedules, AutoFixResult } from "utils/autoFixSchedules";
import {
  ScheduleAdminResponse,
  ScheduleAdminPlayer,
  ScheduleAdminScheduleWithoutPair,
} from "services/tournaments.service";
import { FlagIcon } from "components/FlagIcon";
import Text from "components/Text";
import { format as formatDate } from "date-fns";

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

// ─── Local schedule state ───────────────────────────────────────────────────

interface LocalSchedule {
  scheduleId: string;
  gameCode: string;
  dueDate: string;
  usaPlayer: ScheduleAdminPlayer | null;
  ussrPlayer: ScheduleAdminPlayer | null;
  removed: boolean;
}

// ─── Draggable Player Slot ──────────────────────────────────────────────────

const DraggablePlayerSlot: React.FC<{
  player: ScheduleAdminPlayer;
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
      <span style={{ opacity: 0.5, fontSize: "12px" }}>({player.rating})</span>
    </div>
  );
};

// ─── Droppable Empty Slot ───────────────────────────────────────────────────

const DroppableEmptySlot: React.FC<{
  slotId: string;
  side: "usa" | "ussr";
}> = ({ slotId, side }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
  });

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

// ─── Drag Overlay (follows cursor) ──────────────────────────────────────────

const DragOverlayPlayer: React.FC<{
  player: ScheduleAdminPlayer;
}> = ({ player }) => (
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
    <Text fontSize="medium" strong>
      {player.fullName}
    </Text>
    <span style={{ opacity: 0.5, fontSize: "12px" }}>({player.rating})</span>
  </div>
);

// ─── Schedule Row ───────────────────────────────────────────────────────────

const ScheduleRow: React.FC<{
  schedule: LocalSchedule;
  onRemove: (scheduleId: string) => void;
}> = ({ schedule, onRemove }) => {
  const usaSlotId = `${schedule.scheduleId}-usa`;
  const ussrSlotId = `${schedule.scheduleId}-ussr`;

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
        {/* USA slot */}
        {schedule.usaPlayer ? (
          <DraggablePlayerSlot
            player={schedule.usaPlayer}
            slotId={usaSlotId}
            side="usa"
          />
        ) : (
          <DroppableEmptySlot slotId={usaSlotId} side="usa" />
        )}

        <span style={{ fontWeight: 700, color: "var(--primary-text)", fontSize: "14px" }}>
          vs
        </span>

        {/* USSR slot */}
        {schedule.ussrPlayer ? (
          <DraggablePlayerSlot
            player={schedule.ussrPlayer}
            slotId={ussrSlotId}
            side="ussr"
          />
        ) : (
          <DroppableEmptySlot slotId={ussrSlotId} side="ussr" />
        )}
      </div>

      {/* Meta info */}
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
  data: ScheduleAdminResponse;
}

const ScheduleAdminDataBoxes = ({ data }: ScheduleAdminDataBoxesProps) => {
  const createSchedulesBulkMutation = useCreateSchedulesBulk();
  const deleteScheduleMutation = useDeleteSchedule();
  const [autoFixResult, setAutoFixResult] = useState<AutoFixResult | null>(null);
  const [persistMessage, setPersistMessage] = useState("");

  // Fetch full tournament schedules for USA/USSR game counts
  const { data: fullScheduleData } = useSchedules({
    tournamentId: data.tournamentId,
    fullSchedule: 1,
    pageSize: 9999,
    onlyPending: false,
  });

  // Compute USA/USSR game counts per player
  const playerGameCounts = useMemo(() => {
    const counts = new Map<string, { usa: number; ussr: number }>();
    if (fullScheduleData?.results) {
      for (const game of fullScheduleData.results) {
        const usaId = game.usaPlayerId || game.idUsa;
        const ussrId = game.ussrPlayerId || game.idUssr;
        if (usaId) {
          const c = counts.get(usaId) || { usa: 0, ussr: 0 };
          c.usa += 1;
          counts.set(usaId, c);
        }
        if (ussrId) {
          const c = counts.get(ussrId) || { usa: 0, ussr: 0 };
          c.ussr += 1;
          counts.set(ussrId, c);
        }
      }
    }
    return counts;
  }, [fullScheduleData]);

  // ─── Local schedule state for drag-and-drop ─────────────────────────────

  const buildInitialSchedules = useCallback(
    (orphans: ScheduleAdminScheduleWithoutPair[]): LocalSchedule[] => {
      return orphans.map((o) => ({
        scheduleId: o.scheduleId,
        gameCode: o.gameCode,
        dueDate: o.dueDate,
        usaPlayer: o.existingPlayer.side === "usa" ? { userId: o.existingPlayer.userId, fullName: o.existingPlayer.fullName, rating: o.existingPlayer.rating, tldCode: o.existingPlayer.tldCode } : null,
        ussrPlayer: o.existingPlayer.side === "ussr" ? { userId: o.existingPlayer.userId, fullName: o.existingPlayer.fullName, rating: o.existingPlayer.rating, tldCode: o.existingPlayer.tldCode } : null,
        removed: false,
      }));
    },
    []
  );

  const [localSchedules, setLocalSchedules] = useState<LocalSchedule[]>(() =>
    buildInitialSchedules(data.schedulesWithoutPair)
  );

  // Compute local game count adjustments from drag-and-drop changes
  const localGameAdjustments = useMemo(() => {
    const initial = buildInitialSchedules(data.schedulesWithoutPair);
    const adjustments = new Map<string, { games: number; usa: number; ussr: number }>();

    for (let i = 0; i < initial.length; i++) {
      const ini = initial[i];
      const cur = localSchedules[i];
      if (!cur) continue;

      // Check USA slot changes
      if (!ini.usaPlayer && cur.usaPlayer) {
        // Player added to USA slot
        const adj = adjustments.get(cur.usaPlayer.userId) || { games: 0, usa: 0, ussr: 0 };
        adj.games += 1;
        adj.usa += 1;
        adjustments.set(cur.usaPlayer.userId, adj);
      } else if (ini.usaPlayer && !cur.usaPlayer) {
        // Player removed from USA slot
        const adj = adjustments.get(ini.usaPlayer.userId) || { games: 0, usa: 0, ussr: 0 };
        adj.games -= 1;
        adj.usa -= 1;
        adjustments.set(ini.usaPlayer.userId, adj);
      }

      // Check USSR slot changes
      if (!ini.ussrPlayer && cur.ussrPlayer) {
        // Player added to USSR slot
        const adj = adjustments.get(cur.ussrPlayer.userId) || { games: 0, usa: 0, ussr: 0 };
        adj.games += 1;
        adj.ussr += 1;
        adjustments.set(cur.ussrPlayer.userId, adj);
      } else if (ini.ussrPlayer && !cur.ussrPlayer) {
        // Player removed from USSR slot
        const adj = adjustments.get(ini.ussrPlayer.userId) || { games: 0, usa: 0, ussr: 0 };
        adj.games -= 1;
        adj.ussr -= 1;
        adjustments.set(ini.ussrPlayer.userId, adj);
      }
    }

    return adjustments;
  }, [localSchedules, data.schedulesWithoutPair, buildInitialSchedules]);

  // Merge base game counts with local adjustments
  const mergedGameCounts = useMemo(() => {
    const merged = new Map<string, { usa: number; ussr: number }>();
    // Start with base counts
    for (const [userId, counts] of playerGameCounts) {
      merged.set(userId, { ...counts });
    }
    // Apply local adjustments
    for (const [userId, adj] of localGameAdjustments) {
      const existing = merged.get(userId) || { usa: 0, ussr: 0 };
      existing.usa += adj.usa;
      existing.ussr += adj.ussr;
      merged.set(userId, existing);
    }
    return merged;
  }, [playerGameCounts, localGameAdjustments]);

  // Drag state
  const [activeDragPlayer, setActiveDragPlayer] = useState<ScheduleAdminPlayer | null>(null);
  const [activeDragSourceSlotId, setActiveDragSourceSlotId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const hasChanges = useMemo(() => {
    const initial = buildInitialSchedules(data.schedulesWithoutPair);
    if (localSchedules.length !== initial.length) return true;
    return localSchedules.some((s, i) => {
      const ini = initial[i];
      return (
        s.usaPlayer?.userId !== ini.usaPlayer?.userId ||
        s.ussrPlayer?.userId !== ini.ussrPlayer?.userId ||
        s.removed !== ini.removed
      );
    });
  }, [localSchedules, data.schedulesWithoutPair, buildInitialSchedules]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const player = active.data.current?.player as ScheduleAdminPlayer;
    setActiveDragPlayer(player || null);
    setActiveDragSourceSlotId(String(active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragPlayer(null);
    setActiveDragSourceSlotId(null);

    if (!over) return;

    const sourceSlotId = String(active.id);
    const destSlotId = String(over.id);

    if (sourceSlotId === destSlotId) return;

    // Parse slot IDs: "{scheduleId}-{side}"
    const parseSlotId = (slotId: string) => {
      const parts = slotId.split("-");
      const side = parts[parts.length - 1] as "usa" | "ussr";
      const scheduleId = parts.slice(0, -1).join("-");
      return { scheduleId, side };
    };

    const source = parseSlotId(sourceSlotId);
    const dest = parseSlotId(destSlotId);

    setLocalSchedules((prev) => {
      const next = prev.map((s) => ({ ...s }));

      const sourceSchedule = next.find((s) => s.scheduleId === source.scheduleId);
      const destSchedule = next.find((s) => s.scheduleId === dest.scheduleId);

      if (!sourceSchedule || !destSchedule) return prev;

      // Get the player from the source slot
      const sourcePlayer = source.side === "usa" ? sourceSchedule.usaPlayer : sourceSchedule.ussrPlayer;
      if (!sourcePlayer) return prev;

      // Check destination is empty
      const destPlayer = dest.side === "usa" ? destSchedule.usaPlayer : destSchedule.ussrPlayer;
      if (destPlayer) return prev; // Can only drop into empty slots

      // Move player: clear source, fill destination
      if (source.side === "usa") {
        sourceSchedule.usaPlayer = null;
      } else {
        sourceSchedule.ussrPlayer = null;
      }

      if (dest.side === "usa") {
        destSchedule.usaPlayer = sourcePlayer;
      } else {
        destSchedule.ussrPlayer = sourcePlayer;
      }

      return next;
    });
  };

  const handleRemoveSchedule = (scheduleId: string) => {
    setLocalSchedules((prev) =>
      prev.map((s) => (s.scheduleId === scheduleId ? { ...s, removed: true } : s))
    );
  };

  const handleRollback = () => {
    setLocalSchedules(buildInitialSchedules(data.schedulesWithoutPair));
    setPersistMessage("");
  };

  const handleSaveSchedules = async () => {
    const initial = buildInitialSchedules(data.schedulesWithoutPair);

    // Find schedules to delete (marked as removed)
    const toDelete = localSchedules.filter((s) => s.removed);

    // Find schedules that changed (player moved)
    const modified = localSchedules.filter((s, i) => {
      if (s.removed) return false;
      const ini = initial[i];
      return (
        s.usaPlayer?.userId !== ini.usaPlayer?.userId ||
        s.ussrPlayer?.userId !== ini.ussrPlayer?.userId
      );
    });

    // Find schedules that are now complete (both players filled) and were orphans
    const newlyComplete = modified.filter((s) => s.usaPlayer && s.ussrPlayer);

    try {
      const deletePromises = toDelete.map((s) =>
        deleteScheduleMutation.mutateAsync(s.scheduleId)
      );

      let bulkPromise: Promise<any> = Promise.resolve();
      if (newlyComplete.length > 0) {
        const dtos = newlyComplete.map((s) => ({
          scheduleId: Number(s.scheduleId),
          usa: s.usaPlayer!.userId,
          ussr: s.ussrPlayer!.userId,
          t: Number(data.tournamentId),
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

      // Reset local state to reflect new reality
      const remaining = localSchedules.filter((s) => !s.removed && !(s.usaPlayer && s.ussrPlayer));
      setLocalSchedules(remaining);
    } catch (err: any) {
      setPersistMessage(`❌ ${err?.response?.data?.message || "Failed to save changes"}`);
    }
    setTimeout(() => setPersistMessage(""), 5000);
  };

  // ─── Auto Fix logic (unchanged) ─────────────────────────────────────────

  const handleAutoFix = () => {
    const allPlayers: ScheduleAdminPlayer[] = [];
    const playerIds = new Set<string>();
    for (const p of data.playersBelowTarget) {
      if (!playerIds.has(p.userId)) {
        allPlayers.push({ userId: p.userId, fullName: p.fullName, rating: p.rating, tldCode: p.tldCode });
        playerIds.add(p.userId);
      }
    }
    for (const s of data.schedulesWithoutPair) {
      if (!playerIds.has(s.existingPlayer.userId)) {
        allPlayers.push({ userId: s.existingPlayer.userId, fullName: s.existingPlayer.fullName, rating: s.existingPlayer.rating, tldCode: s.existingPlayer.tldCode });
        playerIds.add(s.existingPlayer.userId);
      }
    }

    const result = autoFixSchedules({
      players: allPlayers,
      previousOpponents: data.previousOpponents || {},
      schedulesWithoutPair: data.schedulesWithoutPair,
      playersBelowTarget: data.playersBelowTarget,
      targetGamesPerPlayer: data.summary.targetGamesPerPlayer,
      tournamentId: data.tournamentId,
      tournamentName: data.tournamentName,
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

    const playerMap = new Map<string, { fullName: string; rating: number; tldCode: string }>();
    for (const p of data.playersBelowTarget) {
      playerMap.set(p.userId, { fullName: p.fullName, rating: p.rating, tldCode: p.tldCode });
    }
    for (const s of data.schedulesWithoutPair) {
      playerMap.set(s.existingPlayer.userId, { fullName: s.existingPlayer.fullName, rating: s.existingPlayer.rating, tldCode: s.existingPlayer.tldCode });
    }
    const name = (id: string) => playerMap.get(id)?.fullName ?? id;
    const rating = (id: string) => playerMap.get(id)?.rating ?? '?';

    const updatedSchedules = autoFixResult.filledOrphans.map(o => {
      const usaId = o.existingPlayerSide === 'usa' ? o.existingPlayerId : o.opponentPlayerId;
      const ussrId = o.existingPlayerSide === 'ussr' ? o.existingPlayerId : o.opponentPlayerId;
      return {
        scheduleId: Number(o.scheduleId),
        usa: usaId,
        ussr: ussrId,
        t: Number(data.tournamentId),
        d: new Date(o.dueDate),
        r: o.randomSides,
        gc: o.gameCode,
        randomSides: o.randomSides,
      };
    });

    const newSchedules = autoFixResult.newPairings.map(p => ({
      usa: p.usaPlayerId,
      ussr: p.ussrPlayerId,
      t: Number(data.tournamentId),
      d: new Date(p.dueDate),
      r: p.randomSides,
      gc: p.gameCode,
      randomSides: p.randomSides,
    }));

    const allSchedules = [...updatedSchedules, ...newSchedules];

    console.log('═══════════════════════════════════════');
    console.log('[Persist] Final state for tournament:', data.tournamentName);
    console.log('═══════════════════════════════════════');
    console.log(`\n📋 Updated schedules (${updatedSchedules.length}):`);
    updatedSchedules.forEach(s => {
      console.log(`  [${s.scheduleId}] ${name(s.usa)} (${rating(s.usa)}) vs ${name(s.ussr)} (${rating(s.ussr)}) — ${s.gc} — ${s.d.toLocaleDateString()}`);
    });
    console.log(`\n🆕 New schedules (${newSchedules.length}):`);
    newSchedules.forEach((s, i) => {
      console.log(`  ${i + 1}. ${name(s.usa)} (${rating(s.usa)}) vs ${name(s.ussr)} (${rating(s.ussr)}) — ${s.gc} — ${s.d.toLocaleDateString()}`);
    });
    console.log('\n📦 Payload:', allSchedules);
    console.log('═══════════════════════════════════════');

    try {
      await createSchedulesBulkMutation.mutateAsync(allSchedules);
      setAutoFixResult(null);
      setPersistMessage(`Persisted ${updatedSchedules.length} updated + ${newSchedules.length} new schedules`);
    } catch (err: any) {
      setPersistMessage(err?.response?.data?.message || "Failed to persist schedules");
    }
    setTimeout(() => setPersistMessage(""), 5000);
  };

  // Compute projected state when in preview mode
  const previewPlayerGameAdditions = new Map<string, number>();
  if (autoFixResult) {
    for (const o of autoFixResult.filledOrphans) {
      previewPlayerGameAdditions.set(o.existingPlayerId, (previewPlayerGameAdditions.get(o.existingPlayerId) || 0) + 1);
      previewPlayerGameAdditions.set(o.opponentPlayerId, (previewPlayerGameAdditions.get(o.opponentPlayerId) || 0) + 1);
    }
    for (const p of autoFixResult.newPairings) {
      previewPlayerGameAdditions.set(p.usaPlayerId, (previewPlayerGameAdditions.get(p.usaPlayerId) || 0) + 1);
      previewPlayerGameAdditions.set(p.ussrPlayerId, (previewPlayerGameAdditions.get(p.ussrPlayerId) || 0) + 1);
    }
  }

  const projectedPlayersBelow = data.playersBelowTarget
    .map(p => {
      const additional = previewPlayerGameAdditions.get(p.userId) || 0;
      const localAdj = localGameAdjustments.get(p.userId)?.games || 0;
      return { ...p, projectedGames: p.currentGames + additional + localAdj };
    })
    .filter(p => p.projectedGames < (data.summary.targetGamesPerPlayer || 20));

  const targetGames = data.summary.targetGamesPerPlayer || 20;

  return (
    <>
      {/* Data Boxes */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <div style={{ ...boxStyle, flex: 1, height: "auto", maxHeight: "400px" }}>
          <div style={titleStyle}>
            Players Below {targetGames} Games ({autoFixResult ? projectedPlayersBelow.length : data.summary.totalPlayersBelowTarget})
            {autoFixResult && <span style={{ fontWeight: 400, opacity: 0.6 }}> (after fix)</span>}
          </div>
          {(autoFixResult ? projectedPlayersBelow : data.playersBelowTarget).map((p) => {
            const counts = mergedGameCounts.get(p.userId) || { usa: 0, ussr: 0 };
            const adj = localGameAdjustments.get(p.userId);
            const games = autoFixResult ? (p as any).projectedGames : p.currentGames + (adj?.games || 0);
            return (
              <div key={p.userId} style={rowStyle} title={p.fullName}>
                {p.fullName} ({p.rating}) — {games}/{targetGames} games — USA {counts.usa}, USSR {counts.ussr}
              </div>
            );
          })}
          {(autoFixResult ? projectedPlayersBelow : data.playersBelowTarget).length === 0 && (
            <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
          )}
        </div>
      </div>

      {/* Schedules With Missing Players — Drag & Drop */}
      <section style={sectionStyle}>
        <h4 style={{ margin: "0 0 12px 0", color: "var(--primary-text)" }}>
          Schedules With Missing Players ({localSchedules.filter(s => !s.removed).length})
        </h4>
        <p style={{ fontSize: "12px", opacity: 0.6, margin: "0 0 12px 0", color: "var(--primary-text)" }}>
          Drag players between slots to pair them. Changes are saved locally until you click &quot;Save Schedules&quot;.
        </p>

        {localSchedules.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", opacity: 0.5, color: "var(--primary-text)" }}>
            No schedules with missing players.
          </div>
        ) : (
          <>
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
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
                {localSchedules.map((schedule) => (
                  <ScheduleRow
                    key={schedule.scheduleId}
                    schedule={schedule}
                    onRemove={handleRemoveSchedule}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeDragPlayer ? <DragOverlayPlayer player={activeDragPlayer} /> : null}
              </DragOverlay>
            </DndContext>

            {/* Save / Rollback controls */}
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
                {(createSchedulesBulkMutation.isPending || deleteScheduleMutation.isPending)
                  ? <Spinner size="2" />
                  : "Save Schedules"}
              </button>
              <button
                onClick={handleRollback}
                disabled={!hasChanges}
                style={{
                  ...btnStyle,
                  opacity: !hasChanges ? 0.5 : 1,
                  cursor: !hasChanges ? "not-allowed" : "pointer",
                }}
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
          {persistMessage && (
            <span style={{ fontSize: "13px", color: persistMessage.includes("success") ? "var(--usa)" : "var(--ussr)" }}>
              {persistMessage}
            </span>
          )}
        </div>

        {autoFixResult?.warnings && autoFixResult.warnings.length > 0 && (
          <div style={{ fontSize: "13px", color: "var(--ussr)", marginBottom: "12px" }}>
            {autoFixResult.warnings.map((w, i) => <div key={i}>⚠️ {w}</div>)}
          </div>
        )}

        {autoFixResult && (autoFixResult.filledOrphans.length > 0 || autoFixResult.newPairings.length > 0) && (() => {
          const allPlayersMap = new Map<string, ScheduleAdminPlayer>();
          for (const p of data.playersBelowTarget) {
            allPlayersMap.set(p.userId, { userId: p.userId, fullName: p.fullName, rating: p.rating, tldCode: p.tldCode });
          }
          for (const s of data.schedulesWithoutPair) {
            allPlayersMap.set(s.existingPlayer.userId, { userId: s.existingPlayer.userId, fullName: s.existingPlayer.fullName, rating: s.existingPlayer.rating, tldCode: s.existingPlayer.tldCode });
          }

          const renderPlayer = (playerId: string) => {
            const p = allPlayersMap.get(playerId);
            return (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: "180px" }}>
                {p?.tldCode && <FlagIcon code={p.tldCode} />}
                <span style={{ fontWeight: 600 }}>{p?.fullName || playerId}</span>
                <span style={{ opacity: 0.6 }}>({p?.rating})</span>
              </div>
            );
          };

          const previewRowStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-card)",
            fontSize: "12px",
          };

          return (
            <div>
              {autoFixResult.filledOrphans.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--primary-text)" }}>
                    Filling {autoFixResult.filledOrphans.length} orphaned schedule(s)
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {autoFixResult.filledOrphans.map((orphan, idx) => {
                      const usaId = orphan.existingPlayerSide === "usa" ? orphan.existingPlayerId : orphan.opponentPlayerId;
                      const ussrId = orphan.existingPlayerSide === "ussr" ? orphan.existingPlayerId : orphan.opponentPlayerId;

                      return (
                        <div key={idx} style={{ ...previewRowStyle, borderLeft: "3px solid var(--usa)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                            {renderPlayer(usaId)}
                            <span style={{ fontWeight: 700, color: "var(--ussr)" }}>vs</span>
                            {renderPlayer(ussrId)}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", opacity: 0.7 }}>
                            <span style={{ fontSize: "10px", backgroundColor: "var(--usa)", color: "var(--alt-text)", padding: "2px 6px", borderRadius: "4px" }}>orphan {orphan.scheduleId}</span>
                            <span>{orphan.gameCode}</span>
                            <span>{new Date(orphan.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {autoFixResult.newPairings.length > 0 && (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--primary-text)" }}>
                    Creating {autoFixResult.newPairings.length} new schedule(s)
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {autoFixResult.newPairings.map((pairing, idx) => (
                      <div key={idx} style={previewRowStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                          {renderPlayer(pairing.usaPlayerId)}
                          <span style={{ fontWeight: 700, color: "var(--ussr)" }}>vs</span>
                          {renderPlayer(pairing.ussrPlayerId)}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", opacity: 0.7 }}>
                          <span>{pairing.randomSides ? "Random" : "Fixed"}</span>
                          <span>{new Date(pairing.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </>
  );
};

export default ScheduleAdminDataBoxes;
