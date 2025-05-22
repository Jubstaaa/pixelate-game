"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
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
import { Leaderboard } from "./Leaderboard";
import Loading from "@/app/[categorySlug]/loading";
import { AnimatePresence, motion } from "framer-motion";

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

  const [guessedCharacters, setGuessedCharacters] = useState([]);
  const [open, setOpen] = useState(false);
  const [localCount, setLocalCount] = useState(null);
  const [localStreak, setLocalStreak] = useState(null);
  const t = useTranslations();
  const canvasRef = useRef(null);

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

  useEffect(() => {
    if (data.count != null) {
      setLocalCount(data.count);
      setLocalStreak(data.streak);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.characterImage || localCount === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;
    ctx.fillStyle = "rgb(243 244 246)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onerror = () => {
      if (img.crossOrigin === "anonymous") {
        img.crossOrigin = null;
        img.src = data.characterImage;
      }
    };

    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Count değerine göre block size'ı hesapla
        const maxBlockSize = level_type === 1 ? 32 : 96;
        const minBlockSize = 1;

        const blockSize = Math.max(
          minBlockSize,
          maxBlockSize -
            Math.floor((localCount / 6) * (maxBlockSize - minBlockSize))
        );

        if (localCount === 6) {
          if (level_type === 1) {
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const { data, width, height } = imageData;

            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg; // R
              data[i + 1] = avg; // G
              data[i + 2] = avg; // B
            }

            ctx.putImageData(imageData, 0, 0);
          }
          return;
        }

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = imageData;
        const newData = new Uint8ClampedArray(data.length);

        for (let y = 0; y < height; y += blockSize) {
          for (let x = 0; x < width; x += blockSize) {
            let r = 0,
              g = 0,
              b = 0,
              a = 0,
              count = 0;

            for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
              for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
                const i = ((y + dy) * width + (x + dx)) * 4;
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                a += data[i + 3];
                count++;
              }
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);
            a = Math.floor(a / count);

            // Level type 1 ise grayscale uygula
            if (level_type === 1) {
              const avg = Math.floor((r + g + b) / 3);
              r = g = b = avg;
            }

            for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
              for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
                const i = ((y + dy) * width + (x + dx)) * 4;
                newData[i] = r;
                newData[i + 1] = g;
                newData[i + 2] = b;
                newData[i + 3] = a;
              }
            }
          }
        }

        const newImageData = new ImageData(newData, width, height);
        ctx.putImageData(newImageData, 0, 0);
      } catch (error) {
        console.error("Error during canvas operations:", error);
      }
    };

    img.src = data.characterImage;
  }, [localCount]);

  const selectCharacter = async (values) => {
    const toastId = toast.loading(t("Guessing"));
    mutate(values, {
      onSuccess: (data) => {
        triggerConfetti();
        toast.success(data.message, { id: toastId });
        setLocalCount(6);

        setTimeout(() => {
          refetch();
          setGuessedCharacters([]);
        }, 2000);
      },
      onError: (error) => {
        setGuessedCharacters((state) => [...state, values.id]);
        toast.error(error.message, { id: toastId });
        setLocalCount((prev) => Math.min((prev || 0) + 1, 6));
        setLocalStreak(0);
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
      <div className="w-96 max-w-xs aspect-square bg-muted rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full bg-white"
          style={{
            imageRendering: "pixelated",
            display: "block",
          }}
        />
      </div>
      <div className="flex justify-center items-center gap-4 w-full max-w-[320px]">
        <AnimatePresence mode="wait">
          <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
            <Flame className="w-5 h-5 text-orange-500" />
            <motion.span
              key={localStreak}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-sm font-semibold"
            >
              {localStreak}
            </motion.span>
          </div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <motion.span
              key={data.maxStreak}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-sm font-semibold"
            >
              {data.maxStreak}
            </motion.span>
          </div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 w-[320px]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {t("Select your guess")}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[320px] p-0">
            <Command className="w-full" filter={filteredCharacters}>
              <CommandInput placeholder={t("Search for your guess")} />
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
