import { Spinner } from "@radix-ui/themes";
import { Box } from "components/Atoms";
import { Button } from "components/Button";
import { DetailContainer } from "components/DetailContainer";
import { DisplayInfo } from "components/DisplayInfo";
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
  return (
    <DetailContainer>
      <Box
        css={{
          display: "grid",
          gap: "0.25rem",
          maxWidth: "48rem",
          gridTemplateColumns: "1fr 2fr",
          backgroundColor: "white",
          padding: "24px 0 24px 24px",
          alignItems: "left",
          border: "solid 1px lightgray",
          height: isLoading ? "250px" : "auto",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          width: "100%",
        }}
      >
        {isLoading || !data ? (
          <Spinner size="3" />
        ) : (
          <>
            <DisplayInfo label="Status" infoText={getTournamentStatusNames(data.status_id)} />
            <DisplayInfo label="Name" infoText={data.tournament_name} />

            <Button>Register</Button>
          </>
        )}
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
