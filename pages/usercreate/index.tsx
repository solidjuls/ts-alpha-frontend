import { Spinner } from "@radix-ui/themes";
import { EditTextComponent } from "components/EditFormComponents";
import { useSession } from "contexts/AuthProvider";
import { NextApiRequest, NextApiResponse } from "next";
import { getInfoFromCookies } from "utils/cookies";
import UserCreateForm from "./UserCreateForm";
import useFetchInitialData from "hooks/useFetchInitialData";
import { userRoles } from "utils/constants";

const UserProfileContainer = ({ id }) => {
  const { data, isLoading } = useFetchInitialData({ url: `/api/countries` });

  if (isLoading) return <Spinner size="3" />;

  return (
    <UserCreateForm countries={data?.map((item) => ({ code: item.id, name: item.country_name }))} />
  );
};

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const payload = getInfoFromCookies(req, res);

  if (!payload || payload?.role !== userRoles.SUPERADMIN) {
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
