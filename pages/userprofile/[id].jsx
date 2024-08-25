import { useState } from "react";
import axios from "axios";
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
import { Spinner } from "@radix-ui/themes";
import useFetchInitialData from "hooks/useFetchInitialData";

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

const UserProfileContent = ({ data }) => (
  <>
    <DisplayInfo label="Player's name" infoText={`${data?.first_name} ${data?.last_name}`} />
    <DisplayInfo label="Country" infoText={data?.countries?.country_name} />
    <DisplayInfo label="Playdeck" infoText={data?.name} />
    <DisplayInfo label="Location" infoText={data?.cities?.name} />
    <DisplayInfo label="Preferred gaming platform" infoText={data?.preferredGamingPlatform} />
    <DisplayInfo label="Email" infoText={data?.email} />

    <DisplayInfo label="Rating" infoText={data?.rating} />
    <DisplayInfo label="Regional federation" infoText="-" />
    <DisplayInfo label="Last activity date" infoText="7/11/2024" />
    <DisplayInfo label="Time Zone" infoText={data?.timeZoneId} />
    <DisplayInfo label="Preferred game duration" infoText={data?.preferredGameDuration} />
  </>
);
const UserProfile = ({ id }) => {
  console.log("props", id);
  // const [data, setData] = useState(null);
  // useEffect(() => {
  //   axios.get(`/api/user/${id}`).then((resp) => console.log(resp));
  // }, []);
  const { data, isLoading} = useFetchInitialData({ url: `/api/user?id=${id}` })

  // const { data, isLoading } = trpc.useQuery(["user-get", { id }]);
  // const mutationAll = trpc.useMutation(["user-update-all"]);
  const { email } = useSession();
  console.log("data", data);

  // if (isLoading) return null;
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
        {isLoading ? <Spinner size="3" /> : <UserProfileContent data={data} />}

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
