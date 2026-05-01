type Player = {
  id: number;
  name: string;
};

interface Square {
  id: string;
  round: number;
  player1?: Player;
  player2?: Player;
  nextMatchId: string | null;
}

class Tournament {
  // Hashmap to store all matches
  public bracket: Map<string, Square> = new Map();

  constructor() {
    this.initializeEmptyBracket();
    this.seedPlayers();
  }

  private initializeEmptyBracket() {
    // We create a cascading structure for 5 rounds + Finals
    // Round 1: 16 matches, Round 2: 8 matches ... Round 5: 1 match
    let matchCount = 16;
    for (let round = 1; round <= 5; round++) {
      for (let i = 1; i <= matchCount; i++) {
        const id = `R${round}-M${i}`;
        const nextMatchId = round < 5 ? `R${round + 1}-M${Math.ceil(i / 2)}` : null;
        
        this.bracket.set(id, {
          id,
          round,
          nextMatchId,
        });
      }
      matchCount /= 2;
    }
  }

  private seedPlayers() {
    // 1. First Stage: Players 17-31 (15 players)
    // Assigned to Round 1
    for (let i = 17; i <= 31; i++) {
      const match = this.bracket.get(`R1-M${Math.ceil((i - 16) / 2)}`)!;
      if (!match.player1) match.player1 = { id: i, name: `Player ${i}` };
      else match.player2 = { id: i, name: `Player ${i}` };
    }

    // 2. Previous Round (R2): Players 9-16
    for (let i = 9; i <= 16; i++) {
      const match = this.bracket.get(`R2-M${i - 8}`)!;
      match.player2 = { id: i, name: `Player ${i}` }; 
      // player1 will come from R1 winners
    }

    // 3. Octave Finals (R3): Players 2-8
    for (let i = 2; i <= 8; i++) {
      const match = this.bracket.get(`R3-M${i - 1}`)!;
      match.player2 = { id: i, name: `Player ${i}` };
    }

    // 4. Quarter Finals (R4): Player 1
    const qfMatch = this.bracket.get('R4-M1')!;
    qfMatch.player2 = { id: 1, name: 'Player 1' };
  }

  public advanceWinner(matchId: string, player: Player) {
    const currentMatch = this.bracket.get(matchId);
    if (!currentMatch?.nextMatchId) {

      return;
    }

    const nextMatch = this.bracket.get(currentMatch.nextMatchId)!;
    
    // Auto-assign to next available slot in the next square
    if (!nextMatch.player1) {
      nextMatch.player1 = player;
    } else {
      nextMatch.player2 = player;
    }
    

  }
}

// Usage
const myTournament = new Tournament();
