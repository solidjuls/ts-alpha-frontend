import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "styled-components";
import { Flex } from "components/Atoms";
import type { Player } from './Playoffs'
import { Checkbox } from "components/Checkbox";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  defaultBO: '1'| '3' | '5'
  playerUsa: CreatePlayoffScheduleProps["playerUsa"];
  playerUssr: CreatePlayoffScheduleProps["playerUssr"];
  dueDate: CreatePlayoffScheduleProps["dueDate"];
  onClick: CreatePlayoffScheduleProps["onClick"]
  onConfirm: () => void;
  onCancel: () => void;
};

interface OnClickProps {
    playerUsa: Player
    playerUssr: Player
    bo: string
    dueDate?: Date | undefined
}
interface CreatePlayoffScheduleProps {
    defaultBO: '1' | '3' | '5'
    playerUsa: Player
    playerUssr: Player
    dueDate?: Date | undefined
    onClick: (props: OnClickProps) => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Confirm Action",
  onClick,
  confirmText = "Confirm",
  cancelText = "Cancel",
  playerUsa,
  playerUssr,
  dueDate,
  defaultBO,
  onConfirm,
  onCancel,
}) => {
    const [bo, setBo] = useState<string>(defaultBO)

    const onButtonClick = async () => {
        await onClick({
            playerUsa,
            playerUssr,
            bo,
            dueDate
        });
        onConfirm()
    }
   
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <Dialog.Portal>
        <Overlay />

        <Content>
          <Title>{title}</Title>
            <Description>The schedule for players{" "}
                <strong>{playerUsa?.userName}</strong>
                {" vs "}
                <strong>{playerUssr?.userName}</strong>
                {" will be created"}
            </Description>
            <Flex style={{ flexDirection: 'row' }}>
                <Checkbox text="BO1" checked={bo === "1"} onCheckedChange={() => setBo("1")} />
                <Checkbox text="BO3" checked={bo === "3"} onCheckedChange={() => setBo("3")} />
                <Checkbox text="BO5" checked={bo === "5"} onCheckedChange={() => setBo("5")} />
            </Flex>
          <ButtonRow>
            <CancelButton type="button" onClick={onCancel}>
              {cancelText}
            </CancelButton>

            <ConfirmButton type="button" onClick={onButtonClick}>
              {confirmText}
            </ConfirmButton>
          </ButtonRow>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};


const CreatePlayoffsSchedule: React.FC<CreatePlayoffScheduleProps> = ({ defaultBO = "1", playerUsa, playerUssr, dueDate, onClick }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        O
      </button>

      <ConfirmModal
        open={open}
        title="Create schedule"
        description="This action cannot be undone."
        confirmText="Confirm"
        cancelText="Cancel"
        defaultBO={defaultBO}
        playerUsa={playerUsa}
        playerUssr={playerUssr}
        dueDate={dueDate}
        onClick={onClick}
        onConfirm={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
}

/* Styled Components */

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 90vw;
  max-width: 420px;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  outline: none;
`;

const Title = styled(Dialog.Title)`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const Description = styled(Dialog.Description)`
  margin-top: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const BaseButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled(BaseButton)`
  background: #f1f1f1;
  color: #222;
`;

const ConfirmButton = styled(BaseButton)`
  background: #111;
  color: white;
`;

export { CreatePlayoffsSchedule }

// import React, { useState } from "react"
// import type { Player } from './Playoffs'
// import { Flex } from "components/Atoms"

// interface OnClickProps {
//     playerUsa: Player
//     playerUssr: Player
//     bo: string
//     dueDate?: Date | undefined
// }
// interface CreatePlayoffScheduleProps {
//     disabled: boolean
//     playerUsa: Player
//     playerUssr: Player
//     dueDate?: Date | undefined
//     onClick: (props: OnClickProps) => void
// }
// const CreatePlayoffsSchedule: React.FC<CreatePlayoffScheduleProps> = ({ disabled, playerUsa, playerUssr, dueDate, onClick }) => {
//     const [bo, setBo] = useState<string>("1")

//     const onButtonClick = () => {
//         const confirmed = window.confirm(`A schedule ${playerUsa?.userName} vs ${playerUssr?.userName} will be created. Confirm?`);
//         if (confirmed) {
//             onClick({
//                 playerUsa,
//                 playerUssr,
//                 bo,
//                 dueDate
//             });
//         }
//     }
//     return <Flex style={{ flexDirection: 'row' }}>
//         <button title="Schedule match" style={scheduleButtonStyle} disabled={disabled} onClick={onButtonClick}>Create Schedule</button>
//         <Flex style={{ flexDirection: 'row' }}>
//             <input type="radio" id="bo1" name="drone" value="1" checked={bo === "1"} onChange={(e) => setBo(e.target.value)} />
//             <input type="radio" id="bo3" name="drone" value="3" checked={bo === "3"} onChange={(e) => setBo(e.target.value)}  />
//             <input type="radio" id="bo5" name="drone" value="5" checked={bo === "5"} onChange={(e) => setBo(e.target.value)}  />
//         </Flex>
//     </Flex>
// }

// export { CreatePlayoffsSchedule }

// const scheduleButtonStyle: React.CSSProperties = {
//   padding: 0,
//   color: 'black',
//   border: 'none',
//   fontSize: '12px',
//   marginBottom: '4px',
//   cursor: 'pointer',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// };
