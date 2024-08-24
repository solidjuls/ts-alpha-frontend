import axios from "axios"
import { styled } from "stitches.config";
import { Flex } from "components/Atoms";
import Text from "components/Text";
import { SkeletonHomepage } from "components/Skeletons";
import { FlagIcon } from "components/FlagIcon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const UnstyledLink = styled(Link, {
  all: "unset" /* Unset all styles */,
  cursor: "pointer" /* Set cursor to pointer */,
});

const borderStyle = "solid 1px $greyLight";
const ResultsPanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  backgroundColor: "$infoForm",
  padding: "8px",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  overflowY: "scroll",
  width: "100%",
  maxWidth: "1000px",
  height: "500px",
});

const StyledCardRow = styled("div", {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "min-content 3fr 2fr min-content",
  paddingInlineStart: "8px",
  paddingInlineEnd: "8px",
  paddingTop: "4px",
  paddingBottom: "4px",
  borderWidth: "1px",
  borderRadius: "6px",
  border: "solid 1px $greyLight",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
});

const CardColumn = ({ header, value, countryCode }) => {
  return (
    <>
      <Flex css={{ flexDirection: "column" }}>
        <Text fontSize="small">{header}</Text>
        <Flex css={{ alignItems: "center" }}>
          {countryCode && <FlagIcon code={countryCode} />}
          <Text fontSize="medium">{value}</Text>
        </Flex>
      </Flex>
    </>
  );
};

// const getAllFlags: (data: UserType[]) => string[] = (data) =>
//   data.reduce((prev: string[], curr: UserType) => {
//     if (!prev.includes(curr.countryCode)) {
//       prev.push(curr.countryCode);
//     }
//     return prev;
//   }, []);

const Players = () => {
  // const { data, isLoading } = trpc.useQuery(["rating-get", { n: -1 }]);
  const [data, setData] = useState([])
  useEffect(() => {
    if (gameId) {
      axios.get('/api/rating/').then(resp => console.log(resp))
    }
  }, [])
  if (isLoading) return <SkeletonHomepage />;
  if (!data) return null;

  return (
    <>
      <h1>Players list</h1>
      <ResultsPanel>
        {data.map((item, index) => (
          <UnstyledLink key={index} href={`/userprofile/${item.id}`} passHref>
            <StyledCardRow>
              <CardColumn header="Rank:" value={index + 1} />
              <CardColumn header="Player:" value={item.name} countryCode={item.countryCode} />
              <CardColumn header="Last activity date:" value="-" />
              <CardColumn header="Rating:" value={item.rating} />
            </StyledCardRow>
          </UnstyledLink>
        ))}
      </ResultsPanel>
    </>
  );
};

export default Players;
