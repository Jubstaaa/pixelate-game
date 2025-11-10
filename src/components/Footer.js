"use client";

import {
  Button,
  Divider,
  Chip,
  Snippet,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { motion } from "framer-motion";
import { Mail, Coffee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import FeedbackModal from "./Feedback/FeedbackModal";

export default function Footer() {
  return (
    <footer className="mt-20 w-full">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-2">
            <Image
              src="/images/pixel_guess_logo.webp"
              width={200}
              height={200}
              className="h-7 w-7 rounded-md"
              alt="Pixel Guess Logo"
            />
            <span className="text-lg font-semibold">PIXEL GUESS</span>
            <Divider orientation="vertical" className="h-4" />
            <Chip variant="flat" className="gap-0.5 text-xs">
              Made by{" "}
              <Link href="https://ilkerbalcilar.com" target="_blank" className="underline">
                Jubstaa
              </Link>
            </Chip>
          </div>
          <p className="text-muted-foreground text-center text-sm md:text-start">
            &copy; 2025 Pixel Guess Inc. All rights reserved.
          </p>
          <Link
            href="/privacy-policy"
            className="text-muted-foreground text-center text-xs opacity-70 md:text-start"
          >
            Privacy Policy
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <FeedbackModal />
          </motion.div>
          <Popover
            placement="top"
            classNames={{
              content: "p-0",
            }}
          >
            <PopoverTrigger>
              <Button variant="bordered" size="sm">
                <Link href="mailto:ilkerbalcilartr@gmail.com">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Contact Email</span>
                </Link>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Snippet hideSymbol size="sm">
                ilkerbalcilartr@gmail.com
              </Snippet>
            </PopoverContent>
          </Popover>

          <Button variant="bordered" size="sm">
            <Link href="https://buymeacoffee.com/jubstaa" target="_blank">
              <Coffee className="h-4 w-4" />
              <span className="sr-only">Buy me a coffee</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
