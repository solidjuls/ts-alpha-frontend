"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { styled } from "stitches.config";

const Overlay = styled(Dialog.Overlay, {
  backgroundColor: "$overlay",
  position: "fixed",
  inset: 0,
});

const Content = styled(Dialog.Content, {
  backgroundColor: "white",
  borderRadius: "$lg",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  padding: "30px",
  width: "400px",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const Title = styled(Dialog.Title, {
  fontSize: "18px",
  fontWeight: 600,
  marginBottom: "$4",
});

const Description = styled(Dialog.Description, {
  color: "black",
  fontSize: "14px",
  marginBottom: "$4",
});

const ActionRow = styled("div", {
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
  marginTop: "16px",
});

const CloseButton = styled(Dialog.Close, {
  position: "absolute",
  top: "16px",
  right: "16px",
  background: "transparent",
  border: "none",
  color: "black",
  cursor: "pointer",
});

const TriggerButton = styled("button", {
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "8px 16px",
  cursor: "pointer",
  "&:hover": {
    opacity: 0.9,
  },
});

const CancelButton = styled(Dialog.Close, {
  backgroundColor: "$gray100",
  color: "$gray900",
  border: "none",
  borderRadius: "$lg",
  padding: "$2 $4",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "$gray900",
    color: "$white",
  },
});

const ConfirmButton = styled("button", {
  backgroundColor: "$primary",
  color: "$white",
  border: "none",
  borderRadius: "$lg",
  padding: "$2 $4",
  cursor: "pointer",
  "&:hover": {
    opacity: 0.9,
  },
});

export default function Modal() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleConfirm = () => {
    setModalOpen(false);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <TriggerButton>Open Modal</TriggerButton>
      </Dialog.Trigger>

      <Overlay />
      <Content>
        <Title>Confirm Action</Title>
        <Description>Are you sure you want to proceed with this action?</Description>

        <ActionRow>
          <CancelButton>Cancel</CancelButton>
          <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>
        </ActionRow>
      </Content>
    </Dialog.Root>
  );
}
