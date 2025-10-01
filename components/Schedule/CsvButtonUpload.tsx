import { Button } from "components/Button";
import { useRouter } from 'next/router'
import { useState } from "react";
import getAxiosInstance from "utils/axios";
import Papa from 'papaparse'
import { FileInput, Title } from "./styles";
import { Flex, Span } from "components/Atoms";

export default function CsvUploadButton({ tournament } : { tournament: string }) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const completeCSVSchema = (results) => {
    // const expectedHeaders = [
    //   "due_date",
    //   "game_code",
    //   "tournaments_id",
    //   "usa_player_email",
    //   "ussr_player_email"
    // ];
    // const headers = results.meta.fields;

    // const isHeaderValid = JSON.stringify(headers) === JSON.stringify(expectedHeaders);
    // if (!isHeaderValid) {
    //   setStatus("Invalid schema! Expected headers:", expectedHeaders, "but got:", headers);
    //   return;
    // }

    let valid = true;
    results.data.forEach((row, i) => {
      // due_date should look like YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.due_date)) {
        setStatus(`Row ${i + 2}: Invalid due_date ${row.due_date}`);
        valid = false;
      }
      // game_code should be 4 digits
      if (!/^[A-Za-z0-9]{4}$/.test(row.game_code)) {
        setStatus(`Row ${i + 2}: Invalid game_code ${row.game_code}`);
        valid = false;
      }
      // Emails should be valid format
      ["usa_player_email", "ussr_player_email"].forEach((field) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[field])) {
          setStatus(`Row ${i + 2}: Invalid email in ${field} ${row[field]}`);
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

    const response = await getAxiosInstance().post(
        "/api/schedule/upload-csv",
        {
            data: {
                file,
                tournament: 318
            }
        },
    )
    if (response.status === 200) {
      router.reload()
    } else if (response.status === 500) {
      setStatus("❌ Upload failed.");
    }
    // return valid error codes. Users should be all registered, tournament should exist
  };

  return (
    <Flex css={{ flexDirection: 'column'}}>
      <Title>Upload CSV Schedule</Title>
      <Span>1- Select a tournament from the dropdown</Span>
      <Span>2- Upload a .csv file with the correct format (due_date,game_code,tournaments_id,usa_player_email,ussr_player_email)</Span>
      <Flex css={{ margin: '8px 0 8px 0' }}>
        <FileInput
          type="file"
          accept=".csv"
          onChange={handleChange}
          css={{ pointerEvents: !tournament ? 'none' : 'unset' }}
        />
        <Button
          onClick={handleUpload}
          disabled={!file}
        >
          Upload CSV
        </Button>
        <p>{status}</p>
      </Flex>
    </Flex>
  );
}
