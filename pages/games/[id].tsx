import { useState } from "react";
import type { GetServerSideProps } from "next";
import type { GameType } from "services/games.service";
import type { GameWinner } from "types/game.types";
import { Span, Flex } from "components/Atoms";
import { FlagIcon } from "components/FlagIcon";
import Link from "next/link";
import { DetailContainer } from "components/DetailContainer";
import { MainLayout } from "components/Layout";
import Text from "components/Text";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import styled from "styled-components";
import { Spinner } from "@radix-ui/themes";
import { getWinnerText, getTurnText } from "utils/games";
import { useGames } from "hooks/useGames";
import { dateFormat } from "utils/dates";
import { Button } from "components/Button";
import { UnstyledLink } from "components/Homepage/Homepage.styled";
import getAxiosInstance from "utils/axios";
import { useSession } from "contexts/AuthProvider";
import { userRoles } from "utils/constants";
import countryFlags from "public/country_flags.json";
import LabelCopy from "components/LabelCopy/LabelCopy";

const spanStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  '@media (max-width: 600px)': {
    maxWidth: '130px',
  },
}

interface StyledLinkProps {
  borderBottom?: "usa" | "ussr";
}

const StyledLink = styled(Link)<StyledLinkProps>`
  text-decoration: none;
  color: Black;

  ${props => props.borderBottom === "usa" && `
    border-bottom: 2px solid blue;
  `}

  ${props => props.borderBottom === "ussr" && `
    border-bottom: 2px solid red;
  `}
`;

interface ChevronIconProps {
  color?: "red" | "green";
}

const StyledChevronDownIcon = styled(ChevronDownIcon)<ChevronIconProps>`
  position: absolute;
  color: ${props => props.color || "black"};
`;

const StyledChevronUpIcon = styled(ChevronUpIcon)<ChevronIconProps>`
  position: absolute;
  color: ${props => props.color || "black"};
`;
type PlayerNameProps = {
  playerName: string;
  userId: string;
  rating: number;
  previousRating: number;
  countryCode: string;
  isUSSR?: boolean;
};

interface CountryFlags {
  [countryCode: string]: string;
}

type GameProps = {
  gameId: string;
};

type GameContentProps = {
  data: GameType;
};

const GameContent: React.FC<GameContentProps> = ({ data }) => {
  const { role } = useSession();
  const {
    id,
    gameDate,
    gameWinner,
    game_code,
    tournamentId,
    tournamentName,
    endTurn,
    endMode,
    usaPlayerId,
    ussrPlayerId,
  } = data;
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState(false);
  const linkToRecreate = `/recreateform?id=${id}&gameDate=${gameDate}&endMode=${endMode}&usaPlayerId=${usaPlayerId}&ussrPlayerId=${ussrPlayerId}&gameWinner=${gameWinner}&gameCode=${game_code}&tournamentId=${tournamentId}&endTurn=${endTurn}&video1=${data.video1 || ""}`;

  const deleteGame = async () => {
    getAxiosInstance().post(``);
    const response = await getAxiosInstance().post(
      "/api/game/recreate",
      {
        data: { oldId: id, op: "delete" },
      },
      {
        cache: {
          update: {
            "game-list": "delete",
          },
        },
      },
    );

    if (response.data) {
      setDeleteSuccessMessage(true);
    }
  };

  const generateText = () => {
    let winnerName = "";
    let loserName = "";

    const flags: CountryFlags = countryFlags;
    const endTurn = data.endTurn === 11 ? "Final Scoring" : `Turn ${data.endTurn}`;
    if (data.gameWinner === "3") {
      return `${data.tournamentName}: ${data.game_code} - ${data.usaPlayer} ${flags[data.usaCountryCode?.toLowerCase()]} (USA) tied with ${data.ussrPlayer} ${flags[data.ussrCountryCode?.toLowerCase()]} in ${endTurn} (${endMode})`;
    }

    if (data.gameWinner === "1") {
      winnerName = data.usaPlayer + " " + flags[data.usaCountryCode?.toLowerCase()];
      loserName = data.ussrPlayer + " " + flags[data.ussrCountryCode?.toLowerCase()];
    } else if (data.gameWinner === "2") {
      winnerName = data.ussrPlayer + " " + flags[data.ussrCountryCode?.toLowerCase()];
      loserName = data.usaPlayer + " " + flags[data.usaCountryCode?.toLowerCase()];
    }

    return `${data.tournamentName}: ${data.game_code} - ${winnerName} (${getWinnerText(data.gameWinner as GameWinner)}) has defeated ${loserName} in ${endTurn} (${endMode})`;
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "16px", marginBottom: "12px" }}>
        <PlayerName
          playerName={data.usaPlayer}
          userId={data.usaPlayerId}
          rating={data.ratingsUSA.rating}
          previousRating={data.ratingsUSA.previousRating}
          countryCode={data.usaCountryCode}
        />
        vs
        <PlayerName
          playerName={data.ussrPlayer}
          userId={data.ussrPlayerId}
          rating={data.ratingsUSSR.rating}
          previousRating={data.ratingsUSSR.previousRating}
          countryCode={data.ussrCountryCode}
          isUSSR
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "8px" }}>
        <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "5fr 0.1fr 5fr" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
            <Span>Tournament:</Span>
            <Span>Identifier:</Span>
            <Span>Won by:</Span>
            <Span>End turn:</Span>
            <Span>Via:</Span>
            <Span>Date:</Span>
            {data.videoURL && <Span>Video:</Span>}
          </div>
          <div style={{ width: "5px" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            <Span style={spanStyle}>{data.tournamentName}</Span>
            <Span>{data.game_code}</Span>
            <Span>{getWinnerText(data.gameWinner as GameWinner)}</Span>
            <Span>{getTurnText(data.endTurn)}</Span>
            <Span>{endMode}</Span>
            <Span>{data.created_at ? dateFormat(new Date(data.created_at)) : null}</Span>
            {data.videoURL && (
              <a target="_blank" href={data.videoURL} rel="noopener noreferrer">
                Link to video
              </a>
            )}
          </div>
        </div>
      </div>
      {role === userRoles.SUPERADMIN && (
        <>
          <Flex>
            <Button style={{ width: "150px", margin: "8px" }}>
              <UnstyledLink href={linkToRecreate} target="_blank">
                Recreate game
              </UnstyledLink>
            </Button>
            <Button style={{ width: "150px", margin: "8px" }} onClick={deleteGame}>
              Delete this game
            </Button>
          </Flex>
          {deleteSuccessMessage && <div>Game deleted successfully</div>}
        </>
      )}
      {(role === userRoles.SUPERADMIN || role === userRoles.ADMIN) && (
        <div style={{ padding: "12px", border: "solid 1px black" }}>
          <LabelCopy text={generateText()} />
        </div>
      )}
    </>
  );
};

const GameContainer = styled.div<{ isLoading: boolean }>`
  display: flex;
  width: 100%;
  max-width: 48rem;
  flex-direction: column;
  background-color: white;
  padding: 24px 0 0 0;
  align-items: center;
  justify-content: ${props => props.isLoading ? "center" : "flex-start"};
  height: ${props => props.isLoading ? "250px" : "auto"};
  border: solid 1px lightgray;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const Game: React.FC<GameProps> = ({ gameId }) => {
  // Use the games endpoint with ID filter to get full game details including ratings and player info
  const { data, isLoading, error } = useGames({ id: gameId });
console.log("data", data)
  if (error) {
    return (
      <MainLayout>
        <DetailContainer>
          <GameContainer isLoading={false}>
            <div>Error loading game details</div>
          </GameContainer>
        </DetailContainer>
      </MainLayout>
    );
  }

  if (!data && !isLoading) {
    return (
      <MainLayout>
        <DetailContainer>
          <GameContainer isLoading={false}>
            <div>Game not found</div>
          </GameContainer>
        </DetailContainer>
      </MainLayout>
    );
  }

  if (data && data.results && data.results.length === 0) {
    return (
      <MainLayout>
        <DetailContainer>
          <GameContainer isLoading={false}>
            <div>Game not found</div>
          </GameContainer>
        </DetailContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DetailContainer>
        <GameContainer isLoading={isLoading}>
          {isLoading ? <Spinner size="3" /> : data && data.results && data.results[0] && <GameContent data={data.results[0]} />}
        </GameContainer>
      </DetailContainer>
    </MainLayout>
  );
};

const ChevronContainer = ({
  rating,
  previousRating,
}: {
  rating: number;
  previousRating: number;
}) =>
  rating > previousRating ? (
    <StyledChevronUpIcon color="green" />
  ) : (
    <StyledChevronDownIcon color="red" />
  );

const Rating = ({
  rating,
  previousRating,
  isUSSR,
}: {
  rating: number;
  previousRating: number;
  isUSSR?: Boolean;
}) => {
  return !isUSSR ? (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", margin: "0 8px 0 8px"}}>
      <Text fontSize="small">{previousRating}</Text>
      <div style={{ position: "relative", marginLeft: "4px", width: "15px"  }}>
        <ChevronContainer rating={Number(rating)} previousRating={previousRating} />
      </div>
      <Text fontSize="small">{rating}</Text>
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: "row", margin: "0 8px 0 8px"}}>
      <Text fontSize="small">{rating}</Text>
      <div style={{ position: "relative", marginRight: "4px", width: "15px" }}>
        <ChevronContainer rating={Number(rating)} previousRating={previousRating} />
      </div>
      <Text fontSize="small">{previousRating}</Text>
    </div>
  );
};

const PlayerName: React.FC<PlayerNameProps> = ({
  playerName,
  userId,
  rating,
  previousRating,
  countryCode,
  isUSSR,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "row", margin: "0 8px 0 8px", alignItems: "flex-end" }}>
        {!isUSSR ? (
          <>
            <StyledLink borderBottom="usa" href={`/userprofile/${userId}`}>
              {playerName}
            </StyledLink>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FlagIcon code={countryCode} />
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FlagIcon code={countryCode} />
            </div>
            <StyledLink borderBottom="ussr" href={`/userprofile/${userId}`}>
              {playerName}
            </StyledLink>
          </>
        )}
      </div>
      <Rating rating={rating} previousRating={previousRating} isUSSR={isUSSR} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Fetch data for a single post
  // const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
  // const post = await res.json();

  // // Return 404 if post is not found
  // if (!post.id) {
  //   return {
  //     notFound: true,
  //   };
  // }

  // Pass post data to the page via props
  return { props: { gameId: params?.id } };
};

export default Game;
