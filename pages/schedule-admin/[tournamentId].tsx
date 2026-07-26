import Head from "next/head";
import { useRouter } from "next/router";
import { Spinner } from "@radix-ui/themes";
import ProtectedRoute from "components/ProtectedRoute";
import { userRoles } from "utils/constants";
import { useScheduleAdmin } from "hooks/useTournaments";

const boxStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: "200px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "12px",
  background: "var(--bg-card)",
  overflow: "auto",
};

const titleStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "8px",
  borderBottom: "1px solid var(--border)",
  paddingBottom: "6px",
};

const rowStyle: React.CSSProperties = {
  fontSize: "11px",
  lineHeight: "1.6",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

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

        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          {/* Forfeited Players */}
          <div style={boxStyle}>
            <div style={titleStyle}>
              Forfeited Players ({data?.summary.totalForfeitedPlayers ?? 0})
            </div>
            {data?.forfeitedPlayers.map((p) => (
              <div key={p.userId} style={rowStyle} title={p.fullName}>
                {p.fullName} ({p.rating})
              </div>
            ))}
            {data?.forfeitedPlayers.length === 0 && (
              <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
            )}
          </div>

          {/* Schedules Without Pair */}
          <div style={boxStyle}>
            <div style={titleStyle}>
              Schedules Without Pair ({data?.summary.totalSchedulesWithoutPair ?? 0})
            </div>
            {data?.schedulesWithoutPair.map((s) => (
              <div key={s.scheduleId} style={rowStyle} title={s.existingPlayer.fullName}>
                {s.existingPlayer.fullName} ({s.existingPlayer.rating}) — {s.gameCode}
              </div>
            ))}
            {data?.schedulesWithoutPair.length === 0 && (
              <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
            )}
          </div>

          {/* Waitlisted Players */}
          <div style={boxStyle}>
            <div style={titleStyle}>
              Waitlisted Players ({data?.summary.totalWaitlistPlayers ?? 0})
            </div>
            {data?.waitlistPlayers.map((p) => (
              <div key={p.userId} style={rowStyle} title={p.fullName}>
                {p.fullName} ({p.rating})
              </div>
            ))}
            {data?.waitlistPlayers.length === 0 && (
              <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
            )}
          </div>

          {/* Players Below Target */}
          <div style={boxStyle}>
            <div style={titleStyle}>
              Players Below {data?.summary.targetGamesPerPlayer ?? 20} Games ({data?.summary.totalPlayersBelowTarget ?? 0})
            </div>
            {data?.playersBelowTarget.map((p) => (
              <div key={p.userId} style={rowStyle} title={p.fullName}>
                {p.fullName} ({p.rating}) — {p.currentGames}/{data.summary.targetGamesPerPlayer} games
              </div>
            ))}
            {data?.playersBelowTarget.length === 0 && (
              <div style={{ ...rowStyle, opacity: 0.5 }}>None</div>
            )}
          </div>
        </div>
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
