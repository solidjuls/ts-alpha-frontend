import Image from "next/image";
import styled from "styled-components";

type FlagIcon = {
  code: string;
};

const StyledImage = styled(Image)`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px;
`

const WIDTH = 24;
const HEIGHT = 16;
const FlagIcon: React.FC<FlagIcon> = ({ code }) => (
  <div style={{ marginLeft: "4px", marginRight: "4px" }}>
    <StyledImage src={`/flags/${code}.png`} alt="code" width={WIDTH} height={HEIGHT} />
  </div>
);

export { FlagIcon };
