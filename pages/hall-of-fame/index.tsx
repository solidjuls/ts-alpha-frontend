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

const RegionalSubtitle = styled.h2`
  margin-top: 2rem;
  margin-left: 2rem;
  color: #1f2937;
`;

const TableContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const RegionalTableContainer = styled.div`
  width: 95%;
  margin-bottom: 2rem;
  margin-left: 2rem;
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
  color: #3b82f6;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    color: #1d4ed8;
  }
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
        {data.map((s) => (
          <tr key={s.season}>
            <td data-label="Season">
              {s.link ? <Link href={s.link}>{s.season}</Link> : s.season}
            </td>
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
      <p>The ITSL, OTSL, and RTSL are the largest, oldest, and arguably most prestigious Twilight Struggle leagues. Placing in the top three of one of these leagues puts players amongst the best in the world.</p>
      <Subtitle>International Twilight Struggle League (ITSL)</Subtitle>
      <TableContainer>{renderTable(hallOfFameData.itsl)}</TableContainer>

      <Subtitle>Online Twilight Struggle League (OTSL)</Subtitle>
      <TableContainer>{renderTable(hallOfFameData.otsl)}</TableContainer>

      <Subtitle>Royale Twilight Struggle League (RTSL)</Subtitle>
      <TableContainer>{renderTable(hallOfFameData.rtsl)}</TableContainer>

      <Subtitle>Champions League</Subtitle>
      <p>The Champions League is an invite-only tournament inspired by UEFA, featuring winners of regional tournaments as well as the ITSL, OTSL, and RTSL.</p>
      <TableContainer>{renderTable(hallOfFameData.cl)}</TableContainer>

      <Subtitle>Asynchronous Leagues (RATS)</Subtitle>
      <p>Not everyone has the ability to play live Twilight Struggle games so there are a variety of asynchronous leagues all under the RATS banner to cater to asynchronous players.</p>
      <TableContainer>{renderTable(hallOfFameData.rats)}</TableContainer>

      <Subtitle>Regional Leagues</Subtitle>
      <p>Regional leagues are generally restricted to players who have a connection to a certain region. You can reach out to the organizers of a regional league you are interested in from our <Link href="/about">About Page</Link> to see if you are eligible.</p>
      <RegionalSubtitle>Atlantic (US) League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.atlantic)}</RegionalTableContainer>
      <RegionalSubtitle>Basque League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.basque)}</RegionalTableContainer>
      <RegionalSubtitle>Belgium League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.belgium)}</RegionalTableContainer>
      <RegionalSubtitle>Canadian League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.canadian)}</RegionalTableContainer>
      <RegionalSubtitle>Catalan League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.catalan)}</RegionalTableContainer>
      <RegionalSubtitle>Chinese League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.chinese)}</RegionalTableContainer>
      <RegionalSubtitle>Dutch League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.dutch)}</RegionalTableContainer>
      <RegionalSubtitle>East European League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.eeu)}</RegionalTableContainer>
      <RegionalSubtitle>French League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.french)}</RegionalTableContainer>
      <RegionalSubtitle>Greek League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.greek)}</RegionalTableContainer>
      <RegionalSubtitle>Hong Kong League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.hongKong)}</RegionalTableContainer>
      <RegionalSubtitle>Israeli League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.israel)}</RegionalTableContainer>
      <RegionalSubtitle>Italian League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.italian)}</RegionalTableContainer>
      <RegionalSubtitle>Korean League (KTSL)</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.korean)}</RegionalTableContainer>
      <RegionalSubtitle>Midwest (US) League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.midwest)}</RegionalTableContainer>
      <RegionalSubtitle>Nordic League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.nordic)}</RegionalTableContainer>
      <RegionalSubtitle>Polish League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.polish)}</RegionalTableContainer>
      <RegionalSubtitle>Portuguese League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.portuguese)}</RegionalTableContainer>
      <RegionalSubtitle>Southern (US) League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.southern)}</RegionalTableContainer>
      <RegionalSubtitle>Liga de Federaciones de Twilight Struggle (LFTS)</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.spanish)}</RegionalTableContainer>
      <RegionalSubtitle>UK League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.uk)}</RegionalTableContainer>
      <RegionalSubtitle>Western (US) League</RegionalSubtitle>
      <RegionalTableContainer>{renderTable(hallOfFameData.western)}</RegionalTableContainer>
    </PageContainer>
  );
}