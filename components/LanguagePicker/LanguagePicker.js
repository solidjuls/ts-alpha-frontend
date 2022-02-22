import { useIntlContext } from "../../contexts/IntlContext";
import { Box, A } from "components/Atoms";

const LanguagePicker = () => {
  const { setLocale } = useIntlContext();
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
      <A css={{ margin: "8px" }} onClick={() => setLocale("ca")}>
        CA
      </A>
      <A css={{ margin: "8px" }} onClick={() => setLocale("en")}>
        EN
      </A>
    </Box>
  );
};

export { LanguagePicker };
