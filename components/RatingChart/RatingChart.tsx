import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Flex, Span } from "components/Atoms";
import { Game } from "types/game.types";
import { Data, Layout, Config } from "plotly.js";
import { useRouter } from "next/router";
import { styled } from "stitches.config";
import useFetchInitialData from "hooks/useFetchInitialData";
import getAxiosInstance from "utils/axios";
import WinTypeChart from "./WinTypeChart";

// Dynamically import Plot with no SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Styled components
const Button = styled("button", {
  padding: "6px 12px",
  borderRadius: "4px",
  fontSize: "14px",
  cursor: "pointer",
  border: "1px solid #ccc",
  backgroundColor: "white",
  transition: "all 0.2s ease",

  "&:hover": {
    backgroundColor: "#f0f0f0",
  },

  variants: {
    size: {
      sm: {
        padding: "4px 8px",
        fontSize: "12px",
      },
    },
    variant: {
      primary: {
        backgroundColor: "#1f77b4",
        color: "white",
        border: "1px solid #1f77b4",

        "&:hover": {
          backgroundColor: "#1768a0",
        },
      },
      outline: {
        backgroundColor: "white",
        color: "#333",
        border: "1px solid #ccc",

        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      },
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "outline",
  },
});

const Text = styled("div", {
  fontSize: "14px",
  color: "#333",
});

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

// Color palette - matching WinTypeChart
const colors = {
  usa: "#4B6CB7", // Calm blue for USA
  ussr: "#B74B4B", // Muted red for USSR
};

const RatingChart: React.FC<RatingChartProps> = ({ playerId }) => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<"3months" | "6months" | "year" | "all">("3months");
  const [isLoading, setIsLoading] = useState(true);
  const [ratingHistory, setRatingHistory] = useState<RatingHistoryItem[]>([]);
  const [chartReady, setChartReady] = useState(false);

  // Calculate date filter for API
  const getDateFilter = () => {
    if (dateRange === "all") return "";

    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return "";
    }

    // Format as ISO string and extract just the date part
    return startDate.toISOString().split("T")[0];
  };

  // Fetch rating history data
  const fetchRatingHistory = async () => {
    setIsLoading(true);
    setChartReady(false);
    try {
      const dateFilter = getDateFilter();
      const url = `/api/game/rating-history?userFilter=${playerId}${dateFilter ? `&fromDate=${dateFilter}` : ""}`;
      const response = await getAxiosInstance().get<RatingHistoryItem[]>(url);
      const reversedData = response.data.slice().reverse();
      setRatingHistory(reversedData);
    } catch (error) {
      console.error("Error fetching rating history:", error);
    } finally {
      // Add a small delay before marking as ready to ensure everything is loaded
      setTimeout(() => {
        setIsLoading(false);
        setChartReady(true);
      }, 500);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRatingHistory();
  }, []);

  // Fetch data when date range changes
  useEffect(() => {
    fetchRatingHistory();
  }, [dateRange, playerId]);

  // Create arrays for the chart data
  const dates: Date[] = ratingHistory.map((item) => new Date(item.date));
  const ratings: number[] = ratingHistory.map((item) => item.currentRating);
  const gameIds: string[] = ratingHistory.map((item) => item.gameId);
  const opponents: string[] = ratingHistory.map((item) => item.opponent);
  const ratingChanges: number[] = ratingHistory.map((item) => item.ratingChange);
  const isUSAGames: boolean[] = ratingHistory.map((item) => item.isUsaGame === "1");

  const data: Data[] = [
    {
      x: Array.from({ length: dates.length }, (_, i) => i + 1), // Game count starting from 1
      y: ratings,
      type: "scatter",
      mode: "lines+markers",
      name: "Rating",
      line: {
        color: "#374151", // Dark grey
        width: 2,
        shape: "spline",
      },
      marker: {
        size: 8,
        color: ratingHistory.map((item) => (item.isUsaGame === "1" ? colors.usa : colors.ussr)),
      },
      hovertemplate:
        "<b>Date:</b> %{customdata[3]|%Y-%m-%d}<br>" +
        "<b>Rating:</b> %{y}<br>" +
        "<b>Opponent:</b> %{customdata[1]}<br>" +
        "<b>Rating Change:</b> %{customdata[2]}<br>" +
        "<b>Side:</b> %{customdata[4]}<br>" +
        "<extra></extra>",
      customdata: gameIds.map((id, i) => [
        id,
        opponents[i],
        ratingChanges[i],
        dates[i],
        isUSAGames[i] ? "USA" : "USSR",
      ]),
    },
  ];

  const layout: Partial<Layout> = {
    title: {
      text: "Rating History",
      font: {
        size: 20,
        family: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
      },
    },
    xaxis: {
      showticklabels: false,
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

  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: false,
  };

  // Handle click on a data point
  const handleClick = (event: any) => {
    if (event && event.points && event.points.length > 0) {
      const pointIndex = event.points[0].pointIndex;
      const gameId = ratingHistory[pointIndex].gameId;

      if (gameId) {
        router.push(`/games/${gameId}`);
      }
    }
  };

  // Handle date range filter change
  const handleDateRangeChange = (range: "3months" | "6months" | "year" | "all") => {
    setDateRange(range);
  };

  return (
    <Box
      css={{
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
      <Flex
        css={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <Flex css={{ gap: "8px" }}>
          <Button
            size="sm"
            variant={dateRange === "3months" ? "primary" : "outline"}
            onClick={() => handleDateRangeChange("3months")}
            disabled={isLoading}
          >
            3 Months
          </Button>
          <Button
            size="sm"
            variant={dateRange === "6months" ? "primary" : "outline"}
            onClick={() => handleDateRangeChange("6months")}
            disabled={isLoading}
          >
            6 Months
          </Button>
          <Button
            size="sm"
            variant={dateRange === "year" ? "primary" : "outline"}
            onClick={() => handleDateRangeChange("year")}
            disabled={isLoading}
          >
            1 Year
          </Button>
          <Button
            size="sm"
            variant={dateRange === "all" ? "primary" : "outline"}
            onClick={() => handleDateRangeChange("all")}
            disabled={isLoading}
          >
            All Time
          </Button>
        </Flex>
      </Flex>

      {isLoading || !chartReady ? (
        <Box
          css={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <Text css={{ color: "#666" }}>Loading chart data...</Text>
        </Box>
      ) : ratingHistory.length === 0 ? (
        <Box
          css={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <Text css={{ color: "#666" }}>No games found in the selected date range</Text>
        </Box>
      ) : (
        <>
          <Plot
            data={data}
            layout={layout}
            config={config}
            style={{ width: "100%", height: "400px" }}
            onClick={handleClick}
          />
          <WinTypeChart playerId={playerId} fromDate={getDateFilter()} />
        </>
      )}
    </Box>
  );
};

export default RatingChart;
