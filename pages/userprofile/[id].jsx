import { hash } from "bcryptjs";
import { useSession } from "contexts/AuthProvider";
import { DisplayInfo } from "components/DisplayInfo";
import { getInfoFromCookies } from "utils/cookies";
import { Box, Flex } from "components/Atoms";
import { DetailContainer } from "components/DetailContainer";
import { Spinner } from "@radix-ui/themes";
import useFetchInitialData from "hooks/useFetchInitialData";
import { dateFormat } from "utils/dates";
import { ResultsPanel } from "components/Homepage/Homepage";

const UserProfileContent = ({ data }) => (
  <>
    <DisplayInfo label="Player's name" infoText={`${data?.first_name} ${data?.last_name}`} />
    <DisplayInfo label="Federation" infoText={data?.countries?.country_name} />
    <DisplayInfo label="Playdeck" infoText={data?.name} />
    <DisplayInfo label="Location" infoText={data?.cities?.name} />
    <DisplayInfo label="Preferred gaming platform" infoText={data?.preferred_gaming_platform} />
    <DisplayInfo label="Email" infoText={data?.email} />

    <DisplayInfo label="Rating" infoText={data?.rating} />
    <DisplayInfo label="Regional federation" infoText="-" />
    <DisplayInfo
      label="Last activity date"
      infoText={data.last_login_at ? dateFormat(new Date(data.last_login_at)) : "-"}
    />
    <DisplayInfo label="Preferred game duration" infoText={data?.preferred_game_duration} />
  </>
);
const UserProfile = ({ id }) => {
  const { data, isLoading } = useFetchInitialData({ url: `/api/user?id=${id}` });

  const gameDataResult = useFetchInitialData({ url: `/api/game?userFilter=${id}&pageSize=10` });

  const { email } = useSession();

  return (
    <>
      <DetailContainer>
        <Box
          css={{
            display: "grid",
            gap: "0.25rem",
            maxWidth: "48rem",
            gridTemplateColumns: "1fr 2fr",
            maxWidth: "48rem",
            backgroundColor: "white",
            padding: "24px 0 24px 24px",
            alignItems: "left",
            border: "solid 1px lightgray",
            height: isLoading ? "250px" : "auto",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            width: "100%",
            maxWidth: "48rem",
          }}
        >
          {isLoading ? <Spinner size="3" /> : <UserProfileContent data={data} />}
        </Box>
      </DetailContainer>
      <DetailContainer backButton={false}>
        <Flex
          css={{ width: "100%", borderRadius: "0", margin: "32px 0 0 0", flexDirection: "column" }}
        >
          Recent Games
          {gameDataResult.isLoading ? (
            <Spinner size="3" />
          ) : (
            <ResultsPanel data={gameDataResult.data.results} excludePagination={true} />
          )}
        </Flex>
      </DetailContainer>
    </>
  );
};

export default UserProfile;

export async function getServerSideProps({ query }) {
  // const payload = getInfoFromCookies(req, res);
  // if (!payload) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };
  // }
  return { props: { id: query.id } };
}
