"use client";

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@heroui/react";
import { BarChart2 } from "lucide-react";
import React from "react";

import { Leaderboard } from "./Leaderboard";
import LeaderboardFormModal from "./LeaderboardFormModal";

import { useGetDeviceQuery } from "@/lib/api/game-api";

export const LeaderboardDrawer = ({ categoryId, level_type }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: device } = useGetDeviceQuery();

  return (
    <>
      <Button variant="bordered" size="lg" onPress={onOpen}>
        <BarChart2 className="h-5 w-5" />
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="right"
        size="md"
        classNames={{
          wrapper: "z-[1200]",
          backdrop: "z-[1100]",
          base: "z-[1200]",
        }}
      >
        <DrawerContent>
          <DrawerHeader className="justify-between">
            LeaderboardDrawer
            {!device?.username && <LeaderboardFormModal />}
          </DrawerHeader>
          <DrawerBody className="px-4 pb-6">
            <Leaderboard isOpen={isOpen} categoryId={categoryId} level_type={level_type} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
