import { Button } from "components/Button";
import { useState } from "react";
import getAxiosInstance from "utils/axios";
import Papa from 'papaparse'
import { FileInput, Title } from "./styles";
import { Flex, Span } from "components/Atoms";

export default function CsvUploadButton({ tournament } : { tournament: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
        const csvParse = e.target.files[0]

        Papa.parse(csvParse, {
            header: true,
            complete: function(results) {
                setFile(results.data)
            }
        })
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("Uploading...");

    await getAxiosInstance().post(
        "/api/schedule/upload-csv",
        {
            data: {
                file,
                tournament
            }
        },
    )

    // if (res.ok) {
    //   setStatus("✅ Upload and parse successful!");
    // } else {
    //   setStatus("❌ Upload failed.");
    // }
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
