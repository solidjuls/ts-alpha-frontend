import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useWinTypeChartData } from "hooks/useGames";
import { DateSelector } from "./DateSelector";
import { WinTypeStats, WinTypeStatsItem } from "services/games.service";

// Dynamically import Plot with no SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface WinTypeChartProps {
  playerId: string;
  fromDate?: string;
}

const colorPalette = {
  root: "#FFFFFF",
  usa: "#1f77b4",
  ussr: "#cc0000",
  win: "#22c55e",
  loss: "#ef4444",
  tie: "#94a3b8",
  types: {
    defcon: "#8b5cf6",
    final_scoring: "#06b6d4",
    vp_track: "#eab308",
    wargames: "#f97316",
    forfeit: "#ec4899",
    timer: "#78350f",
    scoring_card: "#84cc16",
    unknown: "#64748b",
  },
};

interface ChartProps {
  plotData: any;
  winTypeLoading: boolean;
  winTypeError: Error | null;
}

const Chart: React.FC<ChartProps> = ({ plotData, winTypeLoading, winTypeError }) => {
  const layout = {
    margin: { l: 10, r: 10, b: 10, t: 50 },
    width: 700,
    height: 700,
    title: { text: "Global Twilight Struggle Outcomes (USA vs USSR)", font: { size: 20 } },
  };

  if (winTypeLoading) return <div>Loading...</div>;
  if (winTypeError) return <div>{winTypeError.message}</div>;
  if (!plotData) return null;
  return (
    <Plot
      data={[
        {
          type: "sunburst",
          ids: plotData.ids,
          labels: plotData.labels,
          parents: plotData.parents,
          values: plotData.values,
          branchvalues: "total",
          marker: {
            colors: plotData.colors,
            line: { width: 1.5, color: "white" },
          },
          hovertemplate: "<b>%{label}</b><br>Games: %{value}<extra></extra>",
        },
      ]}
      layout={layout}
      config={{ responsive: true }}
    />
  );
};

const WinTypeChart: React.FC<WinTypeChartProps> = ({ playerId }) => {
  const now = new Date();
  const threeMonthsAgoDate = new Date(now.setMonth(now.getMonth() - 3)).toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState<string>(threeMonthsAgoDate);

  const {
    data: winTypeStats,
    isLoading: winTypeLoading,
    error: winTypeError,
  } = useWinTypeChartData(playerId, fromDate);

  const transformDataForSunburst = (data: WinTypeStats) => {
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
    const processSide = (
      sideData: WinTypeStatsItem,
      sideName: string,
      sideId: string,
      sideColor: string,
    ) => {
      // 2. Nodo de Bando (USA o USSR)
      ids.push(sideId);
      labels.push(sideName);
      parents.push("total");
      values.push(parseInt(sideData.total_games));
      colors.push(sideColor);

      const outcomes = [
        { id: "wins", label: "Wins", value: parseInt(sideData.wins), col: colorPalette.win },
        { id: "losses", label: "Losses", value: parseInt(sideData.losses), col: colorPalette.loss },
        { id: "ties", label: "Ties", value: parseInt(sideData.ties), col: colorPalette.tie },
      ];

      outcomes.forEach((outcome) => {
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
            Object.keys(sideData).forEach((key) => {
              if (key.endsWith(`_${outcome.id}`)) {
                const val = parseInt(sideData[key as keyof WinTypeStatsItem]);
                if (val > 0) {
                  // Creamos un nombre legible: "defcon_wins" -> "Defcon"
                  const typeKey = key.replace(
                    `_${outcome.id}`,
                    "",
                  ) as keyof typeof colorPalette.types;
                  const cleanLabel = key
                    .replace(`_${outcome.id}`, "")
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase());

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
      return transformDataForSunburst(winTypeStats);
    }
  }, [winTypeStats]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "52rem",
        backgroundColor: "white",
        padding: "24px",
        marginTop: "16px",
        border: "solid 1px lightgray",
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <DateSelector setFromDate={setFromDate} />
      <Chart plotData={plotData} winTypeLoading={winTypeLoading} winTypeError={winTypeError} />
    </div>
  );
};

export { WinTypeChart };
