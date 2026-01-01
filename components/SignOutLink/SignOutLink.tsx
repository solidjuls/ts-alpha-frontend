import { FormattedMessage } from "react-intl";
import { SignOutButton } from "./SignOutLink.styled";
import { useRouter } from "next/router";
import { useLogout } from "hooks/useAuth";

export const SignOutLink = () => {
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleSignOut = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SignOutButton onClick={handleSignOut}>
      <FormattedMessage id="signOut" defaultMessage="Sign Out" />
    </SignOutButton>
  );
};
