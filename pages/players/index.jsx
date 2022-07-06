import { styled } from "stitches.config";
import { trpc } from "contexts/APIProvider";
import { Box } from "components/Atoms";
import { User } from "components/User";
import { SkeletonHomepage } from "components/Skeletons";
import { UserType } from "types/user.types";

const borderStyle = "solid 1px $greyLight";
const ResultsPanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "$infoForm",
  padding: '8px',
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  overflowY: "scroll",
  height: "500px",
  width: "350px",
});

const FilterPanel = styled("div", {
  padding: "8px",
  margin: "8px",
  borderBottom: borderStyle,
});

// const getAllFlags: (data: UserType[]) => string[] = (data) =>
//   data.reduce((prev: string[], curr: UserType) => {
//     if (!prev.includes(curr.countryCode)) {
//       prev.push(curr.countryCode);
//     }
//     return prev;
//   }, []);

const Players = () => {
  const { data, isLoading } = trpc.useQuery(["rating-get", { n: -1 }]);

  if (isLoading) return <SkeletonHomepage />;
  if (!data) return null;
  // const countryCodes = getAllFlags(data);
  // console.log("countries", countryCodes)
  return (
    <>
      <h1>Players list</h1>
      <ResultsPanel>
        {/* <FilterPanel>
          <div>kaboom</div>
        </FilterPanel> */}
        {data.map((item, index) => (
          <User
            key={index}
            name={item.name}
            rating={item.rating}
            countryCode={item.countryCode}
          />
        ))}
      </ResultsPanel>
    </>
  );
};

export default Players;
