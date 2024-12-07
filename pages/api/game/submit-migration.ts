import { submit } from "backend/controller/game.controller";
import { authenticateJWT } from "pages/api/auth/middleware";
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

const parsedObject = parseJsonFile(
  "../../../../../python/initial_data_seeding/games_json/games_241206.json",
);

export default async function handler(req, res) {
  try {
    const arrayOfGames = req.body.data;
    // console.log("arrayOfGames", arrayOfGames)
    for (let i = 0; i < parsedObject.length; i++) {
      // console.log("arrayOfGames[i].usa_player_id.toString()", arrayOfGames[i].usa_player_id.toString())
      const data = {
        video1: undefined,
        usaPlayerId: parsedObject[i].usa_player_id.toString(),
        ussrPlayerId: parsedObject[i].ussr_player_id.toString(),
        gameType: parsedObject[i].game_type === "Friendly Game" ? "FG" : parsedObject[i].game_type,
        gameWinner: parsedObject[i].game_winner.toString(),
        endTurn: parsedObject[i].end_turn !== null ? parsedObject[i].end_turn : "",
        endMode: parsedObject[i].end_mode || "",
        gameDate: parsedObject[i].game_date,
        gameCode: parsedObject[i].game_code,
      };
      await submit(data);
    }
    // console.log("newGameWithId", newGameWithId);
    // const newGameWithIdParsed = JSON.stringify(newGameWithId, (key, value) =>
    //     typeof value === "bigint" ? value.toString() : value,
    // );

    res.status(200).json("ok");
  } catch {
    res.status(500).json("Error submitting result");
  }
}
