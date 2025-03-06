"use client";
import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
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
import { ChevronsUpDown, Flame, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Leaderboard } from "./Leaderboard";
import Loading from "@/app/[categorySlug]/loading";

const GuessCharacterGame = ({
  categoryId,
  characters,
  level_type,
  leaderboard,
  username,
  deviceId,
}) => {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["gameData", deviceId, categoryId, level_type],
    queryFn: async () => {
      const response = await fetch(
        `/api/game?categoryId=${categoryId}&level_type=${level_type}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (params) => {
      const response = await fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const res = await response.json();

      if (!response.ok) {
        throw res;
      }

      return res;
    },
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      return error;
    },
  });

  const [character, setCharacter] = useState();
  const [guessedCharacters, setGuessedCharacters] = useState([]);
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsAnimating(false);
      }

      const particleCount = 50 * (timeLeft / duration);

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

  const selectCharacter = async (values) => {
    const toastId = toast.loading(t("Guessing"));
    mutate(values, {
      onSuccess: (data) => {
        triggerConfetti();
        toast.success(data.message, { id: toastId });
        setCharacter(characters.find((item) => item.id === Number(values.id)));
        refetch();

        setTimeout(() => {
          setCharacter();
          setGuessedCharacters([]);
        }, 3000);
      },
      onError: (error) => {
        setGuessedCharacters((state) => [...state, values.id]);
        toast.error(error.message, { id: toastId });
        refetch();
      },
    });
  };

  const handleSelectionChange = async (value) => {
    selectCharacter({ id: value, categoryId, level_type: level_type });
    document.activeElement.blur();
    setTimeout(() => {
      const hiddenInput = document.createElement("input");
      hiddenInput.style.display = "none";
      document.body.appendChild(hiddenInput);

      hiddenInput.focus();
      hiddenInput.blur();

      document.body.removeChild(hiddenInput);
    }, 100);
  };

  const filteredCharacters = useMemo(() => {
    const normalize = (str) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
    };

    return (value, search) => {
      const normalizedValue = normalize(value);
      const normalizedSearch = normalize(search);

      if (normalizedValue === normalizedSearch) {
        return 1;
      }

      if (normalizedValue.startsWith(normalizedSearch)) {
        return 1 - normalizedSearch.length / normalizedValue.length;
      }

      if (normalizedValue.indexOf(normalizedSearch) !== -1) {
        return 0.5 - normalizedSearch.length / normalizedValue.length;
      }

      return 0;
    };
  }, []);

  if (isLoading || error) {
    return <Loading />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={character?.image || data?.characterImage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            width={400}
            height={400}
            src={character?.image || data?.characterImage}
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
            key={data.streak}
            className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-semibold">{data.streak}</span>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={data.highStreak}
            className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold">{data.maxStreak}</span>
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
                    {characters
                      .filter(
                        (character) => !guessedCharacters.includes(character.id)
                      )
                      .map((character) => (
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
