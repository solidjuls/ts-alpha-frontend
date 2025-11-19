import { createMachine, assign } from 'xstate';

// Tournament state machine context
export interface TournamentContext {
  tournamentId: string;
  waitlist: boolean;
  status_id: number;
  tournament_name: string;
  starting_date: Date | null;
  adminId: string[];
  adminName: string[];
  description?: string | null;
  error?: string;
}

// Tournament state machine events
export type TournamentEvent =
  | { type: 'START_REGISTRATION' }
  | { type: 'CLOSE_REGISTRATION' }
  | { type: 'START_TOURNAMENT' }
  | { type: 'CLOSE_TOURNAMENT' }
  | { type: 'ENABLE_WAITLIST' }
  | { type: 'DISABLE_WAITLIST' }
  | { type: 'UPDATE_TOURNAMENT'; data: Partial<TournamentContext> }
  | { type: 'ERROR'; error: string };

// Tournament states enum for better type safety
export enum TournamentState {
  INITIAL = 'initial',
  REGISTRATION_OPEN = 'registrationOpen',
  REGISTRATION_CLOSED = 'registrationClosed',
  ONGOING = 'ongoing',
  CLOSED = 'closed'
}

// Create the tournament state machine
export const tournamentStateMachine = createMachine({
  id: 'tournament',
  types: {} as {
    context: TournamentContext;
    events: TournamentEvent;
  },
  initial: TournamentState.INITIAL,
  context: {
    tournamentId: '',
    waitlist: false,
    status_id: 0,
    tournament_name: '',
    starting_date: null,
    adminId: [],
    adminName: [],
    description: null,
  },
  states: {
    [TournamentState.INITIAL]: {
      description: 'Initial Tournament is being published, registration is not started yet',
      on: {
        START_REGISTRATION: {
          target: TournamentState.REGISTRATION_OPEN,
          actions: assign({
            status_id: 1
          })
        },
        UPDATE_TOURNAMENT: {
          actions: assign(({ context, event }) => ({
            ...context,
            ...event.data
          }))
        },
        ENABLE_WAITLIST: {
          actions: assign({
            waitlist: true
          })
        },
        DISABLE_WAITLIST: {
          actions: assign({
            waitlist: false
          })
        },
        ERROR: {
          actions: assign({
            error: ({ event }) => event.error
          })
        }
      }
    },
    [TournamentState.REGISTRATION_OPEN]: {
      description: 'Registration is being started',
      on: {
        CLOSE_REGISTRATION: {
          target: TournamentState.REGISTRATION_CLOSED,
          actions: assign({
            status_id: 2
          })
        },
        START_TOURNAMENT: {
          target: TournamentState.ONGOING,
          actions: assign({
            status_id: 3
          })
        },
        UPDATE_TOURNAMENT: {
          actions: assign(({ context, event }) => ({
            ...context,
            ...event.data
          }))
        },
        ENABLE_WAITLIST: {
          actions: assign({
            waitlist: true
          })
        },
        DISABLE_WAITLIST: {
          actions: assign({
            waitlist: false
          })
        },
        ERROR: {
          actions: assign({
            error: ({ event }) => event.error
          })
        }
      }
    },
    [TournamentState.REGISTRATION_CLOSED]: {
      description: 'Registration is being closed. If waitlist=true, waitlist registration is open',
      on: {
        START_TOURNAMENT: {
          target: TournamentState.ONGOING,
          actions: assign({
            status_id: 3
          })
        },
        START_REGISTRATION: {
          target: TournamentState.REGISTRATION_OPEN,
          actions: assign({
            status_id: 1
          })
        },
        CLOSE_TOURNAMENT: {
          target: TournamentState.CLOSED,
          actions: assign({
            status_id: 4
          })
        },
        UPDATE_TOURNAMENT: {
          actions: assign(({ context, event }) => ({
            ...context,
            ...event.data
          }))
        },
        ENABLE_WAITLIST: {
          actions: assign({
            waitlist: true
          })
        },
        DISABLE_WAITLIST: {
          actions: assign({
            waitlist: false
          })
        },
        ERROR: {
          actions: assign({
            error: ({ event }) => event.error
          })
        }
      }
    },
    [TournamentState.ONGOING]: {
      description: 'Tournament is going on. We cannot register anymore. If waitlist=true, waitlist registration is open',
      on: {
        CLOSE_TOURNAMENT: {
          target: TournamentState.CLOSED,
          actions: assign({
            status_id: 4
          })
        },
        UPDATE_TOURNAMENT: {
          actions: assign(({ context, event }) => ({
            ...context,
            ...event.data
          }))
        },
        ENABLE_WAITLIST: {
          actions: assign({
            waitlist: true
          })
        },
        DISABLE_WAITLIST: {
          actions: assign({
            waitlist: false
          })
        },
        ERROR: {
          actions: assign({
            error: ({ event }) => event.error
          })
        }
      }
    },
    [TournamentState.CLOSED]: {
      description: 'Tournament is closed',
      type: 'final',
      on: {
        UPDATE_TOURNAMENT: {
          actions: assign(({ context, event }) => ({
            ...context,
            ...event.data
          }))
        },
        ERROR: {
          actions: assign({
            error: ({ event }) => event.error
          })
        }
      }
    }
  }
});

// Helper functions for state machine
export const tournamentStateMachineHelpers = {
  // Get current state from status_id
  getStateFromStatusId: (status_id: number): TournamentState => {
    switch (status_id) {
      case 0:
        return TournamentState.INITIAL;
      case 1:
        return TournamentState.REGISTRATION_OPEN;
      case 2:
        return TournamentState.REGISTRATION_CLOSED;
      case 3:
        return TournamentState.ONGOING;
      case 4:
        return TournamentState.CLOSED;
      default:
        return TournamentState.INITIAL;
    }
  },

  // Get status_id from state
  getStatusIdFromState: (state: TournamentState): number => {
    switch (state) {
      case TournamentState.INITIAL:
        return 0;
      case TournamentState.REGISTRATION_OPEN:
        return 1;
      case TournamentState.REGISTRATION_CLOSED:
        return 2;
      case TournamentState.ONGOING:
        return 3;
      case TournamentState.CLOSED:
        return 4;
      default:
        return 0;
    }
  },

  // Check if registration is allowed
  canRegister: (state: TournamentState): boolean => {
    return state === TournamentState.REGISTRATION_OPEN;
  },

  // Check if waitlist registration is allowed
  canWaitlistRegister: (state: TournamentState, waitlist: boolean): boolean => {
    return waitlist && (
      state === TournamentState.REGISTRATION_CLOSED ||
      state === TournamentState.ONGOING
    );
  },

  // Check if tournament can be edited
  canEdit: (state: TournamentState): boolean => {
    return state !== TournamentState.CLOSED;
  },

  // Get user-friendly state name
  getStateName: (state: TournamentState): string => {
    switch (state) {
      case TournamentState.INITIAL:
        return 'Initial';
      case TournamentState.REGISTRATION_OPEN:
        return 'Registration Open';
      case TournamentState.REGISTRATION_CLOSED:
        return 'Registration Closed';
      case TournamentState.ONGOING:
        return 'Ongoing';
      case TournamentState.CLOSED:
        return 'Closed';
      default:
        return 'Unknown';
    }
  },

  // Get available actions for current state
  getAvailableActions: (state: TournamentState): string[] => {
    switch (state) {
      case TournamentState.INITIAL:
        return ['START_REGISTRATION', 'ENABLE_WAITLIST', 'DISABLE_WAITLIST'];
      case TournamentState.REGISTRATION_OPEN:
        return ['CLOSE_REGISTRATION', 'START_TOURNAMENT', 'ENABLE_WAITLIST', 'DISABLE_WAITLIST'];
      case TournamentState.REGISTRATION_CLOSED:
        return ['START_REGISTRATION', 'START_TOURNAMENT', 'CLOSE_TOURNAMENT', 'ENABLE_WAITLIST', 'DISABLE_WAITLIST'];
      case TournamentState.ONGOING:
        return ['CLOSE_TOURNAMENT', 'ENABLE_WAITLIST', 'DISABLE_WAITLIST'];
      case TournamentState.CLOSED:
        return [];
      default:
        return [];
    }
  }
};
