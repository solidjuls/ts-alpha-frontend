import { Box } from "components/Atoms";
import { FormattedMessage } from "react-intl";
import { Label } from "components/Label";

const cssFlexTextComponent = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "16px",
};
const cssLabel = { marginBottom: 8, marginRight: 15, width: "200px" };

const WithLabel = ({ labelText, children }) => {
  return (
    <Box css={cssFlexTextComponent}>
      <Label htmlFor="dropdown" css={cssLabel}>
        <FormattedMessage id={labelText} />
      </Label>
      {children}
    </Box>
  );
};

export default WithLabel;
