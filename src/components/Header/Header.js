"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

import HeaderSkeleton from "./HeaderSkeleton";
import LeaderboardFormModal from "../Leaderboard/LeaderboardFormModal";

import Image from "@/components/Image";
import { useGetDeviceQuery } from "@/lib/api/game-api";

export default function Header({ category }) {
  const { data: device, isLoading: isDeviceLoading, isFetching: isDeviceFetching } = useGetDeviceQuery();

  if (isDeviceLoading || isDeviceFetching) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="w-full">
      <nav className="flex items-center justify-between rounded-2xl border border-default bg-content1 px-3 py-3">
        <div className="flex flex-1 items-center gap-3">
          <Link href="/" className="rounded-xl border border-default bg-content2 p-2">
            <ChevronLeft className="h-[18px] w-[18px] text-foreground" />
          </Link>
          <div className="rounded-xl bg-primary/10 p-2">
            <Image
              alt={`${category.name} Logo`}
              width={50}
              height={50}
              className="h-[22px] w-[22px] object-contain"
              src={category.icon}
            />
          </div>
          <span className="flex-1 truncate text-[14px] font-semibold text-foreground">
            {category.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {device?.username ? (
            <div className="rounded-xl border border-default bg-content2 px-3 py-2 text-[13px] font-semibold text-foreground">
              {device.username}
            </div>
          ) : (
            <LeaderboardFormModal />
          )}
        </div>
      </nav>
    </header>
  );
}
