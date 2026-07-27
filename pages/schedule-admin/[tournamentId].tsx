import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import Papa from "papaparse";
import ProtectedRoute from "components/ProtectedRoute";
import { userRoles } from "utils/constants";
import { useScheduleAdmin } from "hooks/useTournaments";
import { useUploadCsvSchedule } from "hooks/useSchedule";
import { CsvScheduleRow } from "services/schedule.service";

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

const ScheduleAdminPage = () => {
  const router = useRouter();
  const tournamentId = router.query.tournamentId as string;

  const { data, isLoading, error } = useScheduleAdmin(tournamentId);
  const uploadCsvMutation = useUploadCsvSchedule();

  const [file, setFile] = useState<CsvScheduleRow[] | null>(null);
  const [status, setStatus] = useState("");

  const completeCSVSchema = (results: any) => {
    let valid = true;
    results.data.forEach((row: any, i: number) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) {
        setStatus(`❌ Row ${i + 2}: Invalid due_date ${row.due_date}. Expected format: YYYY-MM-DD`);
        valid = false;
      }
      if (!/^[A-Za-z0-9]{4}$/.test(row.game_code)) {
        setStatus(`❌ Row ${i + 2}: Invalid game_code ${row.game_code}. Expected 4 alphanumeric characters`);
        valid = false;
      }
      ["usa_player_id", "ussr_player_id"].forEach((field) => {
        if (!/^\d+$/.test(row[field])) {
          setStatus(`❌ Row ${i + 2}: Invalid user ID in ${field}: ${row[field]}. Expected numeric value`);
          valid = false;
        }
      });
    });

    if (valid) {
      setStatus("✅ CSV schema and data are valid!");
      setFile(results.data);
    } else {
      console.warn("⚠️ CSV has schema/data issues. See errors above.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      Papa.parse(e.target.files[0], {
        header: true,
        complete: completeCSVSchema,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("Uploading...");

    try {
      const result = await uploadCsvMutation.mutateAsync({
        file,
        tournament: tournamentId,
      });

      if (result.success) {
        setStatus(`✅ ${result.message}`);
        if (result.errors.length > 0) {
          setStatus((prev) => `${prev}\n⚠️ Warnings:\n${result.errors.join("\n")}`);
        }
        setTimeout(() => router.reload(), 2000);
      } else {
        setStatus("❌ Upload Failed.");
      }
    } catch (err: any) {
      setStatus(`❌ Upload Failed: ${err?.response?.data?.message || err.message || "Unknown Error"}`);
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
            <input
              type="file"
              accept=".csv"
              onChange={handleChange}
              style={fileInputStyle}
            />
            <button
              onClick={handleUpload}
              disabled={!file || uploadCsvMutation.isPending}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                cursor: !file || uploadCsvMutation.isPending ? "not-allowed" : "pointer",
                fontWeight: 600,
                color: "var(--primary-text)",
                backgroundColor: "var(--bg-card)",
                opacity: !file || uploadCsvMutation.isPending ? 0.5 : 1,
              }}
            >
              {uploadCsvMutation.isPending ? <Spinner size="2" /> : "Upload CSV"}
            </button>
            {status && (
              <span style={{ fontSize: "13px", whiteSpace: "pre-line" }}>{status}</span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {/* Forfeited Players */}
          <div style={boxStyle}>
            <div style={titleStyle}>
              Forfeited Players ({data?.summary.totalForfeitedPlayers ?? 0})
            </div>
            {data?.forfeitedPlayers.map((p) => (
              <div key={p.userId} style={rowStyle} title={p.fullName}>
                {p.fullName} ({p.rating})
              </div>
            ))}
            {data?.forfeitedPlayers.length === 0 && (
              <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
            )}
          </div>

          {/* Schedules Without Pair */}
          <div style={boxStyle}>
            <div style={titleStyle}>
              Schedules Without Pair ({data?.summary.totalSchedulesWithoutPair ?? 0})
            </div>
            {data?.schedulesWithoutPair.map((s) => (
              <div key={s.scheduleId} style={rowStyle} title={s.existingPlayer.fullName}>
                {s.existingPlayer.fullName} ({s.existingPlayer.rating}) — {s.gameCode}
              </div>
            ))}
            {data?.schedulesWithoutPair.length === 0 && (
              <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
            )}
          </div>

          {/* Waitlisted Players */}
          <div style={boxStyle}>
            <div style={titleStyle}>
              Waitlisted Players ({data?.summary.totalWaitlistPlayers ?? 0})
            </div>
            {data?.waitlistPlayers.map((p) => (
              <div key={p.userId} style={rowStyle} title={p.fullName}>
                {p.fullName} ({p.rating})
              </div>
            ))}
            {data?.waitlistPlayers.length === 0 && (
              <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
            )}
          </div>

          {/* Players Below Target */}
          <div style={boxStyle}>
            <div style={titleStyle}>
              Players Below {data?.summary.targetGamesPerPlayer ?? 20} Games ({data?.summary.totalPlayersBelowTarget ?? 0})
            </div>
            {data?.playersBelowTarget.map((p) => (
              <div key={p.userId} style={rowStyle} title={p.fullName}>
                {p.fullName} ({p.rating}) — {p.currentGames}/{data.summary.targetGamesPerPlayer} games
              </div>
            ))}
            {data?.playersBelowTarget.length === 0 && (
              <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
            )}
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
