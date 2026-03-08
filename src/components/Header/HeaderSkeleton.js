"use client";

import { Skeleton } from "@heroui/react";
import React from "react";

export default function HeaderSkeleton() {
  return (
    <header className="w-full">
      <nav className="flex items-center justify-between rounded-2xl border border-default bg-content1 px-3 py-3">
        <div className="flex flex-1 items-center gap-3">
          <Skeleton className="h-[38px] w-[38px] rounded-xl" />
          <Skeleton className="h-[38px] w-[38px] rounded-xl" />
          <Skeleton className="h-4 w-32 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </nav>
    </header>
  );
}
