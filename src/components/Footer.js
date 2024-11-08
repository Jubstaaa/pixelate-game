"use client";

import React from "react";
import { Chip, Divider } from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex flex-col items-center justify-center gap-2 md:order-2 md:items-end">
          <ThemeSwitch />
        </div>
        <div className="mt-4 md:order-1 md:mt-0">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="flex items-center">
              <span className="text-small font-medium">PIXEL GUESS</span>
            </div>
            <Divider className="h-4" orientation="vertical" />
            <Chip
              className="border-none px-0 text-default-500"
              color="primary"
              variant="dot"
            >
              Made by{" "}
              <Link target="_blank" href="https://ilkerbalcilar.com">
                Jubstaa
              </Link>{" "}
            </Chip>
          </div>
          <p className="text-center text-tiny text-default-400 md:text-start">
            &copy; 2024 Pixel Guess Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
