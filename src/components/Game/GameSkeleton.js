"use client";

import { Skeleton } from "@heroui/react";
import React from "react";

export default function GameSkeleton() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <Skeleton className="h-56 w-96 max-w-xs rounded-2xl" />
      <div className="flex w-full max-w-[320px] items-center justify-center gap-2">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
      <div className="flex w-[320px] gap-2">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
}
