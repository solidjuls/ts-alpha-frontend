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

const ManualRegistrationInput = styled("input", {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  width: "250px",
  "&:focus": {
    outline: "none",
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
  }
});

const ManualRegistrationBox = styled("div", {
  padding: "20px 24px",
  borderTop: "1px solid #e9ecef",
  backgroundColor: "#f8f9fa",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
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
              <Flex css={{ flexDirection: "column", gridColumn: "1 / -1" }}>
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
  const [manualRegistrationEmail, setManualRegistrationEmail] = useState("");
  const [isManualRegistering, setIsManualRegistering] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);

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

  const onRegisterClick = async () => {
    if (!tournament || !userId || !email) {
      router.push("/login");
      return;
    }

    setIsRegistering(true);
    try {
      if (registrationStatus === 'registered') {
        await getAxiosInstance().delete(`/api/game/tournaments/registration`, {
          data: { tournamentId: tournament.id, userEmail: email }
        });
        setRegistrationStatus('not_registered');
      } else {
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

  const onManualRegisterClick = async () => {
    if (!tournament || !manualRegistrationEmail.trim()) {
      return;
    }

    setIsManualRegistering(true);
    try {
      await getAxiosInstance().post('/api/game/tournaments', {
        id: tournament.id,
        userEmail: manualRegistrationEmail.trim()
      });
      setManualRegistrationEmail("");
      alert(`Successfully registered ${manualRegistrationEmail} for the tournament!`);
      router.refresh()
    } catch (e) {
      console.error("Manual registration error:", e);
      alert(`Failed to register ${manualRegistrationEmail}. Please check if the email is valid and the user exists.`);
    } finally {
      setIsManualRegistering(false);
    }
  };

  const onExportCSV = async () => {
    if (!tournament) {
      return;
    }

    setIsExportingCSV(true);
    try {
      // Fetch registered players with detailed information
      const response = await getAxiosInstance().get(`/api/game/tournaments?id=${tournament.id}&players=true`);
      const registeredPlayers = response.data || [];

      if (registeredPlayers.length === 0) {
        alert("No registered players found for this tournament.");
        return;
      }

      // Create CSV content
      const csvHeaders = ["Name", "Email", "User ID", "Rating", "Phone Number", "Country Code", "Registered At", "Playdeck Name"];
      const csvRows = registeredPlayers.map(player => [
        player.name || "",
        player.email || "",
        player.userId || "",
        player.rating || "",
        player.phoneNumber || "",
        player.countryCode || "",
        player.registeredAt || "",
        player.playdeckName || "",
      ]);

      // Combine headers and rows
      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(","))
        .join("\n");

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `tournament_${tournament.id}_registered_players.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Successfully exported ${registeredPlayers.length} registered players to CSV!`);
    } catch (e) {
      console.error("CSV export error:", e);
      alert("Failed to export registered players. Please try again.");
    } finally {
      setIsExportingCSV(false);
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
        {tournament?.status_id === 4 && <RegisterButtons registrationStatus={registrationStatus} onRegisterClick={onRegisterClick} isRegistering={isRegistering} />}

        {isUserAdmin && (
          <>
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
              <Button
                css={{
                  backgroundColor: "#059669",
                  "&:hover": {
                    backgroundColor: "#047857"
                  }
                }}
                onClick={onExportCSV}
                disabled={isExportingCSV}
              >
                {isExportingCSV ? (
                  <Spinner size="1" />
                ) : (
                  "Export CSV"
                )}
              </Button>
            </Flex>
          </Box>

          {/* Manual Registration Section */}
          <ManualRegistrationBox>
            <StatusText type="admin">
              Manual Player Registration
            </StatusText>
            <Flex css={{ gap: "12px", alignItems: "center" }}>
              <ManualRegistrationInput
                type="email"
                placeholder="Enter player email address"
                value={manualRegistrationEmail}
                onChange={(e) => setManualRegistrationEmail(e.target.value)}
                disabled={isManualRegistering}
              />
              <Button
                css={{
                  backgroundColor: "#16a34a",
                  "&:hover": {
                    backgroundColor: "#15803d"
                  }
                }}
                onClick={onManualRegisterClick}
                disabled={isManualRegistering || !manualRegistrationEmail.trim()}
              >
                {isManualRegistering ? (
                  <Spinner size="1" />
                ) : (
                  "Register Player"
                )}
              </Button>
            </Flex>
          </ManualRegistrationBox>
          </>
        )}

      {/* Manual Registration Form */}
      {showManualRegistration && (
        <Box css={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "24px",
          padding: "24px"
        }}>
          <Box css={{ marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "#1f2937", fontSize: "18px", fontWeight: "600" }}>
              Register User Manually
            </h3>
            <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
              Search and select a user to register for this tournament
            </p>
          </Box>

          <Flex css={{ gap: "16px", alignItems: "flex-end" }}>
            <Box css={{ flex: 1 }}>
              <UserTypeahead
                labelText=""
                users={usersForDropdown}
                selectedItem={selectedUser}
                onSelect={(item: DropdownItemType) => setSelectedUser(item?.value || "")}
                onBlur={() => {}}
                placeholder="Type user name or email..."
                css={{ width: "100%" }}
                error={false}
              />
            </Box>
            <Button
              onClick={onManualRegisterClick}
              disabled={!selectedUser || isManualRegistering}
              css={{
                backgroundColor: "#10b981",
                "&:hover": {
                  backgroundColor: "#059669",
                },
                "&:disabled": {
                  backgroundColor: "#d1d5db",
                  cursor: "not-allowed"
                }
              }}
            >
              {isManualRegistering ? <Spinner size="1" /> : "Register"}
            </Button>
          </Flex>
        </Box>
      )}

      {/* Edit Form */}
      {isEditing && (
        <TournamentEditForm
          tournament={tournament as any}
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
