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
    const updateStatements = []
    const nonUniqueGamesLinks = []
    const games = []
    // console.log("arrayOfGames", arrayOfGames)
    for (let i = 0; i < parsedObject.length; i++) {
      
      // console.log("arrayOfGames[i].usa_player_id.toString()", arrayOfGames[i].usa_player_id.toString())
      // const data = {
      //   video1: parsedObject[i].video1,
      //   usaPlayerId: parsedObject[i].usa_player_id.toString(),
      //   ussrPlayerId: parsedObject[i].ussr_player_id.toString(),
      //   gameDate: parsedObject[i].game_date,
      //   gameCode: parsedObject[i].game_code,
      // };
      // await submit(data);
      if (parsedObject[i].video1) {
        if (!games.find(item => item.usaPlayerId === parsedObject[i].usa_player_id.toString() && item.ussrPlayerId ===  parsedObject[i].ussr_player_id.toString() && item.gameCode === parsedObject[i].game_code)) {
          games.push({usaPlayerId: parsedObject[i].usa_player_id.toString(),  ussrPlayerId: parsedObject[i].ussr_player_id.toString(), gameCode: parsedObject[i].game_code, gameDate: parsedObject[i].game_date})
        } else {
          nonUniqueGamesLinks.push({usaPlayerId: parsedObject[i].usa_player_id.toString(),  ussrPlayerId: parsedObject[i].ussr_player_id.toString(), gameCode: parsedObject[i].game_code, gameDate: parsedObject[i].game_date})
        }
       
        // updateStatements.push(`UPDATE game_results SET video1 = '${parsedObject[i].video1}' WHERE game_code = '${parsedObject[i].game_code}' AND game_date='${parsedObject[i].game_date}' AND usa_player_id=${parsedObject[i].usa_player_id.toString()} AND ussr_player_id=${parsedObject[i].ussr_player_id.toString()};`)
      }

    }
    console.log(nonUniqueGamesLinks)
   //  const filePath = path.join(__dirname, 'video_links.sql');
    // const fileContent = updateStatements.join('\n');
    // console.log("filePath[i]", filePath)
    // fs.writeFile(filePath, fileContent, () => {})
    // console.log("filePathboom", filePath)

// Join all SQL statements with a newline character
    // console.log("newGameWithId", newGameWithId);
    // const newGameWithIdParsed = JSON.stringify(newGameWithId, (key, value) =>
    //     typeof value === "bigint" ? value.toString() : value,
    // );

    res.status(200).json("ok");
  } catch (e) {
    console.log("e", e)
    res.status(500).json("Error submitting result");
  }
}
