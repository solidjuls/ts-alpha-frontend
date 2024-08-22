import { Spinner } from "@radix-ui/themes";
import { EditTextComponent } from "components/EditFormComponents";
import { trpc } from "contexts/APIProvider";
import { useSession } from "contexts/AuthProvider";
import { NextApiRequest, NextApiResponse } from "next";
import { useState } from "react";
import type { UserProfileState } from "types/game.types";
import { getInfoFromCookies } from "utils/cookies";
import UserProfileForm from "./UserProfileForm";

const UserProfileContainer = () => {
  const { id } = useSession();
  const { data, isLoading } = trpc.useQuery(["user-get", { id }], {
    enabled: id !== undefined && id !== "",
  });

  // const [form, setForm] = useState<UserProfileState>(initialState);



  if (isLoading) return <Spinner size="3" />;
  console.log("id", data);
  if (!data) return null;
  return <UserProfileForm data={data} />;
};

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const payload = getInfoFromCookies(req, res);
  console.log("payload", payload);
  if (!payload) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { role: payload.role || null } };
}

export default UserProfileContainer;
