import { useEffect } from "react";
import { useRouter } from "next/router";
import { useIsAuthenticated } from "hooks/useAuth";

const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
const allowedUsers = (process.env.NEXT_PUBLIC_ALLOWED_USERS || "").split(",").filter(Boolean);

export const MaintenanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user } = useIsAuthenticated();

  useEffect(() => {
    if (!isMaintenanceMode) return;
    if (router.pathname === "/maintenance" || router.pathname === "/login") return;

    const userId = user?.id?.toString();
    if (userId && allowedUsers.includes(userId)) return;

    router.replace("/maintenance");
  }, [router, user?.id]);

  if (isMaintenanceMode && router.pathname !== "/maintenance" && router.pathname !== "/login") {
    const userId = user?.id?.toString();
    if (!userId || !allowedUsers.includes(userId)) {
      return null;
    }
  }

  return <>{children}</>;
};
