import { Spinner } from "@radix-ui/themes";
import { EditTextComponent } from "components/EditFormComponents";
import { useSession } from "contexts/AuthProvider";
import { NextApiRequest, NextApiResponse } from "next";
import { getInfoFromCookies } from "utils/cookies";
import UserProfileForm from "./UserProfileForm";
import useFetchInitialData from "hooks/useFetchInitialData";

const UserProfileContainer = () => {
  const { id } = useSession();
  const { data, error} = useFetchInitialData({ url: `/api/user?id=${id}` })

  // if (isLoading) return <Spinner size="3" />;
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
