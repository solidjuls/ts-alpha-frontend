---
name: Reminder email duplicate prevention via localStorage
description: Reminders page tracks sent emails in localStorage to prevent sending the same reminder type twice for a game, with player-change detection via idUsa/idUssr
type: project
category: common_pitfall
keywords:
  - "reminder email duplicate"
  - "localStorage sent tracking"
  - "idUsa idUssr player change"
usage_scenarios:
  - "Modifying reminders send flow"
  - "Changing duplicate detection logic"
  - "Updating localStorage record structure"
---

The Reminders page prevents sending the same reminder email type more than once per game by tracking sent emails in localStorage under key `reminderEmailsSent`.

Structure:
```ts
{ 30: { [gameCode]: { gameCode, idUsa, idUssr, emailSentAt } }, 15: {...}, 5: {...}, 1: {...} }
```

Each reminder type (30/15/5/1 days) has its own bucket keyed by `gameCode`. Records include `idUsa` and `idUssr` to detect player changes. `emailSentAt` is the ISO date string (`YYYY-MM-DD`).

Duplicate check compares all three fields: `gameCode` (via bucket key), `idUsa`, and `idUssr`. If any differ, the email is considered not sent — allowing re-send when players change.

On successful send, the game codes + player ids are recorded under the current `days` bucket. Before sending, rows with a matching record are filtered out and their checkboxes are disabled.

Sent rows display with a green-tinted background and a Status column showing "Sent [date]" (green) or "Not sent" (muted).

**Why:** The same email type should not be sent twice, but if players change for a game, the new players need to receive the reminder.

**How to apply:** When modifying the reminders send flow, preserve the localStorage read/write cycle. The `days` values (1/5/15/30) must match the bucket keys. Clearing localStorage resets the sent state.
