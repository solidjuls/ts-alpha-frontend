import { Tournament } from '../services/tournaments.service';

// Tournament status constants
export const TOURNAMENT_STATUS = {
  INITIAL: 1,
  REGISTRATION_OPEN: 2,
  REGISTRATION_CLOSED: 3,
  ONGOING: 4,
  CLOSED: 5
} as const;

export type TournamentStatusId = typeof TOURNAMENT_STATUS[keyof typeof TOURNAMENT_STATUS];

// Tournament status names
export const TOURNAMENT_STATUS_NAMES = {
  [TOURNAMENT_STATUS.INITIAL]: 'Initial',
  [TOURNAMENT_STATUS.REGISTRATION_OPEN]: 'Registration Open',
  [TOURNAMENT_STATUS.REGISTRATION_CLOSED]: 'Registration Closed',
  [TOURNAMENT_STATUS.ONGOING]: 'Ongoing',
  [TOURNAMENT_STATUS.CLOSED]: 'Closed'
} as const;

// Available actions for each status
export const TOURNAMENT_ACTIONS = {
  [TOURNAMENT_STATUS.INITIAL]: ['START_REGISTRATION'],
  [TOURNAMENT_STATUS.REGISTRATION_OPEN]: ['CLOSE_REGISTRATION'],
  [TOURNAMENT_STATUS.REGISTRATION_CLOSED]: ['START_TOURNAMENT'],
  [TOURNAMENT_STATUS.ONGOING]: ['CLOSE_TOURNAMENT'],
  [TOURNAMENT_STATUS.CLOSED]: []
} as const;

// Action to status mapping
export const ACTION_TO_STATUS = {
  START_REGISTRATION: TOURNAMENT_STATUS.REGISTRATION_OPEN,
  CLOSE_REGISTRATION: TOURNAMENT_STATUS.REGISTRATION_CLOSED,
  START_TOURNAMENT: TOURNAMENT_STATUS.ONGOING,
  CLOSE_TOURNAMENT: TOURNAMENT_STATUS.CLOSED
} as const;

// Action labels
export const ACTION_LABELS = {
  START_REGISTRATION: 'Start Registration',
  CLOSE_REGISTRATION: 'Close Registration',
  START_TOURNAMENT: 'Start Tournament',
  CLOSE_TOURNAMENT: 'Close Tournament'
} as const;

// Helper functions
export const tournamentStatusHelpers = {
  // Get status name
  getStatusName: (status_id: TournamentStatusId): string => {
    return TOURNAMENT_STATUS_NAMES[status_id] || 'Unknown';
  },

  // Get available actions for a status
  getAvailableActions: (status_id: TournamentStatusId): string[] => {
    return TOURNAMENT_ACTIONS[status_id] || [];
  },

  // Check if registration is allowed
  canRegister: (status_id: TournamentStatusId): boolean => {
    return status_id === TOURNAMENT_STATUS.REGISTRATION_OPEN;
  },

  // Check if waitlist registration is allowed
  canWaitlistRegister: (status_id: TournamentStatusId, waitlist: boolean): boolean => {
    return waitlist && (
      status_id === TOURNAMENT_STATUS.REGISTRATION_CLOSED || 
      status_id === TOURNAMENT_STATUS.ONGOING
    );
  },

  // Check if tournament can be edited
  canEdit: (status_id: TournamentStatusId): boolean => {
    return status_id === TOURNAMENT_STATUS.INITIAL || status_id === TOURNAMENT_STATUS.REGISTRATION_OPEN;
  },

  // Get next status for an action
  getNextStatus: (action: keyof typeof ACTION_TO_STATUS): TournamentStatusId => {
    return ACTION_TO_STATUS[action];
  },

  // Get action label
  getActionLabel: (action: keyof typeof ACTION_LABELS): string => {
    return ACTION_LABELS[action];
  }
};
