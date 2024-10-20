import { Box } from "components/Atoms";
import { FormattedMessage } from "react-intl";
import { Label } from "components/Label";

const cssFlexTextComponent = {
  display: "flex",
  flexDirection: "column",
};
const cssLabel = { marginBottom: 8, marginRight: 15, width: "160px" };

const WithLabel = ({ labelText, children }) => {
  return (
    <Box css={cssFlexTextComponent}>
      <Label htmlFor="dropdown" css={cssLabel}>
        {labelText ? <FormattedMessage id={labelText} /> : labelText}
      </Label>
      {children}
    </Box>
  );
};

export default WithLabel;
