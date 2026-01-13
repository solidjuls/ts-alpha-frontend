import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Box, Flex } from "components/Atoms";
import Text from "components/Text";
import { Game } from "types/game.types";
import { Data, Layout, Config } from "plotly.js";
import { endType } from "utils/constants";
import { useWinTypeChartData } from "hooks/useGames";

// Dynamically import Plot with no SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Color palette
const colors = {
  // Side colors
  usa: "#4B6CB7", // Calm blue for USA
  ussr: "#B74B4B", // Muted red for USSR

  // Outcome colors
  wins: "#2E8B57", // Sea green for wins
  losses: "#8B7355", // Warm brown for losses
  ties: "#808080", // Gray for ties

  // Win/loss type colors - consistent regardless of source
  defcon: "#6A5ACD", // Slate blue for DEFCON
  scoring: "#4682B4", // Steel blue for Final Scoring
  vp: "#8B4513", // Saddle brown for VP Track
  wargames: "#2F4F4F", // Dark slate gray for Wargames
  forfeit: "#A0522D", // Sienna for Forfeit
  timer: "#8B7355", // Peru for Timer Expired
  cuban: "#2F4F4F", // Dark slate gray for Cuban Missile Crisis
  scoringCard: "#20B2AA", // Light sea green for Scoring Card Held
  unknown: "#A9A9A9", // Dark gray for Unknown
};

interface WinTypeChartProps {
  playerId: string;
  fromDate?: string;
}

// Define a fixed order for win/loss types
const winLossTypeOrder = [
  "DEFCON",
  "Final Scoring",
  "VP Track",
  "Wargames",
  "Forfeit",
  "Timer Expired",
  "Cuban Missile Crisis",
  "Scoring Card Held",
  "Unknown",
] as const;

interface WinTypeStats {
  USA: {
    wins: number;
    losses: number;
    ties: number;
    winTypes: Record<string, number>;
    lossTypes: Record<string, number>;
  };
  USSR: {
    wins: number;
    losses: number;
    ties: number;
    winTypes: Record<string, number>;
    lossTypes: Record<string, number>;
  };
}

const colorPalette = {
    root: "#FFFFFF",
    usa: "#1f77b4",  // Azul USA
    ussr: "#cc0000", // Rojo URSS
    win: "#22c55e",  // Verde Victoria
    loss: "#ef4444", // Rojo Derrota
    tie: "#94a3b8",  // Gris Empate
    // Colores para el 3er Nivel (Tipos de fin de juego)
    types: {
      defcon: "#8b5cf6",        // Violeta
      final_scoring: "#06b6d4", // Cian
      vp_track: "#eab308",      // Amarillo
      wargames: "#f97316",      // Naranja
      forfeit: "#ec4899",       // Rosa
      timer: "#78350f",         // Marrón
      scoring_card: "#84cc16",  // Lima
      unknown: "#64748b"        // Pizarra
    }
  };

const WinTypeChart: React.FC<WinTypeChartProps> = ({ playerId, fromDate }) => {
  // const [isLoading, setIsLoading] = useState(true);
  // const [winTypeStats, setWinTypeStats] = useState<WinTypeStats | null>(null);
  const [chartReady, setChartReady] = useState(true);
    const { data: winTypeStats, isLoading: winTypeLoading, error: winTypeError } = useWinTypeChartData(playerId, fromDate);
  // Datos brutos proporcionados
  // const rawData = {
  //   "usaStats": [
  //     { "total_games": "76", "wins": "38", "losses": "37", "ties": "1", "defcon_wins": "5", "final_scoring_wins": "10", "vp_track_wins": "15", "wargames_wins": "7", "forfeit_wins": "0", "timer_wins": "1", "cuban_wins": "0", "scoring_card_wins": "0", "unknown_wins": "0", "defcon_losses": "6", "final_scoring_losses": "13", "vp_track_losses": "7", "wargames_losses": "9", "forfeit_losses": "0", "timer_losses": "0", "cuban_losses": "0", "scoring_card_losses": "2", "unknown_losses": "0" }
  //   ],
  //   "ussrStats": [
  //     { "total_games": "78", "wins": "46", "losses": "31", "ties": "1", "defcon_wins": "0", "final_scoring_wins": "13", "vp_track_wins": "24", "wargames_wins": "7", "forfeit_wins": "1", "timer_wins": "0", "cuban_wins": "0", "scoring_card_wins": "1", "unknown_wins": "0", "defcon_losses": "3", "final_scoring_losses": "16", "vp_track_losses": "5", "wargames_losses": "6", "forfeit_losses": "0", "timer_losses": "0", "cuban_losses": "0", "scoring_card_losses": "1", "unknown_losses": "0" }
  //   ]
  // };

  // Mapeo de propiedades del JSON a etiquetas legibles
  const typeMapping = {
    wins: {
      defcon_wins: "DEFCON", final_scoring_wins: "Final Scoring", vp_track_wins: "VP Track",
      wargames_wins: "Wargames", forfeit_wins: "Forfeit", timer_wins: "Timer",
      cuban_wins: "Cuban Missile", scoring_card_wins: "Scoring Card", unknown_wins: "Unknown"
    },
    losses: {
      defcon_losses: "DEFCON", final_scoring_losses: "Final Scoring", vp_track_losses: "VP Track",
      wargames_losses: "Wargames", forfeit_losses: "Forfeit", timer_losses: "Timer",
      cuban_losses: "Cuban Missile", scoring_card_losses: "Scoring Card", unknown_losses: "Unknown"
    }
  };

  const transformDataForSunburst = (data) => {
    const ids = [];
    const labels = [];
    const parents = [];
    const values = [];
    const colors = [];

    const usa = data.usaStats[0];
    const ussr = data.ussrStats[0];

    // 1. Nodo Raíz (Total Global)
    const totalGlobal = parseInt(usa.total_games) + parseInt(ussr.total_games);
    ids.push("total");
    labels.push("All Games");
    parents.push("");
    values.push(totalGlobal);
    colors.push(colorPalette.root);

    // Helper para procesar cada bando (USA y USSR)
    const processSide = (sideData, sideName, sideId, sideColor) => {
      // 2. Nodo de Bando (USA o USSR)
      ids.push(sideId);
      labels.push(sideName);
      parents.push("total");
      values.push(parseInt(sideData.total_games));
      colors.push(sideColor);

      const outcomes = [
        { id: "wins", label: "Wins", value: parseInt(sideData.wins), col: colorPalette.win },
        { id: "losses", label: "Losses", value: parseInt(sideData.losses), col: colorPalette.loss },
        { id: "ties", label: "Ties", value: parseInt(sideData.ties), col: colorPalette.tie }
      ];

      outcomes.forEach(outcome => {
        if (outcome.value > 0) {
          const outcomeId = `${sideId}_${outcome.id}`;
          
          // 3. Nivel de Resultados (Wins / Losses / Ties)
          ids.push(outcomeId);
          labels.push(outcome.label);
          parents.push(sideId);
          values.push(outcome.value);
          colors.push(outcome.col);

          // 4. Nivel de Detalle (Tipos de victoria/derrota)
          // Solo desglosamos si es Wins o Losses
          if (outcome.id !== "ties") {
            // Buscamos todas las propiedades que terminen en _wins o _losses
            Object.keys(sideData).forEach(key => {
              if (key.endsWith(`_${outcome.id}`)) {
                const val = parseInt(sideData[key]);
                if (val > 0) {
                  // Creamos un nombre legible: "defcon_wins" -> "Defcon"
                  const typeKey = key.replace(`_${outcome.id}`, "");
                  const cleanLabel = key
                    .replace(`_${outcome.id}`, "")
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, l => l.toUpperCase());

                  ids.push(`${outcomeId}_${key}`);
                  labels.push(cleanLabel);
                  parents.push(outcomeId);
                  values.push(val);
                  colors.push(colorPalette.types[typeKey] || colorPalette.types.unknown);
                }
              }
            });
          }
        }
      });
    };

    processSide(usa, "USA", "usa", colorPalette.usa);
    processSide(ussr, "USSR", "ussr", colorPalette.ussr);

    return { ids, labels, parents, values, colors };
  };

  const plotData = useMemo(() => {
    if (winTypeStats) {
      return transformDataForSunburst(winTypeStats)
    }
}, [winTypeStats]);

  const layout = {
    margin: { l: 10, r: 10, b: 10, t: 50 },
    width: 700,
    height: 700,
    title: { text: "Global Twilight Struggle Outcomes (USA vs USSR)", font: { size: 20 } },
  };

  if (!plotData) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Plot
        data={[{
          type: "sunburst",
          ids: plotData.ids,
          labels: plotData.labels,
          parents: plotData.parents,
          values: plotData.values,
          branchvalues: "total",
          marker: {
            colors: plotData.colors,
            line: { width: 1.5, color: "white" }
          },
          leaf: { opacity: 0.8 },
          hovertemplate: '<b>%{label}</b><br>Games: %{value}<extra></extra>'
        }]}
        layout={layout}
        config={{ responsive: true }}
      />
    </div>
  );
};

export { WinTypeChart }
