import { useMachine } from '@xstate/react';
import { useCallback, useEffect } from 'react';
import { 
  tournamentStateMachine, 
  TournamentContext, 
  TournamentEvent, 
  TournamentState,
  tournamentStateMachineHelpers 
} from '../machines/tournamentStateMachine';
import { Tournament } from '../services/tournaments.service';

export interface UseTournamentStateMachineProps {
  tournament?: Tournament;
  onStateChange?: (state: TournamentState, context: TournamentContext) => void;
}

export const useTournamentStateMachine = ({ 
  tournament, 
  onStateChange 
}: UseTournamentStateMachineProps = {}) => {
  // Initialize the state machine
  const [state, send] = useMachine(tournamentStateMachine, {
    context: tournament ? {
      tournamentId: tournament.id,
      waitlist: tournament.waitlist, // Use waitlist property from tournament data
      status_id: tournament.status_id,
      tournament_name: tournament.tournament_name,
      starting_date: tournament.starting_date,
      adminId: tournament.adminId,
      adminName: tournament.adminName,
      description: tournament.description,
    } : undefined
  });

  // Update machine context when tournament data changes
  useEffect(() => {
    if (tournament) {
      send({
        type: 'UPDATE_TOURNAMENT',
        data: {
          tournamentId: tournament.id,
          waitlist: tournament.waitlist,
          status_id: tournament.status_id,
          tournament_name: tournament.tournament_name,
          starting_date: tournament.starting_date,
          adminId: tournament.adminId,
          adminName: tournament.adminName,
          description: tournament.description,
        }
      });
    }
  }, [tournament, send]);

  // Call onStateChange when state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state.value as TournamentState, state.context);
    }
  }, [state.value, state.context, onStateChange]);

  // Action handlers
  const startRegistration = useCallback(() => {
    send({ type: 'START_REGISTRATION' });
  }, [send]);

  const closeRegistration = useCallback(() => {
    send({ type: 'CLOSE_REGISTRATION' });
  }, [send]);

  const startTournament = useCallback(() => {
    send({ type: 'START_TOURNAMENT' });
  }, [send]);

  const closeTournament = useCallback(() => {
    send({ type: 'CLOSE_TOURNAMENT' });
  }, [send]);

  const enableWaitlist = useCallback(() => {
    send({ type: 'ENABLE_WAITLIST' });
  }, [send]);

  const disableWaitlist = useCallback(() => {
    send({ type: 'DISABLE_WAITLIST' });
  }, [send]);

  const updateTournament = useCallback((data: Partial<TournamentContext>) => {
    send({ type: 'UPDATE_TOURNAMENT', data });
  }, [send]);

  const reportError = useCallback((error: string) => {
    send({ type: 'ERROR', error });
  }, [send]);

  // Helper functions
  const currentState = state.value as TournamentState;
  const context = state.context;
  
  const canRegister = tournamentStateMachineHelpers.canRegister(currentState);
  const canWaitlistRegister = tournamentStateMachineHelpers.canWaitlistRegister(currentState, context.waitlist);
  const canEdit = tournamentStateMachineHelpers.canEdit(currentState);
  const stateName = tournamentStateMachineHelpers.getStateName(currentState);
  const availableActions = tournamentStateMachineHelpers.getAvailableActions(currentState);

  return {
    // State information
    currentState,
    context,
    stateName,
    availableActions,
    
    // Capabilities
    canRegister,
    canWaitlistRegister,
    canEdit,
    
    // Actions
    startRegistration,
    closeRegistration,
    startTournament,
    closeTournament,
    enableWaitlist,
    disableWaitlist,
    updateTournament,
    reportError,
    
    // Raw state machine access
    state,
    send
  };
};
