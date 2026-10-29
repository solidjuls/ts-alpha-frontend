import Head from "next/head";
import { useRouter } from "next/router";
import { Spinner } from "@radix-ui/themes";
import ProtectedRoute from "components/ProtectedRoute";
import { userRoles } from "utils/constants";
import { useSchedules } from "hooks/useSchedule";
import { Backbutton } from "components/Backbutton";
import ScheduleAdminDataBoxes from "components/ScheduleAdminDataBoxes/ScheduleAdminDataBoxes";

const SCHEDULE_ADMIN_TOURNAMENT_ID = "359";

const ScheduleAdminPage = () => {
  const router = useRouter();
  const tournamentId = (router.query.tournamentId as string) || SCHEDULE_ADMIN_TOURNAMENT_ID;

  const { data, isLoading, error } = useSchedules({
    tournamentId,
    fullSchedule: 1,
    pageSize: 9999,
    onlyPending: false,
  });

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

  const schedules = data?.results ?? [];
  const tournamentName = schedules[0]?.tournamentName || "Schedule Admin";

  return (
    <>
      <Head>
        <title>Schedule Admin - Twilight Struggle</title>
        <meta name="description" content="Tournament schedule administration" />
        <link rel="icon" href="/ts-icon.webp" />
      </Head>
      <div style={{ padding: "24px" }}>
        <Backbutton />
        <h1>{tournamentName}</h1>

        {tournamentId === SCHEDULE_ADMIN_TOURNAMENT_ID && (
          <ScheduleAdminDataBoxes
            schedules={schedules}
            tournamentId={tournamentId}
            tournamentName={tournamentName}
          />
        )}
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
