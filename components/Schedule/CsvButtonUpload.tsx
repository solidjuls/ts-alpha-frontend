import { Button } from "components/Button";
import { useRouter } from 'next/router'
import { useState } from "react";
import Papa from 'papaparse'
import { FileInput, Title } from "./styles";
import { Flex, Span } from "components/Atoms";
import { useUploadCsvSchedule } from "hooks/useSchedule";
import { CsvScheduleRow } from "services/schedule.service";
import { Spinner } from "@radix-ui/themes";

export default function CsvUploadButton({ tournament } : { tournament: string }) {
  const router = useRouter()
  const [file, setFile] = useState<CsvScheduleRow[] | null>(null);
  const [status, setStatus] = useState("");

  // React Query mutation for CSV upload
  const uploadCsvMutation = useUploadCsvSchedule();

  const completeCSVSchema = (results: any) => {
    const expectedHeaders = [
      "due_date",
      "game_code",
      "usa_player_id",
      "ussr_player_id"
    ];
    const headers = results.meta.fields;

    const isHeaderValid = JSON.stringify(headers) === JSON.stringify(expectedHeaders);
    if (!isHeaderValid) {
      setStatus(`❌ Invalid schema! Expected headers: ${expectedHeaders.join(', ')}, but got: ${headers?.join(', ') || 'none'}`);
      return;
    }

    let valid = true;
    results.data.forEach((row: any, i: number) => {
      // due_date should look like YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) {
        setStatus(`❌ Row ${i + 2}: Invalid due_date ${row.due_date}. Expected format: YYYY-MM-DD`);
        valid = false;
      }
      // game_code should be 4 alphanumeric characters
      if (!/^[A-Za-z0-9]{4}$/.test(row.game_code)) {
        setStatus(`❌ Row ${i + 2}: Invalid game_code ${row.game_code}. Expected 4 alphanumeric characters`);
        valid = false;
      }
      // User IDs should be numeric
      ["usa_player_id", "ussr_player_id"].forEach((field) => {
        if (!/^\d+$/.test(row[field])) {
          setStatus(`❌ Row ${i + 2}: Invalid user ID in ${field}: ${row[field]}. Expected numeric value`);
          valid = false;
        }
      });
    });

    if (valid) {
      setStatus("✅ CSV schema and data are valid!");
      setFile(results.data)
    } else {
      console.warn("⚠️ CSV has schema/data issues. See errors above.");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
        const csvParse = e.target.files[0]

        Papa.parse(csvParse, {
            header: true,
            complete: completeCSVSchema
            // complete: function(results) {
            //     setFile(results.data)
            // }
        })
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("Uploading...");

    try {
      const result = await uploadCsvMutation.mutateAsync({
        file,
        tournament
      });

      if (result.success) {
        setStatus(`✅ ${result.message}`);
        if (result.errors.length > 0) {
          setStatus(prev => `${prev}\n⚠️ Warnings:\n${result.errors.join('\n')}`);
        }
        // Reload the page to show updated schedule
        setTimeout(() => router.reload(), 2000);
      } else {
        setStatus("❌ Upload failed.");
      }
    } catch (error: any) {
      setStatus(`❌ Upload failed: ${error?.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  return (
    <Flex style={{ flexDirection: 'column'}}>
      <Title>Upload CSV Schedule</Title>
      <Span>1- Select a tournament from the dropdown</Span>
      <Span>2- Upload a .csv file with the correct format (due_date,game_code,usa_player_id,ussr_player_id)</Span>
      <Span style={{ fontSize: '12px', color: '#666' }}>Note: Tournament ID is automatically set from the selected tournament</Span>
      <Flex style={{ margin: '8px 0 8px 0' }}>
        <FileInput
          type="file"
          accept=".csv"
          onChange={handleChange}
          style={{ pointerEvents: !tournament ? 'none' : 'unset' }}
        />
        <Button
          onClick={handleUpload}
          disabled={!file || uploadCsvMutation.isPending}
        >
          {uploadCsvMutation.isPending ? <Spinner size="2" /> : "Upload CSV"}
        </Button>
        <p>{status}</p>
      </Flex>
    </Flex>
  );
}
