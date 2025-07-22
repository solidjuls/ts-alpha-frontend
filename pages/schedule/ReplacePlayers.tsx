import { Flex } from "components/Atoms";
import { Button } from "components/Button";
import useFetchInitialData from "hooks/useFetchInitialData";
import UserTypeahead from "pages/submitform/UserTypeahead"
import { useState } from "react";
import { DropdownItemType } from "types/types";
import { UserType } from "types/user.types";

const ReplacePlayers = () => {
  const [oldUser, setOldUser] = useState("")
  const [newUser, setNewUser] = useState("")

  const { data: users, isLoading: loadingUsers } = useFetchInitialData<UserType[]>({
    url: "/api/user",
    cacheId: "user-list",
  });

  if(loadingUsers) return null

  const usersParsed: DropdownItemType[] =
    users?.map((item) => ({
      value: item.id,
      text: item.name,
    })) || [];

  // fetch users registered to tournaments only
  // add a submit change button that will update the schedule
  return <Flex>
          <UserTypeahead
            labelText="oldPlayer"
            selectedItem={oldUser}
            // error={form.opponentWas.error}
            users={usersParsed}
            placeholder="Player to replace..."
            css={{ width: '200px' }}
            onBlur={() => setOldUser("")}
            onSelect={(value: DropdownItemType) =>
              setOldUser(value?.value as string)
            }
          />
          <UserTypeahead
            labelText="newPlayer"
            selectedItem={newUser}
            // error={form.opponentWas.error}
            users={usersParsed}
            placeholder="Type the new player..."
            css={{ width: '200px' }}
            onBlur={() => setNewUser("")}
            onSelect={(value: DropdownItemType) =>
              setNewUser(value?.value as string)
            }
          />
          <Button>Update</Button>
        </Flex>
}

export default ReplacePlayers
