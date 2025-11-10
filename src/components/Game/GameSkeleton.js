"use client";

import { Card, Skeleton } from "@heroui/react";
import React from "react";

export default function GameSkeleton() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <Card className="bg-muted/80 aspect-square w-96 max-w-xs overflow-hidden">
        <Skeleton className="h-full w-full rounded-lg" />
      </Card>
      <div className="flex w-full max-w-[320px] items-center justify-center gap-3">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
      <div className="flex w-[320px] gap-2">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
}
