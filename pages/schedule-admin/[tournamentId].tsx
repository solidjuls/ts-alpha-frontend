import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import Papa from "papaparse";
import ProtectedRoute from "components/ProtectedRoute";
import { userRoles } from "utils/constants";
import { useScheduleAdmin } from "hooks/useTournaments";
import { useUploadCsvSchedule, useAddSchedule, useReplacePlayer, useRemovePlayer } from "hooks/useSchedule";
import { CsvScheduleRow } from "services/schedule.service";
import UserTypeahead from "components/UserTypeahead";
import DateComponent from "components/EditFormComponents/DateComponent";
import { Checkbox } from "components/Checkbox";
import { Backbutton } from "components/Backbutton";
import ScheduleAdminDataBoxes from "components/ScheduleAdminDataBoxes/ScheduleAdminDataBoxes";

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
  const removePlayerMutation = useRemovePlayer();
  // CSV Upload state
  const [file, setFile] = useState<CsvScheduleRow[] | null>(null);
  const [csvStatus, setCsvStatus] = useState("");

  // Create Schedule state
  const [usaPlayer, setUsaPlayer] = useState("");
  const [ussrPlayer, setUssrPlayer] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [bestOf, setBestOf] = useState<number | null>(null);
  const [random, setRandom] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [scheduleMessage, setScheduleMessage] = useState("");

  // Replace Player state
  const [oldUser, setOldUser] = useState("");
  const [newUser, setNewUser] = useState("");
  const [replaceMessage, setReplaceMessage] = useState("");

  // Remove Player state
  const [playerToRemove, setPlayerToRemove] = useState("");
  const [removeMessage, setRemoveMessage] = useState("");

  // Filter state
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  const completeCSVSchema = (results: any) => {
    const errors: string[] = [];
    results.data.forEach((row: any, i: number) => {
      const rowNum = i + 2;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) {
        errors.push(`Row ${rowNum}: Invalid due_date "${row.due_date}". Expected format: YYYY-MM-DD (e.g. 2026-09-15)`);
      }
      if (!/^[A-Za-z0-9]{4}$/.test(row.game_code)) {
        errors.push(`Row ${rowNum}: Invalid game_code "${row.game_code}". Expected exactly 4 alphanumeric characters (letters or digits, e.g. A1B2)`);
      }
      ["usa_player_id", "ussr_player_id"].forEach((field) => {
        if (!/^\d+$/.test(row[field])) {
          errors.push(`Row ${rowNum}: Invalid user ID in ${field}: "${row[field]}". Expected a numeric value (e.g. 123)`);
        }
      });
      if (row.random !== undefined && row.random !== "" && !["0", "1"].includes(String(row.random))) {
        errors.push(`Row ${rowNum}: Invalid random "${row.random}". Expected 0 or 1`);
      }
      if (row.best_of !== undefined && row.best_of !== "" && !["1", "3", "5", "7"].includes(String(row.best_of))) {
        errors.push(`Row ${rowNum}: Invalid best_of "${row.best_of}". Expected one of: 1, 3, 5, 7`);
      }
    });

    if (errors.length > 0) {
      setCsvStatus(`❌ Validation failed:\n${errors.join("\n")}`);
    } else {
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
        bestOf,
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

  const handleRemovePlayer = async () => {
    if (!tournamentId || !playerToRemove) return;
    setRemoveMessage("");
    try {
      await removePlayerMutation.mutateAsync({
        tournamentId,
        playerId: playerToRemove,
      });
      setRemoveMessage("Player removed successfully");
      setPlayerToRemove("");
    } catch (err: any) {
      setRemoveMessage(err?.response?.data?.message || "Error removing player. Please try again.");
    }
    setTimeout(() => setRemoveMessage(""), 3000);
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
        <Backbutton />
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
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>Best Of</label>
              <select
                value={bestOf ?? ""}
                onChange={(e) => { setBestOf(e.target.value ? Number(e.target.value) : null); setScheduleMessage(""); }}
                style={{ width: "80px", height: "35px", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg-main)", color: "var(--primary-text)" }}
              >
                <option value="">—</option>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="7">7</option>
              </select>
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

        {/* Remove Player */}
        <div style={sectionStyle}>
          <h4 style={sectionTitleStyle}>Remove Player</h4>
          <div style={formRowStyle}>
            <UserTypeahead
              labelText="Player"
              selectedItem={playerToRemove}
              placeholder="Player to Remove..."
              width="150px"
              onBlur={() => {}}
              onSelect={(item) => setPlayerToRemove(item?.value || "")}
            />
            <button
              onClick={handleRemovePlayer}
              disabled={!playerToRemove || removePlayerMutation.isPending}
              style={{ ...btnStyle, opacity: !playerToRemove || removePlayerMutation.isPending ? 0.5 : 1 }}
            >
              {removePlayerMutation.isPending ? <Spinner size="2" /> : "Remove Player"}
            </button>
          </div>
          {removeMessage && (
            <span style={{ fontSize: "13px", color: removeMessage.includes("success") ? "var(--usa)" : "var(--ussr)" }}>
              {removeMessage}
            </span>
          )}
        </div>
        {/* Filter */}
        <div style={{ marginTop: "16px" }}>
          <Checkbox
            text="Show Only Pending Games"
            checked={showOnlyPending}
            onCheckedChange={setShowOnlyPending}
          />
        </div>

        {tournamentId === "359" && data && (
          <ScheduleAdminDataBoxes data={data} />
        )}
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
