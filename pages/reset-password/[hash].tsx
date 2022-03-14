import { useState } from "react";
import { trpc } from "utils/trpc";
import { hash } from "bcryptjs";
import { useRouter } from "next/router";
import { Label } from "components/Label";
import { Button } from "components/Button";
import { Box } from "components/Atoms";
import { Input } from "components/Input";

const decryptHash = (hash: string) => {
  let buff = Buffer.from(hash, "base64");
  return buff.toString("ascii");
};

const ResetPassword = () => {
  const mutation = trpc.useMutation(["user-update"]);
  const [pwd, setPwd] = useState<string>("");
  const router = useRouter();
  const { hash: hashKey } = router.query;

  const decrypted = decryptHash(hashKey as string);
  const values = decrypted.split("#");
  const date = Date.parse(values[1]);
console.log(Date.now() - date)
  if (date === NaN) return <div>Link invalid</div>;
  if ((Date.now() - date) / 1000 > 3600) return <div>Link outdated</div>;

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
      <Label htmlFor="mail">Add your new password</Label>
      <Input
        type="text"
        id="mail"
        margin="login"
        onChange={(event) => setPwd(event.target.value)}
        css={{ width: "300px" }}
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
