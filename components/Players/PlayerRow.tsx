import React from "react";
import { UnstyledLink, StyledCardRow } from "./Players.styles";
import CardColumn from "./CardColumn";
import { PlayerRowProps } from "./Players.types";

const PlayerRow: React.FC<PlayerRowProps> = ({ index, player }) => {
  return (
    <UnstyledLink key={index} href={`/userprofile/${player.id}`} passHref>
      <StyledCardRow>
        <CardColumn header="Rank:" value={player.rank} />
        <CardColumn header="Player:" value={player.name} countryCode={player.countryCode} />
        <CardColumn header="Rating:" value={player.rating} />
      </StyledCardRow>
    </UnstyledLink>
  );
};

export default PlayerRow;
