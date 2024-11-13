"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Spacer,
} from "@nextui-org/react";
import toast from "react-hot-toast";
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
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

const GuessCharacterGame = ({
  categoryId,
  pixellatedImageBase64,
  characters,
  level_type,
}) => {
  const [character, setCharacter] = useState();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

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
    const toastId = toast.loading("Guessing...");
    setIsLoading(true);
    const res = await guess(values);

    if (res.error) {
      toast.error(res.error, {
        id: toastId, // Mevcut toast'ı güncelle
      });
      router.refresh();
    } else {
      triggerConfetti();

      toast.success(res.message, {
        id: toastId, // Mevcut toast'ı güncelle
      });

      setCharacter(characters.find((item) => item.value === Number(values.id)));
      router.refresh();

      setTimeout(() => {
        setCharacter();
      }, 3000);
    }
    setIsLoading(false);
  };

  const handleSelectionChange = async (value) => {
    if (value) {
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
        setInputValue("");
      }, 100); // Küçük bir gecikme eklemek bazı cihazlarda yardımcı olabilir
      setInputValue("");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-10">
      <Image
        width={400}
        height={400}
        src={character?.image || pixellatedImageBase64}
        className="w-96 max-w-xs h-auto aspect-square"
        alt="Pixellated Character"
      />
      <Command className="rounded-lg border shadow-md max-w-[320px]">
        <CommandInput
          disabled={isLoading}
          value={inputValue}
          onValueChange={(e) => setInputValue(e)}
          placeholder="Type to search..."
        />
        <CommandList limit={5}>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup
            className={cn("hidden", {
              "!block": inputValue,
            })}
          >
            <div className="max-h-56 overflow-hidden">
              {characters.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelectionChange(item.id)}
                >
                  <Avatar
                    alt={item.name}
                    className="flex-shrink-0"
                    size="sm"
                    src={item.image}
                  />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default GuessCharacterGame;
