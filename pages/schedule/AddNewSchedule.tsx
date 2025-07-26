import { Flex, Span } from "components/Atoms";
import { Button } from "components/Button";
import useFetchInitialData from "hooks/useFetchInitialData";
import UserTypeahead from "pages/submitform/UserTypeahead"
import { useState } from "react";
import { DropdownItemType } from "types/types";
import { UserType } from "types/user.types";
import getAxiosInstance from "utils/axios";
import DateComponent from "components/EditFormComponents/DateComponent";
import { EditTextComponent } from "components/EditFormComponents";

interface AddNewScheduleProps {
  tournament: string | undefined
}

const AddNewSchedule: React.FC<AddNewScheduleProps> = ({ tournament }) => {
  const [usaPlayer, setUsaPlayer] = useState("")
  const [ussrPlayer, setUssrPlayer] = useState("")
  const [gameCode, setGameCode] = useState("")
  const [dueDate, setDueDate] = useState<Date | null>(null)
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

  const addSchedule = async () => {
    await getAxiosInstance().put('/api/schedule', {
        data: {
            usa:usaPlayer,
            ussr:ussrPlayer,
            gc: gameCode,
            t:tournament,
            d: dueDate
        }
    })

    setResponseMessage(`New schedule added`)
  }
  console.log("!usaPlayer || !ussrPlayer || !tournament || !dueDate", usaPlayer, ussrPlayer, tournament, dueDate)
  return <Flex css={{ flexDirection: 'row' }}><Flex>
          <UserTypeahead
            labelText="usaPlayer"
            selectedItem={usaPlayer}
            users={usersParsed}
            placeholder="Type USA player name..."
            css={{ width: '200px' }}
            onBlur={() => setUsaPlayer("")}
            onSelect={(value: DropdownItemType) =>
              setUsaPlayer(value?.value as string)
            }
          />
          <UserTypeahead
            labelText="ussrPlayer"
            selectedItem={ussrPlayer}
            users={usersParsed}
            placeholder="Type USSR player name..."
            css={{ width: '200px' }}
            onBlur={() => setUssrPlayer("")}
            onSelect={(value: DropdownItemType) =>
              setUssrPlayer(value?.value as string)
            }
          />
           <DateComponent
                inputValue={dueDate}
                labelText="dueDate"
                onInputValueChange={(value: Date) => setDueDate(value)}
                />
            <EditTextComponent
                labelText="checkID"
                maxLength={4}
                inputValue={gameCode}
                onInputValueChange={(value) => setGameCode(value)}
                css={{ width: '60px' }}
            />
          <Button disabled={!usaPlayer || !ussrPlayer || !tournament || !dueDate} onClick={addSchedule}>Add Schedule</Button>
        </Flex>
        <Span>{responseMessage}</Span>
      </Flex>
}

export default AddNewSchedule
