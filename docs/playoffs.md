# Feature: Persist Playoff Bracket

## Context
Build a button on components/Playoffs/Playoffs.tsx that sends the bracket data to the backend.

## Goal
Build a button on components/Playoffs/Playoffs.tsx that sends the bracket data to the backend.


## Requirements
- Create a React Query mutation for the bracket data
- Create a button on components/Playoffs/Playoffs.tsx that sends the bracket data to the backend
- The endpoint is /api/playoffs POST


## Data Model
export interface PlayoffEntryDto {
  tournamentId: number;
  nextSquare: string;
  playoffSquare: string;
  userId: number;
  seed: number;
}[]
