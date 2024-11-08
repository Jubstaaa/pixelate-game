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

const GuessChampionGame = ({ device, midnight }) => {
  const [deviceId] = useState(device.id);
  const [isOk] = useState(device?.easyCount === 999);
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState("");

  const [inputValue, setInputValue] = useState("");
  // Şampiyonları aramak için kullanılan fonksiyon
  const fetchChampions = async () => {
    const res = await fetch(`/api/champions`);
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

  const [champions, setChampions] = useState();
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerConfetti = () => {
    setIsAnimating(true);

    const duration = 3 * 1000; // 15 seconds
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
  const fetchRandomChampion = async () => {
    const res = await fetch("/api/champions/random", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Device-Id": deviceId,
      },
    });
    const data = await res.json();
    return data;
  };

  const selectChampion = async ({ id, deviceId }) => {
    const toastId = toast.loading("Guessing...");
    try {
      const res = await fetch("/api/champions/easy", {
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
    queryKey: ["champions"], // Query key
    queryFn: () => fetchChampions(), // Query fonksiyonu
    enabled: !champions, // Arama terimi boş değilse çalıştır
    keepPreviousData: true, // Veri yüklenirken önceki veriyi tut
  });

  const { data: champion } = useQuery({
    queryKey: ["champion"], // Query key
    queryFn: () => fetchRandomChampion(), // Query fonksiyonu
    enabled: deviceId ? true : false, // Arama terimi boş değilse çalıştır
    keepPreviousData: true, // Veri yüklenirken önceki veriyi tut
  });

  const mutation = useMutation({
    mutationFn: selectChampion,
    onSuccess: (res) => {
      queryClient.invalidateQueries("asd");
    },
    onError: (res) => {
      queryClient.invalidateQueries("asd");
    },
  });

  const handleSelectionChange = async (value) => {
    if (value) {
      setInputValue("");
      mutation.mutate({ id: value, deviceId }); // Mutation'u tetikle
    }
  };

  useEffect(() => {
    if (inputValue) {
      setChampions(
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
    } else {
      setChampions([]);
    }
  }, [inputValue]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-10">
      <Image
        src={champion?.pixellatedImage} // Base64 formatındaki pixelleştirilmiş görsel
        className="w-96 max-w-xs h-auto"
        alt="Pixellated Champion"
      />
      <Autocomplete
        items={champions || []}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e)}
        onSelectionChange={handleSelectionChange}
        className="max-w-xs"
        isLoading={isLoading}
        label={isOk ? `Next Character in ${timeLeft}` : "Search for a champion"}
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

export default GuessChampionGame;
