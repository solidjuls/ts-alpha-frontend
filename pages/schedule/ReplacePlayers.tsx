import { Flex, Span } from "components/Atoms";
import { Button } from "components/Button";
import useFetchInitialData from "hooks/useFetchInitialData";
import UserTypeahead from "pages/submitform/UserTypeahead"
import { useState } from "react";
import { DropdownItemType } from "types/types";
import { UserType } from "types/user.types";
import getAxiosInstance from "utils/axios";
import { Title, titleStyles } from "./styles";

interface ReplacePlayersProps {
  tournament: string | undefined
}

const styles = { width: '200px', margin: '4px' }

const ReplacePlayers: React.FC<ReplacePlayersProps> = ({ tournament }) => {
  const [oldUser, setOldUser] = useState("")
  const [newUser, setNewUser] = useState("")
  const [responseMessage, setResponseMessage] = useState("")

  const { data: users, isLoading: loadingUsers } = useFetchInitialData<UserType[]>({
    url: `/api/user?t=${tournament}`,
    cacheId: "user-list",
  });

  if(loadingUsers) return null

  const usersParsed: DropdownItemType[] =
    users?.map((item) => ({
      value: item.id,
      text: item.name,
    })) || [];

  const updatePlayers = async () => {
    const updated = await getAxiosInstance().patch('/api/schedule', {data: {
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
