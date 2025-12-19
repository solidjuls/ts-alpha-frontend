import { Flex, Span } from "components/Atoms";
import { Button } from "components/Button";
import UserTypeahead from "components/UserTypeahead"
import { useState } from "react";
import { useReplacePlayer } from "hooks/useSchedule";
import { Title } from "./styles";

interface ReplacePlayersProps {
  tournament: string | undefined
}

const ReplacePlayers: React.FC<ReplacePlayersProps> = ({ tournament }) => {
  const [oldUser, setOldUser] = useState("")
  const [newUser, setNewUser] = useState("")
  const [responseMessage, setResponseMessage] = useState("")

  const replacePlayerMutation = useReplacePlayer();

  const updatePlayers = async () => {
    if (!tournament || !oldUser || !newUser) return;

    try {
      const result = await replacePlayerMutation.mutateAsync({
        tournamentId: tournament,
        oldPlayerId: oldUser,
        newPlayerId: newUser
      });

      // The backend returns an object with updatedUSA, updatedUSSR, updatedStandings
      const totalUpdated = (result.updatedUSA?.count || 0) + (result.updatedUSSR?.count || 0);
      setResponseMessage(`${totalUpdated} schedule entries have been updated`);
    } catch (error) {
      console.error('Error replacing players:', error);
      setResponseMessage('Error updating players. Please try again.');
    }
  }
  return <Flex style={{ flexDirection: 'column' }}>
          <Title>Replace Players</Title>
          <Flex style={{ marginBottom: '16px', gap: '4px'}}>
            <UserTypeahead
              labelText="oldPlayer"
              selectedItem={oldUser}
              placeholder="Player to replace..."
              width="240px"
              onBlur={() => setOldUser("")}
              onSelect={(value) =>
                setOldUser(value?.value as string)
              }
            />
            <UserTypeahead
              labelText="newPlayer"
              selectedItem={newUser}
              placeholder="Type the new player..."
              width="240px"
              onBlur={() => setNewUser("")}
              onSelect={(value) =>
                setNewUser(value?.value as string)
              }
            />
            <Button
              style={{ height: "40px", alignSelf: 'flex-end' }}
              disabled={!oldUser || !newUser || !tournament || replacePlayerMutation.isPending}
              onClick={updatePlayers}
            >
              {replacePlayerMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </Flex>
        <Span>{responseMessage}</Span>
      </Flex>
}

export default ReplacePlayers
