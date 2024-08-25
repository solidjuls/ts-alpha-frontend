import { useState } from "react";
import axios from "axios";
import { hash } from "bcryptjs";
import { useRouter } from "next/router";
import { Label } from "components/Label";
import { Button } from "components/Button";
import { Box } from "components/Atoms";
import { PasswordInput } from "components/Input";

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
  const router = useRouter();
  const { hash: hashKey } = router.query;

  const decrypted = decryptHash(hashKey);
  const values = decrypted.split("#");
  const date = Date.parse(values[1]);
  console.log(Date.now() - date, values);
  if (date === NaN) return <div>Link invalid</div>;
  if ((Date.now() - date) / 1000 > 3600) return <div>Link outdated</div>;
  if ((Date.now() - date) / 1000 > 3600) return <div>nowhere to go</div>;

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
      <Button
        onClick={async () => {
          if (values[0]) {
            // some regex to validate mail is ok would be nice
            const pwdHashed = await hash(pwd, 12);
            if (!hashKey) return;
            // @ts-ignore
            await axios.post(`/api/user/reset-password`, {
              token: hashKey as string,
              pwd: pwdHashed,
            });
          }
        }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default ResetPassword;
