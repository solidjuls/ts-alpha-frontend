import React, { useState, useMemo } from 'react';
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

interface Player {
  fullName?: string;
  userId?: string;
  playoffSquare?: string;
  playoffName?: string;
  seed?: number; // Player seed/ranking (1-31)
  nextSquare: string | null; // Square where winner advances to
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
const generateBracketConfig = (_playerCount: number = 31): Record<string, Player> => {
  const config: Record<string, Player> = {};

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
    config[id] = { nextSquare: `r2-${nextPosition}` };
  }

  // Round 2: 16 slots -> feed into Round 3 EVEN slots
  for (let i = 0; i < R2_SLOTS; i++) {
    const id = `r2-${i + 1}`;
    const nextPosition = Math.ceil((i + 1) / 2) * 2;
    config[id] = { nextSquare: `r3-${nextPosition}` };
  }

  // Round 3 (Octave Finals): 12 slots -> feed into Round 4 EVEN slots
  for (let i = 0; i < R3_SLOTS; i++) {
    const id = `r3-${i + 1}`;
    const nextPosition = Math.ceil((i + 1) / 2) * 2;
    config[id] = { nextSquare: `r4-${nextPosition}` };
  }

  // Round 4 (Quarter Finals): 8 slots -> feed into Round 5 EVEN slots
  for (let i = 0; i < R4_SLOTS; i++) {
    const id = `r4-${i + 1}`;
    const nextPosition = Math.ceil((i + 1) / 2) * 2;
    config[id] = { nextSquare: `r5-${nextPosition}` };
  }

  // Round 5 (Semi Finals): 4 slots -> feed into Round 6
  for (let i = 0; i < R5_SLOTS; i++) {
    const id = `r5-${i + 1}`;
    const nextPosition = Math.ceil((i + 1) / 2) * 2;
    config[id] = { nextSquare: `r6-${nextPosition}` };
  }

  // Round 6 (Finals): 2 slots -> no next (champion)
  config['r6-1'] = { nextSquare: null };
  config['r6-2'] = { nextSquare: null };

  return config;
};

// Auto-seed players based on their ranking
// Seeded players go to ODD slots, their opponents (from previous round) go to adjacent EVEN slots
const generateInitialSeeding = (
  players: Player[],
  bracketConfig: Record<string, Player>
): Record<string, Player> => {
  const bracket: Record<string, Player> = {};

  // Initialize all slots with their nextSquare config (no player data yet)
  Object.entries(bracketConfig).forEach(([id, config]) => {
    bracket[id] = { nextSquare: config.nextSquare };
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

    if (slotId && bracket[slotId]) {
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
      {player.fullName}
    </div>
  );
};

// Droppable Slot Component
const DroppableSlot: React.FC<{
  id: string;
  player: Player | null;
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
      <div
        ref={setNodeRef}
        onDoubleClick={() => player && onAdvance(id)}
        style={{
          ...squareStyle,
          borderColor: isOver ? '#22c55e' : player ? '#3b82f6' : '#e5e7eb',
          background: isOver ? '#dcfce7' : player ? '#fff' : '#f9fafb',
          boxShadow: isOver ? '0 0 0 2px #22c55e' : 'none',
        }}
      >
        {player ? (
          <DraggablePlayer player={player} slotId={id} />
        ) : (
          <span style={{ color: '#9ca3af', fontSize: '8px' }}>Drop here</span>
        )}
      </div>
      {side !== 'center' && <div style={getLineStyle(side, isOdd)} />}
    </div>
  );
};

// Player Pool Draggable Item
const PoolPlayer: React.FC<{ player: Player }> = ({ player }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pool-${player.userId}`,
    data: { player, fromSlot: 'pool' },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...poolPlayerStyle,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {player.fullName}
    </div>
  );
};

const Bracket: React.FC<{ initialPlayers: Player[] }> = ({ initialPlayers }) => {
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  // Pointer sensor with activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

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

  // 3. HASHMAP STATE for bracket slots - auto-seeded
  // Each slot contains Player data (including nextSquare)
  const [bracket, setBracket] = useState<Record<string, Player>>(() => {
    const config = generateBracketConfig();
    return generateInitialSeeding(initialPlayers, config);
  });

  // 4. PLAYER POOL STATE (players not yet seeded)
  const [playerPool, setPlayerPool] = useState<Player[]>(() => {
    // Only include players without a seed assignment
    const seededIds = new Set(
      initialPlayers
        .filter((p) => p.seed && p.seed >= 1 && p.seed <= 31)
        .map((p) => p.userId)
    );
    return initialPlayers.filter((p) => !seededIds.has(p.userId));
  });

  // 5. ADVANCEMENT LOGIC - nextSquare is now part of each slot
  const advance = (id: string) => {
    const slot = bracket[id];
    if (slot?.nextSquare && slot.userId) {
      const nextId = slot.nextSquare;
      setBracket((prev) => ({
        ...prev,
        [nextId]: {
          ...prev[nextId], // Keep nextSquare of target slot
          fullName: slot.fullName,
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
  const clearSlot = (slotId: string, prev: Record<string, Player>): Player => ({
    nextSquare: prev[slotId].nextSquare,
  });

  // Helper to place player in a slot while preserving nextSquare
  const fillSlot = (slotId: string, player: Player, prev: Record<string, Player>): Player => ({
    ...player,
    nextSquare: prev[slotId].nextSquare,
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

      // Remove from pool
      setPlayerPool((prev) => prev.filter((p) => p.userId !== player.userId));

      // If there was a player in the target slot, move them back to pool
      if (hasExistingPlayer) {
        setPlayerPool((prev) => [...prev, existingSlot]);
      }
    } else if (toSlot === 'pool') {
      // Dragging from bracket back to pool - clear slot but keep nextSquare
      setBracket((prev) => ({ ...prev, [fromSlot]: clearSlot(fromSlot, prev) }));
      setPlayerPool((prev) => [...prev, player]);
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
console.log("bracket", bracket);
  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={mainContainerStyle}>
        {/* Player Pool */}
        <PlayerPoolDroppable playerPool={playerPool} />

        {/* Bracket */}
        <div style={viewportStyle}>
          {columns.map((col) => (
            <div key={col.title} style={columnStyle}>
              <div style={headerStyle}>{col.title}</div>
              <div style={roundFlexStyle}>
                {col.ids.map((id, i) => (
                  <DroppableSlot
                    key={id}
                    id={id}
                    player={bracket[id]}
                    onAdvance={advance}
                    side={col.side}
                    isOdd={i % 2 !== 0}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activePlayer ? (
          <div style={dragOverlayStyle}>{activePlayer.fullName}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// Player Pool Droppable Container
const PlayerPoolDroppable: React.FC<{ playerPool: Player[] }> = ({ playerPool }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'pool' });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...poolContainerStyle,
        borderColor: isOver ? '#22c55e' : '#e5e7eb',
        background: isOver ? '#dcfce7' : '#f9fafb',
      }}
    >
      <div style={poolHeaderStyle}>Player Pool ({playerPool.length})</div>
      <div style={poolListStyle}>
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

// --- STYLES ---
const mainContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
  backgroundColor: '#fff',
};

const viewportStyle: React.CSSProperties = {
  display: 'flex',
  height: '90vh',
  overflowX: 'auto',
  padding: '20px',
  gap: '40px',
  alignItems: 'center',
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
};

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const squareStyle: React.CSSProperties = {
  width: '100%',
  height: '24px',
  border: '2px solid',
  fontSize: '9px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
  zIndex: 2,
  borderRadius: '4px',
  transition: 'all 0.15s ease',
};

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

const poolContainerStyle: React.CSSProperties = {
  width: '180px',
  minWidth: '180px',
  height: '90vh',
  border: '2px dashed',
  borderRadius: '8px',
  padding: '12px',
  margin: '20px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.15s ease',
};

const poolHeaderStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 'bold',
  marginBottom: '12px',
  color: '#374151',
  textAlign: 'center',
};

const poolListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  overflowY: 'auto',
  flex: 1,
};

const poolPlayerStyle: React.CSSProperties = {
  padding: '6px 10px',
  backgroundColor: '#fff',
  border: '1px solid #3b82f6',
  borderRadius: '4px',
  fontSize: '10px',
  cursor: 'grab',
  textAlign: 'center',
  fontWeight: 500,
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
  width: '20px',
  height: '50%',
  [side === 'left' ? 'right' : 'left']: '-20px',
  top: isBottom ? '0' : '50%',
  borderRight: side === 'left' ? '1px solid #cbd5e1' : 'none',
  borderLeft: side === 'right' ? '1px solid #cbd5e1' : 'none',
  borderTop: !isBottom ? '1px solid #cbd5e1' : 'none',
  borderBottom: isBottom ? '1px solid #cbd5e1' : 'none',
});

export type { Player };
export default Bracket;