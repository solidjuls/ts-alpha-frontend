import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { useCreateSchedulesBulk } from "hooks/useSchedule";
import { autoFixSchedules, AutoFixResult } from "utils/autoFixSchedules";
import {
  ScheduleAdminResponse,
  ScheduleAdminPlayer,
} from "services/tournaments.service";
import { FlagIcon } from "components/FlagIcon";

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

interface ScheduleAdminDataBoxesProps {
  data: ScheduleAdminResponse;
}

const ScheduleAdminDataBoxes = ({ data }: ScheduleAdminDataBoxesProps) => {
  const createSchedulesBulkMutation = useCreateSchedulesBulk();
  const [autoFixResult, setAutoFixResult] = useState<AutoFixResult | null>(null);
  const [persistMessage, setPersistMessage] = useState("");

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

  const resolvedOrphanIds = new Set<string>();
  if (autoFixResult) {
    for (const o of autoFixResult.filledOrphans) {
      resolvedOrphanIds.add(o.scheduleId);
    }
  }

  const remainingOrphans = data.schedulesWithoutPair.filter(
    s => !resolvedOrphanIds.has(s.scheduleId)
  );

  const projectedPlayersBelow = data.playersBelowTarget
    .map(p => {
      const additional = previewPlayerGameAdditions.get(p.userId) || 0;
      return { ...p, projectedGames: p.currentGames + additional };
    })
    .filter(p => p.projectedGames < (data.summary.targetGamesPerPlayer || 20));

  return (
    <>
      {/* Data Boxes */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <div style={boxStyle}>
          <div style={titleStyle}>Forfeited Players ({data.summary.totalForfeitedPlayers})</div>
          {data.forfeitedPlayers.map((p) => (
            <div key={p.userId} style={rowStyle} title={p.fullName}>{p.fullName} ({p.rating})</div>
          ))}
          {data.forfeitedPlayers.length === 0 && <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>}
        </div>
        <div style={boxStyle}>
          <div style={titleStyle}>
            Schedules Without Pair ({autoFixResult ? remainingOrphans.length : data.summary.totalSchedulesWithoutPair})
            {autoFixResult && <span style={{ fontWeight: 400, opacity: 0.6 }}> (after fix)</span>}
          </div>
          {(autoFixResult ? remainingOrphans : data.schedulesWithoutPair).map((s) => (
            <div key={s.scheduleId} style={rowStyle} title={s.existingPlayer.fullName}>
              {s.existingPlayer.fullName} ({s.existingPlayer.rating}) — {s.gameCode}
            </div>
          ))}
          {(autoFixResult ? remainingOrphans : data.schedulesWithoutPair).length === 0 && (
            <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
          )}
        </div>
        <div style={boxStyle}>
          <div style={titleStyle}>Waitlisted Players ({data.summary.totalWaitlistPlayers})</div>
          {data.waitlistPlayers.map((p) => (
            <div key={p.userId} style={rowStyle} title={p.fullName}>{p.fullName} ({p.rating})</div>
          ))}
          {data.waitlistPlayers.length === 0 && <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>}
        </div>
        <div style={boxStyle}>
          <div style={titleStyle}>
            Players Below {data.summary.targetGamesPerPlayer ?? 20} Games ({autoFixResult ? projectedPlayersBelow.length : data.summary.totalPlayersBelowTarget})
            {autoFixResult && <span style={{ fontWeight: 400, opacity: 0.6 }}> (after fix)</span>}
          </div>
          {(autoFixResult ? projectedPlayersBelow : data.playersBelowTarget).map((p) => (
            <div key={p.userId} style={rowStyle} title={p.fullName}>
              {p.fullName} ({p.rating}) — {autoFixResult ? (p as any).projectedGames : p.currentGames}/{data.summary.targetGamesPerPlayer || 20} games
            </div>
          ))}
          {(autoFixResult ? projectedPlayersBelow : data.playersBelowTarget).length === 0 && (
            <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
          )}
        </div>
      </div>

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
