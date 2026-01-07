import { useState } from "react";
import styled from "styled-components";
import { Button } from "components/Button";
import { StyledLabel } from "components/DisplayInfo/DisplayInfo.styled";
import { useWaitlistPlayers, useAddToWaitlist, useRemoveFromWaitlist } from "hooks/useTournaments";
import { useAllUsers } from "hooks/useUsers";
import { User } from "services/users.service";
import UserTypeahead from "components/UserTypeahead";
import { DropdownItemType } from "types/types";
import { userRoles } from "utils/constants";

const WaitlistContainer = styled.div`
  margin-top: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  flex: 1 1 auto;
`;

const WaitlistHeader = styled.div`
  padding: 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddUserFlex = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PlayerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PlayerName = styled.span`
  font-weight: 500;
  color: #111827;
`;

const PlayerEmail = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const WaitlistDate = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const EmptyStateContainer = styled.div`
  padding: 20px;
  text-align: center;
  color: #6b7280;
`;

const PlayersContainer = styled.div`
  /* Container for all player rows */
`;

interface TournamentWaitlistProps {
  tournamentId: string;
  userRole: number;
  isAdmin: boolean;
  onPlayerRemoved?: () => void;
}

const TournamentWaitlist: React.FC<TournamentWaitlistProps> = ({
  tournamentId,
  userRole,
  onPlayerRemoved,
  isAdmin,
}) => {
  const [selectedUser, setSelectedUser] = useState<DropdownItemType | null>(null);
  
  const { data: waitlistPlayers, isLoading } = useWaitlistPlayers(parseInt(tournamentId));
  const { data: usersData } = useAllUsers(1, 2000);
  const addToWaitlistMutation = useAddToWaitlist();
  const removeFromWaitlistMutation = useRemoveFromWaitlist();


  const handleAddToWaitlist = async () => {
    if (!selectedUser) return;

    try {
      await addToWaitlistMutation.mutateAsync({
        tournamentId: parseInt(tournamentId),
        data: { userId: selectedUser.value }
      });
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to add to waitlist:', error);
    }
  };

  const handleRemoveFromWaitlist = async (waitlistId: number, userId?: string) => {
    try {
      await removeFromWaitlistMutation.mutateAsync({
        tournamentId: parseInt(tournamentId),
        data: { waitlistId: waitlistId.toString() }
      });
      onPlayerRemoved?.();
    } catch (error) {
      console.error('Failed to remove from waitlist:', error);
    }
  };

  const userOptions: DropdownItemType[] = usersData?.users?.map((user: User) => ({
    label: `${user.first_name} ${user.last_name}`,
    value: user.id.toString(),
  })) || [];

  if (isLoading) {
    return <div>Loading waitlist...</div>;
  }

  return (
    <WaitlistContainer>
      <WaitlistHeader>
        <HeaderFlex>
          {isAdmin && (
            <AddUserFlex>
              <UserTypeahead
                options={userOptions}
                selectedOption={selectedUser}
                onSelect={setSelectedUser}
                placeholder="Add user to waitlist..."
              />
              <Button
                onClick={handleAddToWaitlist}
                disabled={!selectedUser || addToWaitlistMutation.isPending}
                style={{ minWidth: "80px" }}
              >
                {addToWaitlistMutation.isPending ? "Adding..." : "Add"}
              </Button>
            </AddUserFlex>
          )}
        </HeaderFlex>
      </WaitlistHeader>

      {!waitlistPlayers || waitlistPlayers.length === 0 ? (
        <EmptyStateContainer>
          No players on waitlist.
        </EmptyStateContainer>
      ) : (
        <PlayersContainer>
          {waitlistPlayers.map((player, index) => (
            <PlayerRow key={player.waitlistId}>
              <PlayerInfo>
                <PlayerName>
                  #{index + 1} - {player.name}
                </PlayerName>
                {isAdmin && player.email && (
                  <PlayerEmail>{player.email}</PlayerEmail>
                )}
                <WaitlistDate>
                  Waitlisted: {new Date(player.waitlistedAt).toLocaleDateString()}
                </WaitlistDate>
              </PlayerInfo>
              {isAdmin && (
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleRemoveFromWaitlist(player.waitlistId, player.userId)}
                  disabled={removeFromWaitlistMutation.isPending}
                >
                  Remove
                </Button>
              )}
            </PlayerRow>
          ))}
        </PlayersContainer>
      )}
    </WaitlistContainer>
  );
};

export default TournamentWaitlist;
