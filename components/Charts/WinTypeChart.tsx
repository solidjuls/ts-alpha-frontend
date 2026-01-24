import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useWinTypeChartData } from "hooks/useGames";
import { DateSelector } from "./DateSelector";
import { WinTypeStats, WinTypeStatsItem } from "services/games.service";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";
import { ChartCard, ChartArea, CenterMessage } from "./WinTypeChart.styled";

// Dynamically import Plot with no SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface WinTypeChartProps {
  playerId: string;
  fromDate?: string;
}

interface ChartProps {
  plotData: {
    ids: string[];
    labels: string[];
    parents: string[];
    values: number[];
    colors: string[];
  } | null;
  winTypeLoading: boolean;
  winTypeError: Error | null;
}

const getThemeTokens = () => {
  if (typeof window === "undefined") return null;

  const css = getComputedStyle(document.documentElement);
  return {
    bgCard: css.getPropertyValue("--bg-card").trim(),
    border: css.getPropertyValue("--border").trim(),
    text: css.getPropertyValue("--primary-text").trim(),
    muted: css.getPropertyValue("--muted-text").trim(),
    altText: css.getPropertyValue("--alt-text").trim(),
    usa: css.getPropertyValue("--usa").trim(),
    ussr: css.getPropertyValue("--ussr").trim(),
    shadowSoft: css.getPropertyValue("--shadow-soft").trim(), // not used in plotly; kept if needed
    fontBody: css.getPropertyValue("--font-body").trim(),
  };
};

const Chart: React.FC<ChartProps> = ({ plotData, winTypeLoading, winTypeError }) => {
  const theme = getThemeTokens();

  if (!theme) {
    return (
      <CenterMessage>
        <Spinner />
      </CenterMessage>
    );
  }

  if (winTypeLoading) {
    return (
      <CenterMessage>
        <Spinner />
      </CenterMessage>
    );
  }

  if (winTypeError) {
    return (
      <CenterMessage>
        <Text style={{ color: theme.ussr }}>{winTypeError.message}</Text>
      </CenterMessage>
    );
  }

  if (!plotData) {
    return (
      <CenterMessage>
        <Text style={{ color: theme.muted }}>No data available.</Text>
      </CenterMessage>
    );
  }

  const layout = {
    margin: { l: 10, r: 10, b: 10, t: 46 },
    autosize: true,
    paper_bgcolor: theme.bgCard,
    plot_bgcolor: theme.bgCard,
    font: {
      family: theme.fontBody,
      color: theme.text,
      size: 12,
    },
    title: {
      text: "Twilight Struggle Results",
      font: { size: 18, family: theme.fontBody, color: theme.text },
    },
  };

  return (
    <ChartArea>
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
              line: { width: 1, color: theme.bgCard },
            },
            hovertemplate: "<b>%{label}</b><br>Games: %{value}<extra></extra>",
          },
        ]}
        layout={layout as any}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
      />
    </ChartArea>
  );
};

const WinTypeChart: React.FC<WinTypeChartProps> = ({ playerId }) => {
  const now = new Date();
  const threeMonthsAgoDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    .toISOString()
    .split("T")[0];

  const [fromDate, setFromDate] = useState<string>(threeMonthsAgoDate);

  const { data: winTypeStats, isLoading: winTypeLoading, error: winTypeError } =
    useWinTypeChartData(playerId, fromDate);

  const plotData = useMemo(() => {
    if (!winTypeStats) return null;

    // Resolve tokens to real colors (Plotly can’t use CSS vars reliably)
    const theme = getThemeTokens();
    if (!theme) return null;

    const ids: string[] = [];
    const labels: string[] = [];
    const parents: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];

    const usa = winTypeStats.usaStats[0];
    const ussr = winTypeStats.ussrStats[0];

    const totalGlobal = parseInt(usa.total_games) + parseInt(ussr.total_games);

    ids.push("total");
    labels.push("All Games");
    parents.push("");
    values.push(totalGlobal);
    colors.push(theme.bgCard);

    const processSide = (sideData: WinTypeStatsItem, sideName: string, sideId: string, sideColor: string) => {
      ids.push(sideId);
      labels.push(sideName);
      parents.push("total");
      values.push(parseInt(sideData.total_games));
      colors.push(sideColor);

      const outcomes = [
        { id: "wins", label: "Wins", value: parseInt(sideData.wins), col: theme.usa },  // wins = USA tone
        { id: "losses", label: "Losses", value: parseInt(sideData.losses), col: theme.ussr }, // losses = USSR tone
        { id: "ties", label: "Ties", value: parseInt(sideData.ties), col: theme.border }, // neutral
      ];

      outcomes.forEach((outcome) => {
        if (outcome.value > 0) {
          ids.push(`${sideId}_${outcome.id}`);
          labels.push(outcome.label);
          parents.push(sideId);
          values.push(outcome.value);
          colors.push(outcome.col);
        }
      });
    };

    processSide(usa, "USA", "usa", theme.usa);
    processSide(ussr, "USSR", "ussr", theme.ussr);

    return { ids, labels, parents, values, colors };
  }, [winTypeStats]);

  return (
    <ChartCard className="card">
      <DateSelector setFromDate={setFromDate} />
      <Chart plotData={plotData} winTypeLoading={winTypeLoading} winTypeError={winTypeError} />
    </ChartCard>
  );
};

export { WinTypeChart };
