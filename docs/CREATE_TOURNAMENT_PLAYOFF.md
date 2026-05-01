# Feature: Create Tournament of type playoff

## Context
There is a Post endpoint /api/tournaments/:id/subtournament
The endpoint received a tournament id (parent tournament), and the response is:
    subtournament: {
        id: int;
        tournamentName: string;
        parentId: int;
        type: 'playoff';
        description: string;
        startingDate: date;
    };


## Requirements
The page tournament-create/index.tsx has a form to create a tournament, add a button to create a playoff tournament.
Add a dropdown with all open tournaments to select the parent tournament.
Add a button to upload a CSV file with the players of the playoff tournament.
Call first generateBracketConfig() to get the bracket config.
With the returned result of generateBracketConfig, call generateInitialSeeding with the players imported from the CSV and the bracketConfig
With the returned result of generateInitialSeeding, call generateNextSquares to get the nextSquare for each player.
The result of generateNextSquares is the payload to send to the backend.

Example of the result of the CSV file after importing:

const MOCK_PLAYERS: Player[] = [
  { "userId": 2439, "fullName": "Michal Borkowicz", "seed": 1, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 3064, "fullName": "Robin Bos", "seed": 2, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 1597, "fullName": "Andrea Ciappi", "seed": 3, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2971, "fullName": "Markel Elortza", "seed": 4, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2623, "fullName": "Roger Erill", "seed": 5, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2082, "fullName": "Jarek Grzaslewicz", "seed": 6, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 1921, "fullName": "Firat Guncu", "seed": 7, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2393, "fullName": "Mathias Heinze", "seed": 8, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 1974, "fullName": "Giorgos Iosifidis", "seed": 9, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2682, "fullName": "Serhei Isaenka", "seed": 10, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2537, "fullName": "Paweł Januszewski", "seed": 11, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 1853, "fullName": "Dimitris Katsoulas", "seed": 12, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2508, "fullName": "Onur Kulaksizoglu", "seed": 13, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2621, "fullName": "Rodrigo Laso", "seed": 14, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2784, "fullName": "Tomasz Łaniewski", "seed": 15, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2256, "fullName": "Katsiaryna Makouskaya", "seed": 16, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 1600, "fullName": "Andrea Mancuso", "seed": 17, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2606, "fullName": "Ricki McLaughlin", "seed": 18, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2878, "fullName": "Ziemowit Pazderski", "seed": 19, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2074, "fullName": "Jan Schmidt", "seed": 20, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 1635, "fullName": "Arek Sitkowski", "seed": 21, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2983, "fullName": "Pawel Sokol", "seed": 22, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 3100, "fullName": "Balazs Ulveczki", "seed": 23, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2012, "fullName": "Hicham Vanborm", "seed": 24, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 1634, "fullName": "Aran Warszawski", "seed": 25, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2962, "fullName": "Jakub Węcławski", "seed": 26, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 1658, "fullName": "Bartosz Wróbel", "seed": 27, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 2886, "fullName": "Weiran Xie", "seed": 28, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 3084, "fullName": "Zhuang Yan", "seed": 29, "playoffSquare": undefined, "nextSquare": null },
  { "userId": 1838, "fullName": "Delun Zhang", "seed": 30, "playoffSquare": undefined, "nextSquare": null }
]
