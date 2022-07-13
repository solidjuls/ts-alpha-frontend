import Image from "next/image";
import { Box } from "components/Atoms";

const WIDTH = "18px";
const HEIGHT = "12px";
const FlagIcon = ({ code }: { code: string }) => (
  <Box css={{ marginLeft: "4px", marginRight: "4px" }}>
    <Image
      src={`/flags/${code}.png`}
      alt="code"
      width={WIDTH}
      height={HEIGHT}
    />
  </Box>
);

export { FlagIcon };
