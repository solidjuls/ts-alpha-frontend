import React from "react";
import styled from "styled-components";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";

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

// -------------------------------
// DATA
// -------------------------------
const itslData = [
  { season: 2006, link: "http://www.wargameroom.com/itsl06.htm", players: 20, flag1: "DE", winner: "Michael Loth", winnerID: 2427, flag2: "US", second: "Rick Young", secondID: 2605, flag3: "US", third: "Bruce Wigdor", thirdID: 1707 },
  { season: 2007, link: "http://www.wargameroom.com/itsl07.htm", players: 48, flag1: "US", winner: "Steven Bauer", winnerID: 2729, flag2: "US", second: "Rob March", secondID: 2611, flag3: "DE", third: "Michael Loth", thirdID: 2427 },
  { season: 2008, link: "http://www.wargameroom.com/itsl08.htm", players: 49, flag1: "DE", winner: "Charles Féaux de la Croix", winnerID: 1730, flag2: "FI", second: "Sakari Lahti", secondID: 2647, flag3: "FI", third: "Riku Riekkinen", thirdID: 2607 },
  { season: 2010, link: "http://www.wargameroom.com/itsl10.htm", players: 49, flag1: "CN", winner: "Wu Haifu", winnerID: 2831, flag2: "CA", second: "Randy Pippus", secondID: 2588, flag3: "US", third: "Bruce Wigdor", thirdID: 1707 },
  { season: 2012, link: "http://www.wargameroom.com/itsl12.htm", players: 44, flag1: "HU", winner: "Gábor Földes", winnerID: 1943, flag2: "FI", second: "Riku Riekkinen", secondID: 2607, flag3: "CA", third: "Mathieu Paré-Paquin", thirdID: 2396 },
  { season: 2013, link: "http://www.wargameroom.com/itsl13.htm", players: 53, flag1: "FI", winner: "Riku Riekkinen", winnerID: 2607, flag2: "CA", second: "Charles Robinson", secondID: 1732, flag3: "PL", third: "Jędrzej Gąsiorowski", thirdID: 2110 },
  { season: 2014, link: "http://www.wargameroom.com/itsl14.htm", players: 62, flag1: "FI", winner: "Riku Riekkinen", winnerID: 2607, flag2: "PL", second: "Jędrzej Gąsiorowski", secondID: 2110, flag3: "CA", third: "Charles Robinson", thirdID: 1732 },
  { season: 2015, link: "http://www.wargameroom.com/itsl.htm", players: 61, flag1: "PL", winner: "Jędrzej Gąsiorowski", winnerID: 2110, flag2: "PL", second: "Ziemowit Pazderski", secondID: 2878, flag3: "FR", third: "Kik Ribail", thirdID: 2277 },
  { season: 2020, link: "https://docs.google.com/spreadsheets/d/1iTs9MIX1K_aBYEmLXSGdirj79KXzw9i1o7Y6_zo1jlI", players: 107, flag1: "CN", winner: "Kaiyan Fan", winnerID: 2241, flag2: "CN", second: "Kris Wei", secondID: 2287, flag3: "CZ", third: "Tomas Tvaroh", thirdID: 2780 },
  { season: 2021, link: "https://docs.google.com/spreadsheets/d/1J7CFa3oRxULQSevShKXrGA3dyrIk99PFsheRORUEfkc", players: 204, flag1: "CN", winner: "Min Cao", winnerID: 2465, flag2: "LI", second: "Janusz Szulc", secondID: 2079, flag3: "PL", third: "Ziemowit Pazderski", thirdID: 2878 },
  { season: 2022, link: "https://docs.google.com/spreadsheets/d/1eF9a0Uv5RhJ9Ktea86VCYjUBRgr5gO6_zq9Bxc5zNpU", players: 288, flag1: "PL", winner: "Ziemowit Pazderski", winnerID: 2878, flag2: "CN", second: "Zerun He", secondID: 2867, flag3: "US", third: "Scott Senen", thirdID: 2664 },
  { season: 2023, link: "https://docs.google.com/spreadsheets/d/1lY9N0ICtoGO__3cB5zWBjxyv35kgCqBO3mC8f__EnW8", players: 288, flag1: "US", winner: "Michael Patnik", winnerID: 2432, flag2: "SE", second: "Henrik Pettersson", secondID: 2005, flag3: "CA", third: "Félix Lapan", thirdID: 1913 },
  { season: 2024, link: "https://docs.google.com/spreadsheets/d/1KiBaw2ijj6HeNYVJdlELmybFmmplYFte0j4KZ-2hmDc", players: 213, flag1: "CZ", winner: "Tomas Tvaroh", winnerID: 2780, flag2: "ES", second: "Jarib Flores", secondID: 2084, flag3: "PL", third: "Ziemowit Pazderski", thirdID: 2878 },
  { season: 2025, link: "https://docs.google.com/spreadsheets/d/1Li5u8nJXp3JZVdM1TSODUm-Rs0kxCsq39pAsveJ0d4E", players: 192, flag1: "PL", winner: "Ziemowit Pazderski", winnerID: 2878, flag2: "CZ", second: "Tomas Tvaroh", secondID: 2780, flag3: "GR", third: "Makis Bahtsevanis", thirdID: 2344 },
];

const otslData = [
  { season: 2019, players: 50, flag1: "AU", winner: "Jesse Seeberg-Gordon", winnerID: 2130, flag2: "CA", second: "Hasan Jamil", secondID: 2000, flag3: "PL", third: "Tomasz Styczek", thirdID: 2786 },
  { season: 2020, players: 96, flag1: "CZ", winner: "Tomas Tvaroh", winnerID: 2780, flag2: "PL", second: "Tomasz Styczek", secondID: 2786, flag3: "UK", third: "Ricki McLaughlin", thirdID: 2606 },
  { season: 2021, link: "https://docs.google.com/spreadsheets/d/1GSvfZEx9QNXUsP6goMAcsvn-8hDPrSsRtXW0RTkEXfc", players: 160, flag1: "US", winner: "Justin Abramson", winnerID: 2232, flag2: "RU", second: "Pavel Meshkov", secondID: 2536, flag3: "AU", third: "Aidan Archer", thirdID: 1543 },
  { season: 2022, link: "https://docs.google.com/spreadsheets/d/1o_QUK_vYNHTKiHRMTTzOdtNK3DO0YJdatdXPAQHAfs0", players: 170, flag1: "US", winner: "Ryan Pindulic", winnerID: 2645, flag2: "ES", second: "Jarib Flores", secondID: 2084, flag3: "US", third: "Justin Abramson", thirdID: 2232 },
  { season: 2023, link: "https://docs.google.com/spreadsheets/d/1RIaPr8hFMDsMClnfYgJGo0GyqUEXcth6EoYzM7UsUo8", players: 160, flag1: "CZ", winner: "Tomas Tvaroh", winnerID: 2780, flag2: "TR", second: "Firat Guncu", secondID: 1921, flag3: "PL", third: "Bartosz Wróbel", thirdID: 1658 },
  { season: 2024, link: "https://docs.google.com/spreadsheets/d/16MVPndQQErMV-HFlz-lCD5woEf8dnXDypa1Zp8K5hKw", players: 140, flag1: "US", winner: "Justin Abramson", winnerID: 2232, flag2: "GR", second: "Tasos Manolopoulos", secondID: 2743, flag3: "SE", third: "Anton Skott", thirdID: 1630 },
];

const rtslData = [
  { season: "2018", players: 44, flag1: "US", winner: "Michael Shackleton", winnerID: 2435, flag2: "US", second: "Ackbleh" },
  { season: "2019-A", players: 72, flag1: "LI", winner: "Janusz Szulc", winnerID: 2079, flag2: "US", second: "Michael Shackleton", secondID: 2435, flag3: "US", third: "Siddhartha" },
  { season: "2019-B", players: 88, flag1: "LI", winner: "Janusz Szulc", winnerID: 2079, flag2: "US", second: "Michael Shackleton", secondID: 2435, flag3: "US", third: "Patrick Coate", thirdID: 2523 },
  { season: "2020-A", players: 88, flag1: "LI", winner: "Janusz Szulc", winnerID: 2079, flag2: "US", second: "Michael Shackleton", secondID: 2435, flag3: "PL", third: "Ziemowit Pazderski", thirdID: 2878 },
  { season: "2020-B", players: 46, flag1: "CA", winner: "Mathieu Latendresse", winnerID: 2395, flag2: "CA", second: "Félix Lapan", secondID: 1913, flag3: "US", third: "David DiCarlo", thirdID: 1815 },
  { season: "2021-A", players: 110, flag1: "KR", winner: "Youngbae Park", winnerID: 2853, flag2: "US", second: "Michael Shackleton", secondID: 2435, flag3: "PE", third: "Cesar Peña", thirdID: 1725 },
  { season: "2021-B", link: "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQMZY1sPbX_uFyxPJS9ugmwBuddDnmBhCTEhzAF-tlM0kSl0sqP7HjvgNthM1vsKwGKJWii5VLGFWXJ/pubhtml", players: 121, flag1: "CZ", winner: "Tomas Tvaroh", winnerID: 2780, flag2: "US", second: "Michael Shackleton", secondID: 2435, flag3: "NZ", third: "Ken C", thirdID: 2263 },
  { season: "2022-A", link: "https://docs.google.com/spreadsheets/d/1FOASZjMVlwkLVu0NtfvbTeQig56TnhZWD9LzvtC8hr4", players: 121, flag1: "PL", winner: "Ziemowit Pazderski", winnerID: 2878, flag2: "CA", second: "Félix Lapan", secondID: 1913, flag3: "US", third: "Michael Shackleton", thirdID: 2435 },
  { season: "2022-B", link: "https://docs.google.com/spreadsheets/d/13H85QOIGpZMe0rwrubOrk-dLXtpsrgNEJbhXcUJ9iBE", players: 78, flag1: "CN", winner: "Sheng Wei Qin", winnerID: 2688, flag2: "CZ", second: "Tomas Tvaroh", secondID: 2780, flag3: "US", third: "Michael Shackleton", thirdID: 2435 },
  { season: "2023-A", link: "https://docs.google.com/spreadsheets/d/1JlrVkBSWfHe82xhHLl5ot2q0jYtGv-MMW18sW1rkiZs", players: 84, flag1: "PL", winner: "Ziemowit Pazderski", winnerID: 2878, flag2: "US", second: "Michael Stryker", secondID: 2438, flag3: "HK", third: "Tin Sum Cheng", thirdID: 2769 },
  { season: "2023-B", link: "https://docs.google.com/spreadsheets/d/1Lu2UvdK_ZxxjnAXZj3XyrIp2U-lz4TMO_y18Hwkoljk", players: 90, flag1: "ES", winner: "Jarib Flores", winnerID: 2084, flag2: "KR", second: "B H Ju", secondID: 1652, flag3: "US", third: "Michael Stryker", thirdID: 2438 },
  { season: "2024-A", link: "https://docs.google.com/spreadsheets/d/10xuhjVHEU3l6I2Vbf3q8LqgsFpb0T0jyHpHKXZOh3bc", players: 89, flag1: "ES", winner: "Jarib Flores", winnerID: 2084, flag2: "CN", second: "Patrick Gong", secondID: 2525, flag3: "US", third: "Michael Stryker", thirdID: 2438 },
  { season: "2024-B", link: "https://docs.google.com/spreadsheets/d/1fYoRB5Oujb-K0Dl0Kl92uhrLN5-PrftlPyCaaRgfRY0", players: 99, flag1: "PL", winner: "Bartosz Wróbel", winnerID: 1658, flag2: "PL", second: "Ziemowit Pazderski", secondID: 2878, flag3: "CN", third: "Patrick Gong", thirdID: 2525 },
  { season: "2025", link: "https://docs.google.com/spreadsheets/d/1HCvjrfka5zP8EAGgzAgskIKpXxEgfqpYYiSpu7Z4UAc", players: 91, flag1: "PL", winner: "Ziemowit Pazderski", winnerID: 2878, flag2: "US", second: "Justin Abramson", secondID: 2232 },
];

export default function HallOfFamePage() {
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
              <PlayerCell flag={s.flag1} name={s.winner} id={s.winnerID} />
            </td>
            <td data-label="Second">
              <PlayerCell flag={s.flag2} name={s.second} id={s.secondID} />
            </td>
            <td data-label="Third">
              <PlayerCell flag={s.flag3} name={s.third} id={s.thirdID} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <PageContainer>
      <Header>
        <Title>Hall of Fame</Title>
      </Header>
      <p>The ITSL, OTSL, and RTSL are the largest, oldest, and arguably most prestiguous Twilight Struggle leagues.<br/>Placing in the top three of one of these leagues puts players amongst the best in the world.</p>
      <Subtitle>International Twilight Struggle League (ITSL)</Subtitle>
      <TableContainer>{renderTable(itslData)}</TableContainer>

      <Subtitle>Online Twilight Struggle League (OTSL)</Subtitle>
      <TableContainer>{renderTable(otslData)}</TableContainer>

      <Subtitle>Royale Twilight Struggle League (RTSL)</Subtitle>
      <TableContainer>{renderTable(rtslData)}</TableContainer>
    </PageContainer>
  );
}