import { Button } from "components/Button";
import { useState } from "react";
import getAxiosInstance from "utils/axios";
import Papa from 'papaparse'

export default function CsvUploadButton({ tournament }:{ tournament: string }) {
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

console.log("Finished", file)
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
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleChange}
      />
      <Button
        onClick={handleUpload}
        disabled={!file}
      >
        Upload CSV
      </Button>
      <p>{status}</p>
    </div>
  );
}
