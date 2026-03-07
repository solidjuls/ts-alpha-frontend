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
  fullName: string;
  userId: string;
  playoffSquare: string;
  playoffName: string;
}

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

  // 1. CALCULATE TOURNAMENT DIMENSIONS
  const slotsPerSide = initialPlayers.length / 2;
  const roundsPerSide = Math.log2(slotsPerSide);

  // 2. GENERATE DYNAMIC COLUMN CONFIGURATION
  const columns = useMemo(() => {
    const leftCols = [];
    const rightCols = [];

    let currentLeftStart = 1;
    let currentRightStart = 33;

    for (let r = 0; r <= roundsPerSide; r++) {
      const count = slotsPerSide / Math.pow(2, r);
      if (count < 1) break;

      leftCols.push({
        title: `L-R${r + 1}`,
        ids: Array.from({ length: count }, (_, i) => `sq-${currentLeftStart + i}`),
        side: 'left' as const,
      });

      rightCols.unshift({
        title: `R-R${r + 1}`,
        ids: Array.from({ length: count }, (_, i) => `sq-${currentRightStart + i}`),
        side: 'right' as const,
      });

      currentLeftStart += count;
      currentRightStart += count;
    }

    return [...leftCols, { title: 'FINAL', ids: ['sq-127'], side: 'center' as const }, ...rightCols];
  }, [roundsPerSide, slotsPerSide]);

  // 3. HASHMAP STATE for bracket slots
  const [bracket, setBracket] = useState<Record<string, Player | null>>(() => {
    const map: Record<string, Player | null> = {};
    for (let i = 1; i <= 127; i++) map[`sq-${i}`] = null;
    return map;
  });

  // 4. PLAYER POOL STATE (unassigned players)
  const [playerPool, setPlayerPool] = useState<Player[]>(initialPlayers);

  // 5. ADVANCEMENT LOGIC
  const getNextSquare = (id: string): string | null => {
    const num = parseInt(id.replace('sq-', ''));
    if (num >= 127) return null;
    if (num <= 32) return `sq-${64 + Math.ceil(num / 2)}`;
    if (num >= 33 && num <= 64) return `sq-${80 + Math.ceil((num - 32) / 2)}`;
    return `sq-127`;
  };

  const advance = (id: string) => {
    const nextId = getNextSquare(id);
    const player = bracket[id];
    if (nextId && player) {
      setBracket((prev) => ({ ...prev, [nextId]: { ...player, playoffSquare: nextId } }));
    }
  };

  // 6. DRAG HANDLERS
  const handleDragStart = (event: DragStartEvent) => {
    const { player } = event.active.data.current as { player: Player };
    setActivePlayer(player);
  };

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
      const existingPlayer = bracket[toSlot];

      setBracket((prev) => ({
        ...prev,
        [toSlot]: { ...player, playoffSquare: toSlot },
      }));

      // Remove from pool
      setPlayerPool((prev) => prev.filter((p) => p.userId !== player.userId));

      // If there was a player in the target slot, move them back to pool
      if (existingPlayer) {
        setPlayerPool((prev) => [...prev, existingPlayer]);
      }
    } else if (toSlot === 'pool') {
      // Dragging from bracket back to pool
      setBracket((prev) => ({ ...prev, [fromSlot]: null }));
      setPlayerPool((prev) => [...prev, player]);
    } else {
      // Dragging between bracket slots (swap)
      const existingPlayer = bracket[toSlot];

      setBracket((prev) => ({
        ...prev,
        [fromSlot]: existingPlayer ? { ...existingPlayer, playoffSquare: fromSlot } : null,
        [toSlot]: { ...player, playoffSquare: toSlot },
      }));
    }
  };

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