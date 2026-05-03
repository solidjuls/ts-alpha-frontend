import React, { useState } from "react"
import type { Player } from './Playoffs'
import { Flex } from "components/Atoms"

interface OnClickProps {
    playerUsa: Player
    playerUssr: Player
    bo: string
    dueDate?: Date | undefined
}
interface CreatePlayoffScheduleProps {
    disabled: boolean
    playerUsa: Player
    playerUssr: Player
    dueDate?: Date | undefined
    onClick: (props: OnClickProps) => void
}
const CreatePlayoffsSchedule: React.FC<CreatePlayoffScheduleProps> = ({ disabled, playerUsa, playerUssr, dueDate, onClick }) => {
    const [bo, setBo] = useState<string>("1")

    const onButtonClick = () => {
        const confirmed = window.confirm(`A schedule ${playerUsa?.userName} vs ${playerUssr?.userName} will be created. Confirm?`);
        if (confirmed) {
            onClick({
                playerUsa,
                playerUssr,
                bo: "1",
                dueDate
            });
        }
    }
    return <Flex style={{ flexDirection: 'row' }}>
        <button title="Schedule match" style={scheduleButtonStyle} disabled={disabled} onClick={onButtonClick}>Create Schedule</button>
        <Flex style={{ flexDirection: 'row' }}>
            <input type="radio" id="bo1" name="drone" value="bo1" checked />
            <input type="radio" id="bo3" name="drone" value="bo3" />
            <input type="radio" id="bo5" name="drone" value="bo5" />
        </Flex>
    </Flex>
}

export { CreatePlayoffsSchedule }

const scheduleButtonStyle: React.CSSProperties = {
  padding: 0,
  color: 'black',
  border: 'none',
  fontSize: '12px',
  marginBottom: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
