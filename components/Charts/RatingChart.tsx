import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Data, Layout } from "plotly.js";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useRatingHistory } from "hooks/useRating";
import { DateSelector } from "./DateSelector";
import { RatingHistoryEntry } from "services/rating.service";

// Dynamically import Plot with no SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const Text = styled("div")`
  font-size: "14px",
  color: "#333",
`;

interface RatingChartProps {
  playerId: string;
}

interface RatingHistoryItem {
  gameId: string;
  date: string;
  currentRating: number;
  previousRating: number;
  ratingChange: number;
  opponent: string;
  isUsaGame: string;
}

const colors = {
  usa: "#4B6CB7",
  ussr: "#B74B4B",
};

interface ChartProps {
  ratingHistory: RatingHistoryEntry[] | undefined;
  ratingLoading: boolean;
  ratingError: Error | null;
}

const Chart: React.FC<ChartProps> = ({ ratingHistory, ratingLoading, ratingError }) => {
  const router = useRouter();

  if (ratingLoading) return <div>Loading...</div>;
  if (ratingError) return <div>{ratingError.message}</div>;
  const layout: Partial<Layout> = {
    title: {
      text: "Rating History",
      font: {
        size: 20,
        family: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
      },
    },
    xaxis: {
      title: {
        text: "Date",
        font: {
          size: 14,
        },
      },
      zeroline: false,
      gridcolor: "#f0f0f0",
      zerolinecolor: "#d3d3d3",
    },
    yaxis: {
      title: {
        text: "Rating",
        font: {
          size: 14,
        },
      },
      zeroline: false,
      gridcolor: "#f0f0f0",
    },
    margin: { t: 60, r: 30, b: 50, l: 60 },
    showlegend: false,
    plot_bgcolor: "white",
    paper_bgcolor: "white",
    font: {
      family: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    },
    hovermode: "closest",
    hoverlabel: {
      bgcolor: "white",
      font: { size: 12 },
      align: "left",
    },
  };
  const ratingHistorySorted = ratingHistory?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (!ratingHistorySorted) return null;
  // Create arrays for the chart data
  const dates: Date[] = ratingHistorySorted.map((item) => new Date(item.date));
  const ratings: number[] = ratingHistorySorted.map((item) => item.currentRating);
  const gameIds: string[] = ratingHistorySorted.map((item) => item.gameId);
  const opponents: string[] = ratingHistorySorted.map((item) => item.opponent);
  const ratingChanges: number[] = ratingHistorySorted.map((item) => item.ratingChange);
  const isUSAGames: boolean[] = ratingHistorySorted.map((item) => item.isUsaGame === "1");

  const data: Data[] = [
    {
      x: dates, // Array.from({ length: dates?.length }, (_, i) => i + 1),
      y: ratings,
      type: "scatter",
      mode: "lines+markers",
      name: "Rating",
      line: {
        color: "#374151",
        width: 2,
        shape: "spline",
      },
      marker: {
        size: 8,
        color: ratingHistorySorted?.map((item) => (item.isUsaGame === "1" ? colors.usa : colors.ussr)),
      },
      hovertemplate:
        "<b>Date:</b> %{customdata[3]|%Y-%m-%d}<br>" +
        "<b>Rating:</b> %{y}<br>" +
        "<b>Opponent:</b> %{customdata[1]}<br>" +
        "<b>Rating Change:</b> %{customdata[2]}<br>" +
        "<b>Side:</b> %{customdata[4]}<br>" +
        "<extra></extra>",
      customdata: gameIds?.map((id, i) => [
        id,
        opponents[i],
        ratingChanges[i],
        dates?.[i],
        isUSAGames[i] ? "USA" : "USSR",
      ]),
    },
  ];

  const handleClick = (event: any) => {
    if (event && event.points && event.points.length > 0) {
      const pointIndex = event.points[0].pointIndex;
      const gameId = ratingHistorySorted[pointIndex].gameId;

      if (gameId) {
        router.push(`/games/${gameId}`);
      }
    }
  };

  return (
    <Plot
      data={data}
      layout={layout}
      config={{
        responsive: true,
        displayModeBar: false,
      }}
      style={{ width: "100%", height: "400px" }}
      onClick={handleClick}
    />
  );
};

const RatingChart: React.FC<RatingChartProps> = ({ playerId }) => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3)).toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState<string>(threeMonthsAgo);
  const {
    data: ratingHistory,
    isLoading: ratingLoading,
    error: ratingError,
  } = useRatingHistory({ userId: playerId, fromDate });

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
      <Chart
        ratingHistory={ratingHistory}
        ratingLoading={ratingLoading}
        ratingError={ratingError}
      />
    </div>
  );
};

export { RatingChart };
