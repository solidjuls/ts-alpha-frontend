import Head from "next/head";
import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { CheckIcon } from "@radix-ui/react-icons";
import ProtectedRoute from "components/ProtectedRoute";
import { useAuth } from "contexts/AuthProviderNew";
import { userRoles } from "utils/constants";
import { useUpcomingSchedules } from "hooks/useSchedule";
import { useScheduleAdmin } from "hooks/useTournaments";
import { UpcomingScheduleItem } from "services/schedule.service";
import {
  PageTitle,
  ResponsiveContainer,
  LoadingContainer,
  CenteredResultsWrapper,
} from "components/Schedule/Schedule.styled";
import { StyledCheckbox, StyledIndicator } from "components/Checkbox/Checkbox.styled";

const REMINDER_TOURNAMENT_ID = "359";

const daysOptions: { value: 1 | 5 | 15 | 30; label: string }[] = [
  { value: 1, label: "1 day" },
  { value: 5, label: "5 days" },
  { value: 15, label: "15 days" },
  { value: 30, label: "30 days" },
];

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "4px",
  marginTop: "16px",
};

const controlsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginTop: "12px",
  marginBottom: "12px",
  flexWrap: "wrap",
};

const selectStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "1px solid var(--border)",
  background: "var(--bg-card)",
  color: "var(--primary-text)",
  fontSize: "14px",
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
  borderRadius: "12px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--bg-card)",
  boxShadow: "var(--shadow-soft)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  color: "var(--primary-text)",
  fontSize: "14px",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  borderBottom: "1px solid var(--border)",
  fontWeight: 600,
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "top",
};

const nameStyle: React.CSSProperties = {
  fontWeight: 500,
  lineHeight: 1.4,
};

const emailStyle: React.CSSProperties = {
  fontSize: "12px",
  opacity: 0.75,
  lineHeight: 1.4,
};

const rowHoverBg = "var(--bg-main)";

const RemindersContent = () => {
  const { user } = useAuth();
  const userId = user?.id || "";

  const [days, setDays] = useState<1 | 5 | 15 | 30>(15);
  const [includePast, setIncludePast] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: scheduleData } = useScheduleAdmin(REMINDER_TOURNAMENT_ID);
  const isTournamentAdmin = scheduleData?.tournament?.adminId?.includes(userId) ?? false;

  const { data: upcomingData, isLoading, isFetching } = useUpcomingSchedules({
    tournamentId: REMINDER_TOURNAMENT_ID,
    days,
    includePast: includePast || undefined,
  });

  if (!isLoading && user?.role !== userRoles.SUPERADMIN && !isTournamentAdmin) {
    return (
      <>
        <Head>
          <title>Reminders - Twilight Struggle</title>
          <link rel="icon" href="/ts-icon.webp" />
        </Head>
        <ResponsiveContainer>
          <LoadingContainer>
            <CenteredResultsWrapper>
              You don&apos;t have permission to access this page.
            </CenteredResultsWrapper>
          </LoadingContainer>
        </ResponsiveContainer>
      </>
    );
  }

  const rows: UpcomingScheduleItem[] = upcomingData ?? [];

  const allSelected = rows.length > 0 && selectedIds.size === rows.length;

  const rowKey = (item: UpcomingScheduleItem) =>
    `${item.idUsa}-${item.idUssr}-${item.gameCode}-${item.dueDate}`;

  const toggleRow = (item: UpcomingScheduleItem) => {
    const key = rowKey(item);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map(rowKey)));
    }
  };

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Head>
        <title>Reminders - Twilight Struggle</title>
        <link rel="icon" href="/ts-icon.webp" />
      </Head>
      <ResponsiveContainer>
        <div style={containerStyle}>
          <PageTitle>Reminders</PageTitle>

          <div style={controlsStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "var(--primary-text)" }}>
                Due within:
              </label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value) as 1 | 5 | 15 | 30)}
                style={selectStyle}
              >
                {daysOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              role="checkbox"
              aria-checked={includePast}
              tabIndex={0}
              onClick={() => setIncludePast((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setIncludePast((v) => !v);
                }
              }}
              style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            >
              <StyledCheckbox checked={includePast}>
                <StyledIndicator>
                  <CheckIcon width={20} height={20} />
                </StyledIndicator>
              </StyledCheckbox>
              <span style={{ fontSize: "14px", color: "var(--primary-text)" }}>Include overdue</span>
            </div>
          </div>

          {isLoading ? (
            <LoadingContainer>
              <CenteredResultsWrapper>
                <Spinner />
              </CenteredResultsWrapper>
            </LoadingContainer>
          ) : rows.length === 0 ? (
            <LoadingContainer>
              <CenteredResultsWrapper>
                No upcoming schedules found.
              </CenteredResultsWrapper>
            </LoadingContainer>
          ) : (
            <div style={{ ...tableWrapperStyle, opacity: isFetching ? 0.6 : 1, transition: "opacity 0.2s" }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: "40px" }}>
                      <StyledCheckbox checked={allSelected} onCheckedChange={toggleAll}>
                        <StyledIndicator>
                          <CheckIcon width={16} height={16} />
                        </StyledIndicator>
                      </StyledCheckbox>
                    </th>
                    <th style={thStyle}>USA</th>
                    <th style={thStyle}>USSR</th>
                    <th style={thStyle}>Game Code</th>
                    <th style={thStyle}>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => {
                    const key = rowKey(item);
                    const isSelected = selectedIds.has(key);
                    return (
                      <tr
                        key={key}
                        style={{ backgroundColor: isSelected ? rowHoverBg : undefined }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = rowHoverBg;
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = "";
                        }}
                      >
                        <td style={tdStyle}>
                          <StyledCheckbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRow(item)}
                          >
                            <StyledIndicator>
                              <CheckIcon width={16} height={16} />
                            </StyledIndicator>
                          </StyledCheckbox>
                        </td>
                        <td style={tdStyle}>
                          <div style={nameStyle}>{item.nameUsa}</div>
                          <div style={emailStyle}>{item.emailUsa}</div>
                        </td>
                        <td style={tdStyle}>
                          <div style={nameStyle}>{item.nameUssr}</div>
                          <div style={emailStyle}>{item.emailUssr}</div>
                        </td>
                        <td style={tdStyle}>{item.gameCode}</td>
                        <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{formatDueDate(item.dueDate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ResponsiveContainer>
    </>
  );
};

const RemindersPage = () => (
  <ProtectedRoute requiredRole={userRoles.PLAYER}>
    <RemindersContent />
  </ProtectedRoute>
);

export default RemindersPage;
