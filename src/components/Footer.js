"use client";

import React, { useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { submitFeedback } from "@/lib/feedback";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, Frown, Meh, Smile, ThumbsUp } from "lucide-react";
import { Chip, Divider } from "@nextui-org/react";
export default function Footer() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedRating, setSelectedRating] = useState(null > null);

  const ratings = [
    { icon: Frown, label: "Poor" },
    { icon: Meh, label: "Okay" },
    { icon: Smile, label: "Good" },
    { icon: ThumbsUp, label: "Great" },
  ];

  const sendFeedback = async (values) => {
    const toastId = toast.loading("Sending...");
    console.log(values);
    const res = await submitFeedback(values);
    console.log(res);
    if (res.error) {
      toast.error(res.error, {
        id: toastId, // Mevcut toast'ı güncelle
      });
    } else {
      toast.success(res.message, {
        id: toastId, // Mevcut toast'ı güncelle
      });
    }
  };

  return (
    <footer className="flex w-full flex-col">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-center gap-2 md:order-2 md:items-end">
          <motion.div
            animate={{
              y: [0, -10, 0], // Başlangıçta, -10px yukarı, sonra tekrar aşağı
            }}
            transition={{
              duration: 4, // Her dönüş hareketinin süresi
              repeat: Infinity, // Sonsuz döngü
              repeatType: "loop", // Döngü tipi
              ease: "easeInOut", // Hareketin yumuşaklığı
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
                  <DialogFooter className="justify-between !flex-row">
                    <div className="flex gap-2">
                      {ratings.map((rating, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedRating(rating.label)}
                          className={
                            selectedRating === index
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
