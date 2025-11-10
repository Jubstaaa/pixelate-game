"use client";

import {
  Skeleton,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import React from "react";

export default function LeaderboardSkeleton() {
  const rows = new Array(20).fill(0);
  return (
    <Table aria-label="Loading leaderboard" className="w-full text-sm">
      <TableHeader>
        <TableColumn className="text-left">Rank</TableColumn>
        <TableColumn className="text-left">User</TableColumn>
        <TableColumn className="text-left">Score</TableColumn>
      </TableHeader>
      <TableBody>
        {rows.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <Skeleton className="h-4 w-10 rounded-md" />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-md" />
                <Skeleton className="h-4 w-10 rounded-md" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
