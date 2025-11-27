import { Spinner } from "@radix-ui/themes";
import UserProfileForm from "./UserProfileForm";
import { useUserById } from "hooks/useUsers";
import { useAuth } from "contexts/AuthProviderNew";

const UserProfileContainer = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useUserById(user?.id || "");

  if (isLoading) return <Spinner size="3" />;
  if (error || !data) return <div>Error loading user profile</div>;

  return <UserProfileForm data={data} />;
};



export default UserProfileContainer;
