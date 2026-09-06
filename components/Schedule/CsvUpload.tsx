import { useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "@radix-ui/themes";
import Papa from "papaparse";
import { useUploadCsvSchedule } from "hooks/useSchedule";
import { CsvScheduleRow } from "services/schedule.service";

const fileInputStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  fontSize: "14px",
  color: "var(--primary-text)",
  backgroundColor: "var(--bg-main)",
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

const CsvUpload = ({ tournamentId }: { tournamentId: string }) => {
  const router = useRouter();
  const uploadCsvMutation = useUploadCsvSchedule();
  const [file, setFile] = useState<CsvScheduleRow[] | null>(null);
  const [csvStatus, setCsvStatus] = useState("");

  const completeCSVSchema = (results: any) => {
    let firstInvalidRow: { rowNum: number; errors: string[] } | null = null;
    for (let i = 0; i < results.data.length; i++) {
      const row = results.data[i];
      const rowNum = i + 2;
      const errors: string[] = [];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) {
        errors.push(`Invalid due_date "${row.due_date}". Expected format: YYYY-MM-DD (e.g. 2026-09-15)`);
      }
      if (!/^[A-Za-z0-9]{4}$/.test(row.game_code)) {
        errors.push(`Invalid game_code "${row.game_code}". Expected exactly 4 alphanumeric characters (letters or digits, e.g. A1B2)`);
      }
      ["usa_player_id", "ussr_player_id"].forEach((field) => {
        if (!/^\d+$/.test(row[field])) {
          errors.push(`Invalid user ID in ${field}: "${row[field]}". Expected a numeric value (e.g. 123)`);
        }
      });
      if (row.random !== undefined && row.random !== "" && !["0", "1"].includes(String(row.random))) {
        errors.push(`Invalid random "${row.random}". Expected 0 or 1`);
      }
      if (row.best_of !== undefined && row.best_of !== "" && !["1", "3", "5", "7"].includes(String(row.best_of))) {
        errors.push(`Invalid best_of "${row.best_of}". Expected one of: 1, 3, 5, 7`);
      }
      if (errors.length > 0) {
        firstInvalidRow = { rowNum, errors };
        break;
      }
    }

    if (firstInvalidRow) {
      setCsvStatus(`❌ Validation failed at row ${firstInvalidRow.rowNum}:\n${firstInvalidRow.errors.join("\n")}`);
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

  return (
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
  );
};

export default CsvUpload;
