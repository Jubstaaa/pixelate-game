"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import LeaderboardForm from "./LeaderboardForm";

export default function Header({ category, username }) {
  const t = useTranslations();

  return (
    <header className="w-full py-4">
      <Card className="mx-auto max-w-xl bg-background/60 backdrop-blur-md backdrop-saturate-150 shadow-sm">
        <nav className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary p-2">
              <Image
                alt={`${category.name} Logo`}
                width={50}
                height={50}
                className="object-contain w-7 h-7"
                src={category.icon}
              />
            </div>
            <h1 className="text-sm font-medium text-muted-foreground hidden md:inline-block">
              Pixel Guess: {category.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {username ? (
              <Button size="sm">{username}</Button>
            ) : (
              <LeaderboardForm />
            )}

            <Button asChild variant="outline" size="sm">
              <Link href="/">{t("All Categories")}</Link>
            </Button>
          </div>
        </nav>
      </Card>
    </header>
  );
}
