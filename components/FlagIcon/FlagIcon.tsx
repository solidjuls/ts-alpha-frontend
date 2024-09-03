import Image from "next/image";
import { Box } from "components/Atoms";
import { styled } from "stitches.config";

type FlagIcon = {
  code: string;
};

const StyledImage = styled(Image, {
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px;",
});

const WIDTH = 24;
const HEIGHT = 16;
const FlagIcon: React.FC<FlagIcon> = ({ code }) => (
  <Box css={{ marginLeft: "4px", marginRight: "4px" }}>
    <StyledImage src={`/flags/${code}.png`} alt="code" width={WIDTH} height={HEIGHT} />
  </Box>
);

export { FlagIcon };
