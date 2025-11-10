"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import React from "react";

import LeaderboardForm from "./LeaderboardForm";

function LeaderboardFormModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button variant="solid" size="sm" onPress={onOpen}>
        Join Ranking
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col">
            Join the Ranking
            <span className="text-muted-foreground text-sm font-normal">
              Enter your username to join the leaderboard.
            </span>
          </ModalHeader>
          <ModalBody>
            <LeaderboardForm onSuccess={() => onOpenChange(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LeaderboardFormModal;
