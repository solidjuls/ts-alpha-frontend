import { Spinner } from "@radix-ui/themes";
import { getInfoFromCookies } from "utils/cookies";
import UserProfileForm from "./UserProfileForm";
import { ServerType } from "types/types";
import { useUserById } from "hooks/useUsers";

interface UserProfileProps {
  id: string;
}

const UserProfileContainer: React.FC<UserProfileProps> = ({ id }) => {
  const { data, isLoading, error } = useUserById(id);

  if (isLoading) return <Spinner size="3" />;
  if (error || !data) return <div>Error loading user profile</div>;

  return <UserProfileForm data={data} />;
};

export async function getServerSideProps({ req, res }: ServerType) {
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
