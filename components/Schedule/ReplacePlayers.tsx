import { Flex, Span } from "components/Atoms";
import { Button } from "components/Button";
import UserTypeahead from "components/UserTypeahead"
import { useState } from "react";
// DropdownItemType is now used internally by UserTypeahead
import getAxiosInstance from "utils/axios";
import { Title } from "./styles";
// React Query and users service are now used internally by UserTypeahead

interface ReplacePlayersProps {
  tournament: string | undefined
}

const styles = { width: '200px', margin: '4px' }

const ReplacePlayers: React.FC<ReplacePlayersProps> = ({ tournament }) => {
  const [oldUser, setOldUser] = useState("")
  const [newUser, setNewUser] = useState("")
  const [responseMessage, setResponseMessage] = useState("")

  // Users are now fetched directly by the UserTypeahead components

  // Users are now fetched directly by the UserTypeahead components

  const updatePlayers = async () => {
    const updated = await getAxiosInstance().patch('/api/schedule', {
      data: {
        pold:oldUser,
        pnew:newUser,
        t:tournament
      }})

    setResponseMessage(`${updated?.data?.count} players have been updated`)
  }
  return <Flex css={{ flexDirection: 'column' }}>
          <Title>Replace Players</Title>
          <Flex css={{ marginBottom: '16px'}}>
            <UserTypeahead
              labelText="oldPlayer"
              selectedItem={oldUser}
              placeholder="Player to replace..."
              css={styles}
              onBlur={() => setOldUser("")}
              onSelect={(value) =>
                setOldUser(value?.value as string)
              }
            />
            <UserTypeahead
              labelText="newPlayer"
              selectedItem={newUser}
              placeholder="Type the new player..."
              css={styles}
              onBlur={() => setNewUser("")}
              onSelect={(value) =>
                setNewUser(value?.value as string)
              }
            />
            <Button css={{ height: "40px", alignSelf: 'self-end' }} disabled={!oldUser || !newUser || !tournament} onClick={updatePlayers}>Update</Button>
          </Flex>
        <Span>{responseMessage}</Span>
      </Flex>
}

export default ReplacePlayers
