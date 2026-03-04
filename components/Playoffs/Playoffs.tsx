import React, { useState } from 'react';

interface Player {
  fullName: string;
  userId: string;
  playoffSquare: string;
  playoffName: string;
}

const Bracket: React.FC<{ initialPlayers: Player[] }> = ({ initialPlayers }) => {
  // --- 1. THE ADVANCEMENT MAP (Flat Logic) ---
  const ADVANCE_TO: Record<string, string> = {
    // Left Wing (1-32 feed into 65-80, etc.)
    ...Object.fromEntries(Array.from({ length: 32 }, (_, i) => [`sq-${i + 1}`, `sq-${65 + Math.floor(i / 2)}`])),
    // Right Wing (33-64 feed into 81-96, etc.)
    ...Object.fromEntries(Array.from({ length: 32 }, (_, i) => [`sq-${i + 33}`, `sq-${81 + Math.floor(i / 2)}`])),
    // Semi-Finals to Finals (Example)
    'sq-125': 'sq-127', 'sq-126': 'sq-127'
  };

  // --- 2. HASHMAP STATE ---
  const [bracket, setBracket] = useState<Record<string, Player | null>>(() => {
    const map: Record<string, Player | null> = {};
    for (let i = 1; i <= 127; i++) map[`sq-${i}`] = null;
    
    // Balanced Distribution (19 left, 19 right)
    initialPlayers.slice(0, 19).forEach((p, i) => map[`sq-${i + 1}`] = p);
    initialPlayers.slice(19, 38).forEach((p, i) => map[`sq-${i + 33}`] = p);
    return map;
  });

  const advance = (id: string) => {
    const nextId = ADVANCE_TO[id];
    const player = bracket[id];
    if (nextId && player) {
      setBracket(prev => ({ ...prev, [nextId]: { ...player, playoffSquare: nextId } }));
    }
  };

  // --- 3. FLAT LAYOUT CONFIG ---
  // We define the order of columns from left to right
  const columns = [
    { title: "R1-L", ids: range(1, 32), side: 'left' },
    { title: "R2-L", ids: range(65, 80), side: 'left' },
    { title: "FINAL", ids: ['sq-127'], side: 'center' },
    { title: "R2-R", ids: range(81, 96), side: 'right' },
    { title: "R1-R", ids: range(33, 64), side: 'right' },
  ];

  return (
    <div style={viewportStyle}>
      {columns.map((col) => (
        <div key={col.title} style={columnStyle}>
          <div style={headerStyle}>{col.title}</div>
          <div style={roundFlexStyle}>
            {col.ids.map((id, i) => {
              const player = bracket[id];
              const isBottom = i % 2 !== 0;
              return (
                <div key={id} style={containerStyle}>
                  <label style={labelStyle}>{id}</label>
                  <div 
                    onClick={() => advance(id)}
                    style={{ 
                      ...squareStyle, 
                      borderColor: player ? '#3b82f6' : '#e5e7eb',
                      background: player ? '#fff' : '#f9fafb'
                    }}
                  >
                    {player?.fullName || ''}
                  </div>
                  {/* Flat Logic for Lines: No recursion, just absolute positioning */}
                  {ADVANCE_TO[id] && (
                    <div style={getLineStyle(col.side as 'left'|'right', isBottom)} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- HELPERS & STYLES ---

const range = (s: number, e: number) => Array.from({ length: e - s + 1 }, (_, i) => `sq-${s + i}`);

const getLineStyle = (side: 'left' | 'right', isBottom: boolean): React.CSSProperties => ({
  position: 'absolute',
  width: '15px',
  height: '50%',
  [side === 'left' ? 'right' : 'left']: '-15px',
  top: isBottom ? '0' : '50%',
  borderRight: side === 'left' ? '1px solid #cbd5e1' : 'none',
  borderLeft: side === 'right' ? '1px solid #cbd5e1' : 'none',
  borderTop: !isBottom ? '1px solid #cbd5e1' : 'none',
  borderBottom: isBottom ? '1px solid #cbd5e1' : 'none',
  pointerEvents: 'none'
});

const viewportStyle: React.CSSProperties = {
  display: 'flex', height: '95vh', overflowX: 'auto', overflowY: 'hidden', padding: '10px', gap: '30px'
};
const columnStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', minWidth: '110px' };
const roundFlexStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flexGrow: 1 };
const containerStyle: React.CSSProperties = { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' };
const squareStyle: React.CSSProperties = { width: '100%', height: '18px', border: '1px solid', fontSize: '9px', display: 'flex', alignItems: 'center', padding: '0 4px', cursor: 'pointer', overflow: 'hidden' };
const labelStyle: React.CSSProperties = { fontSize: '7px', color: '#aaa' };
const headerStyle: React.CSSProperties = { fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' };

export default Bracket;