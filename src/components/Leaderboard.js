"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart2, Trophy } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import LeaderboardForm from "./LeaderboardForm";

const getRankColor = (index) => {
  switch (index) {
    case 0:
      return "bg-yellow-500/10 text-yellow-500";
    case 1:
      return "bg-gray-500/10 text-gray-500";
    case 2:
      return "bg-orange-500/10 text-orange-500";
    default:
      return "";
  }
};

const getRankIcon = (index) => {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return <>&nbsp;&nbsp;{index + 1}</>;
  }
};

export const Leaderboard = ({ data, username }) => {
  const t = useTranslations("Leaderboard");

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[72px]">
          <BarChart2 className="w-5 h-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className="inset-x-auto mt-0 h-full right-2 top-2 bottom-2 fixed outline-none w-[310px] flex flex-col"
        style={{ "--initial-transform": "calc(100% + 8px)" }}
      >
        <DrawerHeader className="text-center grid-cols-2 items-center">
          <DrawerTitle>{t("Title")}</DrawerTitle>
          {!username && <LeaderboardForm />}
        </DrawerHeader>
        <ScrollArea className="flex-grow px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Rank")}</TableHead>
                <TableHead>{t("User")}</TableHead>
                <TableHead>{t("Score")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {data.map((player, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`${getRankColor(index)}`}
                  >
                    <TableCell>{getRankIcon(index) || index + 1}</TableCell>
                    <TableCell>{player.device.username}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-start space-x-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>{player.maxStreak}</span>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
