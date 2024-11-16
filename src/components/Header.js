"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Header({ category }) {
  return (
    <header className="w-full py-4">
      <Card className="mx-auto max-w-xl bg-background/60 backdrop-blur-md backdrop-saturate-150 shadow-sm">
        <nav className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary p-1">
              <Image
                alt={`${category.name} Logo`}
                width={34}
                height={34}
                className="object-contain"
                src={category.icon}
              />
            </div>
            <h1 className="text-sm font-medium text-muted-foreground hidden md:inline-block">
              Pixel Guess: {category.name}
            </h1>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">All Categories</Link>
          </Button>
        </nav>
      </Card>
    </header>
  );
}
