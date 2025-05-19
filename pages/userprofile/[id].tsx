import { DisplayInfo } from "components/DisplayInfo";
import { getInfoFromCookies } from "utils/cookies";
import { Box, Flex } from "components/Atoms";
import Text from "components/Text";
import { DetailContainer } from "components/DetailContainer";
import { Spinner } from "@radix-ui/themes";
import useFetchInitialData from "hooks/useFetchInitialData";
import { dateFormat } from "utils/dates";
import { ResultsPanel } from "components/Homepage/Homepage";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { ParsedUrlQuery } from "querystring";
import { Game } from "types/game.types";

// Dynamically import RatingChart with no SSR
const RatingChart = dynamic(() => import("components/RatingChart/RatingChart"), { ssr: false });
// Dynamically import WinTypeChart with no SSR
const WinTypeChart = dynamic(() => import("components/RatingChart/WinTypeChart"), { ssr: false });

// Country name to TLD code mapping
const COUNTRY_TO_TLD = {
  "United Kingdom": "UK",
  // Add more mappings as needed
};

interface UserProfileData {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  last_login_at: string | null;
  rating: number;
  countries?: {
    tld_code: string;
    country_name: string;
  };
  cities?: {
    name: string;
  };
  preferred_gaming_platform?: string;
  preferred_game_duration?: string;
}

interface RankingData {
  ranking: number;
  federationRanking: number;
}

interface UserProfileContentProps {
  data: UserProfileData;
}

interface FetchParams {
  url: string;
  cacheId?: string;
  enabled?: boolean;
}

const UserProfileContent = ({ data }: UserProfileContentProps) => {
  const { data: rankingData } = useFetchInitialData<RankingData>({
    url: `/api/user/ranking?userId=${data.id}`,
    enabled: !!data.id, // Only fetch ranking if we have a valid user ID
  } as FetchParams);

  const countryCode = data.countries?.tld_code;
  const flagPath = countryCode ? `/flags/${countryCode}.png` : null;

  return (
    <>
      <DisplayInfo label="Player's name" infoText={`${data.first_name} ${data.last_name}`} />
      <DisplayInfo label="Playdek" infoText={data.name} />
      <DisplayInfo label="Email" infoText={data.email} />
      <DisplayInfo
        label="Last activity date"
        infoText={data.last_login_at ? dateFormat(new Date(data.last_login_at)) : "-"}
      />
      <DisplayInfo label="Rating" infoText={String(data.rating || 0)} />
      <DisplayInfo
        label="Global Ranking"
        infoText={rankingData ? String(rankingData.ranking) : "-"}
      />
      <DisplayInfo label="Federation" infoText={data.countries?.country_name || "-"} />
      <DisplayInfo
        label="Federation Ranking"
        infoText={rankingData ? String(rankingData.federationRanking) : "-"}
      />
      <DisplayInfo
        label="Preferred gaming platform"
        infoText={data.preferred_gaming_platform || "-"}
      />
      <DisplayInfo label="Preferred game duration" infoText={data.preferred_game_duration || "-"} />
      <DisplayInfo label="Location" infoText={data.cities?.name || "-"} />
      <DisplayInfo label="Regional federation" infoText="-" />
    </>
  );
};

interface UserProfileProps {
  id: string;
}

const UserProfile = ({ id }: UserProfileProps) => {
  const { data, isLoading, error } = useFetchInitialData<UserProfileData>({
    url: `/api/user?id=${id}`,
  });
  const gameDataResult = useFetchInitialData<{ results: Game[] }>({
    url: `/api/game?userFilter=${id}&pageSize=100`,
  });
  const { data: session } = useSession();
  const email = session?.user?.email;

  if (error) {
    return (
      <DetailContainer>
        <Box
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            width: "100%",
            maxWidth: "52rem",
          }}
        >
          <Text css={{ color: "#666" }}>Error loading user data</Text>
        </Box>
      </DetailContainer>
    );
  }

  return (
    <>
      <DetailContainer>
        <Box
          css={{
            display: "grid",
            gap: "0.25rem",
            maxWidth: "52rem",
            gridTemplateColumns: "1fr 2fr",
            backgroundColor: "white",
            padding: "24px",
            alignItems: "left",
            border: "solid 1px lightgray",
            height: isLoading ? "250px" : "auto",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            width: "100%",
          }}
        >
          {isLoading ? (
            <Spinner size="3" />
          ) : data ? (
            <UserProfileContent data={data} />
          ) : (
            <Text css={{ color: "#666" }}>No user data found</Text>
          )}
        </Box>
      </DetailContainer>
      {gameDataResult.isLoading ? (
        <DetailContainer backButton={false}>
          <Box
            css={{
              width: "100%",
              maxWidth: "52rem",
              backgroundColor: "white",
              padding: "24px",
              border: "solid 1px lightgray",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <Spinner size="3" />
          </Box>
        </DetailContainer>
      ) : gameDataResult.data?.results && gameDataResult.data.results.length > 0 ? (
        <>
          <DetailContainer backButton={false}>
            <RatingChart playerId={id} />
          </DetailContainer>
        </>
      ) : (
        <DetailContainer backButton={false}>
          <Box
            css={{
              width: "100%",
              maxWidth: "52rem",
              backgroundColor: "white",
              padding: "24px",
              border: "solid 1px lightgray",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <Text css={{ color: "#666" }}>No games found for this player</Text>
          </Box>
        </DetailContainer>
      )}
      <DetailContainer backButton={false}>
        <Flex
          css={{
            width: "100%",
            borderRadius: "8px",
            flexDirection: "column",
            backgroundColor: "white",
            padding: "24px",
            border: "solid 1px lightgray",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Text css={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
            Recent Games
          </Text>
          {gameDataResult.isLoading ? (
            <Spinner size="3" />
          ) : gameDataResult.data?.results ? (
            <ResultsPanel data={gameDataResult.data.results.slice(0, 10)} />
          ) : null}
        </Flex>
      </DetailContainer>
    </>
  );
};

export default UserProfile;

export async function getServerSideProps({
  req,
  res,
  params,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  params: ParsedUrlQuery;
}) {
  const payload = getInfoFromCookies(req, res);

  if (!payload) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  const { id } = params;
  return { props: { role: payload.role || null, id } };
}
