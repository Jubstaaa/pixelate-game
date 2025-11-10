"use client";

import { Button, Modal, ModalContent, useDisclosure } from "@heroui/react";
import { MessageSquare } from "lucide-react";
import React from "react";

import Feedback from "./Feedback";

export default function FeedbackModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Button variant="bordered" size="sm" onPress={onOpen}>
        <MessageSquare className="h-4 w-4" />
        Feedback
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="sm:max-w-[425px]">
          <Feedback onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
}
