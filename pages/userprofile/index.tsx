import { Spinner } from "@radix-ui/themes";
import UserProfileForm from "components/UserProfile/UserProfileForm";
import { useUserById } from "hooks/useUsers";
import { useAuth } from "contexts/AuthProviderNew";

const UserProfileContainer = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useUserById(user?.id || "");

  if (isLoading) return <Spinner size="3" />;
  if (error || !data) return <div>Error Loading User Profile</div>;

  return <UserProfileForm data={data} />;
};

export default UserProfileContainer;
