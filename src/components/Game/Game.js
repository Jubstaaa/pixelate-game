"use client";

import { Avatar, Chip, Autocomplete, AutocompleteItem } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import GameSkeleton from "./GameSkeleton";
import { addImageResizeParams } from "../Image";
import { LeaderboardDrawer } from "../Leaderboard/LeaderboardDrawer";

import { useCanvasPixelation } from "@/hooks/useCanvasPixelation";
import {
  useGetGameDataQuery,
  useSubmitGuessMutation,
  useGetCharactersQuery,
  useGetDeviceQuery,
} from "@/lib/api/game-api";
import { triggerConfetti } from "@/lib/confetti";

const GuessCharacterGame = ({ categoryId, level_type, username }) => {
  const defaultCharacterFilter = useCallback((textValue, inputValue) => {
    const normalize = (str) => {
      return String(str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
    };
    const normalizedValue = normalize(textValue);
    const normalizedSearch = normalize(inputValue);
    if (!normalizedSearch) return 1;
    if (normalizedValue === normalizedSearch) return 1;
    if (normalizedValue.startsWith(normalizedSearch)) {
      return 1 - normalizedSearch.length / Math.max(normalizedValue.length, 1);
    }
    if (normalizedValue.indexOf(normalizedSearch) !== -1) {
      return 0.5 - normalizedSearch.length / Math.max(normalizedValue.length, 1);
    }
    return 0;
  }, []);

  const {
    data = {},
    isLoading,
    refetch,
  } = useGetGameDataQuery({
    categoryId,
    levelType: level_type,
  });

  const [submitGuess] = useSubmitGuessMutation();

  const { data: characters = [], isLoading: isCharsLoading } = useGetCharactersQuery({
    categoryId,
  });

  const { isLoading: isDeviceLoading } = useGetDeviceQuery();
  const [guessedCharacters, setGuessedCharacters] = useState([]);
  const [input, setInput] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  const canvasRef = useCanvasPixelation(
    addImageResizeParams(data.characterImage, 400, 400),
    isRevealed ? 6 : data.count,
    level_type,
  );

  const filteredCharacters = useMemo(() => {
    const available = characters.filter((character) => !guessedCharacters.includes(character.id));

    if (!input) {
      return available.slice(0, 5);
    }

    const scored = available
      .map((character) => ({
        character,
        score: defaultCharacterFilter(character.name, input),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.character);

    return scored;
  }, [characters, guessedCharacters, input, defaultCharacterFilter]);

  const handleSelectionChange = async (value) => {
    setGuessedCharacters((state) => [...state, Number(value)]);
    setInput("");
    try {
      await submitGuess({
        id: value,
        categoryId,
        level_type: level_type,
      }).unwrap();
      triggerConfetti();
      setIsRevealed(true);

      setTimeout(async () => {
        await refetch();
        setIsRevealed(false);
        setGuessedCharacters([]);
      }, 2000);
    } catch {
      refetch();
    }
  };

  if (isLoading || isCharsLoading || isDeviceLoading) {
    return <GameSkeleton />;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <div className="bg-muted aspect-square w-96 max-w-xs overflow-hidden rounded-lg">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="h-full w-full bg-white"
          style={{
            imageRendering: "pixelated",
            display: "block",
          }}
        />
      </div>
      <div className="flex w-full max-w-[320px] items-center justify-center gap-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={`streak-${data.streak}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Chip
              size="lg"
              variant="flat"
              color="warning"
              startContent={<Flame className="h-4 w-4" />}
            >
              {data.streak}
            </Chip>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={`max-${data.maxStreak}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Chip
              size="lg"
              variant="flat"
              color="success"
              startContent={<Trophy className="h-4 w-4" />}
            >
              {data.maxStreak}
            </Chip>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex w-[320px] gap-2">
        <Autocomplete
          inputValue={input}
          onInputChange={(value) => {
            setInput(value);
          }}
          size="lg"
          onSelectionChange={(key) => {
            if (key) {
              handleSelectionChange(key);
            }
          }}
          placeholder="Type to search..."
          variant="bordered"
          items={filteredCharacters}
        >
          {(item) => (
            <AutocompleteItem
              key={item.id}
              textValue={item.name}
              startContent={
                <Avatar
                  src={addImageResizeParams(item.characterImage, 64, 64)}
                  name={item.name}
                  className="size-6 shrink-0"
                />
              }
            >
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <LeaderboardDrawer categoryId={categoryId} level_type={level_type} username={username} />
      </div>
    </div>
  );
};

export default GuessCharacterGame;
