"use client";

import { Card, Skeleton } from "@heroui/react";
import React from "react";

export default function HeaderSkeleton() {
  return (
    <header className="w-full py-4">
      <Card className="bg-background/60 mx-auto max-w-xl shadow-sm backdrop-blur-md backdrop-saturate-150">
        <nav className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-11 w-11 rounded-full" />
            <Skeleton className="hidden h-4 w-44 rounded-md md:inline-block" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </nav>
      </Card>
    </header>
  );
}
