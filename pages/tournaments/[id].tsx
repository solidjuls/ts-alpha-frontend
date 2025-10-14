import { Spinner } from "@radix-ui/themes";
import { Box, Flex } from "components/Atoms";
import { Button } from "components/Button";
import { DetailContainer } from "components/DetailContainer";
import { DisplayInfo } from "components/DisplayInfo";
import { StyledLabel } from "components/DisplayInfo/DisplayInfo.styles";
import useFetchInitialData from "hooks/useFetchInitialData";
import { useParams } from "next/navigation";
import { TournamentsType } from "types/game.types";
import { getTournamentStatusNames } from "utils/constants";

const TournamentRegistration = () => {
  // I call for tournament detail api
  // I must add some optional edition fields when adding a tournament
  let { id } = useParams();
  const { data, setData, isLoading, refetch } = useFetchInitialData<TournamentsType>({
    url: `/api/game/tournaments?id=${id}`,
    cacheId: "tournaments",
  });

  const onRegisterClick = async () => {
    try {
        // @ts-ignore
        await getAxiosInstance().patch(
          "/api/game/submit",
          {
            data: normalizeData(form),
          },
          {
            cache: {
              update: {
                "game-list": "delete",
              },
            },
          },
        );
        router.push("/");
      } catch (e) {
        console.log("error submitform", e);
        setErrorMsg("There was an error submitting the result");
      } finally {
        setIsSubmitting(false);
      }
  }

  if (isLoading) return;
console.log("data", data)
const tournament = data[0]
  return (
    <DetailContainer>
      <Box css={{
        border: "solid 1px lightgray",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
      }}>
      <Box
        css={{
          display: "grid",
          gap: "0.25rem",
          maxWidth: "48rem",
          gridTemplateColumns: "1fr 2fr",
          backgroundColor: "white",
          padding: "24px 0 24px 24px",
          alignItems: "left",
          height: isLoading ? "250px" : "auto",
          
          width: "100%",
        }}
      >
        {isLoading || !tournament ? (
          <Spinner size="3" />
        ) : (
          <>
            <DisplayInfo label="Status" infoText={getTournamentStatusNames(tournament.status_id)} />
            <DisplayInfo label="Name" infoText={tournament.tournament_name} />
            <DisplayInfo label="Admin" infoText={tournament.tournament_admins?.[0].users.first_name} />
            <DisplayInfo label="Starting Date" infoText={tournament.starting_date} />
            <Flex css={{ flexDirection: "column", minWidth: "400px" }}>
                <StyledLabel htmlFor="userName">Description</StyledLabel>
                <div dangerouslySetInnerHTML={{ __html: tournament.description }} />
              </Flex>
            
          </>
        )}
      </Box>
        <Button>Register</Button>
      </Box>
    </DetailContainer>
  );
};

export default TournamentRegistration;

// RTSL 2025 👽👹🤖👻 is coming.
// 🗓 Season Dates: Jun 1 - Oct 31
// 🎲 Playoff Dates:  Nov 1 - 30
// 📝 Sign up now for 10 games in 5 months at your own schedule.
// 🤝 Compete against players near your level!

// Not registered yet?
// https://forms.gle/XqkxktFYiGfvzC3R6
