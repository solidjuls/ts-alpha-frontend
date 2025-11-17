import { Flex, Span } from "components/Atoms";
import { Button } from "components/Button";
import UserTypeahead from "pages/submitform/UserTypeahead"
import { useState } from "react";
import { DropdownItemType } from "types/types";
import getAxiosInstance from "utils/axios";
import { Title } from "./styles";
import { useQuery } from '@tanstack/react-query';
import { usersService } from 'services/users.service';

interface ReplacePlayersProps {
  tournament: string | undefined
}

const styles = { width: '200px', margin: '4px' }

const ReplacePlayers: React.FC<ReplacePlayersProps> = ({ tournament }) => {
  const [oldUser, setOldUser] = useState("")
  const [newUser, setNewUser] = useState("")
  const [responseMessage, setResponseMessage] = useState("")

  // Fetch users for the tournament using React Query and NestJS backend
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users', tournament],
    queryFn: async () => {
      if (!tournament) return [];
      return await usersService.getUsersByTournament(tournament);
    },
    enabled: !!tournament,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if(loadingUsers) return null

  const usersParsed: DropdownItemType[] =
    users?.map((item) => ({
      value: item.id,
      text: item.name,
    })) || [];

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
              users={usersParsed}
              placeholder="Player to replace..."
              css={styles}
              onBlur={() => setOldUser("")}
              onSelect={(value: DropdownItemType) =>
                setOldUser(value?.value as string)
              }
            />
            <UserTypeahead
              labelText="newPlayer"
              selectedItem={newUser}
              users={usersParsed}
              placeholder="Type the new player..."
              css={styles}
              onBlur={() => setNewUser("")}
              onSelect={(value: DropdownItemType) =>
                setNewUser(value?.value as string)
              }
            />
            <Button css={{ height: "40px", alignSelf: 'self-end' }} disabled={!oldUser || !newUser || !tournament} onClick={updatePlayers}>Update</Button>
          </Flex>
        <Span>{responseMessage}</Span>
      </Flex>
}

export default ReplacePlayers
