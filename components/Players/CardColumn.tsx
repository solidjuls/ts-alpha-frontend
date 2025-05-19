import React from "react";
import { Flex } from "components/Atoms";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { CardColumnProps } from "./Players.types";

const CardColumn: React.FC<CardColumnProps> = ({ header, value, countryCode }) => {
  return (
    <>
      <Flex css={{ flexDirection: "column" }}>
        <Text fontSize="small">{header}</Text>
        <Flex css={{ alignItems: "center" }}>
          {countryCode && <FlagIcon code={countryCode} />}
          <Text fontSize="medium">{value}</Text>
        </Flex>
      </Flex>
    </>
  );
};

export default CardColumn;
