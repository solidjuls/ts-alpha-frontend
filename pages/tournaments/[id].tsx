import { useState, useEffect } from "react";
import { Spinner } from "@radix-ui/themes";
import { Box, Flex } from "components/Atoms";
import { Button } from "components/Button";
import { DetailContainer } from "components/DetailContainer";
import { DisplayInfo } from "components/DisplayInfo";
import { StyledLabel } from "components/DisplayInfo/DisplayInfo.styles";
import useFetchInitialData from "hooks/useFetchInitialData";
import { useParams, useRouter } from "next/navigation";
import { TournamentsType } from "types/game.types";
import { getTournamentStatusNames, userRoles } from "utils/constants";
import { dateIntlFormatter } from "utils/dates";
import { useSession } from "contexts/AuthProvider";
import getAxiosInstance from "utils/axios";
import { getInfoFromCookies } from "utils/cookies";
import { ServerType } from "types/types";
import { styled } from "stitches.config";
import TournamentEditForm from "components/TournamentEditForm";
import TournamentPlayersList from "components/TournamentPlayersList";

const DescriptionBox = styled("div", {
  marginTop: "8px",
  padding: "12px",
  backgroundColor: "#f8f9fa",
  whiteSpace: 'pre-line',
  borderRadius: "6px",
  border: "1px solid #e9ecef"
});

const StatusText = styled("span", {
  fontWeight: "500",
  variants: {
    type: {
      registered: {
        color: "#16a34a",
      },
      default: {
        color: "#6b7280",
      },
      admin: {
        color: "#6b7280",
        fontWeight: "500",
      }
    }
  }
});

interface TournamentDetailProps {
  userRole?: number;
}

const RegisterButtons = ({ registrationStatus, onRegisterClick, isRegistering }) => {
  return <Box css={{
            padding: "20px 24px",
            borderTop: "1px solid #e9ecef",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Box>
              {registrationStatus === 'registered' && (
                <StatusText type="registered">
                  ✓ You are registered for this tournament
                </StatusText>
              )}
              {registrationStatus === 'not_registered' && (
                <StatusText type="default">
                  Click to register for this tournament
                </StatusText>
              )}
            </Box>

            <Button
              onClick={onRegisterClick}
              disabled={isRegistering}
              css={{
                backgroundColor: registrationStatus === 'registered' ? "#dc2626" : "#16a34a",
                "&:hover": {
                  backgroundColor: registrationStatus === 'registered' ? "#b91c1c" : "#15803d",
                }
              }}
            >
              {isRegistering ? (
                <Spinner size="1" />
              ) : registrationStatus === 'registered' ? (
                "Unregister"
              ) : (
                "Register"
              )}
            </Button>
          </Box>
}
const TournamentInfo = ({ tournament_name, statusName, adminName, starting_date, description }: TournamentsType) => {
  return <Box css={{
            display: "grid",
            gap: "0.25rem",
            maxWidth: "48rem",
            gridTemplateColumns: "1fr 2fr",
            padding: "24px 0 24px 24px",
            alignItems: "left",
            width: "100%",
          }}>
            <DisplayInfo label="Tournament Name" infoText={tournament_name || '-'} />
            <DisplayInfo label="Status" infoText={statusName} />
            <DisplayInfo label="Administrators" infoText={adminName} />
            <DisplayInfo label="Starting Date" infoText={starting_date} />

            {description && (
              <Flex css={{ flexDirection: "column", minWidth: "400px", gridColumn: "1 / -1" }}>
                <StyledLabel>Description</StyledLabel>
                <DescriptionBox>{description}</DescriptionBox>
              </Flex>
            )}
          </Box>
}
const TournamentDetail = ({ userRole }: TournamentDetailProps) => {
  const { id } = useParams();
  const router = useRouter();
  const { id: userId, email } = useSession();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'registered' | 'not_registered' | 'loading'>('not_registered');
  const [isEditing, setIsEditing] = useState(false);

  const URLparams = new URLSearchParams();
  if (userId) URLparams.append("u", userId);
  if (id) URLparams.append("id", id);

  const { data, isLoading, refetch } = useFetchInitialData<TournamentsType[]>({
    url: `/api/game/tournaments?${URLparams.toString()}`,
  });

  const tournament = data?.[0];

  // Check if user is registered for this tournament
  useEffect(() => {
    if (tournament && userId && email) {
      // Check if user is already registered by checking tournament registrations
      // This would typically be done by checking the user's registered tournaments
      // For now, we'll assume not registered - this should be implemented with proper API call
      setRegistrationStatus(tournament?.registered ? 'registered' : 'not_registered');
    }
  }, [tournament]);

  const isUserAdmin = userRole === userRoles.SUPERADMIN //||(tournament?.adminId && userId && tournament.adminId.includes(userId));
console.log("isUserAdmin", isUserAdmin);
  const onRegisterClick = async () => {
    if (!tournament || !userId || !email) return;

    setIsRegistering(true);
    try {
      if (registrationStatus === 'registered') {
        // Unregister logic
        await getAxiosInstance().delete(`/api/game/tournaments/registration`, {
          data: { tournamentId: tournament.id, userEmail: email }
        });
        setRegistrationStatus('not_registered');
      } else {
        // Register logic
        await getAxiosInstance().post('/api/game/tournaments', {
          id: tournament.id,
          userEmail: email
        });
        setRegistrationStatus('registered');
      }
      router.refresh()
    } catch (e) {
      console.error("Registration error:", e);
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) return <Spinner size="3" />;

  if (!tournament) {
    return (
      <DetailContainer>
        <Box css={{ textAlign: "center", padding: "40px" }}>
          Tournament not found
        </Box>
      </DetailContainer>
    );
  }

  const adminsFormatted = tournament?.adminName?.length > 0 ? tournament?.adminName.join(", ") : '-';
  const dateFormatted = tournament?.starting_date ? dateIntlFormatter(new Date(tournament.starting_date)) : '-';
  const statusName = getTournamentStatusNames(tournament?.status_id);

  // Admin Mode - Show tournament info with admin controls (to be implemented)
  return (
    <DetailContainer>
      <Box css={{
        border: "solid 1px lightgray",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
        backgroundColor: "white",
      }}>
        <TournamentInfo tournament_name={tournament.tournament_name} statusName={statusName} adminName={adminsFormatted} starting_date={dateFormatted} description={tournament.description} />
        {userId && tournament?.status_id === 4 && <RegisterButtons registrationStatus={registrationStatus} onRegisterClick={onRegisterClick} isRegistering={isRegistering} />}

        {isUserAdmin && (
          <Box css={{
          padding: "20px 24px",
          borderTop: "1px solid #e9ecef",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <StatusText type="admin">
            Admin Mode - Tournament Management
          </StatusText>

          <Flex css={{ gap: "12px" }}>
            <Button
              css={{ backgroundColor: "#3b82f6" }}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Edit" : "Edit Tournament"}
            </Button>
          </Flex>
        </Box>)}

      {/* Edit Form */}
      {isEditing && (
        <TournamentEditForm
          tournament={tournament}
          onSave={() => {
            setIsEditing(false);
            router.refresh()
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
      </Box>
      {/* Registered Players List */}
      <TournamentPlayersList
        tournamentId={tournament.id}
        onPlayerRemoved={() => refetch()}
        isUserAdmin={isUserAdmin}
      />
      
    </DetailContainer>
  );
};

// Add server-side props to determine user role
export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);

  // if (!payload) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };
  // }

  return {
    props: {
      userRole: payload?.role || null
    }
  };
}

export default TournamentDetail;

// RTSL 2025 👽👹🤖👻 is coming.
// 🗓 Season Dates: Jun 1 - Oct 31
// 🎲 Playoff Dates:  Nov 1 - 30
// 📝 Sign up now for 10 games in 5 months at your own schedule.
// 🤝 Compete against players near your level!

// Not registered yet?
// https://forms.gle/XqkxktFYiGfvzC3R6
