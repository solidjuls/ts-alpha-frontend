import React, { useEffect } from "react";
import styled from "styled-components";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { useHallOfFame } from "hooks/useHallOfFame";
import { Spinner } from "@radix-ui/themes";

const PageContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--surface-ground);
  color: #1f2937;
  padding: 1rem;
`;

const Header = styled.header`
  background-color: #f8f9fa;
  color: #1f2937;
  padding: 16px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #1f2937;
`;

const Subtitle = styled.h2`
  margin-top: 2rem;
  color: #1f2937;
`;

const TableContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  background-color: transparent;

  th, td {
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: #365f65;
    color: #fff;
    font-weight: bold;
  }

  tr {
    border-bottom: 1px solid #e5e7eb;
  }

  tr:nth-child(even) {
    background-color: #f9fafb;
  }

  /* ----- MOBILE CARD STYLE ----- */
  @media (max-width: 700px) {
    border: 0;
    display: block;

    thead {
      display: none;
    }

    tbody, tr, td {
      display: block;
      width: 100%;
    }

    tr {
      margin-bottom: 1rem;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    td {
      text-align: left;
      padding: 0.75rem 1rem;
      position: relative;

      &::before {
        content: attr(data-label);
        display: block;
        font-weight: bold;
        color: #365f65;
        margin-bottom: 0.25rem;
      }
    }
  }
`;

const Link = styled.a`
  color: inherit;
`;

const PlayerCellContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PlayerCell = ({ flag, name, id }: { flag?: string; name: string; id?: number }) => (
  <PlayerCellContainer>
    {flag && <FlagIcon code={flag} />}
    {id ? <Link href={`/userprofile/${id}`}>{name}</Link> : <Text>{name}</Text>}
  </PlayerCellContainer>
);

interface HallOfFameEntry {
  id: number;
  season: number | string;
  players: number;
  link?: string;
  flag1?: string;
  flag2?: string;
  flag3?: string;
  winner: { id: number; name: string };
  second: { id: number; name: string };
  third?: { id: number; name: string };
}
export default function HallOfFamePage() {
  const { data: hallOfFameData, isLoading, error } = useHallOfFame();

  useEffect(() => {
    if (hallOfFameData) {
      console.log('Hall of Fame API Response:', hallOfFameData);
    }
    if (error) {
      console.log('Hall of Fame API Error:', error);
    }
  }, [hallOfFameData, error]);

  const renderTable = (data: any[]) => (
    <Table>
      <thead>
        <tr>
          <th>Season</th>
          <th>Players</th>
          <th>Winner</th>
          <th>Second</th>
          <th>Third</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((s) => (
          <tr key={s.id}>
            <td data-label="Season">{s.link ? <Link href={s.link}>{s.season}</Link> : s.season}</td>
            <td data-label="Players">{s.players}</td>
            <td data-label="Winner">
              <PlayerCell flag={s.flag1} name={s.winner?.name} id={s.winnerID} />
            </td>
            <td data-label="Second">
              <PlayerCell flag={s.flag2} name={s.second?.name} id={s.secondID} />
            </td>
            <td data-label="Third">
              <PlayerCell flag={s.flag3} name={s.third?.name} id={s.thirdID} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  if (isLoading) return <Spinner size="3" />;
  if (error || !hallOfFameData) return <div>Error loading hall of fame</div>;

  return (
    <PageContainer>
      <Header>
        <Title>Hall of Fame</Title>
      </Header>
      <p>The ITSL, OTSL, and RTSL are the largest, oldest, and arguably most prestiguous Twilight Struggle leagues.<br/>Placing in the top three of one of these leagues puts players amongst the best in the world.</p>
      <Subtitle>International Twilight Struggle League (ITSL)</Subtitle>
      <TableContainer>{renderTable(hallOfFameData.itsl)}</TableContainer>

      <Subtitle>Online Twilight Struggle League (OTSL)</Subtitle>
      <TableContainer>{renderTable(hallOfFameData.otsl)}</TableContainer>

      <Subtitle>Royale Twilight Struggle League (RTSL)</Subtitle>
      <TableContainer>{renderTable(hallOfFameData.rtsl)}</TableContainer>
    </PageContainer>
  );
}