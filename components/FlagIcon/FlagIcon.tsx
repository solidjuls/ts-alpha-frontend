import Image from "next/image";
import { Box } from "components/Atoms";

type FlagIcon = {
  code: string
}

const WIDTH = 18;
const HEIGHT = 12;
const FlagIcon: React.FC<FlagIcon> = ({ code }) => (
  <Box css={{ marginLeft: "4px", marginRight: "4px" }}>
    <Image src={`/flags/${code}.png`} alt="code" width={WIDTH} height={HEIGHT} />
  </Box>
);

export { FlagIcon };
