"use client";

import React from "react";
import {
  Button,
  Chip,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";
import Link from "next/link";
import { Icon } from "@iconify/react";
import FeedbackRating from "./FeedbackRating";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { submitFeedback } from "@/lib/feedback";

export default function Footer() {
  const sendFeedback = async (values) => {
    const toastId = toast.loading("Sending...");
    const res = await submitFeedback(values);

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
            <Popover shouldBlockScroll={false}>
              <PopoverTrigger>
                <Button size="sm" variant="bordered">
                  Feedback
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[340px] p-3">
                <form
                  className="flex w-full flex-col gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const formData = new FormData(form);

                    // Form verilerini konsola yazdır
                    const data = {};
                    formData.forEach((value, key) => {
                      data[key] = value;
                    });
                    sendFeedback(data);
                  }}
                >
                  <Textarea
                    aria-label="Feedback"
                    name="feedback"
                    placeholder="Ideas or suggestions to improve our product"
                    variant="faded"
                  />

                  <Divider className="my-2" />

                  <div className="flex w-full items-center justify-between">
                    <FeedbackRating name="rating" />
                    <Button color="primary" size="sm" type="submit">
                      Submit
                    </Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
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
