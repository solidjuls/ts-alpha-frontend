import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Dot,
} from "recharts";
import { useRatingHistory } from "hooks/useRating";
import { DateSelector } from "./DateSelector";
import { RatingHistoryEntry } from "services/rating.service";
import { ChartCard, CenterMessage } from "./RatingChart.styled";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";

interface RatingChartProps {
  playerId: string;
}

interface ChartProps {
  ratingHistory: RatingHistoryEntry[] | undefined;
  ratingLoading: boolean;
  ratingError: Error | null;
}

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

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 12px",
        boxShadow: "var(--shadow-soft)",
        fontSize: "0.8rem",
        color: "var(--primary-text)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{formatDate(data.date)}</div>
      <div>Rating: <strong>{data.currentRating}</strong></div>
      <div>Opponent: {data.opponent}</div>
      <div>Change: <span style={{ color: data.ratingChange >= 0 ? "var(--usa)" : "var(--ussr)" }}>
        {data.ratingChange >= 0 ? "+" : ""}{data.ratingChange}
      </span></div>
      <div>Side: {data.isUsaGame === "1" ? "USA" : "USSR"}</div>
    </div>
  );
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const fill = payload.isUsaGame === "1" ? "var(--usa)" : "var(--ussr)";
  return <Dot cx={cx} cy={cy} r={4} fill={fill} stroke={fill} />;
};

const Chart: React.FC<ChartProps> = ({ ratingHistory, ratingLoading, ratingError }) => {
  const router = useRouter();
  const theme = getThemeColors();

  if (!theme) {
    return <CenterMessage><Spinner /></CenterMessage>;
  }

  if (ratingLoading) {
    return <CenterMessage><Spinner /></CenterMessage>;
  }

  if (ratingError) {
    return <CenterMessage><Text>{ratingError.message}</Text></CenterMessage>;
  }

  const chartData = ratingHistory
    ? [...ratingHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  if (chartData.length === 0) {
    return <CenterMessage><Text>No Rating History Available</Text></CenterMessage>;
  }

  const handleClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.gameId) {
      router.push(`/games/${data.activePayload[0].payload.gameId}`);
    }
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} onClick={handleClick} style={{ cursor: "pointer" }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke={theme.muted}
            fontSize={11}
            tick={{ fill: theme.muted }}
          />
          <YAxis
            stroke={theme.muted}
            fontSize={11}
            tick={{ fill: theme.muted }}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="currentRating"
            stroke={theme.text}
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6, stroke: theme.text, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
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
