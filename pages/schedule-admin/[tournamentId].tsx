import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import Papa from "papaparse";
import ProtectedRoute from "components/ProtectedRoute";
import { userRoles } from "utils/constants";
import { useScheduleAdmin } from "hooks/useTournaments";
import { useUploadCsvSchedule, useAddSchedule, useReplacePlayer } from "hooks/useSchedule";
import { CsvScheduleRow } from "services/schedule.service";
import UserTypeahead from "components/UserTypeahead";
import DateComponent from "components/EditFormComponents/DateComponent";
import { Checkbox } from "components/Checkbox";

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
        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <div style={boxStyle}>
            <div style={titleStyle}>Forfeited Players ({data?.summary.totalForfeitedPlayers ?? 0})</div>
            {data?.forfeitedPlayers.map((p) => (
              <div key={p.userId} style={rowStyle} title={p.fullName}>{p.fullName} ({p.rating})</div>
            ))}
            {data?.forfeitedPlayers.length === 0 && <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>}
          </div>
          <div style={boxStyle}>
            <div style={titleStyle}>Schedules Without Pair ({data?.summary.totalSchedulesWithoutPair ?? 0})</div>
            {data?.schedulesWithoutPair.map((s) => (
              <div key={s.scheduleId} style={rowStyle} title={s.existingPlayer.fullName}>
                {s.existingPlayer.fullName} ({s.existingPlayer.rating}) — {s.gameCode}
              </div>
            ))}
            {data?.schedulesWithoutPair.length === 0 && <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>}
          </div>
          <div style={boxStyle}>
            <div style={titleStyle}>Waitlisted Players ({data?.summary.totalWaitlistPlayers ?? 0})</div>
            {data?.waitlistPlayers.map((p) => (
              <div key={p.userId} style={rowStyle} title={p.fullName}>{p.fullName} ({p.rating})</div>
            ))}
            {data?.waitlistPlayers.length === 0 && <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>}
          </div>
          <div style={boxStyle}>
            <div style={titleStyle}>Players Below {data?.summary.targetGamesPerPlayer ?? 20} Games ({data?.summary.totalPlayersBelowTarget ?? 0})</div>
            {data?.playersBelowTarget.map((p) => (
              <div key={p.userId} style={rowStyle} title={p.fullName}>
                {p.fullName} ({p.rating}) — {p.currentGames}/{data.summary.targetGamesPerPlayer} games
              </div>
            ))}
            {data?.playersBelowTarget.length === 0 && <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>}
          </div>
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
