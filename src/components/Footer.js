"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  MessageSquare,
  Frown,
  Meh,
  Smile,
  ThumbsUp,
  Sun,
  Moon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Assume this function exists in your project
import { submitFeedback } from "@/lib/feedback";
import { toast } from "sonner";

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const ratings = [
    { icon: Frown, label: "Poor" },
    { icon: Meh, label: "Okay" },
    { icon: Smile, label: "Good" },
    { icon: ThumbsUp, label: "Great" },
  ];

  const sendFeedback = async (values) => {
    const toastId = toast.loading("Sending feedback...");

    const res = await submitFeedback(values);
    if (res.error) {
      toast.error(res.error, { id: toastId });
    } else {
      toast.success(res.message, { id: toastId });
    }
  };

  return (
    <footer className="mt-20 w-full">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">PIXEL GUESS</span>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="secondary" className="text-xs gap-0.5">
              Made by
              <Link
                href="https://ilkerbalcilar.com"
                target="_blank"
                className="underline"
              >
                Jubstaa
              </Link>
            </Badge>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-start">
            &copy; 2024 Pixel Guess Inc. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await sendFeedback({ feedback, rating: selectedRating });
                    setOpen(false);
                  }}
                >
                  <div className="grid gap-4 py-4">
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Ideas or suggestions to improve our product"
                      className="col-span-3"
                      rows={5}
                      required
                    />
                  </div>
                  <DialogFooter className="flex-row justify-between">
                    <div className="flex gap-2">
                      {ratings.map((rating, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedRating(rating.label)}
                          className={
                            selectedRating === rating.label
                              ? "text-primary"
                              : "text-muted-foreground"
                          }
                        >
                          <rating.icon className="h-4 w-4" />
                          <span className="sr-only">{rating.label}</span>
                        </Button>
                      ))}
                    </div>
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Change Theme</span>
          </Button>
        </div>
      </div>
    </footer>
  );
}
