import Head from "next/head";
import { useRouter } from "next/router";
import { Spinner } from "@radix-ui/themes";
import ProtectedRoute from "components/ProtectedRoute";
import { userRoles } from "utils/constants";
import { useScheduleAdmin } from "hooks/useTournaments";

const ScheduleAdminPage = () => {
  const router = useRouter();
  const tournamentId = router.query.tournamentId as string;

  const { data, isLoading, error } = useScheduleAdmin(tournamentId);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <Spinner size="3" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", color: "var(--ussr)" }}>
        Error: {(error as Error).message}
      </div>
    );
  }

  if (data) {
    console.log("Schedule Admin Response:", data);
  }

  return (
    <>
      <Head>
        <title>Schedule Admin - Twilight Struggle</title>
        <meta name="description" content="Tournament schedule administration" />
        <link rel="icon" href="/ts-icon.webp" />
      </Head>
      <div style={{ padding: "24px" }}>
        <h1>{data?.tournamentName || "Schedule Admin"}</h1>
      </div>
    </>
  );
};

const WrappedScheduleAdminPage = () => (
  <ProtectedRoute requiredRole={userRoles.PLAYER}>
    <ScheduleAdminPage />
  </ProtectedRoute>
);

export default WrappedScheduleAdminPage;
