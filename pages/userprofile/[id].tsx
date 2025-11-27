import { DisplayInfo } from "components/DisplayInfo";
import { DetailContainer } from "components/DetailContainer";
import { Spinner } from "@radix-ui/themes";
import { useUserById } from "hooks/useUsers";
import { useGamesByUsers } from "hooks/useGames";
import { dateFormat } from "utils/dates";
import { ResultsPanel } from "components/Homepage/Homepage";
import { UserDetail } from "services/users.service";
import { Game as ServiceGame } from "services/games.service";
import { Game as ComponentGame, GameWinner } from "types/game.types";
import styled from "styled-components";
import { useParams } from "next/navigation";

// Convert service Game type to component Game type
const convertServiceGameToComponentGame = (serviceGame: ServiceGame): ComponentGame => ({
  ...serviceGame,
  id: BigInt(serviceGame.id),
  usaPlayerId: BigInt(serviceGame.usaPlayerId),
  ussrPlayerId: BigInt(serviceGame.ussrPlayerId),
  reporter_id: serviceGame.reporter_id ? BigInt(serviceGame.reporter_id) : null,
  gameWinner: serviceGame.gameWinner as GameWinner,
  created_at: serviceGame.created_at ? new Date(serviceGame.created_at) : null,
  updated_at: serviceGame.updated_at ? new Date(serviceGame.updated_at) : null,
  reported_at: new Date(serviceGame.reported_at),
  gameDate: new Date(serviceGame.gameDate),
});

const UserProfileContent: React.FC<UserDetail> = (data) => (
  <>
    <DisplayInfo label="Player's name" infoText={`${data?.first_name} ${data?.last_name}`} />
    <DisplayInfo label="Federation" infoText={data?.countries?.country_name || "-"} />
    <DisplayInfo label="Playdek" infoText={data?.name} />
    <DisplayInfo label="Location" infoText={data?.cities?.name || "-"} />
    <DisplayInfo label="Preferred gaming platform" infoText={data?.preferred_gaming_platform || "-"} />
    <DisplayInfo label="Email" infoText={data?.email} />

    <DisplayInfo label="Rating" infoText={data?.rating?.toString() || "-"} />
    <DisplayInfo label="Regional federation" infoText="-" />
    <DisplayInfo
      label="Last activity date"
      infoText={data.last_login_at ? dateFormat(new Date(data.last_login_at)) : "-"}
    />
    <DisplayInfo label="Preferred game duration" infoText={data?.preferred_game_duration || "-"} />
  </>
);



// Styled components for the profile layout
const ProfileContainer = styled.div`
  display: grid;
  gap: 0.25rem;
  max-width: 48rem;
  height: ${props => props.userLoading ? "250px" : "auto"};
  grid-template-columns: 1fr 2fr;
  background-color: white;
  padding: 24px 0 24px 24px;
  align-items: left;
  border: solid 1px lightgray;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 100%;
`;

const RecentGamesContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: 0;
  margin: 32px 0 0 0;
  flex-direction: column;
`;

const UserProfile = () => {
  const params = useParams();
  const id = params?.id as string;

  // Use NestJS endpoints with React Query
  const { data: userData, isLoading: userLoading, error: userError } = useUserById(id);
  const { data: gamesData, isLoading: gamesLoading, error: gamesError } = useGamesByUsers([id], 1, 10);

  // Handle errors
  if (userError) {
    return (
      <DetailContainer>
        <ProfileContainer style={{ height: "250px" }}>
          <div>Error loading user profile</div>
        </ProfileContainer>
      </DetailContainer>
    );
  }

  return (
    <>
      <DetailContainer>
        <ProfileContainer userLoading={userLoading}>
          {userLoading || !userData ? <Spinner size="3" /> : <UserProfileContent {...userData} />}
        </ProfileContainer>
      </DetailContainer>
      <DetailContainer backButton={false}>
        <RecentGamesContainer>
          Recent Games
          {gamesError ? (
            <div>Error loading recent games</div>
          ) : gamesLoading || !gamesData ? (
            <Spinner size="3" />
          ) : (
            <ResultsPanel data={gamesData.results.map(convertServiceGameToComponentGame)} />
          )}
        </RecentGamesContainer>
      </DetailContainer>
    </>
  );
};

export default UserProfile;


