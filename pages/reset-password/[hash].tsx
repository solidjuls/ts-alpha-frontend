import { useState } from "react";
import { trpc } from "contexts/APIProvider";
import { hash } from "bcryptjs";
import { useRouter } from "next/router";
import { Label } from "components/Label";
import { Button } from "components/Button";
import { Box } from "components/Atoms";
import { PasswordInput } from "components/Input";

const decryptHash = (hash) => {
  let buff = Buffer.from(hash, "base64");
  return buff.toString("ascii");
};

const LabelInput = ({ inputValue, labelText, onChange }) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
      <Label css={{ width: "200px" }}>{labelText}</Label>
      <PasswordInput
        id="mail"
        margin="login"
        defaultValue={inputValue}
        onChange={(event) => onChange(event.target.value)}
        css={{ width: "300px" }}
      />
    </Box>
  );
};

const ResetPassword = () => {
  const mutation = trpc.useMutation(["user-update"]);
  const [pwd, setPwd] = useState<String>("");
  const [pwdConfirm, setPwdConfirm] = useState<String>("");
  const router = useRouter();
  const { hash: hashKey } = router.query;

  const decrypted = decryptHash(hashKey);
  const values = decrypted.split("#");
  const date = Date.parse(values[1]);
  console.log(Date.now() - date);
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

            mutation.mutate({
              mail: values[0],
              password: pwdHashed,
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
