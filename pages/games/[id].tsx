import { Box, Span, Flex } from "components/Atoms";
import { FlagIcon } from "components/FlagIcon";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { styled } from "stitches.config";

const spanCssGameData = {
  marginRight: "8px",
};

const spanCssRating = {
  fontSize: "12px",
};

const StyledChevronDownIcon = styled(ChevronDownIcon, {
  position: "absolute",
  variants: {
    color: {
      red: { color: 'red' },
      green: { color: 'green' },
    },
  },
});
const StyledChevronUpIcon = styled(ChevronUpIcon, {
  position: "absolute",
  variants: {
    color: {
      red: { color: 'red' },
      green: { color: 'green' },
    },
  },
});

export default function Game() {
  const game = {
    id: 5,
    created_at: Date.now(),
    updated_at: Date.now(),
    usaPlayerId: 1,
    ussrPlayerId: 2,
    usaRatingDifference: 232,
    ussrRatingDifference: 442,
    gameType: "whoknows",
    game_code: "dfd",
    reported_at: Date.now(),
    gameWinner: "USSR",
    endTurn: "7",
    endMode: "DEFCON",
    game_date: Date.now(),
    video1: "megalol",
    videoURL: "megalooooooool",
    reporter_id: 1,
    usaCountryCode: "CAT",
    ussrCountryCode: "ES",
    usaPlayer: "Juli Arnalot",
    ussrPlayer: "Exhausted man",
    ratingsUSA: {
      rating: 8889,
      ratingDifference: 176,
    },
    ratingsUSSR: {
      rating: 8689,
      ratingDifference: 176,
    },
  };
  // const router = useRouter();

  // If the page is not yet generated, this will be displayed initially until the page is generated
  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }
  console.log("game", game);
  return (
    <Flex
      css={{
        width: "100%",
        maxWidth: "48rem",
        flexDirection: "column",
        backgroundColor: "white",
        padding: "24px",
        alignItems: "center",
        borderWidth: "1px",
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Flex css={{ alignItems: "center", marginBottom: "12px" }}>
        <PlayerName
          playerName={game.usaPlayer}
          rating={game.ratingsUSA.rating}
          ratingDifference={game.ratingsUSA.ratingDifference}
        />
        vs
        <PlayerName
          playerName={game.ussrPlayer}
          rating={game.ratingsUSSR.rating}
          ratingDifference={game.ratingsUSSR.ratingDifference}
        />
      </Flex>

      <Box css={{ display: "grid", gap: "1rem", gridTemplateColumns: "5fr 0.1fr 5fr" }}>
        <Flex css={{ flexDirection: "column", alignItems: "end" }}>
          <Span>Tournament:</Span>
          <Span>Identifier:</Span>
          <Span>Won by:</Span>
          <Span>In:</Span>
          <Span>Via:</Span>
          <Span>On:</Span>
        </Flex>
        <Box css={{ width: "5px" }} />
        <Flex css={{ flexDirection: "column", alignItems: "start" }}>
          <Span>{game.game_code}</Span>
          <Span>{game.id}</Span>
          <Span>{game.gameWinner}</Span>
          <Span>{game.endTurn}</Span>
          <Span>{game.gameType}</Span>
          <Span>{game.game_date}</Span>
        </Flex>
      </Box>
    </Flex>
  );
}

const PlayerName = ({ playerName, rating, ratingDifference }) => {
  return (
    <Flex css={{ flexDirection: "column" }}>
      <Flex css={{ margin: "0 8px 0 8px" }}>
        <Link href="/userprofile">{playerName}</Link>
        <FlagIcon code="US" />
      </Flex>

      <Flex css={{ margin: "0 8px 0 8px" }}>
        <Span css={spanCssRating}>{Number(rating) + Number(ratingDifference)}</Span>
        <Box css={{ position: "relative", width: "20px" }}><StyledChevronDownIcon color="red" /></Box>
        <Span css={spanCssRating}>{rating}</Span>
        <Box css={{ position: "relative", width: "20px" }}><StyledChevronDownIcon color="green" /></Box>
      </Flex>
    </Flex>
  );
};

export async function getServerSideProps({ params }) {
  // Fetch data for a single post
  // const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
  // const post = await res.json();

  // // Return 404 if post is not found
  // if (!post.id) {
  //   return {
  //     notFound: true,
  //   };
  // }
  console.log("params", params);
  // Pass post data to the page via props
  return { props: { game: params } };
}
