import { trpc } from "utils/trpc";
import { Box } from "components/Atoms";
import Text from "components/Text";

const Players = () => {
  const { data, isLoading } = trpc.useQuery(["rating-get", { n: -1 }]);

  if (isLoading) return null;
  return (
    <Box>
      {data?.map((item: any, index: number) => (
        <Box key={index} css={{ display: 'flex', flexDirection: 'row'}}>
          <Text>{item.name}</Text>
          <Text>{item.rating}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default Players;
