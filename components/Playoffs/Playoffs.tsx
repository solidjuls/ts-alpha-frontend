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

import { useSavePlayoffBracket, useUpdatePlayoffBracket, usePlayoffBracket, useAllPlayoffs, useSchedulePlayoffMatch, useSetPlayoffWinner } from '../../hooks/usePlayoffs';
import { PlayoffEntryDto, PlayoffTournament } from '../../services/playoffs.service';
import { useIsAuthenticated } from '../../hooks/useAuth';
import { userRoles } from '../../utils/constants';
import styled from 'styled-components';

 interface Player {
   id?: number;
   userName: string | null;
   userId: number | null;
   playoffSquare?: string;
   playoffName?: string;
   seed: number | null;
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
  width: fit-content;
  max-width: 100%;
  overflow-x: auto; 
  white-space: nowrap; 

  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--bg-card);
`;

 const containerId = 'root-container'

 // Player Pool Draggable Item
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
  side: 'left' | 'right' | 'center';
  isOdd: boolean;
  disabled?: boolean;
  onSetWinner?: (id: number) => void;
  isSettingWinner?: boolean;
}> = ({ id, player, onAdvance, side, isOdd, isAdmin, disabled, onSetWinner, isSettingWinner }) => {
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
      {/* {side !== 'center' && <div style={getLineStyle(side, isOdd)} />} */}
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
          seed: row.seed ? Number(row.seed) : null,
          playoffSquare: undefined,
          playoffName: undefined,
          nextSquare: null,
        }));
        console.log("Players loaded to pool:", players);
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

  // Schedule a match between two players (randomly assigns USA/USSR)
  const handleScheduleMatch = (player1Id: number | null, player2Id: number | null) => {
    if (!player1Id || !player2Id || !selectedTournamentId) return;

    // Randomly assign USA/USSR
    const [usaId, ussrId] = Math.random() < 0.5
      ? [player1Id, player2Id]
      : [player2Id, player1Id];

    scheduleMatchMutation.mutate({
      usaPlayerId: String(usaId),
      ussrPlayerId: String(ussrId),
      tournamentId: selectedTournamentId,
    });
  };

  // Set a player as the winner of a match
  const handleSetWinner = (id: number) => {
    setWinnerMutation.mutate({ id });
  };

  // Bracket config is now merged into bracket state (each slot has nextSquare)

  // 2. COLUMN CONFIGURATION FOR 6 ROUNDS (matching slot counts from generateBracketConfig)
  const columnsMain = useMemo(() => {
    return [
      {
        title: 'Round-1',
        ids: Array.from({ length: 16 }, (_, i) => `r1-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'Round-2',
        ids: Array.from({ length: 16 }, (_, i) => `r2-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'Octave-Finals',
        ids: Array.from({ length: 12 }, (_, i) => `r3-${i + 1}`),
        side: 'left' as const,
        // gap: 40px;
      },
      {
        title: 'Quarter-Finals',
        ids: Array.from({ length: 8 }, (_, i) => `r4-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'Semi-Finals',
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
  const columnsSilver = useMemo(() => {
    return [
      {
        title: 'RoundS-1',
        ids: Array.from({ length: 20 }, (_, i) => `r1-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'RoundS-2',
        ids: Array.from({ length: 26 }, (_, i) => `r2-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'RoundS-3',
        ids: Array.from({ length: 22 }, (_, i) => `r3-${i + 1}`),
        side: 'left' as const,
        // gap: 40px;
      },
      {
        title: 'RoundS-4',
        ids: Array.from({ length: 18 }, (_, i) => `r4-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'RoundS-5',
        ids: Array.from({ length: 16 }, (_, i) => `r5-${i + 1}`),
        side: 'left' as const,
      },
      {
        title: 'RoundS-6',
        ids: Array.from({ length: 8 }, (_, i) => `r6-${i + 1}`),
        side: 'center' as const,
      },
      {
        title: 'RoundS-7',
        ids: Array.from({ length: 4 }, (_, i) => `r7-${i + 1}`),
        side: 'center' as const,
      },
      {
        title: 'RoundS-8',
        ids: ['r8-1','r8-2'],
        side: 'center' as const,
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
    seed: null,
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
const connectionsMain = [
  { from: "match-Round-1-0", to: "match-Round-2-0" },
  { from: "match-Round-1-1", to: "match-Round-2-1" },
  { from: "match-Round-1-2", to: "match-Round-2-2" },
  { from: "match-Round-1-3", to: "match-Round-2-3" },
  { from: "match-Round-1-4", to: "match-Round-2-4" },
  { from: "match-Round-1-5", to: "match-Round-2-5" },
  { from: "match-Round-1-6", to: "match-Round-2-6" },
  { from: "match-Round-1-7", to: "match-Round-2-7" },

  { from: "match-Round-2-0", to: "match-Octave-Finals-0" },
  { from: "match-Round-2-1", to: "match-Octave-Finals-1" },
  { from: "match-Round-2-2", to: "match-Octave-Finals-2" },
  { from: "match-Round-2-3", to: "match-Octave-Finals-3" },
  { from: "match-Round-2-4", to: "match-Octave-Finals-4" },
  { from: "match-Round-2-5", to: "match-Octave-Finals-4" },
  { from: "match-Round-2-6", to: "match-Octave-Finals-5" },
  { from: "match-Round-2-7", to: "match-Octave-Finals-5" },

  { from: "match-Octave-Finals-0", to: "match-Quarter-Finals-0" },
  { from: "match-Octave-Finals-1", to: "match-Quarter-Finals-1" },
  { from: "match-Octave-Finals-2", to: "match-Quarter-Finals-2" },
  { from: "match-Octave-Finals-3", to: "match-Quarter-Finals-2" },
  { from: "match-Octave-Finals-4", to: "match-Quarter-Finals-3" },
  { from: "match-Octave-Finals-5", to: "match-Quarter-Finals-3" },

  { from: "match-Quarter-Finals-0", to: "match-Semi-Finals-0" },
  { from: "match-Quarter-Finals-1", to: "match-Semi-Finals-0" },
  { from: "match-Quarter-Finals-2", to: "match-Semi-Finals-1" },
  { from: "match-Quarter-Finals-3", to: "match-Semi-Finals-1" },
];
const connectionsSilver = [
  { from: "match-RoundS-1-0", to: "match-RoundS-2-2" },
  { from: "match-RoundS-1-1", to: "match-RoundS-2-3" },
  { from: "match-RoundS-1-2", to: "match-RoundS-2-4" },
  { from: "match-RoundS-1-3", to: "match-RoundS-2-5" },
  { from: "match-RoundS-1-4", to: "match-RoundS-2-6" },
  { from: "match-RoundS-1-5", to: "match-RoundS-2-7" },
  { from: "match-RoundS-1-6", to: "match-RoundS-2-9" },
  { from: "match-RoundS-1-7", to: "match-RoundS-2-10" },
  { from: "match-RoundS-1-8", to: "match-RoundS-2-11" },
  { from: "match-RoundS-1-9", to: "match-RoundS-2-12" },


  { from: "match-RoundS-2-0", to: "match-RoundS-3-0" },
  { from: "match-RoundS-2-1", to: "match-RoundS-3-1" },
  { from: "match-RoundS-2-2", to: "match-RoundS-3-2" },
  { from: "match-RoundS-2-3", to: "match-RoundS-3-2" },
  { from: "match-RoundS-2-4", to: "match-RoundS-3-3" },
  { from: "match-RoundS-2-5", to: "match-RoundS-3-3" },
  { from: "match-RoundS-2-6", to: "match-RoundS-3-4" },
  { from: "match-RoundS-2-7", to: "match-RoundS-3-5" },
  { from: "match-RoundS-2-8", to: "match-RoundS-3-6" },
  { from: "match-RoundS-2-9", to: "match-RoundS-3-7" },
  { from: "match-RoundS-2-10", to: "match-RoundS-3-8" },
  { from: "match-RoundS-2-11", to: "match-RoundS-3-9" },
  { from: "match-RoundS-2-12", to: "match-RoundS-3-10" },
  { from: "match-RoundS-2-13", to: "match-RoundS-3-11" },

  { from: "match-RoundS-3-0", to: "match-RoundS-4-0" },
  { from: "match-RoundS-3-1", to: "match-RoundS-4-0" },
  { from: "match-RoundS-3-2", to: "match-RoundS-4-1" },
  { from: "match-RoundS-3-3", to: "match-RoundS-4-2" },
  { from: "match-RoundS-3-4", to: "match-RoundS-4-3" },
  { from: "match-RoundS-3-5", to: "match-RoundS-4-4" },
  { from: "match-RoundS-3-6", to: "match-RoundS-4-5" },
  { from: "match-RoundS-3-7", to: "match-RoundS-4-5" },
  { from: "match-RoundS-3-8", to: "match-RoundS-4-6" },
  { from: "match-RoundS-3-9", to: "match-RoundS-4-7" },
  { from: "match-RoundS-3-10", to: "match-RoundS-4-8" },

  { from: "match-RoundS-4-0", to: "match-RoundS-5-0" },
  { from: "match-RoundS-4-1", to: "match-RoundS-5-1" },
  { from: "match-RoundS-4-2", to: "match-RoundS-5-1" },
  { from: "match-RoundS-4-3", to: "match-RoundS-5-2" },
  { from: "match-RoundS-4-4", to: "match-RoundS-5-3" },
  { from: "match-RoundS-4-5", to: "match-RoundS-5-4" },
  { from: "match-RoundS-4-6", to: "match-RoundS-5-5" },
  { from: "match-RoundS-4-7", to: "match-RoundS-5-6" },
  { from: "match-RoundS-4-8", to: "match-RoundS-5-7" },

  { from: "match-RoundS-5-0", to: "match-RoundS-6-0" },
  { from: "match-RoundS-5-1", to: "match-RoundS-6-0" },
  { from: "match-RoundS-5-2", to: "match-RoundS-6-1" },
  { from: "match-RoundS-5-3", to: "match-RoundS-6-1" },
  { from: "match-RoundS-5-4", to: "match-RoundS-6-2" },
  { from: "match-RoundS-5-5", to: "match-RoundS-6-2" },
  { from: "match-RoundS-5-6", to: "match-RoundS-6-3" },
  { from: "match-RoundS-5-7", to: "match-RoundS-6-3" },

  { from: "match-RoundS-6-0", to: "match-RoundS-7-0" },
  { from: "match-RoundS-6-1", to: "match-RoundS-7-0" },
  { from: "match-RoundS-6-2", to: "match-RoundS-7-1" },
  { from: "match-RoundS-6-3", to: "match-RoundS-7-1" },

  { from: "match-RoundS-7-0", to: "match-RoundS-8-0" },
  { from: "match-RoundS-7-1", to: "match-RoundS-8-0" },
]

  const activeTabButton = (tournament: PlayoffTournament, index: number) => {
    if (selectedTournamentId) {
      return selectedTournamentId === tournament.id;
    }
    return index === 0
  }
  if (!selectedTournamentId) return null
  const columns = [326,327].includes(selectedTournamentId) ? columnsMain : columnsSilver
  const connections = [326,327].includes(selectedTournamentId) ? connectionsMain : connectionsSilver
  console.log("bracket", bracket)
  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header with Tournament Dropdown and Admin Controls */}
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

        <div id="root-container" style={mainContainerStyle}>
          {/* Player Pool - admin only */}
          {isAdmin && <PlayerPoolDroppable playerPool={playerPool} />}
          {/* Bracket */}
          <div ref={canvasRef} style={viewportStyle}> 
            {columns.map((col) => (
              <div key={col.title} style={columnStyle}>
                <div style={headerStyle}>{col.title}</div>
                <div style={roundFlexStyle}>
                  {groupIntoPairs(col.ids).map((pair, matchIndex) => {
                    const player1 = bracket[pair[0]];
                    const player2 = bracket[pair[1]];
                    const canSchedule = player1?.userId && player2?.userId;
                    const id=`match-${col.title}-${matchIndex}`
                    const marginMap = {
                      'match-RoundS-8-0': '380px',
                      'match-RoundS-7-1': '280px',
                      'match-RoundS-7-0': '200px',
                      'match-RoundS-6-3': '120px',
                      'match-RoundS-6-2': '120px',
                      'match-RoundS-6-1': '120px',
                      'match-RoundS-6-0': '120px',
                      'match-RoundS-5-4': '60px',
                      'match-RoundS-5-3': '40px',
                      'match-RoundS-5-2': '60px',
                      'match-RoundS-5-1': '60px',
                      'match-RoundS-5-0': '80px',
                      'match-RoundS-4-5': '80px',
                      'match-RoundS-4-3': '100px',
                      'match-RoundS-4-0': '100px',
                      'match-RoundS-1-0': '130px',
                      'match-RoundS-3-0': '80px',
                      'match-RoundS-3-4': '100px',
                      'match-Octave-Finals-4': '60px',
                      'match-Octave-Finals-5': '60px',
                      'match-Quarter-Finals-2': '60px',
                      'match-Quarter-Finals-3': '120px',
                      'match-Quarter-Finals-4': '120px',
                      'match-Semi-Finals-0': '60px',
                      'match-Semi-Finals-1': '120px'
                    };
                    return (
                      <MatchContainer key={`match-${matchIndex}`} id={id} extraMargin={marginMap[id]}>
                        {isAdmin && canSchedule && <button title="Schedule match" style={scheduleButtonStyle} disabled={scheduleMatchMutation.isPending} onClick={() => handleScheduleMatch(player1?.userId, player2?.userId )}>Create Schedule</button>}
                        {pair.map((id, i) => (
                          <DroppableSlot
                            key={id}
                            id={id}
                            isAdmin={isAdmin}
                            player={bracket[id]}
                            onSetWinner={handleSetWinner}
                            onAdvance={advance}
                            side={col.side}
                            isOdd={i % 2 !== 0}
                            disabled={!isAdmin}
                            isSettingWinner={setWinnerMutation.isPending}
                          />
                        ))}
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
                width: '100%', height: '100%', 
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
    </DndContext>
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

const scheduleButtonStyle: React.CSSProperties = {
  padding: 0,
  color: 'black',
  border: 'none',
  fontSize: '12px',
  marginBottom: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const winnerButtonStyle: React.CSSProperties = {
  position: 'absolute',
  right: '2px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '16px',
  height: '16px',
  padding: 0,
  backgroundColor: '#10b981',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
};

const mainContainerStyle: React.CSSProperties = {
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  backgroundColor: '#fff',
  // width: '1512px',
  height: '1395px',
  minWidth: '1512px',
  minHeight: '1395px',
  // maxWidth: '1512px',
  maxHeight: '1395px',
  overflow: 'auto',
};

const viewportStyle: React.CSSProperties = {
  display: 'flex',
  width: '1512px',
  height: '1395px',
  minWidth: '1512px',
  minHeight: '1395px',
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
  minWidth: '180px',
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
        onDoubleClick={onDoubleClick}
      >
        {children}
      </div>
    );
  }
)
Square.displayName='Square'  
// ffff
const labelStyle: React.CSSProperties = {
  fontSize: '12px',
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