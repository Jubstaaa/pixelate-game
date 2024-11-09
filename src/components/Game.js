"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Image,
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

const GuessCharacterGame = ({ device, midnight, categoryId, level_type }) => {
  const [deviceId] = useState(device.device_id);
  const [character, setCharacter] = useState();

  const [inputValue, setInputValue] = useState("");
  // Şampiyonları aramak için kullanılan fonksiyon
  const fetchCharacters = async () => {
    const res = await fetch(`/api/characters?categoryId=${categoryId}`);
    const data = await res.json();
    return data;
  };

  const fetchRandomCharacter = async () => {
    try {
      const res = await fetch(
        `/api/characters/${level_type}?categoryId=${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Device-Id": deviceId,
          },
        }
      );
      const data = await res.json();
      setCharacter(data);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchRandomCharacter();
  }, []);

  useEffect(() => {
    if (character?.image) {
      setTimeout(() => {
        fetchRandomCharacter();
      }, 3000);
    }
  }, [character?.image]);

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
    try {
      const res = await fetch(`/api/characters/${level_type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Device-Id": deviceId,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw await res.json();
      }

      triggerConfetti();

      const data = await res.json();

      toast.success(data.message, {
        id: toastId, // Mevcut toast'ı güncelle
      });

      setCharacter(characters.find((item) => item.value === Number(values.id)));

      return data;
    } catch (err) {
      toast.error(err.message, {
        id: toastId, // Mevcut toast'ı güncelle
      });
      fetchRandomCharacter();

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

  const mutation = useMutation({
    mutationFn: selectCharacter,
  });

  const handleSelectionChange = async (value) => {
    if (value) {
      mutation.mutate({ id: value, categoryId }); // Mutation'u tetikle

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
      setInputValue("");
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
        src={character?.pixellatedImage || character?.image} // Base64 formatındaki pixelleştirilmiş görsel
        className="w-96 max-w-xs h-auto aspect-square"
        alt="Pixellated Character"
      />
      <Autocomplete
        items={characters || []}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e)}
        onSelectionChange={handleSelectionChange}
        className="max-w-xs !text-foreground"
        isLoading={isLoading || mutation.isLoading}
        label={"Search for a character"}
        placeholder={"Type to search..."}
        variant="bordered"
      >
        {(item) => (
          <AutocompleteItem
            key={item.value}
            textValue={item.label}
            isSelected={false}
            hideSelectedIcon={true}
            classNames={{ title: "!text-foreground" }}
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
