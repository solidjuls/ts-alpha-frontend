import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import Papa from "papaparse";
import ProtectedRoute from "components/ProtectedRoute";
import { userRoles } from "utils/constants";
import { useScheduleAdmin } from "hooks/useTournaments";
import { useUploadCsvSchedule, useAddSchedule, useReplacePlayer, useCreateSchedulesBatch, useUpdateScheduleOpponent } from "hooks/useSchedule";
import { CsvScheduleRow } from "services/schedule.service";
import UserTypeahead from "components/UserTypeahead";
import DateComponent from "components/EditFormComponents/DateComponent";
import { Checkbox } from "components/Checkbox";
import { FlagIcon } from "components/FlagIcon";
import { autoFixSchedules, AutoFixResult } from "utils/autoFixSchedules";
import { ScheduleAdminPlayer } from "services/tournaments.service";

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

const fileInputStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  fontSize: "14px",
  color: "var(--primary-text)",
  backgroundColor: "var(--bg-main)",
};

const sectionStyle: React.CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  background: "var(--bg-card)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 12px 0",
  color: "var(--primary-text)",
};

const formRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-end",
  marginBottom: "12px",
  flexWrap: "wrap",
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

const ScheduleAdminPage = () => {
  const router = useRouter();
  const tournamentId = router.query.tournamentId as string;

  const { data, isLoading, error } = useScheduleAdmin(tournamentId);
  const uploadCsvMutation = useUploadCsvSchedule();
  const addScheduleMutation = useAddSchedule();
  const replacePlayerMutation = useReplacePlayer();
  const createSchedulesBatchMutation = useCreateSchedulesBatch();
  const updateScheduleOpponentMutation = useUpdateScheduleOpponent();

  // CSV Upload state
  const [file, setFile] = useState<CsvScheduleRow[] | null>(null);
  const [csvStatus, setCsvStatus] = useState("");

  // Create Schedule state
  const [usaPlayer, setUsaPlayer] = useState("");
  const [ussrPlayer, setUssrPlayer] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [random, setRandom] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [scheduleMessage, setScheduleMessage] = useState("");

  // Replace Player state
  const [oldUser, setOldUser] = useState("");
  const [newUser, setNewUser] = useState("");
  const [replaceMessage, setReplaceMessage] = useState("");

  // Auto Fix state
  const [autoFixResult, setAutoFixResult] = useState<AutoFixResult | null>(null);
  const [persistMessage, setPersistMessage] = useState("");

  const completeCSVSchema = (results: any) => {
    let valid = true;
    results.data.forEach((row: any, i: number) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) {
        setCsvStatus(`❌ Row ${i + 2}: Invalid due_date ${row.due_date}. Expected format: YYYY-MM-DD`);
        valid = false;
      }
      if (!/^[A-Za-z0-9]{4}$/.test(row.game_code)) {
        setCsvStatus(`❌ Row ${i + 2}: Invalid game_code ${row.game_code}. Expected 4 alphanumeric characters`);
        valid = false;
      }
      ["usa_player_id", "ussr_player_id"].forEach((field) => {
        if (!/^\d+$/.test(row[field])) {
          setCsvStatus(`❌ Row ${i + 2}: Invalid user ID in ${field}: ${row[field]}. Expected numeric value`);
          valid = false;
        }
      });
    });

    if (valid) {
      setCsvStatus("✅ CSV schema and data are valid!");
      setFile(results.data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      Papa.parse(e.target.files[0], {
        header: true,
        complete: completeCSVSchema,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setCsvStatus("Uploading...");
    try {
      const result = await uploadCsvMutation.mutateAsync({ file, tournament: tournamentId });
      if (result.success) {
        setCsvStatus(`✅ ${result.message}`);
        if (result.errors.length > 0) {
          setCsvStatus((prev) => `${prev}\n⚠️ Warnings:\n${result.errors.join("\n")}`);
        }
        setTimeout(() => router.reload(), 2000);
      } else {
        setCsvStatus("❌ Upload Failed.");
      }
    } catch (err: any) {
      setCsvStatus(`❌ Upload Failed: ${err?.response?.data?.message || err.message || "Unknown Error"}`);
    }
  };

  const handleCreateSchedule = async () => {
    if (!usaPlayer || !ussrPlayer || !dueDate) {
      setScheduleMessage("Please fill in all required fields");
      return;
    }
    if (usaPlayer === ussrPlayer) {
      setScheduleMessage("USA and USSR players must be different");
      return;
    }
    setScheduleMessage("");
    try {
      await addScheduleMutation.mutateAsync({
        tournamentId,
        usaPlayerId: usaPlayer,
        ussrPlayerId: ussrPlayer,
        randomSides: random,
        dueDate: dueDate.toISOString(),
        gameCode: gameCode || "",
      });
      setScheduleMessage("Schedule created successfully!");
      setTimeout(() => setScheduleMessage(""), 3000);
    } catch (err: any) {
      setScheduleMessage(err?.response?.data?.message || "Failed to create schedule");
    }
  };

  const handleReplacePlayer = async () => {
    if (!tournamentId || !oldUser || !newUser) return;
    try {
      const result = await replacePlayerMutation.mutateAsync({
        tournamentId,
        oldPlayerId: oldUser,
        newPlayerId: newUser,
      });
      const totalUpdated = (result.updatedUSA?.count || 0) + (result.updatedUSSR?.count || 0);
      setReplaceMessage(`${totalUpdated} schedule entries have been updated`);
    } catch {
      setReplaceMessage("Error updating players. Please try again.");
    }
  };

  const handleAutoFix = () => {
    if (!data) return;

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

  const handlePersistSchedules = () => {
    if (!autoFixResult || !data) return;

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
        scheduleId: o.scheduleId,
        t: data.tournamentId,
        usa: usaId,
        ussr: ussrId,
        randomSides: o.randomSides,
        d: o.dueDate,
        gc: o.gameCode,
      };
    });

    const newSchedules = autoFixResult.newPairings.map(p => ({
      scheduleId: null,
      t: data.tournamentId,
      usa: p.usaPlayerId,
      ussr: p.ussrPlayerId,
      randomSides: p.randomSides,
      d: p.dueDate,
      gc: p.gameCode,
    }));

    const allSchedules = [...updatedSchedules, ...newSchedules];

    console.log('═══════════════════════════════════════');
    console.log('[Persist] Final state for tournament:', data.tournamentName);
    console.log('═══════════════════════════════════════');
    console.log(`\n📋 Updated schedules (${updatedSchedules.length}):`);
    updatedSchedules.forEach(s => {
      console.log(`  [${s.scheduleId}] ${name(s.usa)} (${rating(s.usa)}) vs ${name(s.ussr)} (${rating(s.ussr)}) — ${s.gc} — ${new Date(s.d).toLocaleDateString()}`);
    });
    console.log(`\n🆕 New schedules (${newSchedules.length}):`);
    newSchedules.forEach((s, i) => {
      console.log(`  ${i + 1}. ${name(s.usa)} (${rating(s.usa)}) vs ${name(s.ussr)} (${rating(s.ussr)}) — ${s.gc} — ${new Date(s.d).toLocaleDateString()}`);
    });
    console.log('\n📦 Payload (all schedules):', allSchedules);
    console.log('═══════════════════════════════════════');

    setAutoFixResult(null);
    setPersistMessage(`Persisted ${updatedSchedules.length} updated + ${newSchedules.length} new (check console)`);
    setTimeout(() => setPersistMessage(""), 5000);
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <Spinner size="3" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", color: "var(--ussr)" }}>
        Error: {(error as Error).message}
      </div>
    );
  }

  if (data) {
    console.log("Schedule Admin Response:", data);
  }

  return (
    <>
      <Head>
        <title>Schedule Admin - Twilight Struggle</title>
        <meta name="description" content="Tournament schedule administration" />
        <link rel="icon" href="/ts-icon.webp" />
      </Head>
      <div style={{ padding: "24px" }}>
        <h1>{data?.tournamentName || "Schedule Admin"}</h1>

        {/* CSV Upload */}
        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
          <h3 style={{ marginTop: 0 }}>Upload CSV Schedule</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <input type="file" accept=".csv" onChange={handleFileChange} style={fileInputStyle} />
            <button
              onClick={handleUpload}
              disabled={!file || uploadCsvMutation.isPending}
              style={{ ...btnStyle, opacity: !file || uploadCsvMutation.isPending ? 0.5 : 1, cursor: !file || uploadCsvMutation.isPending ? "not-allowed" : "pointer" }}
            >
              {uploadCsvMutation.isPending ? <Spinner size="2" /> : "Upload CSV"}
            </button>
            {csvStatus && <span style={{ fontSize: "13px", whiteSpace: "pre-line" }}>{csvStatus}</span>}
          </div>
        </div>

        {/* Create Schedule */}
        <div style={sectionStyle}>
          <h4 style={sectionTitleStyle}>Create Schedule</h4>
          <div style={formRowStyle}>
            <UserTypeahead
              labelText="USA Player"
              selectedItem={usaPlayer}
              placeholder="Select USA Player..."
              width="150px"
              onBlur={() => {}}
              onSelect={(item) => { setUsaPlayer(item?.value || ""); setScheduleMessage(""); }}
            />
            <UserTypeahead
              labelText="USSR Player"
              selectedItem={ussrPlayer}
              placeholder="Select USSR Player..."
              width="150px"
              onBlur={() => {}}
              onSelect={(item) => { setUssrPlayer(item?.value || ""); setScheduleMessage(""); }}
            />
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>Game Code</label>
              <input
                type="text"
                placeholder="Code"
                value={gameCode}
                maxLength={4}
                onChange={(e) => { setGameCode(e.target.value); setScheduleMessage(""); }}
                style={{ width: "80px", height: "35px", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg-main)", color: "var(--primary-text)" }}
              />
            </div>
            <DateComponent
              labelText="Due Date"
              inputValue={dueDate}
              onInputValueChange={(value: Date) => { setDueDate(value); setScheduleMessage(""); }}
            />
            <Checkbox text="Random" checked={random} onCheckedChange={() => setRandom(!random)} />
            <button
              onClick={handleCreateSchedule}
              disabled={!usaPlayer || !ussrPlayer || !dueDate || addScheduleMutation.isPending}
              style={{ ...btnStyle, opacity: !usaPlayer || !ussrPlayer || !dueDate || addScheduleMutation.isPending ? 0.5 : 1 }}
            >
              {addScheduleMutation.isPending ? <Spinner size="2" /> : "Create Schedule"}
            </button>
          </div>
          {scheduleMessage && (
            <span style={{ fontSize: "13px", color: scheduleMessage.includes("success") ? "var(--usa)" : "var(--ussr)" }}>
              {scheduleMessage}
            </span>
          )}
        </div>

        {/* Replace Player */}
        <div style={sectionStyle}>
          <h4 style={sectionTitleStyle}>Replace Player</h4>
          <div style={formRowStyle}>
            <UserTypeahead
              labelText="Old Player"
              selectedItem={oldUser}
              placeholder="Player to Replace..."
              width="150px"
              onBlur={() => setOldUser("")}
              onSelect={(value) => setOldUser(value?.value as string)}
            />
            <UserTypeahead
              labelText="New Player"
              selectedItem={newUser}
              placeholder="Type the New Player..."
              width="150px"
              onBlur={() => setNewUser("")}
              onSelect={(value) => setNewUser(value?.value as string)}
            />
            <button
              onClick={handleReplacePlayer}
              disabled={!oldUser || !newUser || replacePlayerMutation.isPending}
              style={{ ...btnStyle, opacity: !oldUser || !newUser || replacePlayerMutation.isPending ? 0.5 : 1 }}
            >
              {replacePlayerMutation.isPending ? "Updating..." : "Replace Player"}
            </button>
          </div>
          {replaceMessage && <span style={{ fontSize: "13px" }}>{replaceMessage}</span>}
        </div>
        {/* Data Boxes */}
        {(() => {
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

          const remainingOrphans = (data?.schedulesWithoutPair || []).filter(
            s => !resolvedOrphanIds.has(s.scheduleId)
          );

          const projectedPlayersBelow = (data?.playersBelowTarget || [])
            .map(p => {
              const additional = previewPlayerGameAdditions.get(p.userId) || 0;
              return { ...p, projectedGames: p.currentGames + additional };
            })
            .filter(p => p.projectedGames < (data?.summary.targetGamesPerPlayer || 20));

          return (
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <div style={boxStyle}>
                <div style={titleStyle}>Forfeited Players ({data?.summary.totalForfeitedPlayers ?? 0})</div>
                {data?.forfeitedPlayers.map((p) => (
                  <div key={p.userId} style={rowStyle} title={p.fullName}>{p.fullName} ({p.rating})</div>
                ))}
                {data?.forfeitedPlayers.length === 0 && <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>}
              </div>
              <div style={boxStyle}>
                <div style={titleStyle}>
                  Schedules Without Pair ({autoFixResult ? remainingOrphans.length : (data?.summary.totalSchedulesWithoutPair ?? 0)})
                  {autoFixResult && <span style={{ fontWeight: 400, opacity: 0.6 }}> (after fix)</span>}
                </div>
                {(autoFixResult ? remainingOrphans : (data?.schedulesWithoutPair || [])).map((s) => (
                  <div key={s.scheduleId} style={rowStyle} title={s.existingPlayer.fullName}>
                    {s.existingPlayer.fullName} ({s.existingPlayer.rating}) — {s.gameCode}
                  </div>
                ))}
                {(autoFixResult ? remainingOrphans : (data?.schedulesWithoutPair || [])).length === 0 && (
                  <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
                )}
              </div>
              <div style={boxStyle}>
                <div style={titleStyle}>Waitlisted Players ({data?.summary.totalWaitlistPlayers ?? 0})</div>
                {data?.waitlistPlayers.map((p) => (
                  <div key={p.userId} style={rowStyle} title={p.fullName}>{p.fullName} ({p.rating})</div>
                ))}
                {data?.waitlistPlayers.length === 0 && <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>}
              </div>
              <div style={boxStyle}>
                <div style={titleStyle}>
                  Players Below {data?.summary.targetGamesPerPlayer ?? 20} Games ({autoFixResult ? projectedPlayersBelow.length : (data?.summary.totalPlayersBelowTarget ?? 0)})
                  {autoFixResult && <span style={{ fontWeight: 400, opacity: 0.6 }}> (after fix)</span>}
                </div>
                {(autoFixResult ? projectedPlayersBelow : (data?.playersBelowTarget || [])).map((p) => (
                  <div key={p.userId} style={rowStyle} title={p.fullName}>
                    {p.fullName} ({p.rating}) — {autoFixResult ? (p as any).projectedGames : p.currentGames}/{data?.summary.targetGamesPerPlayer || 20} games
                  </div>
                ))}
                {(autoFixResult ? projectedPlayersBelow : (data?.playersBelowTarget || [])).length === 0 && (
                  <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
                )}
              </div>
            </div>
          );
        })()}
        {/* Auto Fix Schedules */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: autoFixResult ? "16px" : "0" }}>
            <button
              onClick={handleAutoFix}
              disabled={!data || createSchedulesBatchMutation.isPending || updateScheduleOpponentMutation.isPending}
              style={{ ...btnStyle, backgroundColor: "var(--usa)", color: "var(--alt-text)", opacity: !data ? 0.5 : 1 }}
            >
              Auto Fix Schedules
            </button>
            {autoFixResult && (
              <>
                <button
                  onClick={handlePersistSchedules}
                  disabled={createSchedulesBatchMutation.isPending || updateScheduleOpponentMutation.isPending}
                  style={{ ...btnStyle, backgroundColor: "var(--usa)", color: "var(--alt-text)", opacity: createSchedulesBatchMutation.isPending || updateScheduleOpponentMutation.isPending ? 0.5 : 1 }}
                >
                  {(createSchedulesBatchMutation.isPending || updateScheduleOpponentMutation.isPending) ? <Spinner size="2" /> : "Persist Schedules"}
                </button>
                <button
                  onClick={handleUndoPreview}
                  disabled={createSchedulesBatchMutation.isPending || updateScheduleOpponentMutation.isPending}
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
            for (const p of data?.playersBelowTarget || []) {
              allPlayersMap.set(p.userId, { userId: p.userId, fullName: p.fullName, rating: p.rating, tldCode: p.tldCode });
            }
            for (const s of data?.schedulesWithoutPair || []) {
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

            const rowStyle: React.CSSProperties = {
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
                          <div key={idx} style={{ ...rowStyle, borderLeft: "3px solid var(--usa)" }}>
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
                        <div key={idx} style={rowStyle}>
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
      </div>
    </>
  );
};

const WrappedScheduleAdminPage = () => (
  <ProtectedRoute requiredRole={userRoles.PLAYER}>
    <ScheduleAdminPage />
  </ProtectedRoute>
);

export default WrappedScheduleAdminPage;
