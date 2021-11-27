import { styled } from "@stitches/react";
import { useIntlContext } from "../../contexts/IntlContext";

const Flex = styled("div", { display: "flex", flexDirection: "row" });
const A = styled("a", { margin: "8px" });

const LanguagePicker = () => {
  const { setLocale } = useIntlContext();
  return (
    <Flex>
      <A onClick={() => setLocale("ca")}>CA</A>
      <A onClick={() => setLocale("en")}>EN</A>
    </Flex>
  );
};

export { LanguagePicker };
