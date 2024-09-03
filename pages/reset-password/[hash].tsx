import { useState } from "react";
import { hash } from "bcryptjs";
import { useRouter } from "next/router";
import { Label } from "components/Label";
import { Button } from "components/Button";
import { Box } from "components/Atoms";
import { PasswordInput } from "components/Input";
import getAxiosInstance from "utils/axios";

const decryptHash = (hash: any) => {
  let buff = Buffer.from(hash, "base64");
  return buff.toString("ascii");
};

const LabelInput = ({
  inputValue,
  labelText,
  onChange,
}: {
  inputValue: string;
  labelText: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
      <Label css={{ width: "200px" }}>{labelText}</Label>
      <PasswordInput
        id="mail"
        margin="login"
        defaultValue={inputValue}
        onChange={(event: any) => onChange(event.target.value)}
        css={{ width: "300px" }}
      />
    </Box>
  );
};

const ResetPassword = () => {
  const [pwd, setPwd] = useState<string>("");
  const [pwdConfirm, setPwdConfirm] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const router = useRouter();
  const { hash: hashKey } = router.query;

  const decrypted = decryptHash(hashKey);

  const validate = ({ hash }) => {
    if (pwd !== pwdConfirm) {
      setErrorMsg("Passwords don't match");
      return false;
    }
    if (!hash) {
      console.log("hash", hash);
      setErrorMsg("Unexpected error. Try to reset the password again");
      return false;
    }
    return true;
  };

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <h1>Reset password</h1>
      <LabelInput labelText="New password" inputValue={pwd} onChange={setPwd} />
      <LabelInput
        labelText="Confirm new password"
        inputValue={pwdConfirm}
        onChange={setPwdConfirm}
      />
      {errorMsg && <Label css={{ color: "red" }}>{errorMsg}</Label>}
      <Button
        onClick={async () => {
          if (validate({ hash: decrypted })) {
            // some regex to validate mail is ok would be nice
            const pwdHashed = await hash(pwd, 12);
            if (!hashKey) return;
            // @ts-ignore
            await getAxiosInstance().post(`/api/user/reset-password`, {
              token: hashKey as string,
              pwd: pwdHashed,
            });
            router.push("/login");
          }
        }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default ResetPassword;
