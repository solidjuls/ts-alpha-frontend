const fs = require("fs");
const axios = require("axios");
const path = require("path");

async function main() {
    try {
      // const parsedObject = parseJsonFile(
      //   "../python/initial_data_seeding/games_json/games_20240925.json",
      // );
  
      await axios.post("http://localhost:3000/api/cities/migration", {
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
  
  main()
  