import { useState } from "react";
import { trpc } from "contexts/APIProvider";
import jwt from "next-auth/jwt";
import { hash } from "bcryptjs";
import { useSession } from "contexts/AuthProvider";
import { FormattedMessage } from "react-intl";
import { Input } from "components/Input";
import { Label } from "components/Label";
import { Button } from "components/Button";
import { LanguagePicker } from "components/LanguagePicker";
import { Box } from "components/Atoms";

const cssLabel = { marginRight: 15, width: "140px", maxWidth: "140px" };

const TextComponent = ({
  labelText,
  inputValue,
  onInputValueChange = () => {},
  ...rest
}) => (
  <Box css={{ display: "flex", marginBottom: "16px" }}>
    <Label htmlFor="video1" css={cssLabel}>
      <FormattedMessage id={labelText} />
    </Label>
    <Input
      type="text"
      id="video1"
      defaultValue={inputValue}
      onChange={(event) => onInputValueChange(event.target.value)}
      {...rest}
    />
  </Box>
);

const UserProfile = () => {
  const mutation = trpc.useMutation(["user-update"]);
  const mutationAll = trpc.useMutation(["user-update-all"]);
  const { data: session } = useSession();
  const [password, setPassword] = useState("");
  const updateClick = async () => {
    // if (session?.user?.email) {
    const pwdHashed = await hash(password, 12);
// @ts-ignore
    mutation.mutate({
      mail: "juli.arnalot@gmail.com", // session.user?.email,
      password: pwdHashed,
    });
    // }
  };

  const updateAllClick = async () => {
    const pwd = "welcome6"

    mutationAll.mutate({
      password: pwd,
    });
    // if (session?.user?.email) {
    //   const pwd = await hash("welcome6", 12);

    //   mutationAll.mutate({
    //     password: pwd,
    //   });
    // }
  };

  return (
    <Box css={{ padding: "24px" }}>
      <TextComponent
        labelText="updatePwdProfile"
        inputValue={password}
        onInputValueChange={setPassword}
      />
      <Button onClick={updateClick}>
        <FormattedMessage id="updatePwdProfileButton" />
      </Button>
      <Button onClick={updateAllClick}>Update All Passwords</Button>
      {/* <LanguagePicker /> */}
    </Box>
  );
};

export default UserProfile;
