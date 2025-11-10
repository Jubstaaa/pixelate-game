"use client";

import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
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
          <ModalHeader className="flex flex-col items-start gap-1">
            Share your thoughts
            <span className="text-muted-foreground text-sm font-normal">
              We&apos;d love to hear your feedback.
            </span>
          </ModalHeader>
          <ModalBody>
            <Feedback onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
