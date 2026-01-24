import React, { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { Data, Layout } from "plotly.js";
import { useRouter } from "next/router";
import { useRatingHistory } from "hooks/useRating";
import { DateSelector } from "./DateSelector";
import { RatingHistoryEntry } from "services/rating.service";
import { ChartCard, ChartArea, CenterMessage } from "./RatingChart.styled";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";

// Dynamically import Plot with no SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface RatingChartProps {
  playerId: string;
}

interface ChartProps {
  ratingHistory: RatingHistoryEntry[] | undefined;
  ratingLoading: boolean;
  ratingError: Error | null;
}

const Chart: React.FC<ChartProps> = ({ ratingHistory, ratingLoading, ratingError }) => {
  const router = useRouter();
  const chartWrapRef = useRef<HTMLDivElement | null>(null); // Needed to allow pointer cursor

  // Needed because Plotly has trouble with CSS color variables
  const getThemeColors = () => {
    if (typeof window === "undefined") return null;

    const css = getComputedStyle(document.documentElement);

    return {
      bgCard: css.getPropertyValue("--bg-card").trim(),
      border: css.getPropertyValue("--border").trim(),
      text: css.getPropertyValue("--primary-text").trim(),
      muted: css.getPropertyValue("--muted-text").trim(),
      usa: css.getPropertyValue("--usa").trim(),
      ussr: css.getPropertyValue("--ussr").trim(),
    };
  };

  const ratingHistorySorted = useMemo(() => {
    if (!ratingHistory) return null;
    return [...ratingHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [ratingHistory]);

  const theme = getThemeColors();
  if (!theme) {
    return (
      <CenterMessage>
        <Spinner />
      </CenterMessage>
    );
  }

  if (ratingLoading) {
    return (
      <CenterMessage>
        <Spinner />
      </CenterMessage>
    );
  }
    if (ratingError) {
    return (
      <CenterMessage>
        <Text>{ratingError.message}</Text>
      </CenterMessage>
    );
  }

  if (!ratingHistorySorted || ratingHistorySorted.length === 0) {
    return (
      <CenterMessage>
        <Text>No Rating History Available</Text>
      </CenterMessage>
    );
  }

  // Create arrays for the chart data
  const dates: Date[] = ratingHistorySorted.map((item) => new Date(item.date));
  const ratings: number[] = ratingHistorySorted.map((item) => item.currentRating);
  const gameIds: string[] = ratingHistorySorted.map((item) => item.gameId);
  const opponents: string[] = ratingHistorySorted.map((item) => item.opponent);
  const ratingChanges: number[] = ratingHistorySorted.map((item) => item.ratingChange);
  const isUSAGames: boolean[] = ratingHistorySorted.map((item) => item.isUsaGame === "1");

  const layout: Partial<Layout> = {
    title: {
      text: "Rating History",
      font: {
        size: 18,
        family: "var(--font-body)",
        color: theme.text,
      },
    },
    margin: { t: 48, r: 18, b: 40, l: 52 },
    showlegend: false,
    hovermode: "closest",
    paper_bgcolor: theme.bgCard,
    plot_bgcolor: theme.bgCard,
    font: {
      family: "var(--font-body)",
      color: theme.text,
    },
    xaxis: {
      title: { text: "Date", font: { size: 12, family: "var(--font-body)"} },
      zeroline: false,
      gridcolor: theme.border,
      tickfont: { size: 11, family: "var(--font-body)"},
    },
    yaxis: {
      title: { text: "Rating", font: { size: 12, family: "var(--font-body)"} },
      zeroline: false,
      gridcolor: theme.border,
      tickfont: { size: 11, family: "var(--font-body)"},
    },
    hoverlabel: {
      bgcolor: theme.bgCard,
      bordercolor: theme.border,
      font: {
        size: 12,
        family: "var(--font-body)",
        color: theme.text,
      },
      align: "left",
    },
  };

  const data: Data[] = [
    {
      x: dates, // Array.from({ length: dates?.length }, (_, i) => i + 1),
      y: ratings,
      type: "scatter",
      mode: "lines+markers",
      name: "Rating",
      line: {
        color: theme.text,
        width: 2,
        shape: "linear",
      },
      marker: {
        size: 8,
        color: ratingHistorySorted.map((item) =>
          item.isUsaGame === "1" ? theme.usa : theme.ussr
        ) as any,
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

  const setPlotlyCursor = (cursor: string) => {
    const root = chartWrapRef.current;
    if (!root) return;

    const plotlyEl = root.querySelector(".js-plotly-plot") as HTMLElement | null;
    if (plotlyEl) {
      plotlyEl.style.cursor = cursor;
    }

    const plotlyAlt = root.querySelector(".plotly") as HTMLElement | null;
    if (plotlyAlt) {
      plotlyAlt.style.cursor = cursor;
    }

    const dragLayer = root.querySelector(".draglayer .nsewdrag") as HTMLElement | null;
    if (dragLayer) {
      dragLayer.style.cursor = cursor;
    }
  };


  const handleHover = () => setPlotlyCursor("pointer");
  const handleUnhover = () => setPlotlyCursor("crosshair");

  const handleClick = (event: any) => {
    const pointIndex = event?.points?.[0]?.pointIndex;
    if (typeof pointIndex !== "number") return;

    const gameId = ratingHistorySorted[pointIndex]?.gameId;
    if (gameId) router.push(`/games/${gameId}`);
  };

  return (
    <div ref={chartWrapRef} style={{ width: "100%", height: 400 }}>
      <Plot
        data={data}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "100%" }}
        onClick={handleClick}
        onHover={handleHover}
        onUnhover={handleUnhover}
      />
    </div>
  );
};

const RatingChart: React.FC<RatingChartProps> = ({ playerId }) => {
  const now = new Date();
  const threeMonthsAgoDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const threeMonthsAgo = threeMonthsAgoDate.toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState<string>(threeMonthsAgo);

  const { data: ratingHistory, isLoading: ratingLoading, error: ratingError } =
    useRatingHistory({ userId: playerId, fromDate });

  return (
    <ChartCard className="card">
      <DateSelector setFromDate={setFromDate} />
      <Chart ratingHistory={ratingHistory} ratingLoading={ratingLoading} ratingError={ratingError} />
    </ChartCard>
  );
};

export { RatingChart };