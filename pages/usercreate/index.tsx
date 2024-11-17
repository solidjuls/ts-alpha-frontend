import { Spinner } from "@radix-ui/themes";
import { EditTextComponent } from "components/EditFormComponents";
import { useSession } from "contexts/AuthProvider";
import { NextApiRequest, NextApiResponse } from "next";
import { getInfoFromCookies } from "utils/cookies";
import UserProfileForm from "./UserCreateForm";
import useFetchInitialData from "hooks/useFetchInitialData";

const UserProfileContainer = ({ id }) => {
  const { data, isLoading } = useFetchInitialData({ url: `/api/countries` });

  if (isLoading) return <Spinner size="3" />;
console.log("countries", data)
  return <div></div>;
};

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const payload = getInfoFromCookies(req, res);

  if (!payload) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { id: payload.id || null } };
}

export default UserProfileContainer;