import React from "react";
import { Flex } from "components/Atoms";
import Text from "components/Text";
import { Spinner } from "@radix-ui/themes";
import { StyledResultsPanel } from "./Players.styles";
import PlayerRow from "./PlayerRow";
import { ResultsPanelProps } from "./Players.types";

const ResultsPanel: React.FC<ResultsPanelProps> = ({ data, isLoading }) => {
  return (
    <Flex css={{ flexDirection: "column", width: "100%", height: "100%" }}>
      <StyledResultsPanel>
        {isLoading ? (
          <Spinner />
        ) : (
          Array.isArray(data) && data.length > 0 ? (
            data.map((player, index) => <PlayerRow key={index} index={index} player={player} />)
          ) : (
            <Text css={{ textAlign: "center", marginTop: "20px" }}>No players found</Text>
          )
        )}
      </StyledResultsPanel>
    </Flex>
  );
};

export default ResultsPanel; 