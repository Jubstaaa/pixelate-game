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
  Globe,
  Mail,
  Copy,
  Coffee,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Assume this function exists in your project
import { submitFeedback } from "@/lib/feedback";
import { toast } from "sonner";
import Image from "next/image";
import { setUserLocale } from "@/lib/locale";
import { useLocale, useTranslations } from "next-intl";
import { PatchNotesModal } from "./PatchNotesModal";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Footer({ locales, patchNotes }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const locale = useLocale();
  const f = useTranslations("Footer");
  const router = useRouter();

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
    const toastId = toast.loading(f("Feedback.SubmitMessage"));

    const res = await submitFeedback(values);
    if (res.error) {
      toast.error(res.error, { id: toastId });
    } else {
      toast.success(res.message, { id: toastId });
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText("ilkerbalcilartr@gmail.com");
    toast.success("Email copied to clipboard!");
  };

  return (
    <footer className="mt-20 w-full">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-2">
            <Image
              src="/images/pixel_guess_logo.webp"
              width={200}
              height={200}
              className="w-7 h-7 rounded-md"
              alt="Pixel Guess Logo"
            />
            <span className="text-lg font-semibold">PIXEL GUESS</span>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="secondary" className="text-xs gap-0.5">
              {f.rich("MadeBy", {
                person: () => (
                  <Link
                    href="https://ilkerbalcilar.com"
                    target="_blank"
                    className="underline"
                  >
                    Jubstaa
                  </Link>
                ),
              })}
            </Badge>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-start">
            &copy; 2025 Pixel Guess Inc. {f("Rights")}
          </p>
          <Link
            href={"/privacy-policy"}
            className="text-center text-xs text-muted-foreground md:text-start opacity-70"
          >
            {f("Privacy Policy")}
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
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {f("Feedback.Title")}
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
                      placeholder={f("Feedback.Placeholder")}
                      className="col-span-3"
                      rows={5}
                      required
                    />
                  </div>
                  <DialogFooter className="flex-row sm:justify-between">
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
                    <Button type="submit">{f("Feedback.ButtonText")}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
          <PatchNotesModal patchNotes={patchNotes} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Change Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((lang) => (
                <DropdownMenuItem
                  disabled={lang.code === locale}
                  onClick={() => {
                    lang.code !== locale && setUserLocale(lang.code);
                    router.refresh();
                  }}
                  className={
                    lang.code === locale
                      ? "font-bold bg-muted"
                      : "cursor-pointer"
                  }
                  key={lang.code}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Change Theme</span>
          </Button>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" asChild>
                  <Link href="mailto:ilkerbalcilartr@gmail.com">
                    <Mail className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Contact Email</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="flex items-center gap-2">
                <p>ilkerbalcilartr@gmail.com</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyEmailToClipboard}
                  className="h-4 w-4 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="icon" asChild>
            <Link href="https://buymeacoffee.com/jubstaa" target="_blank">
              <Coffee className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Buy me a coffee</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
