'use client'
import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
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
import { Spinner } from "@radix-ui/themes";
import { useSavePlayoffBracket, useUpdatePlayoffBracket, usePlayoffBracket, useAllPlayoffs, useSchedulePlayoffMatch, useSetPlayoffWinner } from '../../hooks/usePlayoffs';
import { PlayoffEntryDto, PlayoffTournament } from '../../services/playoffs.service';
import { useIsAuthenticated } from '../../hooks/useAuth';
import { userRoles } from '../../utils/constants';
import styled from 'styled-components';
import { connectionsMain, connectionsSilver, marginMap } from './constants';
import { CreatePlayoffsSchedule } from './CreatePlayoffsSchedule';
import { Flex } from 'components/Atoms';

 export interface Player {
   id?: number;
   userName: string | null;
   userId: number | null;
   playoffSquare?: string;
   playoffName?: string;
   seed: number;
   nextSquare: string | null;
   winnerUserId?: number | null;
 }

 interface TabButtonProps {
  $active?: boolean;
}

 export const TabButton = styled.button<TabButtonProps>`
  padding: 10px 18px;
  border: none;
  border-radius: 0;
  cursor: pointer;

  font-size: 14px;
  font-weight: 600;

  &:hover {
    background-color: var(--ussr);
    color: var(--alt-text);
  }

  background-color: ${({ $active }) =>
    $active ? "var(--usa)" : "var(--bg-card)"};

  color: ${({ $active }) =>
    $active ? "var(--alt-text)" : "var(--primary-text)"};

  border-right: 1px solid var(--border);

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
`;

export const TabContainer = styled.div`
  display: inline-flex;
  align-self: flex-start;
  white-space: nowrap; 

  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--bg-card);
`;

const FIXED_WIDTH = "1512px"
const FIXED_HEIGHT = "1395px"

 const containerId = 'root-container'

 const getDefaultBO = (tournamentId: number) => {
  if ([345, 347].includes(tournamentId)) {
    return "3"
  }
  if ([346, 348].includes(tournamentId)) {
    return "1"
  }
  return "1"
 }

const PoolPlayer: React.FC<{ player: Player; disabled?: boolean }> = ({ player, disabled }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pool-${player.userId}`,
    data: { player, fromSlot: 'pool' },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...(disabled ? {} : listeners)}
      {...attributes}
      style={{
        // ...poolPlayerStyle,
        opacity: isDragging ? 0.5 : 1,
        cursor: disabled ? 'default' : 'grab',
      }}
    >
      {player.userName}
    </div>
  );
};

// Player Pool Droppable Container
const PlayerPoolDroppable: React.FC<{ playerPool: Player[] }> = ({ playerPool }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'pool' });

  return (
    <div
      ref={setNodeRef}
      style={{
        // ...poolContainerStyle,
        borderColor: isOver ? '#22c55e' : '#e5e7eb',
        background: isOver ? '#dcfce7' : '#f9fafb',
      }}
    >
      <div >Player Pool ({playerPool.length})</div>
      <div >
        {playerPool.map((player) => (
          <PoolPlayer key={player.userId} player={player} />
        ))}
        {playerPool.length === 0 && (
          <span style={{ color: '#9ca3af', fontSize: '11px' }}>All players assigned</span>
        )}
      </div>
    </div>
  );
};
// poolHeaderStyle
// poolListStyle
// Draggable Player Component
const DraggablePlayer: React.FC<{
  player: Player;
  slotId: string;
  isAdmin: boolean;
  disabled?: boolean;
  onSetWinner: Function;
  isSettingWinner?: boolean;
}> = ({ player, slotId, disabled, isAdmin, onSetWinner, isSettingWinner }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `player-${player.userId}`,
    data: { player, fromSlot: slotId },
    disabled,
  });

  const isWinner = !!player.winnerUserId;

  return (
      <div
        ref={setNodeRef}
        onDoubleClick={(e) => isAdmin && onSetWinner(e)}
        {...(disabled ? {} : listeners)}
        {...attributes}
        style={{
          ...playerStyle,
          opacity: isDragging ? 0.5 : 1,
          cursor: disabled ? 'default' : 'grab',
          position: 'relative'
        }}
      >
        {player.seed && <span >{player.seed}</span>}
        {player.userName}
      </div>
  );
};

// Droppable Slot Component
const DroppableSlot: React.FC<{
  id: string;
  player: Player | undefined;
  onAdvance: (id: string) => void;
  isAdmin: boolean;
  isOdd: boolean;
  disabled?: boolean;
  onSetWinner?: (id: number) => void;
  isSettingWinner?: boolean;
}> = ({ id, player, onAdvance, isOdd, isAdmin, disabled, onSetWinner, isSettingWinner }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    disabled,
  });

    const handleSetWinner = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (player && player.id && onSetWinner) {
        onSetWinner(player.id);
      }
    };

  return (
    <div style={containerStyle}>
      {/* <span style={labelStyle}>{id}</span> */}
      <Square
        ref={setNodeRef}
        onDoubleClick={() => !disabled && player && onAdvance(id)}
        isOver={isOver}
        isOdd={isOdd}
        player={player}
      >
        {player ? (
          <DraggablePlayer player={player} isAdmin={isAdmin} slotId={id} disabled={disabled} onSetWinner={handleSetWinner} isSettingWinner={isSettingWinner} />
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '8px' }}>{disabled ? '' : ''}</span>
        )}
      </Square>
    </div>
  );
};

const parseBracketData = (entries: PlayoffEntryDto[]): Record<string, Player | undefined> => {
  const bracket: Record<string, Player | undefined> = {};

  for (const entry of entries) {
      bracket[entry.playoffSquare] = {
        id: entry.id,
        userId: entry.userId,
        userName: entry.userName,
        seed: entry.seed,
        nextSquare: entry.nextSquare,
        playoffSquare: entry.playoffSquare,
        winnerUserId: entry.winnerUserId,
      };
  }

  return bracket;
};

const BracketLink = ({ startId, endId, bracketData }) => {
  const [path, setPath] = React.useState("");
  const drawLines = () => {
    const startEl = document.getElementById(startId);
    const endEl = document.getElementById(endId);
    const parentEl = document.getElementById(containerId);

    if (startEl && endEl && parentEl) {
      const start = startEl.getBoundingClientRect();
      const end = endEl.getBoundingClientRect();
      const parent = parentEl.getBoundingClientRect();

      // Calculate relative coordinates
      const x1 = start.right - parent.left;
      const y1 = (start.top + start.height / 2) - parent.top;
      const x2 = end.left - parent.left;
      const y2 = (end.top + end.height / 2) - parent.top;

      // Create a squared-off "elbow" path
      const midX = x1 + (x2 - x1) / 2;
      setPath(`M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`);
    }
  }

  useLayoutEffect(() => {
    drawLines();
  }, [drawLines, bracketData]);

  return (
    <path d={path} stroke="#9ca3af" strokeWidth="2" fill="none" />
  );
};

const Bracket: React.FC = () => {
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
  const [copyMode, setCopyMode] = useState<boolean>(true);
  const [playerPool, setPlayerPool] = useState<Player[]>([]);
  const canvasRef = useRef(null);
  // Check if user is admin
  const { user } = useIsAuthenticated();
  const isAdmin = user?.role === userRoles.ADMIN || user?.role === userRoles.SUPERADMIN;
  const saveBracketMutation = useSavePlayoffBracket();
  const updateBracketMutation = useUpdatePlayoffBracket();
  const scheduleMatchMutation = useSchedulePlayoffMatch();
  const setWinnerMutation = useSetPlayoffWinner();
  const { data: playoffTournaments, isLoading: loadingTournaments } = useAllPlayoffs();
  const { data: bracketData, isLoading, isError, error } = usePlayoffBracket(selectedTournamentId ?? 0);

  // Auto-select first tournament when data loads
  useEffect(() => {
    if (playoffTournaments && playoffTournaments.length > 0 && selectedTournamentId === null) {
      setSelectedTournamentId(playoffTournaments[0].id);
    }
  }, [playoffTournaments, selectedTournamentId]);

  const initialBracket = useMemo(() => {
    return parseBracketData(bracketData || []);
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
      id: player?.id,
      tournamentId: selectedTournamentId,
      playoffSquare,
      nextSquare: player?.nextSquare ?? null,
      userId: player?.userId ?? null,
      userName: player?.userName ?? null,
      seed: player?.seed ?? null,
      winnerUserId: player?.winnerUserId ?? null,
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
          seed: row.seed ? Number(row.seed) : 99,
          playoffSquare: undefined,
          playoffName: undefined,
          nextSquare: null,
        }));
        // Add all players to the pool - brackets will be configured manually via drag & drop
        setPlayerPool(players);
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

  const handleUpdateBracket = () => {
    const payload = buildPayload(bracket);
    console.log('Updating bracket payload:', payload);
    updateBracketMutation.mutate(payload);
  };

  // Schedule a match between two players
  const handleScheduleMatch = (props: {playerUsa: Player
    playerUssr: Player
    bo: string
    dueDate?: Date | undefined}) => {
      const { playerUsa, playerUssr, bo, dueDate } = props
      if (!playerUsa || !playerUssr || !selectedTournamentId) return;

      scheduleMatchMutation.mutate({
        usaPlayerId: String(playerUsa.userId),
        ussrPlayerId: String(playerUssr.userId),
        usaSeed: playerUsa.seed,
        ussrSeed: playerUssr.seed,
        tournamentId: selectedTournamentId,
        randomSides: true,
        due_date: dueDate?.toISOString(),
        bo,
      });
  };

  // Set a player as the winner of a match
  const handleSetWinner = (id: number) => {
    setWinnerMutation.mutate({ id, tournamentId: selectedTournamentId });
  };

  // Bracket config is now merged into bracket state (each slot has nextSquare)

  // Helper to parse the right side date from subtitle (e.g., "May 1 - May 14" -> Date for May 14)
  const parseDueDate = (subtitle?: string): Date | undefined => {
    if (!subtitle) return undefined;
    const parts = subtitle.split(' - ');
    if (parts.length !== 2) return undefined;
    const rightDate = parts[1].trim(); // e.g., "May 14", "June 11", "Jul 9"
    const currentYear = new Date().getFullYear();
    const parsed = new Date(`${rightDate}, ${currentYear}`);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  };

  // 2. COLUMN CONFIGURATION FOR 6 ROUNDS (matching slot counts from generateBracketConfig)
  const columnsMain = useMemo(() => {
    return [
      {
        title: 'Round 1',
        key: 'Round-1',
        subtitle: 'May 1 - May 14',
        dueDate: parseDueDate('May 1 - May 14'),
        ids: Array.from({ length: 18 }, (_, i) => `r1-${i + 1}`),
      },
      {
        title: 'Round 2',
        key: 'Round-2',
        subtitle: 'May 15 - May 28',
        dueDate: parseDueDate('May 15 - May 28'),
        ids: Array.from({ length: 14 }, (_, i) => `r2-${i + 1}`),
      },
      {
        title: 'Octave-Finals',
        key: 'Octave-Finals',
        subtitle: 'May 29 - June 11',
        dueDate: parseDueDate('May 29 - June 11'),
        ids: Array.from({ length: 14 }, (_, i) => `r3-${i + 1}`),
        // gap: 40px;
      },
      {
        title: 'Quarter-Finals',
        key: 'Quarter-Finals',
        subtitle: 'June 12 - June 25',
        dueDate: parseDueDate('June 12 - June 25'),
        ids: Array.from({ length: 8 }, (_, i) => `r4-${i + 1}`),
      },
      {
        title: 'Semi-Finals',
        key: 'Semi-Finals',
        subtitle: 'June 26 - Jul 9',
        dueDate: parseDueDate('June 26 - Jul 9'),
        ids: Array.from({ length: 4 }, (_, i) => `r5-${i + 1}`),
      },
      {
        title: 'FINALS',
        key: 'main-finals',
        ids: ['r6-1'],
        dueDate: undefined,
      },
    ];
  }, []);
  const columnsSilver = useMemo(() => {
    return [
      {
        title: 'Round 1',
        key: 'Round-1',
        subtitle: 'May 1 - May 14',
        dueDate: parseDueDate('May 1 - May 14'),
        ids: Array.from({ length: 20 }, (_, i) => `r1-${i + 1}`),
      },
      {
        title: 'Round 2',
        key: 'Round-2',
        subtitle: 'May 15 - May 28',
        dueDate: parseDueDate('May 15 - May 28'),
        ids: Array.from({ length: 26 }, (_, i) => `r2-${i + 1}`),
      },
      {
        title: 'Round 3',
        key: 'Round-3',
        subtitle: 'May 29 - June 11',
        dueDate: parseDueDate('May 29 - June 11'),
        ids: Array.from({ length: 22 }, (_, i) => `r3-${i + 1}`),
        // gap: 40px;
      },
      {
        title: 'Round 4',
        key: 'Round-4',
        subtitle: 'June 12 - June 25',
        dueDate: parseDueDate('June 12 - June 25'),
        ids: Array.from({ length: 18 }, (_, i) => `r4-${i + 1}`),
      },
      {
        title: 'Round 5',
        key: 'Round-5',
        subtitle: 'June 26 - Jul 9',
        dueDate: parseDueDate('June 26 - Jul 9'),
        ids: Array.from({ length: 16 }, (_, i) => `r5-${i + 1}`),
      },
      {
        title: 'Round 6',
        key: 'Round-6',
        subtitle: 'Jul 10 - Jul 23',
        dueDate: parseDueDate('Jul 10 - Jul 23'),
        ids: Array.from({ length: 8 }, (_, i) => `r6-${i + 1}`),
      },
      {
        title: 'Round 7',
        key: 'Round-7',
        subtitle: 'Jul 24 - Aug 6',
        dueDate: parseDueDate('Jul 24 - Aug 6'),
        ids: Array.from({ length: 4 }, (_, i) => `r7-${i + 1}`),
      },
      {
        title: 'Round 8',
        key: 'Round-8',
        ids: ['r8-1','r8-2'],
        subtitle: 'Aug 7 - Aug 20',
        dueDate: parseDueDate('Aug 7 - Aug 20'),
      },
    ];
  }, []);

  // 3. HASHMAP STATE for bracket slots - loaded from API
  const [bracket, setBracket] = useState<Record<string, Player | undefined>>({});

  // Sync bracket state when API data is loaded
  useEffect(() => setBracket(initialBracket), [initialBracket]);
  
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

  // Helper to clear player data from a slot while preserving id and nextSquare
  const clearSlot = (slotId: string, prev: Record<string, Player | undefined>): Player => ({
    id: prev[slotId]?.id,
    nextSquare: prev[slotId]?.nextSquare ?? null,
    userName: null,
    userId: null,
    seed: 99,
  });

  // Helper to place player in a slot while preserving id and nextSquare
  const fillSlot = (slotId: string, player: Player, prev: Record<string, Player | undefined>): Player => ({
    ...player,
    id: prev[slotId]?.id,
    nextSquare: prev[slotId]?.nextSquare ?? null,
    playoffSquare: slotId,
    winnerUserId: null
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
      if (!copyMode) {
        setBracket((prev) => ({ ...prev, [fromSlot]: clearSlot(fromSlot, prev) }));
      }
    } else {
      // Dragging between bracket slots
      const existingSlot = bracket[toSlot];
      const hasExistingPlayer = !!existingSlot?.userId;

      if (copyMode) {
        // Copy mode: only fill target slot, keep source slot unchanged
        setBracket((prev) => ({
          ...prev,
          [toSlot]: fillSlot(toSlot, player, prev),
        }));
      } else {
        // Normal mode: swap players between slots
        setBracket((prev) => ({
          ...prev,
          [fromSlot]: hasExistingPlayer ? fillSlot(fromSlot, existingSlot, prev) : clearSlot(fromSlot, prev),
          [toSlot]: fillSlot(toSlot, player, prev),
        }));
      }
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

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This only runs on the client after the first render
    setIsHydrated(true);
  }, []);

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

  // Error state
  if (isError && selectedTournamentId) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px', color: '#ef4444' }}>
        <span>Error loading bracket: {error?.message || 'Unknown error'}</span>
      </div>
    );
  }

  const activeTabButton = (tournament: PlayoffTournament, index: number) => {
    if (selectedTournamentId) {
      return selectedTournamentId === tournament.id;
    }
    return index === 0
  }
  if (!selectedTournamentId) return null
  const columns = [345,347].includes(selectedTournamentId) ? columnsMain : columnsSilver
  const connections = [345,347].includes(selectedTournamentId) ? connectionsMain : connectionsSilver
  const idMatchContainer = [345,347].includes(selectedTournamentId) ? 'match' : 'match-silver'

  return (
    <>
      <div style={toolbarStyle}>
          {playoffTournaments?.length > 0 && (
            <TabContainer>
              {playoffTournaments.map((tournament, index: number) => (
                <TabButton
                  key={tournament.id}
                  $active={activeTabButton(tournament, index)}
                  onClick={() => setSelectedTournamentId(tournament.id)}
                >
                  {tournament.name}
                </TabButton>
              ))}
            </TabContainer>
          )}

          {/* Admin-only controls */}
          {isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '4px'}}>
              <button
                onClick={handleSaveBracket}
                disabled={saveBracketMutation?.isPending || !selectedTournamentId}
                style={saveButtonStyle}
              >
                {saveBracketMutation?.isPending ? 'Saving...' : 'Save Bracket'}
              </button>

              <button
                onClick={handleUpdateBracket}
                disabled={updateBracketMutation?.isPending || !selectedTournamentId}
                style={updateButtonStyle}
              >
                {updateBracketMutation?.isPending ? 'Updating...' : 'Update Bracket'}
              </button>

              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={copyMode}
                  onChange={(e) => setCopyMode(e.target.checked)}
                  style={checkboxStyle}
                />
                Copy Mode
              </label>

              <input
                type='file'
                accept=".csv"
                onChange={handleFileUpload}
                disabled={saveBracketMutation?.isPending}
                style={saveButtonStyle}
              />
            </div>
          )}
      </div>
      {(isLoading && selectedTournamentId) ?
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px' }}>
          <Spinner />
        </div> :
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header with Tournament Dropdown and Admin Controls */}

          <div id="root-container" style={mainContainerStyle}>
            {/* Player Pool - admin only */}
            {isAdmin && <PlayerPoolDroppable playerPool={playerPool} />}
            {/* Bracket */}
            <div ref={canvasRef} style={viewportStyle}> 
              {columns.map((col) => (
                <div key={col.title} style={columnStyle}>
                  <div style={headerStyle}>
                    <span>{col.title}</span>
                    <br/>
                    <span>{col.subtitle}</span>
                  </div>
                  <div style={roundFlexStyle}>
                    {groupIntoPairs(col.ids).map((pair, matchIndex) => {
                      const playerUsa = bracket[pair[0]];
                      const playerUssr = bracket[pair[1]];
                      const canSchedule = playerUsa?.userId && playerUssr?.userId;
                      const id=`${idMatchContainer}-${col.key}-${matchIndex}`
                      
                      return (
                        <MatchContainer key={id} id={id} extraMargin={marginMap[id]}>
                          {isAdmin && canSchedule && <CreatePlayoffsSchedule defaultBO={getDefaultBO(selectedTournamentId)} playerUsa={playerUsa} playerUssr={playerUssr} dueDate={col.dueDate} onClick={handleScheduleMatch} />}
                          <Flex style={{ flexDirection: 'column', width: '100%'}}>
                            {pair.map((id, i) => (
                              <DroppableSlot
                                key={id}
                                id={id}
                                isAdmin={isAdmin}
                                player={bracket[id]}
                                onSetWinner={handleSetWinner}
                                onAdvance={advance}
                                isOdd={i % 2 !== 0}
                                disabled={!isAdmin}
                                isSettingWinner={setWinnerMutation.isPending}
                              />
                            ))}
                          </Flex>
                        </MatchContainer>
                      );
                    })}
                  </div>
                </div>
              ))}
              {isHydrated && <svg 
                style={{ 
                  position: 'absolute', 
                  top: 0, left: 0, 
                  width: '2520px', height: '2520px', 
                  pointerEvents: 'none' 
                }}
              >
                {connections.map((item, id) =>  <BracketLink key={id} startId={item.from} endId={item.to} />)}
              </svg>}
            </div>
          </div>
        </div>
        {/* Drag Overlay */}
        <DragOverlay>
          {activePlayer ? (
            <div style={dragOverlayStyle}>{activePlayer.userName}</div>
          ) : null}
        </DragOverlay>
      </DndContext>}
    </>
  );
};

// --- STYLES ---
const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 20px',
  borderBottom: '1px solid #e5e7eb',
  backgroundColor: '#f9fafb',
  gap: '12px',
  overflow: 'scroll'
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

const updateButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#f59e0b',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
  color: '#374151',
  cursor: 'pointer',
};

const checkboxStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  cursor: 'pointer',
};

const mainContainerStyle: React.CSSProperties = {
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  backgroundColor: '#fff',
  height: FIXED_HEIGHT,
  minHeight: FIXED_HEIGHT,
  maxHeight: FIXED_HEIGHT,
  overflow: 'auto',
};

const viewportStyle: React.CSSProperties = {
  display: 'flex',
  width: FIXED_WIDTH,
  height: FIXED_HEIGHT,
  minWidth: FIXED_WIDTH,
  minHeight: FIXED_HEIGHT,
  padding: '20px',
  gap: '80px',
  alignItems: 'center',
  backgroundColor: '#fff',
};

const columnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  // minWidth: '120px',
  height: '100%',
};

const roundFlexStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: '200px',
  flexGrow: 1,
  gap: '8px',
};

interface MatchContainerProps {
  id: string;
  extraMargin?: string;
  children: React.ReactNode;
}

const MatchContainer: React.FC<MatchContainerProps> = ({ id, extraMargin, children }) => {
  return (
    <div
      id={id}
      className="match-container"
      style={extraMargin ? { marginTop: extraMargin } : undefined}
    >
      {children}
    </div>
  );
};

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
  children: React.ReactNode;
  onDoubleClick?: () => void;
}

const Square = React.forwardRef<HTMLDivElement, SquareProps>(
  ({ isOver, isOdd: _isOdd, player, children, onDoubleClick }, ref) => {
    const classNames = ['square'];
    if (player) classNames.push('square--has-player');
    if (isOver) classNames.push('square--is-over');
    if (player?.winnerUserId) classNames.push('square--victory')

    return (
      <div
        ref={ref}
        className={classNames.join(' ')}
        onDoubleClick={() => {
          onDoubleClick?.()
          // optimistic response
          classNames.push('square--victory')
        }}
      >
        {children}
      </div>
    );
  }
)
Square.displayName='Square'  

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
  fontSize: '12px',
  fontWeight: 500,
  gap: '4px',
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

export type { Player };
export default Bracket;
