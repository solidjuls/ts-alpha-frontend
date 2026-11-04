import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { Spinner } from "@radix-ui/themes";
import ProtectedRoute from "components/ProtectedRoute";
import { useAuth } from "contexts/AuthProviderNew";
import { userRoles } from "utils/constants";
import { useUpcomingSchedules } from "hooks/useSchedule";
import { useScheduleAdmin } from "hooks/useTournaments";
import { UpcomingScheduleItem, ReminderEmailPayload, PlayerReminderPayload, PlayerReminderRequest, scheduleService } from "services/schedule.service";
import {
  PageTitle,
  ResponsiveContainer,
  LoadingContainer,
  CenteredResultsWrapper,
} from "components/Schedule/Schedule.styled";
import { Checkbox } from "components/Checkbox";
import { Button } from "components/Button";

type ReminderType = 1 | 5 | 15 | 30;

interface SentReminderRecord {
  gameCode: string;
  idUsa: string;
  idUssr: string;
  emailSentAt: string;
}

type SentRemindersMap = Record<ReminderType, Record<string, SentReminderRecord>>;

const REMINDER_EMAILS_STORAGE_KEY = "reminderEmailsSent";

const getEmptySentReminders = (): SentRemindersMap => ({
  30: {},
  15: {},
  5: {},
  1: {},
});

const loadSentReminders = (): SentRemindersMap => {
  if (typeof window === "undefined") return getEmptySentReminders();
  try {
    const raw = localStorage.getItem(REMINDER_EMAILS_STORAGE_KEY);
    if (!raw) return getEmptySentReminders();
    return { ...getEmptySentReminders(), ...JSON.parse(raw) };
  } catch {
    return getEmptySentReminders();
  }
};

const saveSentReminders = (map: SentRemindersMap) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMINDER_EMAILS_STORAGE_KEY, JSON.stringify(map));
};

interface PlayerSentRecord {
  sentAt: string;
  count: number;
}

type PlayerSideSentMap = Record<string, { usa?: PlayerSentRecord; ussr?: PlayerSentRecord }>;
type PlayerSentRemindersMap = Record<ReminderType, PlayerSideSentMap>;

const PLAYER_REMINDER_STORAGE_KEY = "playerReminderSent";

const getEmptyPlayerSentReminders = (): PlayerSentRemindersMap => ({
  30: {},
  15: {},
  5: {},
  1: {},
});

const loadPlayerSentReminders = (): PlayerSentRemindersMap => {
  if (typeof window === "undefined") return getEmptyPlayerSentReminders();
  try {
    const raw = localStorage.getItem(PLAYER_REMINDER_STORAGE_KEY);
    if (!raw) return getEmptyPlayerSentReminders();
    return { ...getEmptyPlayerSentReminders(), ...JSON.parse(raw) };
  } catch {
    return getEmptyPlayerSentReminders();
  }
};

const savePlayerSentReminders = (map: PlayerSentRemindersMap) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAYER_REMINDER_STORAGE_KEY, JSON.stringify(map));
};

interface PlayerRow {
  key: string;
  gameCode: string;
  dueDate: string;
  playerName: string;
  playerEmail: string;
  side: "usa" | "ussr";
}

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
const rowSentBg = "rgba(0, 180, 80, 0.08)";
const rowSentColor = "#00b450";

const RemindersContent = () => {
  const { user } = useAuth();
  const userId = user?.id || "";

  const [days, setDays] = useState<1 | 5 | 15 | 30>(15);
  const [includePast, setIncludePast] = useState(false);
  const [selectAllIncludingSent, setSelectAllIncludingSent] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [sentReminders, setSentReminders] = useState<SentRemindersMap>(getEmptySentReminders);
  const [individualMode, setIndividualMode] = useState<"none" | "ghostOp" | "bothOp">("none");
  const [playerSentReminders, setPlayerSentReminders] = useState<PlayerSentRemindersMap>(getEmptyPlayerSentReminders);
  const [showOnlyDue, setShowOnlyDue] = useState(false);

  useEffect(() => {
    setSentReminders(loadSentReminders());
    setPlayerSentReminders(loadPlayerSentReminders());
  }, []);

  const isEmailSent = useCallback(
    (item: UpcomingScheduleItem) => {
      const record = sentReminders[days]?.[item.gameCode];
      if (!record) return false;
      return record.idUsa === item.idUsa && record.idUssr === item.idUssr;
    },
    [sentReminders, days],
  );

  const getSentDate = useCallback(
    (item: UpcomingScheduleItem) => {
      const record = sentReminders[days]?.[item.gameCode];
      if (!record || record.idUsa !== item.idUsa || record.idUssr !== item.idUssr) return null;
      return record.emailSentAt;
    },
    [sentReminders, days],
  );

  const getPlayerSentRecord = useCallback(
    (gameCode: string, side: "usa" | "ussr"): PlayerSentRecord | null => {
      const record = playerSentReminders[days]?.[gameCode]?.[side];
      return record ?? null;
    },
    [playerSentReminders, days],
  );

  const isPlayerSent = useCallback(
    (gameCode: string, side: "usa" | "ussr"): boolean => {
      return getPlayerSentRecord(gameCode, side) !== null;
    },
    [getPlayerSentRecord],
  );

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

  const allRows: UpcomingScheduleItem[] = upcomingData ?? [];

  const isPastDue = (item: UpcomingScheduleItem): boolean => {
    const due = new Date(item.dueDate);
    due.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
  };

  const rows = showOnlyDue ? allRows.filter(isPastDue) : allRows;

  const rowKey = (item: UpcomingScheduleItem) =>
    `${item.idUsa}-${item.idUssr}-${item.gameCode}-${item.dueDate}`;

  const unsentRows = rows.filter((item) => !isEmailSent(item));
  const allUnsentSelected = unsentRows.length > 0 && unsentRows.every((item) => selectedIds.has(rowKey(item)));
  const allRowsSelected = rows.length > 0 && rows.every((item) => selectedIds.has(rowKey(item)));
  const headerCheckboxChecked = selectAllIncludingSent ? allRowsSelected : allUnsentSelected;

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
    if (selectAllIncludingSent) {
      if (allRowsSelected) {
        setSelectedIds(new Set());
      } else {
        setSelectedIds(new Set(rows.map(rowKey)));
      }
    } else {
      if (allUnsentSelected) {
        setSelectedIds(new Set());
      } else {
        setSelectedIds(new Set(unsentRows.map(rowKey)));
      }
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

  const calculateDaysLeft = (dueDateStr: string): number => {
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const buildReminderPayload = (items: UpcomingScheduleItem[]): ReminderEmailPayload[] =>
    items.map((item) => ({
      gameCode: item.gameCode,
      daysLeft: calculateDaysLeft(item.dueDate),
      dueDate: item.dueDate,
      usaEmail: item.emailUsa,
      ussrEmail: item.emailUssr,
      usaPlayerFullName: item.nameUsa,
      usaPlaydekName: item.playdekUsa,
      ussrPlayerFullName: item.nameUssr,
      ussrPlaydekName: item.playdekUssr,
      usaTimezone: item.timezoneUsa,
      ussrTimezone: item.timezoneUssr,
    }));

  const handleSendEmails = async () => {
    const selectedRows = rows.filter(
      (item) => selectedIds.has(rowKey(item)),
    );
    if (selectedRows.length === 0) return;

    setIsSending(true);
    setSendResult(null);
    try {
      const payload = buildReminderPayload(selectedRows);
      await scheduleService.sendReminderEmails(payload);

      const today = new Date().toISOString().split("T")[0];
      setSentReminders((prev) => {
        const next = { ...prev, [days]: { ...prev[days] } };
        selectedRows.forEach((item) => {
          next[days][item.gameCode] = {
            gameCode: item.gameCode,
            idUsa: item.idUsa,
            idUssr: item.idUssr,
            emailSentAt: today,
          };
        });
        saveSentReminders(next);
        return next;
      });

      setSendResult({ type: "success", message: `Reminder emails sent for ${selectedRows.length} game(s).` });
    } catch {
      setSendResult({ type: "error", message: "Failed to send reminder emails. Please try again." });
    } finally {
      setIsSending(false);
    }
  };

  const expandToPlayerRows = (items: UpcomingScheduleItem[]): PlayerRow[] => {
    const result: PlayerRow[] = [];
    for (const item of items) {
      result.push(
        {
          key: `player-${item.gameCode}-usa`,
          gameCode: item.gameCode,
          dueDate: item.dueDate,
          playerName: item.nameUsa,
          playerEmail: item.emailUsa,
          side: "usa",
        },
        {
          key: `player-${item.gameCode}-ussr`,
          gameCode: item.gameCode,
          dueDate: item.dueDate,
          playerName: item.nameUssr,
          playerEmail: item.emailUssr,
          side: "ussr",
        },
      );
    }
    return result;
  };

  const playerRows = expandToPlayerRows(rows);
  const unsentPlayerRows = playerRows.filter((p) => !isPlayerSent(p.gameCode, p.side));
  const allPlayerSelected = playerRows.length > 0 && playerRows.every((p) => selectedIds.has(p.key));
  const allUnsentPlayerSelected = unsentPlayerRows.length > 0 && unsentPlayerRows.every((p) => selectedIds.has(p.key));
  const headerCheckboxCheckedIndividual = selectAllIncludingSent ? allPlayerSelected : allUnsentPlayerSelected;

  const handleSendPlayerReminders = async () => {
    const selected = playerRows.filter((p) => selectedIds.has(p.key));
    if (selected.length === 0) return;

    setIsSending(true);
    setSendResult(null);
    try {
      const payload: PlayerReminderPayload[] = selected.map((p) => ({
        gameCode: p.gameCode,
        playerName: p.playerName,
        playerEmail: p.playerEmail,
      }));
      const request: PlayerReminderRequest = {
        data: payload,
        ghostOp: individualMode === "ghostOp",
        bothOp: individualMode === "bothOp",
      };
      const response = await scheduleService.sendPlayerReminderEmails(request);
      const today = new Date().toISOString().split("T")[0];

      setPlayerSentReminders((prev) => {
        const next = { ...prev, [days]: { ...prev[days] } };
        response.results.forEach((result) => {
          if (!result.success) return;
          const playerRow = selected.find(
            (p) => p.gameCode === result.gameCode && p.playerName === result.playerName,
          );
          if (!playerRow) return;
          const existing = next[days][playerRow.gameCode]?.[playerRow.side];
          const prevCount = existing?.count ?? 0;
          if (!next[days][playerRow.gameCode]) next[days][playerRow.gameCode] = {};
          next[days][playerRow.gameCode][playerRow.side] = {
            sentAt: today,
            count: prevCount + 1,
          };
        });
        savePlayerSentReminders(next);
        return next;
      });

      const successCount = response.results.filter((r) => r.success).length;
      const failCount = response.results.length - successCount;
      if (failCount > 0) {
        setSendResult({
          type: "success",
          message: `Sent ${successCount} player reminder(s). ${failCount} failed.`,
        });
      } else {
        setSendResult({ type: "success", message: `Sent ${successCount} player reminder(s).` });
      }
      setSelectedIds(new Set());
    } catch {
      setSendResult({ type: "error", message: "Failed to send player reminders. Please try again." });
    } finally {
      setIsSending(false);
    }
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

            <Checkbox
              checked={includePast}
              text="Include overdue"
              onCheckedChange={(v) => setIncludePast(v)}
            />

            <Checkbox
              checked={showOnlyDue}
              text="Show only due games"
              onCheckedChange={(v) => {
                setShowOnlyDue(v);
                setSelectedIds(new Set());
              }}
            />

            <Checkbox
              checked={selectAllIncludingSent}
              text="Select all (including sent)"
              onCheckedChange={(v) => setSelectAllIncludingSent(v)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
            <Checkbox
              checked={individualMode === "ghostOp"}
              text="Send reminder to individual players (ghost opponents)"
              onCheckedChange={(v) => {
                setIndividualMode(v ? "ghostOp" : "none");
                setSelectedIds(new Set());
              }}
            />

            <Checkbox
              checked={individualMode === "bothOp"}
              text="Send reminder to individual players (both opponents missing)"
              onCheckedChange={(v) => {
                setIndividualMode(v ? "bothOp" : "none");
                setSelectedIds(new Set());
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
            <Button
              onClick={individualMode !== "none" ? handleSendPlayerReminders : handleSendEmails}
              disabled={selectedIds.size === 0 || isSending}
              style={{
                gap: "8px",
              }}
            >
              {isSending && <Spinner size="1" />}
              {isSending
                ? "Sending..."
                : individualMode !== "none"
                  ? `Send Player Reminders${selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}`
                  : `Send Emails${selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}`}
            </Button>
          </div>

          {sendResult && (
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: sendResult.type === "success" ? "rgba(0, 180, 80, 0.1)" : "rgba(220, 40, 40, 0.1)",
                color: sendResult.type === "success" ? "#00b450" : "#dc2828",
                border: `1px solid ${sendResult.type === "success" ? "rgba(0, 180, 80, 0.3)" : "rgba(220, 40, 40, 0.3)"}`,
              }}
            >
              {sendResult.message}
            </div>
          )}

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
                      <Checkbox
                        checked={individualMode !== "none" ? headerCheckboxCheckedIndividual : headerCheckboxChecked}
                        text=""
                        onCheckedChange={() => {
                          if (individualMode !== "none") {
                            if (selectAllIncludingSent) {
                              setSelectedIds(allPlayerSelected ? new Set() : new Set(playerRows.map((p) => p.key)));
                            } else {
                              setSelectedIds(allUnsentPlayerSelected ? new Set() : new Set(unsentPlayerRows.map((p) => p.key)));
                            }
                          } else {
                            toggleAll();
                          }
                        }}
                        css={{ margin: 0 }}
                      />
                    </th>
                    {individualMode !== "none" ? (
                      <>
                        <th style={thStyle}>Player</th>
                        <th style={thStyle}>Side</th>
                        <th style={thStyle}>Game Code</th>
                        <th style={thStyle}>Due Date</th>
                        <th style={thStyle}>Status</th>
                      </>
                    ) : (
                      <>
                        <th style={thStyle}>USA</th>
                        <th style={thStyle}>USSR</th>
                        <th style={thStyle}>Game Code</th>
                        <th style={thStyle}>Due Date</th>
                        <th style={thStyle}>Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {individualMode !== "none"
                    ? [...playerRows]
                        .sort((a, b) => {
                          const aSent = isPlayerSent(a.gameCode, a.side);
                          const bSent = isPlayerSent(b.gameCode, b.side);
                          if (aSent === bSent) return 0;
                          return aSent ? 1 : -1;
                        })
                        .map((player) => {
                          const sent = isPlayerSent(player.gameCode, player.side);
                          const sentRecord = getPlayerSentRecord(player.gameCode, player.side);
                          const isSelected = selectedIds.has(player.key);
                          return (
                            <tr
                              key={player.key}
                              style={{
                                backgroundColor: sent ? rowSentBg : isSelected ? rowHoverBg : undefined,
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected && !sent) e.currentTarget.style.backgroundColor = rowHoverBg;
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected && !sent) e.currentTarget.style.backgroundColor = "";
                              }}
                            >
                              <td style={tdStyle}>
                                <Checkbox
                                  checked={isSelected}
                                  text=""
                                  onCheckedChange={() => {
                                    setSelectedIds((prev) => {
                                      const next = new Set(prev);
                                      if (next.has(player.key)) next.delete(player.key);
                                      else next.add(player.key);
                                      return next;
                                    });
                                  }}
                                  css={{ margin: 0 }}
                                  disabled={sent && !selectAllIncludingSent}
                                />
                              </td>
                              <td style={tdStyle}>
                                <div style={nameStyle}>{player.playerName}</div>
                                <div style={emailStyle}>{player.playerEmail}</div>
                              </td>
                              <td style={{ ...tdStyle, textTransform: "uppercase", fontSize: "12px", fontWeight: 600 }}>
                                {player.side}
                              </td>
                              <td style={tdStyle}>{player.gameCode}</td>
                              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{formatDueDate(player.dueDate)}</td>
                              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                                {sent && sentRecord ? (
                                  <span style={{ color: rowSentColor, fontSize: "13px" }}>
                                    Sent {sentRecord.count}x — {formatDueDate(sentRecord.sentAt)}
                                  </span>
                                ) : (
                                  <span style={{ opacity: 0.5, fontSize: "13px" }}>Not sent</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                    : [...rows]
                        .sort((a, b) => {
                          const aSent = isEmailSent(a);
                          const bSent = isEmailSent(b);
                          if (aSent === bSent) return 0;
                          return aSent ? 1 : -1;
                        })
                        .map((item) => {
                          const key = rowKey(item);
                          const isSelected = selectedIds.has(key);
                          const sent = isEmailSent(item);
                          const sentDate = getSentDate(item);
                          return (
                            <tr
                              key={key}
                              style={{
                                backgroundColor: sent ? rowSentBg : isSelected ? rowHoverBg : undefined,
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected && !sent) e.currentTarget.style.backgroundColor = rowHoverBg;
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected && !sent) e.currentTarget.style.backgroundColor = "";
                              }}
                            >
                              <td style={tdStyle}>
                                <Checkbox
                                  checked={isSelected}
                                  text=""
                                  onCheckedChange={() => toggleRow(item)}
                                  css={{ margin: 0 }}
                                  disabled={sent}
                                />
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
                              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                                {sent ? (
                                  <span style={{ color: rowSentColor, fontSize: "13px" }}>
                                    Sent {sentDate ? formatDueDate(sentDate) : ""}
                                  </span>
                                ) : (
                                  <span style={{ opacity: 0.5, fontSize: "13px" }}>Not sent</span>
                                )}
                              </td>
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
