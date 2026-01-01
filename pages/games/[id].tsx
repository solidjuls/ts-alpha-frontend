import { useState } from "react";
import type { GetServerSideProps } from "next";
import type { GameType } from "services/games.service";
import type { GameWinner } from "types/game.types";
import { Span } from "components/Atoms";
import { FlagIcon } from "components/FlagIcon";
import Link from "next/link";
import { DetailContainer } from "components/DetailContainer";
import Text from "components/Text";
import { Spinner } from "@radix-ui/themes";
import { getWinnerText, getTurnText } from "utils/games";
import { useGames, useDeleteGame } from "hooks/useGames";
import { dateFormat } from "utils/dates";
import { useAuth } from "contexts/AuthProviderNew";
import { userRoles } from "utils/constants";
import countryFlags from "public/country_flags.json";
import LabelCopy from "components/LabelCopy/LabelCopy";
import { 
  GameContainer,
  PlayersHeader,
  PlayerNameBlock,
  PlayerRow,
  RatingRow,
  PlayerLink,
  MetaGrid,
  MetaWrapper,
  MetaLabelColumn,
  MetaValueColumn,
  ChevronWrapper,
  StyledChevronDownIcon,
  StyledChevronUpIcon,
  TruncatedSpan,
  UnstyledLink,
  AdminActions,
  AdminButton,
  LabelCopyBox,
  NumericText
 } from "../../styles/games.styles";

type GameProps = {
  gameId: string;
};

type GameContentProps = {
  data: GameType;
};

interface CountryFlags {
  [countryCode: string]: string;
}

type PlayerNameProps = {
  playerName: string;
  userId: string;
  rating: number;
  previousRating: number;
  countryCode: string;
  isUSSR?: boolean;
};


/* ============================
   Small Helpers
   ============================ */

const ChevronContainer = ({
  rating,
  previousRating,
}: {
  rating: number;
  previousRating: number;
}) =>
  rating > previousRating ? (
    <StyledChevronUpIcon $color="var(--usa)" />
  ) : (
    <StyledChevronDownIcon $color="var(--ussr)" />
  );

const Rating = ({
  rating,
  previousRating,
  isUSSR,
}: {
  rating: number;
  previousRating: number;
  isUSSR?: boolean;
}) => {
  return !isUSSR ? (
    <RatingRow>
      <NumericText>
        {previousRating}
      </NumericText>
      <ChevronWrapper>
        <ChevronContainer rating={Number(rating)} previousRating={previousRating} />
      </ChevronWrapper>
      <NumericText $newRating>
        {rating}
      </NumericText>
    </RatingRow>
  ) : (
    <RatingRow $isUSSR>
      <NumericText>
        {previousRating}
      </NumericText>
      <ChevronWrapper>
        <ChevronContainer rating={Number(rating)} previousRating={previousRating} />
      </ChevronWrapper>
      <NumericText $newRating>
        {rating}
      </NumericText>
    </RatingRow>
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
    <PlayerNameBlock>
      <PlayerRow>
        {!isUSSR ? (
          <>
            <PlayerLink $side="usa" href={`/userprofile/${userId}`}>
              {playerName}
            </PlayerLink>
            <FlagIcon code={countryCode} />
          </>
        ) : (
          <>
            <FlagIcon code={countryCode} />
            <PlayerLink $side="ussr" href={`/userprofile/${userId}`}>
              {playerName}
            </PlayerLink>
          </>
        )}
      </PlayerRow>
      <Rating rating={rating} previousRating={previousRating} isUSSR={isUSSR} />
    </PlayerNameBlock>
  );
};

/* ============================
   Main game content
   ============================ */

const GameContent: React.FC<GameContentProps> = ({ data }) => {
  const { user } = useAuth();
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

  const deleteGameMutation = useDeleteGame();

const deleteGame = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this game? This action cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteGameMutation.mutateAsync(id);
    setDeleteSuccessMessage(true);
  } catch (error) {
    console.error("Error Deleting Game:", error);
  }
};


  const generateText = () => {
    let winnerName = "";
    let loserName = "";

    const flags: CountryFlags = countryFlags as CountryFlags;
    const endTurnText =
      data.endTurn === 11 ? "Final Scoring" : `Turn ${data.endTurn}`;

    if (data.gameWinner === "3") {
      return `${data.tournamentName}: ${data.game_code} - ${data.usaPlayer} ${flags[data.usaCountryCode?.toLowerCase()]} (USA) tied with ${data.ussrPlayer} ${flags[data.ussrCountryCode?.toLowerCase()]} in ${endTurnText} (${endMode})`;
    }

    if (data.gameWinner === "1") {
      winnerName = `${data.usaPlayer} ${flags[data.usaCountryCode?.toLowerCase()]}`;
      loserName = `${data.ussrPlayer} ${flags[data.ussrCountryCode?.toLowerCase()]}`;
    } else if (data.gameWinner === "2") {
      winnerName = `${data.ussrPlayer} ${flags[data.ussrCountryCode?.toLowerCase()]}`;
      loserName = `${data.usaPlayer} ${flags[data.usaCountryCode?.toLowerCase()]}`;
    }

    return `${data.tournamentName}: ${data.game_code} - ${winnerName} (${getWinnerText(
      data.gameWinner as GameWinner
    )}) has defeated ${loserName} in ${endTurnText} (${endMode})`;
  };

  return (
    <>
      <PlayersHeader>
        <PlayerName
          playerName={data.usaPlayer}
          userId={data.usaPlayerId}
          rating={data.ratingsUSA.rating}
          previousRating={data.ratingsUSA.previousRating}
          countryCode={data.usaCountryCode}
        />
        <Text>vs</Text>
        <PlayerName
          playerName={data.ussrPlayer}
          userId={data.ussrPlayerId}
          rating={data.ratingsUSSR.rating}
          previousRating={data.ratingsUSSR.previousRating}
          countryCode={data.ussrCountryCode}
          isUSSR
        />
      </PlayersHeader>

      <MetaWrapper>
        <MetaGrid>
          <MetaLabelColumn>
            <Span>Tournament:</Span>
            <Span>Identifier:</Span>
            <Span>Won by:</Span>
            <Span>End turn:</Span>
            <Span>Via:</Span>
            <Span>Date:</Span>
            {data.videoURL && <Span>Video:</Span>}
          </MetaLabelColumn>

          <div />

          <MetaValueColumn>
            <TruncatedSpan>{tournamentName}</TruncatedSpan>
            <Span>{data.game_code}</Span>
            <Span>{getWinnerText(data.gameWinner as GameWinner)}</Span>
            <Span>{getTurnText(data.endTurn)}</Span>
            <Span>{endMode}</Span>
            <Span>
              {data.created_at ? dateFormat(new Date(data.created_at)) : null}
            </Span>
            {data.videoURL && (
              <Link
                target="_blank"
                href={data.videoURL}
                rel="noopener"
              >
                Link to Video
              </Link>
            )}
          </MetaValueColumn>
        </MetaGrid>
      </MetaWrapper>

      {user?.role === userRoles.SUPERADMIN && (
        <>
          <AdminActions>
            <AdminButton>
              <UnstyledLink href={linkToRecreate} target="_blank">
                Recreate Game
              </UnstyledLink>
            </AdminButton>
            <AdminButton
              onClick={deleteGame}
              disabled={deleteGameMutation.isPending}
            >
              {deleteGameMutation.isPending ? (
                <Spinner size="2" />
              ) : (
                "Delete Game"
              )}
            </AdminButton>
          </AdminActions>
          {deleteSuccessMessage && <div>Game Deleted Successfully</div>}
        </>
      )}

      {(user?.role === userRoles.SUPERADMIN ||
        user?.role === userRoles.ADMIN) && (
        <LabelCopyBox>
          <LabelCopy text={generateText()} />
        </LabelCopyBox>
      )}
    </>
  );
};

/* ============================
   Page wrapper
   ============================ */

const Game: React.FC<GameProps> = ({ gameId }) => {
  const { data, isLoading, error } = useGames({ id: gameId });

  if (error) {
    return (
      <DetailContainer>
        <GameContainer $isLoading={false}>
          <div>Error Loading Game Details</div>
        </GameContainer>
      </DetailContainer>
    );
  }

  if (!data && !isLoading) {
    return (
      <DetailContainer>
        <GameContainer $isLoading={false}>
          <div>Game Not Found</div>
        </GameContainer>
      </DetailContainer>
    );
  }

  if (data && data.results && data.results.length === 0) {
    return (
      <DetailContainer>
        <GameContainer $isLoading={false}>
          <div>Game Not Found</div>
        </GameContainer>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <GameContainer $isLoading={isLoading}>
        {isLoading ? (
          <Spinner size="3" />
        ) : (
          data &&
          data.results &&
          data.results[0] && <GameContent data={data.results[0]} />
        )}
      </GameContainer>
    </DetailContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return { props: { gameId: params?.id } };
};

export default Game;
