import { useState } from "react";
import { trpc } from "contexts/APIProvider";
import { hash } from "bcryptjs";
import { useSession } from "contexts/AuthProvider";
import { FormattedMessage } from "react-intl";
import { Input } from "components/Input";
import { Label } from "components/Label";
import { Button } from "components/Button";
import { DisplayInfo } from "components/DisplayInfo";
import { getInfoFromCookies } from "utils/cookies";
import { Box, Flex } from "components/Atoms";
import { DetailContainer } from "components/DetailContainer";

const cssLabel = { marginRight: 15, width: "140px", maxWidth: "140px" };

const TextComponent = ({ labelText, inputValue, onInputValueChange = () => {}, ...rest }) => (
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

const UserProfile = ({ id }) => {
  console.log("props", id);
  const { data, isLoading } = trpc.useQuery(["user-get", { id }]);
  // const mutationAll = trpc.useMutation(["user-update-all"]);
  const { email } = useSession();
  console.log("data", data);

  const updateClick = async () => {
    // if (session?.user?.email) {
    const pwdHashed = await hash(password, 12);
    // @ts-ignore
    mutation.mutate({
      mail,
      password: pwdHashed,
    });
    // }
  };

  const updateAllClick = async () => {
    const pwd = "welcome6";

    if (email) {
      const pwd = await hash("welcome6", 12);

      mutationAll.mutate({
        password: pwd,
      });
    }
  };

  return (
    <DetailContainer>
      <Box
        css={{
          display: "grid",
          gap: "0.25rem",
          gridTemplateColumns: "1fr 2fr",
          width: "100%",
          maxWidth: "48rem",
          backgroundColor: "white",
          padding: "24px",
          alignItems: "left",
          border: "solid 1px lightgray",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <DisplayInfo label="Rank" infoText="1" />
        <DisplayInfo label="First name" infoText="Juli" />
        <DisplayInfo label="Country" infoText="Spain" />
        <DisplayInfo label="Playdeck" infoText="Abaddon833" />
        <DisplayInfo label="Location" infoText="Barcelona" />
        <DisplayInfo label="Preferred gaming platform" infoText="PC Steam (Playdeck)" />
        <DisplayInfo label="Email" infoText="email" />

        <DisplayInfo label="Rating" infoText="7007" />
        <DisplayInfo label="Regional federation" infoText="-" />
        <DisplayInfo label="Last activity date" infoText="7/11/2024" />
        <DisplayInfo label="Time Zone" infoText="Europe/London" />
        <DisplayInfo label="Preferred game duration" infoText="45 minutes" />
        {/* {role === 2 && (
        <TextComponent labelText="userMail" inputValue={mail} onInputValueChange={setMail} />
      )} */}
        {/* <TextComponent
        labelText="updatePwdProfile"
        inputValue={password}
        onInputValueChange={setPassword}
      />
      <Button onClick={updateClick}>
        <FormattedMessage id="updatePwdProfileButton" />
      </Button> */}
        {/* <Button onClick={updateAllClick}>Update All Passwords</Button> */}
        {/* <LanguagePicker /> */}
      </Box>
    </DetailContainer>
  );
};

export default UserProfile;

export async function getServerSideProps({ query }) {
  // const payload = getInfoFromCookies(req, res);
  // if (!payload) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };
  // }
  return { props: { id: query.id } };
}
