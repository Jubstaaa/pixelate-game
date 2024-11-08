"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Image,
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

const GuessCharacterGame = ({ device, midnight }) => {
  const [deviceId] = useState(device.id);
  const [isOk] = useState(device?.easyCount === 999);
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState("");

  const [inputValue, setInputValue] = useState("");
  // Şampiyonları aramak için kullanılan fonksiyon
  const fetchCharacters = async () => {
    const res = await fetch(`/api/characters`);
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    if (!midnight) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remainingTime = new Date(midnight) - now; // Kalan süreyi hesaplıyoruz

      if (remainingTime <= 0) {
        clearInterval(interval); // Eğer süre bitti ise interval'ı durduruyoruz
        setTimeLeft("00:00:00");
      } else {
        const hours = Math.floor(remainingTime / 1000 / 60 / 60);
        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        // Formatlayıp zamanı güncelliyoruz
        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      }
    }, 1000); // Her saniye güncelleme

    return () => clearInterval(interval); // Component unmount olduğunda interval'ı temizliyoruz
  }, []);

  const [characters, setCharacters] = useState();
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

        window.location.reload();
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
  const fetchRandomCharacter = async () => {
    try {
      const res = await fetch("/api/characters/random", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Device-Id": deviceId,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const selectCharacter = async ({ id, deviceId }) => {
    const toastId = toast.loading("Guessing...");
    try {
      const res = await fetch("/api/characters/easy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Device-Id": deviceId,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw await res.json();
      }

      triggerConfetti();

      const data = await res.json();

      toast.success(data.message, {
        id: toastId, // Mevcut toast'ı güncelle
      });

      return data;
    } catch (err) {
      toast.error(err.message, {
        id: toastId, // Mevcut toast'ı güncelle
      });

      throw err;
    }
  };

  // Autocomplete için React Query kullanımı
  const { data, isLoading } = useQuery({
    queryKey: ["characters"], // Query key
    queryFn: () => fetchCharacters(), // Query fonksiyonu
    enabled: !characters, // Arama terimi boş değilse çalıştır
    keepPreviousData: true, // Veri yüklenirken önceki veriyi tut
  });

  const { data: character, isLoading: isRandomLoading } = useQuery({
    queryKey: ["character"], // Query key
    queryFn: () => fetchRandomCharacter(), // Query fonksiyonu
    enabled: deviceId ? true : false, // Arama terimi boş değilse çalıştır
    keepPreviousData: true, // Veri yüklenirken önceki veriyi tut
  });

  const mutation = useMutation({
    mutationFn: selectCharacter,
    onSuccess: (res) => {
      queryClient.invalidateQueries("character");
    },
    onError: (res) => {
      queryClient.invalidateQueries("character");
    },
  });

  const handleSelectionChange = async (value) => {
    if (value) {
      setInputValue("");
      mutation.mutate({ id: value, deviceId }); // Mutation'u tetikle
    }
  };

  useEffect(() => {
    if (inputValue && data) {
      setCharacters(
        data
          .filter((item) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase())
          )
          .slice(0, 5)
          .map((item) => ({
            value: item.id,
            label: item.name,
            image: item.image,
          }))
      );
    } else if (data) {
      setCharacters(
        data.slice(0, 5).map((item) => ({
          value: item.id,
          label: item.name,
          image: item.image,
        }))
      );
    } else {
      setCharacters([]);
    }
  }, [inputValue, data]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-10">
      <Image
        src={character?.pixellatedImage} // Base64 formatındaki pixelleştirilmiş görsel
        className="w-96 max-w-xs h-auto aspect-square"
        alt="Pixellated Character"
      />
      <Autocomplete
        items={characters || []}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e)}
        onSelectionChange={handleSelectionChange}
        className="max-w-xs"
        isLoading={isLoading || isRandomLoading || mutation.isLoading}
        label={
          isOk ? `Next Character in ${timeLeft}` : "Search for a character"
        }
        placeholder={!isOk && "Type to search..."}
        variant="bordered"
        isDisabled={isOk}
      >
        {(item) => (
          <AutocompleteItem
            key={item.value}
            textValue={item.label}
            isSelected={false}
            hideSelectedIcon={true}
          >
            <div className="flex gap-2 items-center">
              <Avatar
                alt={item.label}
                className="flex-shrink-0"
                size="sm"
                src={item.image}
              />
              <div className="flex flex-col">
                <span className="text-small">{item.label}</span>
              </div>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};

export default GuessCharacterGame;
