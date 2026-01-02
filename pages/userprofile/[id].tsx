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
import { useParams } from "next/navigation";
import ProtectedRoute from "components/ProtectedRoute";
import { userRoles } from "utils/constants";
import { ProfileContainer, RecentGamesContainer, ProfileHeading } from "../../styles/userprofile.styles";
import { Pagination } from "components/Pagination";
import React, {useState} from "react";

const PAGE_SIZE = 10;

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
    <ProfileHeading>
      {`${data?.first_name} ${data?.last_name}`}
    </ProfileHeading>

    <DisplayInfo label="Federation" infoText={data?.countries?.country_name || "-"} />
    <DisplayInfo label="Playdek" infoText={data?.playdek_name || "-"} />
    <DisplayInfo label="Location" infoText={data?.cities?.name || "-"} />
    <DisplayInfo label="Preferred Platform" infoText={data?.preferred_gaming_platform || "-"} />
    <DisplayInfo label="Email" infoText={data?.email} />

    <DisplayInfo label="Rating" infoText={data?.rating?.toString() || "-"} />
    <DisplayInfo label="Regional Federation" infoText="-" />
    <DisplayInfo
      label="Last Activity"
      infoText={data.last_login_at ? dateFormat(new Date(data.last_login_at)) : "-"}
    />
    <DisplayInfo label="Preferred Duration" infoText={data?.preferred_game_duration || "-"} />
  </>
);

const UserProfile = () => {
  const params = useParams();
  const id = params?.id as string;

  const [currentPage, setCurrentPage] = useState(1);
  const { data: userData, isLoading: userLoading, error: userError } = useUserById(id);
  const { data: gamesData, isLoading: gamesLoading, error: gamesError } = useGamesByUsers([id], currentPage, PAGE_SIZE);

  const totalPages = gamesData ? Math.ceil(gamesData.totalRows / PAGE_SIZE) : 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (userError) {
    return (
      <DetailContainer>
        <ProfileContainer>
          <div>Error Loading User Profile</div>
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
            <div>Error Loading Recent Games</div>
          ) : gamesLoading || !gamesData ? (
            <Spinner size="3" />
          ) : (
            <>
              <ResultsPanel
                data={gamesData.results.map(convertServiceGameToComponentGame)}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </RecentGamesContainer>
      </DetailContainer>
    </>
  );
};

// Wrap with ProtectedRoute - requires logged in user
const UserProfilePage = () => (
  <ProtectedRoute requiredRole={userRoles.PLAYER}>
    <UserProfile />
  </ProtectedRoute>
);

export default UserProfilePage;