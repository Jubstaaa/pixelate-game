"use client";

import { Avatar, Autocomplete, AutocompleteItem } from "@heroui/react";
import { Flame, SkipForward, Trophy } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import GameSkeleton from "./GameSkeleton";
import { addImageResizeParams } from "../Image";
import { LeaderboardDrawer } from "../Leaderboard/LeaderboardDrawer";

import { useCanvasPixelation } from "@/hooks/useCanvasPixelation";
import {
  useGetGameDataQuery,
  useSubmitGuessMutation,
  useSkipCharacterMutation,
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

  const { data = {}, isLoading, refetch } = useGetGameDataQuery({
    categoryId,
    levelType: level_type,
  });

  const [submitGuess] = useSubmitGuessMutation();
  const [skipCharacter, { isLoading: isSkipping }] = useSkipCharacterMutation();

  const { data: characters = [], isLoading: isCharsLoading } = useGetCharactersQuery({
    categoryId,
  });

  const { isLoading: isDeviceLoading } = useGetDeviceQuery();
  const [guessedCharacters, setGuessedCharacters] = useState([]);
  const [input, setInput] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  const { canvasRef, isImageLoaded } = useCanvasPixelation(
    addImageResizeParams(data.characterImage, 800, 800),
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

  const handleSkip = async () => {
    setIsRevealed(true);
    try {
      await skipCharacter({
        categoryId,
        level_type: level_type,
      }).unwrap();

      setTimeout(async () => {
        await refetch();
        setIsRevealed(false);
        setGuessedCharacters([]);
      }, 2000);
    } catch {
      setIsRevealed(false);
      refetch();
    }
  };

  if (isLoading || isCharsLoading || isDeviceLoading) {
    return <GameSkeleton />;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="relative w-96 max-w-xs overflow-hidden rounded-2xl border border-default">
        {!isImageLoaded && (
          <div className="bg-content1 absolute inset-0 flex items-center justify-center">
            <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="h-full w-full"
          style={{
            imageRendering: "pixelated",
            display: "block",
            opacity: isImageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
        <button
          onClick={handleSkip}
          disabled={isSkipping || isRevealed}
          className="absolute right-2 top-2 flex items-center gap-1.5 rounded-xl border border-default/50 bg-background/80 px-3 py-1.5 text-xs font-medium text-default-500 backdrop-blur-sm transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          <SkipForward className="h-3.5 w-3.5" />
          Skip
        </button>
      </div>

      <div className="flex w-full max-w-[320px] items-center justify-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-warning/25 bg-warning/10 px-4 py-2">
          <Flame className="h-[15px] w-[15px] text-warning" />
          <span className="text-[15px] font-bold text-warning">{data.streak}</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-success/25 bg-success/10 px-4 py-2">
          <Trophy className="h-[15px] w-[15px] text-success" />
          <span className="text-[15px] font-bold text-success">{data.maxStreak}</span>
        </div>
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
