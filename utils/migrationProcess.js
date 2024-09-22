const fs = require("fs");
const axios = require("axios");
const path = require("path");

// Function to parse JSON file
function parseJsonFile(filePath) {
  try {
    // Read the JSON file synchronously
    const jsonData = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");

    // Parse the JSON data into an object
    const parsedData = JSON.parse(jsonData);

    return parsedData;
  } catch (error) {
    console.error(`Error parsing JSON file: ${error}`);
    return null;
  }
}

// Example usage of the tRPC client to call a procedure
async function main() {
  try {
    const parsedObject = parseJsonFile(
      "../python/initial_data_seeding/games_json/first_20k_game_results_20240811.json",
    );

    await axios.post("http://localhost:3000/api/game/submit-migration", {
      method: "POST",
      headers: {
        "x-trpc-source": "client",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error occurred while calling tRPC endpoint:", error);
  }
}

main();
