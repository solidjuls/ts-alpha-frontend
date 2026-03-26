import React, { useState, useMemo, useEffect } from 'react';
import Papa from "papaparse";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { styled } from 'styled-components';
import { useSavePlayoffBracket, usePlayoffBracket, useAllPlayoffs } from '../../hooks/usePlayoffs';
import { PlayoffEntryDto } from '../../services/playoffs.service';

 interface Player {
   userName: string | null;
   userId: number | null;
   playoffSquare?: string;
   playoffName?: string;
   seed: number | null;
   nextSquare: string | null;
 }
 

  // Generate bracket structure dynamically based on player count
 // For 31 players:
 // - Seeds 17-31 (15 players): Round 1
 // - Seeds 9-16 (8 players): Round 2 (odd slots, even slots for R1 winners)
 // - Seeds 2-8 (7 players): Round 3 "Octave Finals" (odd slots, even for R2 winners)
 // - Seed 1 (1 player): Round 4 "Quarter Finals" (odd slot, even for R3 winner)
 // - Round 5: Semi Finals
 // - Round 6: Finals/Champion
 // Returns a hashmap where key is the square ID and value contains nextSquare
 const generateBracketConfig = (_playerCount: number = 31): Record<string, Player | undefined> => {
   const config: Record<string, Player | undefined> = {};
 
   // Slot counts for 31 players bracket
   // Each seeded player in rounds 2+ occupies an ODD slot, their opponent goes to the adjacent EVEN slot
   const R1_SLOTS = 16; // Seeds 17-31 (15 players + 1 bye)
   const R2_SLOTS = 16; // 8 odd (seeds 9-16) + 8 even (R1 winners)
   const R3_SLOTS = 12; // 4 odd (seeds 5-8) + 4 even (R2 winners)
   const R4_SLOTS = 8;  // 2 odd (seeds 2-4 distributed) + 2 even (R3 winners)
   const R5_SLOTS = 4;  // Semi finals
 
   // Round 1: 16 slots -> feed into Round 2 EVEN slots
   for (let i = 0; i < R1_SLOTS; i++) {
     const id = `r1-${i + 1}`;
     const nextPosition = Math.ceil((i + 1) / 2) * 2;
     config[id] = undefined// { nextSquare: null };
   }
 
   // Round 2: 16 slots -> feed into Round 3 EVEN slots
   for (let i = 0; i < R2_SLOTS; i++) {
     const id = `r2-${i + 1}`;
     const nextPosition = Math.ceil((i + 1) / 2) * 2;
     config[id] = undefined// { nextSquare: null };
   }
 
   // Round 3 (Octave Finals): 12 slots -> feed into Round 4 EVEN slots
   for (let i = 0; i < R3_SLOTS; i++) {
     const id = `r3-${i + 1}`;
     const nextPosition = Math.ceil((i + 1) / 2) * 2;
     config[id] = undefined// { nextSquare: null };
   }
 
   // Round 4 (Quarter Finals): 8 slots -> feed into Round 5 EVEN slots
   for (let i = 0; i < R4_SLOTS; i++) {
     const id = `r4-${i + 1}`;
     const nextPosition = Math.ceil((i + 1) / 2) * 2;
     config[id] = undefined// { nextSquare: null };
   }
 
   // Round 5 (Semi Finals): 4 slots -> feed into Round 6
   for (let i = 0; i < R5_SLOTS; i++) {
     const id = `r5-${i + 1}`;
     const nextPosition = Math.ceil((i + 1) / 2) * 2;
     config[id] = undefined// { nextSquare: null };
   }
 
   // Round 6 (Finals): 2 slots -> no next (champion)
   config['r6-1'] = undefined// { nextSquare: null };
   config['r6-2'] = undefined// { nextSquare: null };
 
   return config;
 };
 
 // Auto-seed players based on their ranking
 // Seeded players go to ODD slots, their opponents (from previous round) go to adjacent EVEN slots
 const generateInitialSeeding = (
   players: Player[],
   bracketConfig: Record<string, Player | undefined>
 ): Record<string, Player | undefined> => {
   const bracket: Record<string, Player | undefined> = {};
 
   // Initialize all slots with their nextSquare config (no player data yet)
   Object.entries(bracketConfig).forEach(([id, config]) => {
     bracket[id] = undefined;
   });
 
   // Sort players by seed
   const sortedPlayers = [...players].sort((a, b) => (a.seed || 999) - (b.seed || 999));
 
   sortedPlayers.forEach((player) => {
     const seed = player.seed || 999;
     let slotId: string | null = null;
 
     if (seed === 1) {
       slotId = 'r4-1';
     } else if (seed === 2) {
       slotId = 'r4-3';
     } else if (seed >= 3 && seed <= 4) {
       const oddSlot = (seed - 3) * 2 + 1;
       slotId = `r3-${oddSlot}`;
     } else if (seed >= 5 && seed <= 8) {
       if (seed <= 6) {
         const r3OddSlot = (seed - 5) * 2 + 5;
         slotId = `r3-${r3OddSlot}`;
       } else {
         const r2OddSlot = (seed - 7) * 2 + 13;
         slotId = `r2-${r2OddSlot}`;
       }
     } else if (seed >= 9 && seed <= 16) {
       const index = seed - 9;
       if (index < 6) {
         const oddSlot = index * 2 + 1;
         slotId = `r2-${oddSlot}`;
       } else {
         slotId = `r1-${seed - 16 + 16}`;
       }
     } else if (seed >= 17 && seed <= 31) {
       slotId = `r1-${seed - 16}`;
     }
 
     if (slotId) {
       // Merge player data with existing nextSquare config
       bracket[slotId] = {
         ...bracket[slotId],
         ...player,
         playoffSquare: slotId,
       };
     }
   });
 
   return bracket;
 };
 
 const generateNextSquares = (bracket: Record<string, Player | undefined>) => {
   const rounds: Record<string, Player[]> = {};
 
   try {
     Object.entries(bracket).forEach(([id, player]) => {
       const match = id.match(/^r\d+/);
 
       if (match) {
         const roundKey = match[0];
 
         if (!rounds[roundKey]) {
           rounds[roundKey] = [];
         }
         if (player) {
           rounds[roundKey].push(player);
         } else {
           rounds[roundKey].push({ playoffSquare: id, nextSquare: null } as Player);
         }
       }
     });
     const squaresAlreadyAssigned: string[] = [];
 
     Object.keys(rounds).forEach(currentKey => {
       const currentRoundNumber = parseInt(currentKey.replace('r', ''));
       const nextKey = `r${currentRoundNumber + 1}`;
       const currentPlayers = rounds[currentKey];
       const nextPlayers = rounds[nextKey];
 
       if (!nextPlayers) return;
 
       for (let i = 0; i < currentPlayers.length; i++) {
         if (currentPlayers[i] && currentPlayers[i + 1]) {
           const player = currentPlayers[i];
           const nextPlayer = currentPlayers[i + 1];
           if (bracket[player.playoffSquare!]?.nextSquare) continue;
 
           const nextEmptySquare = nextPlayers.find((p: Player) => !p.userId && !squaresAlreadyAssigned.includes(p.playoffSquare!));
           if (nextEmptySquare) {
             player.nextSquare = nextEmptySquare.playoffSquare!;
             nextPlayer.nextSquare = nextEmptySquare.playoffSquare!;
             bracket[player.playoffSquare!] = {
               ...player,
               nextSquare: nextEmptySquare.playoffSquare!,
             };
             bracket[nextPlayer.playoffSquare!] = {
               ...nextPlayer,
               nextSquare: nextEmptySquare.playoffSquare!,
             };
             squaresAlreadyAssigned.push(nextEmptySquare.playoffSquare!);
           }
         }
       }
     });
   } catch (e) {
     console.error("Error generating next squares:", e);
   }
 };

// Draggable Player Component
const DraggablePlayer: React.FC<{
  player: Player;
  slotId: string;
}> = ({ player, slotId }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `player-${player.userId}`,
    data: { player, fromSlot: slotId },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...playerStyle,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {player.seed && <span style={seedBadgeStyle}>#{player.seed}</span>}
      {player.userName}
    </div>
  );
};

// Droppable Slot Component
const DroppableSlot: React.FC<{
  id: string;
  player: Player | undefined;
  onAdvance: (id: string) => void;
  side: 'left' | 'right' | 'center';
  isOdd: boolean;
}> = ({ id, player, onAdvance, side, isOdd }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>{id}</label>
      <Square
        ref={setNodeRef}
        onDoubleClick={() => player && onAdvance(id)}
        isOver={isOver}
        isOdd={isOdd}
        player={player}
      >
        {player ? (
          <DraggablePlayer player={player} slotId={id} />
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '8px' }}>Drop here</span>
        )}
      </Square>
      {/* {side !== 'center' && <div style={getLineStyle(side, isOdd)} />} */}
    </div>
  );
};

const parseBracketData = (entries: PlayoffEntryDto[]): Record<string, Player | undefined> => {
  const bracket: Record<string, Player | undefined> = {};

  for (const entry of entries) {
      bracket[entry.playoffSquare] = {
        userId: entry.userId,
        userName: entry.userName,
        seed: entry.seed,
        nextSquare: entry.nextSquare,
        playoffSquare: entry.playoffSquare,
      };
  }

  return bracket;
};

const Bracket: React.FC = () => {
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);

  const saveBracketMutation = useSavePlayoffBracket();
  const { data: playoffTournaments, isLoading: loadingTournaments } = useAllPlayoffs();
  const { data: bracketData, isLoading, isError, error } = usePlayoffBracket(selectedTournamentId ?? 0);

  // Auto-select first tournament when data loads
  useEffect(() => {
    if (playoffTournaments && playoffTournaments.length > 0 && selectedTournamentId === null) {
      setSelectedTournamentId(playoffTournaments[0].id);
    }
  }, [playoffTournaments, selectedTournamentId]);

  // Parse API response to bracket state
  const initialBracket = useMemo(() => {
    if (!bracketData || bracketData.length === 0) {
      return {};
    }
    return parseBracketData(bracketData);
  }, [bracketData]);

  // Pointer sensor with activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Build payload for saving bracket - includes ALL slots (even empty ones)
  const buildPayload = (bracketState: Record<string, Player | undefined>): PlayoffEntryDto[] => {
    if (!selectedTournamentId) return [];
    return Object.entries(bracketState).map(([playoffSquare, player]) => ({
      tournamentId: selectedTournamentId,
      playoffSquare,
      nextSquare: player?.nextSquare ?? null,
      userId: player?.userId ?? null,
      userName: player?.userName ?? null,
      seed: player?.seed ?? null,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: { data: Array<{ userId?: string; userName?: string; seed?: string }> }) => {
        const players: Player[] = results.data.map((row) => ({
          userId: row.userId ? Number(row.userId) : null,
          userName: row.userName || null,
          seed: row.seed ? Number(row.seed) : null,
          playoffSquare: undefined,
          playoffName: undefined,
          nextSquare: null,
        }));
        console.log("Players:", players);
        // setBracket(generateBracketConfig(players.length));
        const b = generateInitialSeeding(players, generateBracketConfig())
        generateNextSquares(b)
        setBracket(b)
      },
      error: (err: { message: string }) => {
        console.error("CSV upload error:", err.message);
      },
    });
  };


  const handleSaveBracket = () => {
    const payload = buildPayload(bracket);
    console.log('Saving bracket payload:', payload);
    saveBracketMutation.mutate(payload);
  };

  // Bracket config is now merged into bracket state (each slot has nextSquare)

  // 2. COLUMN CONFIGURATION FOR 6 ROUNDS (matching slot counts from generateBracketConfig)
  const columns = useMemo(() => {
    return [
      {
        title: 'Round 1',
        ids: Array.from({ length: 16 }, (_, i) => `r1-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'Round 2',
        ids: Array.from({ length: 16 }, (_, i) => `r2-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'Octave Finals',
        ids: Array.from({ length: 12 }, (_, i) => `r3-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'Quarter Finals',
        ids: Array.from({ length: 8 }, (_, i) => `r4-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'Semi Finals',
        ids: Array.from({ length: 4 }, (_, i) => `r5-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'FINALS',
        ids: ['r6-1'],
        side: 'center' as const,
      },
    ];
  }, []);

  // 3. HASHMAP STATE for bracket slots - loaded from API
  const [bracket, setBracket] = useState<Record<string, Player | undefined>>({});

  // Sync bracket state when API data is loaded
  useEffect(() => {
    if (Object.keys(initialBracket).length > 0) {
      setBracket(initialBracket);
    }
  }, [initialBracket]);
console.log("bracket", initialBracket, playoffTournaments)
  // 5. ADVANCEMENT LOGIC - nextSquare is now part of each slot
  const advance = (id: string) => {
    const slot = bracket[id];
    if (slot?.nextSquare && slot.userId) {
      const nextId = slot.nextSquare;
      setBracket((prev) => ({
        ...prev,
        [nextId]: {
          nextSquare: prev[nextId]?.nextSquare ?? null,
          userName: slot.userName,
          userId: slot.userId,
          playoffName: slot.playoffName,
          seed: slot.seed,
          playoffSquare: nextId,
        },
      }));
    }
  };

  // 6. DRAG HANDLERS
  const handleDragStart = (event: DragStartEvent) => {
    const { player } = event.active.data.current as { player: Player };
    setActivePlayer(player);
  };

  // Helper to clear player data from a slot while preserving nextSquare
  const clearSlot = (slotId: string, prev: Record<string, Player | undefined>): Player => ({
    nextSquare: prev[slotId]?.nextSquare ?? null,
  });

  // Helper to place player in a slot while preserving nextSquare
  const fillSlot = (slotId: string, player: Player, prev: Record<string, Player | undefined>): Player => ({
    ...player,
    nextSquare: prev[slotId]?.nextSquare ?? null,
    playoffSquare: slotId,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePlayer(null);

    if (!over) return;

    const { player, fromSlot } = active.data.current as { player: Player; fromSlot: string };
    const toSlot = over.id as string;

    // Don't do anything if dropped on the same slot
    if (fromSlot === toSlot) return;

    // Handle different drag scenarios
    if (fromSlot === 'pool') {
      // Dragging from pool to bracket
      const existingSlot = bracket[toSlot];
      const hasExistingPlayer = !!existingSlot?.userId;

      setBracket((prev) => ({
        ...prev,
        [toSlot]: fillSlot(toSlot, player, prev),
      }));

      // If there was a player in the target slot, move them back to pool
      if (hasExistingPlayer) {
        // setPlayerPool((prev) => [...prev, existingSlot]);
      }
    } else if (toSlot === 'pool') {
      // Dragging from bracket back to pool - clear slot but keep nextSquare
      setBracket((prev) => ({ ...prev, [fromSlot]: clearSlot(fromSlot, prev) }));
    } else {
      // Dragging between bracket slots (swap)
      const existingSlot = bracket[toSlot];
      const hasExistingPlayer = !!existingSlot?.userId;

      setBracket((prev) => ({
        ...prev,
        [fromSlot]: hasExistingPlayer ? fillSlot(fromSlot, existingSlot, prev) : clearSlot(fromSlot, prev),
        [toSlot]: fillSlot(toSlot, player, prev),
      }));
    }
  };
  // Group slot IDs into pairs (matches)
  const groupIntoPairs = (ids: string[]): string[][] => {
    const pairs: string[][] = [];
    for (let i = 0; i < ids.length; i += 2) {
      pairs.push(ids.slice(i, i + 2));
    }
    return pairs;
  };

  // Loading tournaments state
  if (loadingTournaments) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px' }}>
        <span>Loading tournaments...</span>
      </div>
    );
  }

  // No tournaments available
  if (!playoffTournaments || playoffTournaments.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px', color: '#6b7280' }}>
        <span>No playoff tournaments available</span>
      </div>
    );
  }

  // Loading bracket state
  if (isLoading && selectedTournamentId) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px' }}>
        <span>Loading bracket...</span>
      </div>
    );
  }

  // Error state
  if (isError && selectedTournamentId) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px', color: '#ef4444' }}>
        <span>Error loading bracket: {error?.message || 'Unknown error'}</span>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header with Tournament Dropdown and Save Button */}
        <div style={toolbarStyle}>
          {/* Tournament Dropdown */}
          <select
            value={selectedTournamentId ?? ''}
            onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
            style={dropdownStyle}
          >
            {playoffTournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSaveBracket}
            disabled={saveBracketMutation?.isPending || !selectedTournamentId}
            style={saveButtonStyle}
          >
            {saveBracketMutation?.isPending ? 'Saving...' : 'Save Bracket'}
          </button>
          <input
            type='file'
            accept=".csv"
            onChange={handleFileUpload}
            disabled={saveBracketMutation?.isPending}
            style={saveButtonStyle}
            // value='Upload CSV players'
          />
          {/* {saveBracketMutation?.isSuccess && (
            <span style={{ color: '#22c55e', marginLeft: '8px' }}>✓ Saved</span>
          )}
          {saveBracketMutation?.isError && (
            <span style={{ color: '#ef4444', marginLeft: '8px' }}>
              Error: {saveBracketMutation?.error?.message || 'Failed to save'}
            </span>
          )} */}
        </div>

        <div style={mainContainerStyle}>
          {/* Bracket */}
          <div style={viewportStyle}>
            {columns.map((col) => (
              <div key={col.title} style={columnStyle}>
                <div style={headerStyle}>{col.title}</div>
                <div style={roundFlexStyle}>
                  {groupIntoPairs(col.ids).map((pair, matchIndex) => (
                    <MatchContainer key={`match-${matchIndex}`}>
                      {pair.map((id, i) => (
                        <DroppableSlot
                          key={id}
                          id={id}
                          player={bracket[id]}
                          onAdvance={advance}
                          side={col.side}
                          isOdd={i % 2 !== 0}
                        />
                      ))}
                    </MatchContainer>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activePlayer ? (
          <div style={dragOverlayStyle}>{activePlayer.userName}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// --- STYLES ---
const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 20px',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  gap: '12px',
};

const dropdownStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  minWidth: '200px',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};

const mainContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  backgroundColor: '#fff',
};

const viewportStyle: React.CSSProperties = {
  display: 'flex',
  height: '90vh',
  overflowX: 'auto',
  padding: '20px',
  gap: '40px',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  flex: 1,
};

const columnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: '120px',
  height: '100%',
};

const roundFlexStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  flexGrow: 1,
  gap: '8px',
};

const MatchContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: lightgray;

  &::before {
    content: '';
    position: absolute;
    top: 28px;
    bottom: 29px;
    right: 0px;
    width: 1px;
    background-color: red;
  }
`;

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

interface SquareProps {
  isOver: boolean;
  isOdd: boolean;
  player: Player | undefined;
}

const Square = styled.div<SquareProps>`
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  z-index: 2;
  font-size: 9px;
  border-radius: 4px;
  transition: all 0.15s ease;
  position: relative;

  /* Dynamic Props */
  border: 2px solid ${(props) =>
    props.isOver ? '#22c55e' : props.player ? '#3b82f6' : '#e5e7eb'};

  background: ${(props) =>
    props.isOver ? '#dcfce7' : props.player ? '#fff' : '#f9fafb'};

  box-shadow: ${(props) =>
    props.isOver ? '0 0 0 2px #22c55e' : 'none'};
  &::before {
    content: '';
    position: absolute;
    top: 32px;
    bottom: 29px;
    right: -47px;
    width: ${props => props.isOdd ? '0px': '41px'};
    height: ${props => props.isOdd ? '0px': '1px'};
    background-color: red;
  }
`


const labelStyle: React.CSSProperties = {
  fontSize: '7px',
  color: '#6b7280',
  marginBottom: '2px',
};

const headerStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '10px',
  color: '#374151',
};

const playerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '9px',
  fontWeight: 500,
  gap: '4px',
};

const seedBadgeStyle: React.CSSProperties = {
  backgroundColor: '#3b82f6',
  color: '#fff',
  padding: '1px 4px',
  borderRadius: '3px',
  fontSize: '7px',
  fontWeight: 600,
};

const dragOverlayStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#3b82f6',
  color: '#fff',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
};

const getLineStyle = (side: 'left' | 'right', isBottom: boolean): React.CSSProperties => ({
  position: 'absolute',
  width: '70px',
  height: '100%',
  [side === 'left' ? 'right' : 'left']: '-20px',
  top: isBottom ? '0' : '50%',
  borderRight: side === 'left' ? '1px solid #cbd5e1' : 'none',
  borderLeft: side === 'right' ? '1px solid #cbd5e1' : 'none',
  borderTop: !isBottom ? '1px solid #cbd5e1' : 'none',
  borderBottom: isBottom ? '1px solid #cbd5e1' : 'none',
});

export type { Player };
export default Bracket;