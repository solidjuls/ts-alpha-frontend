const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Function to parse JSON file
function parseJsonFile(filePath) {
    try {
      // Read the JSON file synchronously
      const jsonData = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
  
      // Parse the JSON data into an object
      const parsedData= JSON.parse(jsonData);
  
      return parsedData;
    } catch (error) {
      console.error(`Error parsing JSON file: ${error}`);
      return null;
    }
  }

// Example usage of the tRPC client to call a procedure
async function main() {
  try {
    const parsedObject = parseJsonFile('../python/initial_data_seeding/games_json/first_20k_game_results_20240811.json');

    // parsedObject.slice(1).forEach((element) => {
      for(let i = 0; i<parsedObject.length; i++) {

    const ddd = await   axios.post('http://localhost:3000/api/game/submit', {
        method: "POST",
        headers: {
          'x-trpc-source': 'client',
          'Content-Type': 'application/json',
        },
        data: {
          video1: undefined, 
          usaPlayerId: parsedObject[i].usa_player_id.toString(), 
          ussrPlayerId: parsedObject[i].ussr_player_id.toString(),
          gameType: parsedObject[i].game_type,
          gameWinner: parsedObject[i].game_winner.toString(), 
          endTurn: parsedObject[i].end_turn !== null ? parsedObject[i].end_turn : "",
          endMode: parsedObject[i].end_mode || "",
          gameDate: parsedObject[i].game_date,
          gameCode: parsedObject[i].game_code
      }
  })
  console.log("done ",ddd.id)
      }
    // fetch('', {
    //   method: "POST",
    //   headers: {
    //     'x-trpc-source': 'client',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({})
    // }).then(resp => resp.json()).then(resp => console.log('GameSubmit result:', resp));
//         console.log('GameSubmit result:', gameSubmit);
   //  });
  } catch (error) {
    console.error('Error occurred while calling tRPC endpoint:', error);
  }
}

main();
