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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

const GuessCharacterGame = ({
  categoryId,
  pixellatedImageBase64,
  characters,
  level_type,
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
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
    };

    return (value, search) => {
      const normalizedValue = normalize(value);
      const normalizedSearch = normalize(search);

      // Exact match
      if (normalizedValue === normalizedSearch) {
        return 1;
      }

      // Starts with match
      if (normalizedValue.startsWith(normalizedSearch)) {
        return 1 - normalizedSearch.length / normalizedValue.length;
      }

      // Includes match
      if (normalizedValue.includes(normalizedSearch)) {
        return 0.5 - normalizedSearch.length / normalizedValue.length;
      }

      // No match
      return 0;
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-10">
      <Image
        width={400}
        height={400}
        src={character?.image || pixellatedImageBase64}
        className="w-96 max-w-xs h-auto aspect-square"
        alt="Pixellated Image"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[320px] justify-between"
          >
            {t("Select character")}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0">
          <Command className="max-w-[320px]" filter={filteredCharacters}>
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
    </div>
  );
};

export default GuessCharacterGame;
