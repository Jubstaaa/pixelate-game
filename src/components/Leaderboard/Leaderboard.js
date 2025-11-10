"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Trophy } from "lucide-react";
import React from "react";

import LeaderboardSkeleton from "./LeaderboardSkeleton";

import { useGetDeviceQuery, useGetLeaderboardQuery } from "@/lib/api/game-api";

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

export const Leaderboard = ({ isOpen, categoryId, level_type }) => {
  const { data: device } = useGetDeviceQuery();

  const { data = [], isLoading } = useGetLeaderboardQuery(
    { categoryId, level_type },
    {
      skip: !isOpen,
      refetchOnMountOrArgChange: true,
    },
  );

  if (isLoading) return <LeaderboardSkeleton />;

  return (
    <Table aria-label="Leaderboard" className="w-full text-sm">
      <TableHeader>
        <TableColumn className="text-left">Rank</TableColumn>
        <TableColumn className="text-left">User</TableColumn>
        <TableColumn className="text-left">Score</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((player, index) => {
          const isCurrentUser = player.device?.username === device?.username;

          return (
            <TableRow
              key={index}
              className={` ${getRankColor(index)} ${isCurrentUser ? "bg-primary/10 text-primary-700 ring-primary font-bold shadow-lg ring-2 ring-offset-2" : ""} `}
            >
              <TableCell>
                <span className={isCurrentUser ? "text-primary" : ""}>
                  {getRankIcon(index) || index + 1}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">{player.device.username}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-start gap-1">
                  <Trophy className="text-primary h-4 w-4" />
                  <span className={isCurrentUser ? "text-primary font-bold" : ""}>
                    {player.maxStreak}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
