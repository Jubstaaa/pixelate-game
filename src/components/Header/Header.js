"use client";

import { Button, Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import HeaderSkeleton from "./HeaderSkeleton";
import LeaderboardFormModal from "../Leaderboard/LeaderboardFormModal";

import { useGetDeviceQuery } from "@/lib/api/game-api";

export default function Header({ category }) {
  const { data: device, isLoading: isDeviceLoading } = useGetDeviceQuery();

  if (isDeviceLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="w-full py-4">
      <Card className="bg-background/60 mx-auto max-w-xl shadow-sm backdrop-blur-md backdrop-saturate-150">
        <nav className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-full p-2">
              <Image
                alt={`${category.name} Logo`}
                width={50}
                height={50}
                className="h-7 w-7 object-contain"
                src={category.icon}
              />
            </div>
            <h1 className="text-muted-foreground hidden text-sm font-medium md:inline-block">
              Pixel Guess: {category.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {device?.username ? (
              <Button size="sm">{device.username}</Button>
            ) : (
              <LeaderboardFormModal />
            )}

            <Button asChild size="sm" variant="bordered">
              <Link href="/">All Categories</Link>
            </Button>
          </div>
        </nav>
      </Card>
    </header>
  );
}
