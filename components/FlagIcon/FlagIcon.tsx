import Image from "next/image";
import { Box } from "components/Atoms";
import { styled } from "stitches.config";
import { useState } from "react";

type FlagIcon = {
  code: string;
};

const StyledImage = styled(Image, {
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px;",
});

const WIDTH = 24;
const HEIGHT = 16;
const FlagIcon: React.FC<FlagIcon> = ({ code }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return <Box css={{ width: WIDTH, height: HEIGHT, backgroundColor: "#eee", marginLeft: "4px", marginRight: "4px" }} />;
  }
  
  return (
    <Box css={{ marginLeft: "4px", marginRight: "4px" }}>
      <StyledImage 
        src={`/flags/${code}.png`} 
        alt={`${code} flag`} 
        width={WIDTH} 
        height={HEIGHT} 
        onError={() => {
          console.error(`Failed to load flag for ${code}`);
          setError(true);
        }}
      />
    </Box>
  );
};

export { FlagIcon };
