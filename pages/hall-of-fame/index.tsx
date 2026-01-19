import React, { useEffect } from "react";
import { FlagIcon } from "components/FlagIcon";
import { useHallOfFame } from "hooks/useHallOfFame";
import { Spinner } from "@radix-ui/themes";
import { 
  PageContainer,
  Title,
  Lead,
  Section,
  SectionTitle,
  SectionSubtitle,
  RegionalBlock,
  RegionalTitle,
  StyledLink,
  Card,
  TableScroll,
  Table,
  Thead,
  Th,
  Td,
  Center,
  PlayerInfo,
  PlayerName,
  Medal,
  ErrorBox
 } from "styles/hallOfFame.styled";

type Place = 1 | 2 | 3;

const medalForPlace: Record<Place, { icon: string; label: string }> = {
  1: { icon: "🥇", label: "Winner" },
  2: { icon: "🥈", label: "Second place" },
  3: { icon: "🥉", label: "Third place" },
};

 type PlayerCellProps = {
  flag?: string;
  name: string;
  id?: number;
  place: Place;
};

const PlayerCell = ({ flag, name, id, place }: PlayerCellProps) => {
  if (!name) return null;
  
  const medal = medalForPlace[place];

  return (
    <PlayerInfo $winner={place === 1}>
      <Medal aria-label={medal.label} title={medal.label}>
        {medal.icon}
      </Medal>
      {flag && <FlagIcon code={flag} />}
      {id ? (
        <StyledLink href={`/userprofile/${id}`}>
          <PlayerName>{name}</PlayerName>
        </StyledLink>
      ) : (
        <PlayerName>{name}</PlayerName>
      )}
    </PlayerInfo>
  );
};

export default function HallOfFamePage() {
  const { data: hallOfFameData, isLoading, error } = useHallOfFame();

  useEffect(() => {
    if (hallOfFameData) console.log("Hall of Fame API Response:", hallOfFameData);
    if (error) console.log("Hall of Fame API Error:", error);
  }, [hallOfFameData, error]);

  const renderTable = (data: any[]) => (
    <Card>
      <TableScroll>
        <Table>
          <Thead>
            <tr>
              <Th>Season</Th>
              <Th>Players</Th>
              <Th>Winner</Th>
              <Th>Second</Th>
              <Th>Third</Th>
            </tr>
          </Thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.season}>
                <Td data-label="Season">
                  {s.link ? <StyledLink href={s.link}>{s.season}</StyledLink> : s.season}
                </Td>
                <Td data-label="Players">{s.players}</Td>
                <Td data-label="Winner">
                  <PlayerCell flag={s.flag1} name={s.winner?.name} id={s.winnerID} place={1} />
                </Td>
                <Td data-label="Second">
                  <PlayerCell flag={s.flag2} name={s.second?.name} id={s.secondID} place={2} />
                </Td>
                <Td data-label="Third">
                  <PlayerCell flag={s.flag3} name={s.third?.name} id={s.thirdID} place={3} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableScroll>
    </Card>
  );

  if (isLoading)
    return (
      <Center>
        <Spinner size="3" />
      </Center>
    );

  if (error || !hallOfFameData) return <ErrorBox>Error Loading Hall of Fame</ErrorBox>;

  return (
    <PageContainer>
      <Title>Hall of Fame</Title>
      

      <Lead>
        The ITSL, OTSL, and RTSL are the largest, oldest, and arguably most prestigious Twilight Struggle leagues.
        Placing in the top three of one of these leagues puts players amongst the best in the world.
      </Lead>

      <Section>
        <SectionTitle>International Twilight Struggle League (ITSL)</SectionTitle>
        {renderTable(hallOfFameData.itsl)}
      </Section>

      <Section>
        <SectionTitle>Online Twilight Struggle League (OTSL)</SectionTitle>
        {renderTable(hallOfFameData.otsl)}
      </Section>

      <Section>
        <SectionTitle>Royale Twilight Struggle League (RTSL)</SectionTitle>
        {renderTable(hallOfFameData.rtsl)}
      </Section>

      <Section>
        <SectionTitle>Champions League</SectionTitle>
        <SectionSubtitle>
          The Champions League is an invite-only tournament inspired by UEFA, featuring winners of regional tournaments
          as well as the ITSL, OTSL, and RTSL.
        </SectionSubtitle>
        {renderTable(hallOfFameData.cl)}
      </Section>

      <Section>
        <SectionTitle>World Cup</SectionTitle>
        <SectionSubtitle>
          The World Cup is a weekend tournament featuring an 8-game Swiss format.
        </SectionSubtitle>
        {renderTable(hallOfFameData.world)}
      </Section>

      <Section>
        <SectionTitle>The King's Cup</SectionTitle>
        <SectionSubtitle>
          The King's Cup is a 2-day-long, Swiss tournament. There are four matches each day with the new regal of the TS community crowned 
          at the end of day two. All peasants are welcome to compete for a chance to ascend the throne!
        </SectionSubtitle>
        {renderTable(hallOfFameData.king)}
      </Section>

      <Section>
        <SectionTitle>Grand Slam Series</SectionTitle>
        <SectionSubtitle>
          The Grand Slam is a yearly series of shorter, one-day tournaments held in different time zones.
        </SectionSubtitle>
        {renderTable(hallOfFameData.grand)}
      </Section>

      <Section>
        <SectionTitle>Evergreen Cup</SectionTitle>
        <SectionSubtitle>
          The Evergreen Cup is a single-elimination tournament with a 10-day timer to complete every round.
        </SectionSubtitle>
        {renderTable(hallOfFameData.evergreen)}
      </Section>

      <Section>
        <SectionTitle>Convention</SectionTitle>
        <SectionSubtitle>
          Generally held in Europe, the Twilight Struggle Convention is the largest in-person Twilight Struggle tournament.
        </SectionSubtitle>
        {renderTable(hallOfFameData.convention)}
      </Section>

      <Section>
        <SectionTitle>Mind Sports Olympiad (MSO)</SectionTitle>
        <SectionSubtitle>
          The <a href="https://mindsportsolympiad.com/" target="_blank" rel="noreferrer">Mind Sports Olympiad</a> is an international event with over 100 different competitions that has occasionally featured Twilight Struggle.
        </SectionSubtitle>
        {renderTable(hallOfFameData.mso)}
      </Section>

      <Section>
        <SectionTitle>Asynchronous Leagues (RATS)</SectionTitle>
        <SectionSubtitle>
          Not everyone has the ability to play live Twilight Struggle games so there are a variety of asynchronous
          leagues all under the RATS banner to cater to asynchronous players.
        </SectionSubtitle>
        {renderTable(hallOfFameData.rats)}
      </Section>

      <Section>
        <SectionTitle>Regional Leagues</SectionTitle>
        <SectionSubtitle>
          Regional leagues are generally restricted to players who have a connection to a certain region. You can reach
          out to the organizers of a regional league you are interested in from our{" "}
          <StyledLink href="/about">About Page</StyledLink>.
        </SectionSubtitle>

        <RegionalBlock>
          <RegionalTitle>Atlantic (US) League</RegionalTitle>
          {renderTable(hallOfFameData.atlantic)}
          <RegionalTitle>Basque League</RegionalTitle>
          {renderTable(hallOfFameData.basque)}
          <RegionalTitle>Belgium League</RegionalTitle>
          {renderTable(hallOfFameData.belgium)}
          <RegionalTitle>Canadian League</RegionalTitle>
          {renderTable(hallOfFameData.canadian)}
          <RegionalTitle>Catalan League</RegionalTitle>
          {renderTable(hallOfFameData.catalan)}
          <RegionalTitle>Chinese League</RegionalTitle>
          {renderTable(hallOfFameData.chinese)}
          <RegionalTitle>Dutch League</RegionalTitle>
          {renderTable(hallOfFameData.dutch)}
          <RegionalTitle>East European League</RegionalTitle>
          {renderTable(hallOfFameData.eeu)}
          <RegionalTitle>French League</RegionalTitle>
          {renderTable(hallOfFameData.french)}
          <RegionalTitle>Greek League</RegionalTitle>
          {renderTable(hallOfFameData.greek)}
          <RegionalTitle>Hong Kong League</RegionalTitle>
          {renderTable(hallOfFameData.hongKong)}
          <RegionalTitle>Israeli League</RegionalTitle>
          {renderTable(hallOfFameData.israel)}
          <RegionalTitle>Italian League</RegionalTitle>
          {renderTable(hallOfFameData.italian)}
          <RegionalTitle>Korean League (KTSL)</RegionalTitle>
          {renderTable(hallOfFameData.korean)}
          <RegionalTitle>Midwest (US) League</RegionalTitle>
          {renderTable(hallOfFameData.midwest)}
          <RegionalTitle>Nordic League</RegionalTitle>
          {renderTable(hallOfFameData.nordic)}
          <RegionalTitle>Polish League</RegionalTitle>
          {renderTable(hallOfFameData.polish)}
          <RegionalTitle>Portuguese League</RegionalTitle>
          {renderTable(hallOfFameData.portuguese)}
          <RegionalTitle>Southern (US) League</RegionalTitle>
          {renderTable(hallOfFameData.southern)}
          <RegionalTitle>Spanish Liga de Federaciones de Twilight Struggle (LFTS)</RegionalTitle>
          {renderTable(hallOfFameData.spanish)}
          <RegionalTitle>UK League</RegionalTitle>
          {renderTable(hallOfFameData.uk)}
          <RegionalTitle>Western (US) League</RegionalTitle>
          {renderTable(hallOfFameData.western)}
        </RegionalBlock>
      </Section>
    </PageContainer>
  );
}
