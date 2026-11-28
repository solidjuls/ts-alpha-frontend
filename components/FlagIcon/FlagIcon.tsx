import Image from "next/image";
import styled from "styled-components";
import flagSvgMap from "./flagSvgMap";

type FlagIconProps = {
  code: string;
};

const StyledImage = styled(Image)`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px;
`;

const WIDTH = 24;
const HEIGHT = 16;

const FlagIcon: React.FC<FlagIconProps> = ({ code }) => {
  const svgSrc = flagSvgMap[code?.toUpperCase()];
  const src = svgSrc || `/flags/${code}.png`;

  return (
    <div style={{ marginLeft: "4px", marginRight: "4px" }}>
      <StyledImage src={src} alt={code} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

export { FlagIcon };
