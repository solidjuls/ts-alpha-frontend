import React, { useMemo, useState } from 'react';




// This maps a current square ID to the next square ID in the bracket
type SquareMapping = Record<string, string>;

interface Props {
  initialPlayers: Player[];
}

export interface Player {
  fullName: string;
  userId: string;
  playoffSquare: string;
  playoffName: string;
}

const TOTAL_STARTING_SLOTS = 64;


const BracketUI: React.FC<{ initialPlayers: Player[] }> = ({ initialPlayers }) => {
  // 1. Hashmap logic for advancement
  const squareMapping = useMemo(() => {
    const map: Record<string, string> = {};
    let currentId = 1, nextRoundStartId = 65, slotsInRound = 64;
    while (slotsInRound > 1) {
      for (let i = 0; i < slotsInRound; i += 2) {
        map[`sq-${currentId + i}`] = `sq-${nextRoundStartId + i / 2}`;
        map[`sq-${currentId + i + 1}`] = `sq-${nextRoundStartId + i / 2}`;
      }
      currentId = nextRoundStartId;
      slotsInRound /= 2;
      nextRoundStartId += slotsInRound;
    }
    return map;
  }, []);

  const [bracket, setBracket] = useState<Record<string, Player | null>>(() => {
    const hashmap: Record<string, Player | null> = {};
    for (let i = 1; i <= 127; i++) hashmap[`sq-${i}`] = null;
    initialPlayers.forEach(p => { hashmap[p.playoffSquare] = p; });
    return hashmap;
  });

  const handleAdvance = (id: string) => {
    const player = bracket[id];
    const nextId = squareMapping[id];
    if (player && nextId) {
      setBracket(prev => ({ ...prev, [nextId]: { ...player, playoffSquare: nextId } }));
    }
  };

  // 2. Component for Square + Lines
  const Square = ({ id, isRightSideOfMatch }: { id: string, isRightSideOfMatch: boolean }) => {
    const player = bracket[id];
    const hasNext = !!squareMapping[id];

    return (
      <div style={{ ...containerStyle, position: 'relative' }}>
        <span style={labelStyle}>{id}</span>
        <div 
          onClick={() => handleAdvance(id)}
          style={{ 
            ...squareStyle, 
            backgroundColor: player ? '#ffffff' : '#f3f4f6',
            borderColor: player ? '#2563eb' : '#d1d5db',
            zIndex: 2
          }}
        >
          {player?.fullName || ''}
        </div>
        {/* Connection Line to the right */}
        {hasNext && (
          <div style={{
            position: 'absolute',
            right: '-10px',
            top: '50%',
            width: '10px',
            height: isRightSideOfMatch ? 'calc(50% + 10px)' : 'calc(50% + 10px)',
            borderRight: '1px solid #9ca3af',
            borderTop: !isRightSideOfMatch ? '1px solid #9ca3af' : 'none',
            borderBottom: isRightSideOfMatch ? '1px solid #9ca3af' : 'none',
            transform: isRightSideOfMatch ? 'translateY(-100%)' : 'none',
          }} />
        )}
      </div>
    );
  };

  const renderRound = (start: number, count: number, title: string) => (
    <div style={columnStyle}>
      <h6 style={headerStyle}>{title}</h6>
      <div style={roundFlexStyle}>
        {Array.from({ length: count }).map((_, i) => (
          <Square 
            key={`sq-${start + i}`} 
            id={`sq-${start + i}`} 
            isRightSideOfMatch={i % 2 !== 0} 
          />
        ))}
      </div>
    </div>
  );

  return (
    <div style={viewportStyle}>
      {renderRound(1, 64, "R1")}
      {renderRound(65, 32, "R2")}
      {renderRound(97, 16, "R3")}
      {renderRound(113, 8, "R4")}
      {renderRound(121, 4, "R5")}
      {renderRound(125, 2, "R6")}
      {renderRound(127, 1, "🏆")}
    </div>
  );
};

// --- Updated Styles for Connectors ---

const viewportStyle: React.CSSProperties = {
  display: 'flex',
  padding: '20px',
  height: '92vh',
  width: '100%',
  backgroundColor: '#fff',
  overflowX: 'auto',
  overflowY: 'hidden',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const columnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 120px',
  minWidth: '120px'
};

const roundFlexStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  flexGrow: 1,
  position: 'relative'
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '90%'
};

const labelStyle: React.CSSProperties = {
  fontSize: '7px',
  color: '#6b7280',
  marginBottom: '1px',
};

const squareStyle: React.CSSProperties = {
  width: '100%',
  height: '16px',
  border: '1px solid',
  borderRadius: '3px',
  fontSize: '8.5px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 4px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const headerStyle: React.CSSProperties = {
  fontSize: '10px',
  margin: '0 0 10px 0',
  textAlign: 'center',
  color: '#111827',
  fontWeight: 'bold'
};

export default BracketUI;