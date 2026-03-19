# Feature: Retrieve Playoff Bracket

## Context
When we load components/Playoffs/Playoffs.tsx, we should call the backend to get the bracket data for that tournament.

## Requirements
- Split the logic on two parts:
    - One is to create the bracket data that will be saved on the POST api call. It will be executed later, for now, add it on a function that will receive initialPLayers as parameter 
    - The other logic starts at:
      `const [bracket, setBracket] = useState<Record<string, Player | undefined>>(bracketWithSeeds);`
- Create a React Query query to get the bracketWithSeeds data
- It should be executed on load
- The endpoint is /api/playoffs/:tournamentId GET
- The query should be cached
- The query should be used in components/Playoffs/Playoffs.tsx

 