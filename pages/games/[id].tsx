import { Box } from "components/Atoms";
import Link from "next/link";

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
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
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
        </Box>
        <Box
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span>Tournament:</span>
          <span>Identifier:</span>
          <span>Won by:</span>
          <span>In:</span>
          <span>Via:</span>
          <span>On:</span>
        </Box>
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            borderLeft: "solid 1px black",
            margin: "4px"
          }}
        >
          <span>Tournament:</span>
          <span>Identifier:</span>
          <span>Won by:</span>
          <span>In:</span>
          <span>Via:</span>
          <span>On:</span>
        </Box>
        </Box>
    </Box>
  );
}

const PlayerName = ({ playerName, rating, ratingDifference }) => {
  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link href="kkk">{playerName}</Link>
      <Box
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div>{rating}</div>
        <div>{Number(rating) - Number(ratingDifference)}</div>
      </Box>
    </Box>
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
