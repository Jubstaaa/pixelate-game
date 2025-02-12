"use client";
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import confetti from "canvas-confetti";
import {
  formatDistanceToNow,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";
import { useRouter } from "next/navigation";
import { guess } from "@/lib/guess";
import Image from "next/image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { BarChart2, Check, ChevronsUpDown, Flame, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "./ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Leaderboard } from "./Leaderboard";

const GuessCharacterGame = ({
  categoryId,
  pixellatedImageBase64,
  characters,
  level_type,
  currentStreak,
  highStreak,
  leaderboard,
  username,
}) => {
  const [character, setCharacter] = useState();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const [isAnimating, setIsAnimating] = useState(false);

  const triggerConfetti = () => {
    setIsAnimating(true);

    const duration = 5 * 1000; // 15 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval); // Stop the animation when time is up
        setIsAnimating(false); // Stop the animation state
      }

      const particleCount = 50 * (timeLeft / duration);

      // Emit confetti from two random origins
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // Rastgele şampiyon almak için kullanılan fonksiyon

  const selectCharacter = async (values) => {
    const toastId = toast.loading(t("Guessing"));

    const res = await guess(values);

    if (res.error) {
      toast.error(res.error, { id: toastId });
      router.refresh();
    } else {
      triggerConfetti();
      toast.success(res.message, { id: toastId });

      setCharacter(characters.find((item) => item.id === Number(values.id)));
      router.refresh();

      setTimeout(() => {
        setCharacter();
      }, 3000);
    }
  };

  const handleSelectionChange = async (value) => {
    selectCharacter({ id: value, categoryId, level_type: level_type });
    // Klavyeyi kapat
    document.activeElement.blur(); // Önce aktif elementi bulanıklaştır

    // Gecikmeli olarak gizli bir input'a odaklan ve bulanıklaştır
    setTimeout(() => {
      const hiddenInput = document.createElement("input");
      hiddenInput.style.display = "none";
      document.body.appendChild(hiddenInput);

      hiddenInput.focus();
      hiddenInput.blur();

      document.body.removeChild(hiddenInput); // Temizlemeyi unutmayın
    }, 100); // Küçük bir gecikme eklemek bazı cihazlarda yardımcı olabilir
  };

  const filteredCharacters = useMemo(() => {
    const normalize = (str) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Combine diacritics removal
        .replace(/[^a-z0-9]/g, ""); // Remove non-alphanumeric characters
    };

    return (value, search) => {
      const normalizedValue = normalize(value);
      const normalizedSearch = normalize(search);

      // Exact match
      if (normalizedValue === normalizedSearch) {
        return 1;
      }

      // Starts with match (with better handling)
      if (normalizedValue.startsWith(normalizedSearch)) {
        return 1 - normalizedSearch.length / normalizedValue.length;
      }

      // Includes match with better fuzzy handling
      if (normalizedValue.indexOf(normalizedSearch) !== -1) {
        // Calculate the ratio more intelligently
        return 0.5 - normalizedSearch.length / normalizedValue.length;
      }

      // No match
      return 0;
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={character?.image || pixellatedImageBase64}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            width={400}
            height={400}
            src={character?.image || pixellatedImageBase64}
            className="w-96 max-w-xs h-auto aspect-square"
            alt="Character Image"
          />
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="flex justify-center items-center gap-4 w-full max-w-[320px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStreak}
            className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-semibold">{currentStreak}</span>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={highStreak}
            className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold">{highStreak}</span>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="flex gap-2 w-[320px]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {t("Select character")}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[320px] p-0">
            <Command className="w-full" filter={filteredCharacters}>
              <CommandInput placeholder={t("Search character")} />
              <CommandList>
                <CommandEmpty>{t("No character found")}</CommandEmpty>
                <CommandGroup>
                  <div className="max-h-56 overflow-hidden">
                    {characters.map((character) => (
                      <CommandItem
                        className="cursor-pointer"
                        key={character.id}
                        value={character.name}
                        onSelect={() => {
                          handleSelectionChange(character.id);
                          setOpen(false);
                        }}
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={character.image}
                            alt={character.name}
                          />
                          <AvatarFallback>
                            {character.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{character.name}</span>
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Leaderboard data={leaderboard} username={username} />
      </div>
    </div>
  );
};

export default GuessCharacterGame;
