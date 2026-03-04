import React, { useState, useMemo } from 'react';

interface Player {
  fullName: string;
  userId: string;
  playoffSquare: string;
  playoffName: string;
}

const Bracket: React.FC<{ initialPlayers: Player[] }> = ({ initialPlayers }) => {
  // 1. CALCULATE TOURNAMENT DIMENSIONS
  // For 38 players, powerOfTwo is 64. totalRounds per side is log2(64) = 6.
  const slotsPerSide = initialPlayers.length/2; 
  const roundsPerSide = Math.log2(slotsPerSide); // 5 rounds per side before merging

  // 2. GENERATE DYNAMIC COLUMN CONFIGURATION
  const columns = useMemo(() => {
    const leftCols = [];
    const rightCols = [];

    let currentLeftStart = 1;
    let currentRightStart = 33;
    let currentCount = 32;

    // Build the wings iteratively
    for (let r = 0; r <= roundsPerSide; r++) {
      const count = slotsPerSide / Math.pow(2, r);
      if (count < 1) break;

      leftCols.push({
        title: `L-R${r + 1}`,
        ids: Array.from({ length: count }, (_, i) => `sq-${currentLeftStart + i}`),
        side: 'left' as const
      });

      rightCols.unshift({
        title: `R-R${r + 1}`,
        ids: Array.from({ length: count }, (_, i) => `sq-${currentRightStart + i}`),
        side: 'right' as const
      });

      currentLeftStart += count; // This logic assumes sequential IDs for rounds
      currentRightStart += count;
    }

    return [...leftCols, { title: "FINAL", ids: ['sq-127'], side: 'center' as const }, ...rightCols];
  }, []);

  // 3. HASHMAP STATE
  const [bracket, setBracket] = useState<Record<string, Player | null>>(() => {
    const map: Record<string, Player | null> = {};
    for (let i = 1; i <= 127; i++) map[`sq-${i}`] = null;
    
    // Balanced Initial Distribution
    initialPlayers.slice(0, 19).forEach((p, i) => map[`sq-${i + 1}`] = p);
    initialPlayers.slice(19, 38).forEach((p, i) => map[`sq-${i + 33}`] = p);
    return map;
  });

  // 4. ADVANCEMENT LOGIC (Dynamic Lookup)
  const getNextSquare = (id: string): string | null => {
    const num = parseInt(id.replace('sq-', ''));
    // Simple logic: every two squares in a round feed the next sequential square in the next round
    // This assumes your square ID generation follows the round sequence
    if (num >= 127) return null;
    if (num <= 32) return `sq-${64 + Math.ceil(num / 2)}`; // L-R1 -> L-R2
    if (num >= 33 && num <= 64) return `sq-${80 + Math.ceil((num - 32) / 2)}`; // R-R1 -> R-R2
    // ... further round logic or a pre-computed map
    return `sq-127`; 
  };

  const advance = (id: string) => {
    const nextId = getNextSquare(id);
    const player = bracket[id];
    if (nextId && player) {
      setBracket(prev => ({ ...prev, [nextId]: { ...player, playoffSquare: nextId } }));
    }
  };

  return (
    <div style={viewportStyle}>
      {columns.map((col) => (
        <div key={col.title} style={columnStyle}>
          <div style={headerStyle}>{col.title}</div>
          <div style={roundFlexStyle}>
            {col.ids.map((id, i) => {
              const player = bracket[id];
              return (
                <div key={id} style={containerStyle}>
                  <label style={labelStyle}>{id}</label>
                  <div 
                    onClick={() => advance(id)}
                    style={{ 
                      ...squareStyle, 
                      borderColor: player ? '#3b82f6' : '#e5e7eb',
                      background: player ? '#fff' : '#f9fafb',
                      cursor: player ? 'pointer' : 'default'
                    }}
                  >
                    {player?.fullName || ''}
                  </div>
                  {/* Absolute lines based on side */}
                  {col.side !== 'center' && (
                    <div style={getLineStyle(col.side, i % 2 !== 0)} />
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

// --- STYLES (Flat & No Recursion) ---
const viewportStyle: React.CSSProperties = {
  display: 'flex', height: '90vh', overflowX: 'auto', padding: '20px', gap: '40px', alignItems: 'center', backgroundColor: '#fff'
};
const columnStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', minWidth: '120px', height: '100%' };
const roundFlexStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flexGrow: 1 };
const containerStyle: React.CSSProperties = { position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const squareStyle: React.CSSProperties = { width: '100%', height: '18px', border: '1px solid', fontSize: '9px', display: 'flex', alignItems: 'center', padding: '0 4px', zIndex: 2 };
const labelStyle: React.CSSProperties = { fontSize: '7px', color: '#cbd5e1' };
const headerStyle: React.CSSProperties = { fontSize: '11px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' };

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

export default Bracket;