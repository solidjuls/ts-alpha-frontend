import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useWinTypeChartData } from "hooks/useGames";
import { DateSelector } from "./DateSelector";
import { WinTypeStats, WinTypeStatsItem } from "services/games.service";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";
import { ChartCard, ChartArea, CenterMessage } from "./WinTypeChart.styled";
import styled from "styled-components";

interface WinTypeChartProps {
  playerId: string;
}

interface ChartProps {
  winTypeStats: WinTypeStats | undefined;
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
    fontBody: css.getPropertyValue("--font-body").trim(),
  };
};

const PieSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const SectionTitle = styled.div`
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--primary-text);
  margin-bottom: 4px;
`;

const ChartsWrap = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  height: 100%;
`;

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const { name, value } = payload[0];
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "6px 10px",
        boxShadow: "var(--shadow-soft)",
        fontSize: "0.8rem",
        color: "var(--primary-text)",
      }}
    >
      <strong>{name}</strong>: {value} games
    </div>
  );
};

const renderPie = (
  sideData: WinTypeStatsItem,
  theme: NonNullable<ReturnType<typeof getThemeTokens>>,
) => {
  const data = [
    { name: "Wins", value: parseInt(sideData.wins), fill: theme.usa },
    { name: "Losses", value: parseInt(sideData.losses), fill: theme.ussr },
    { name: "Ties", value: parseInt(sideData.ties), fill: theme.border },
  ].filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
          fontSize={11}
          fill={theme.text}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<PieTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={28}
          formatter={(value: string) => (
            <span style={{ color: theme.text, fontSize: "0.75rem" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

const Chart: React.FC<ChartProps> = ({ winTypeStats, winTypeLoading, winTypeError }) => {
  const theme = getThemeTokens();

  if (!theme) {
    return <CenterMessage><Spinner /></CenterMessage>;
  }

  if (winTypeLoading) {
    return <CenterMessage><Spinner /></CenterMessage>;
  }

  if (winTypeError) {
    return <CenterMessage><Text style={{ color: theme.ussr }}>{winTypeError.message}</Text></CenterMessage>;
  }

  if (!winTypeStats) {
    return <CenterMessage><Text style={{ color: theme.muted }}>No data available.</Text></CenterMessage>;
  }

  const usa = winTypeStats.usaStats[0];
  const ussr = winTypeStats.ussrStats[0];

  return (
    <ChartArea>
      <ChartsWrap>
        <PieSection>
          <SectionTitle>USA ({usa.total_games} games)</SectionTitle>
          {renderPie(usa, theme)}
        </PieSection>
        <PieSection>
          <SectionTitle>USSR ({ussr.total_games} games)</SectionTitle>
          {renderPie(ussr, theme)}
        </PieSection>
      </ChartsWrap>
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

  return (
    <ChartCard className="card">
      <DateSelector setFromDate={setFromDate} />
      <Chart winTypeStats={winTypeStats} winTypeLoading={winTypeLoading} winTypeError={winTypeError} />
    </ChartCard>
  );
};

export { WinTypeChart };
