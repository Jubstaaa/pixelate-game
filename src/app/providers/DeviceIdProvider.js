"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie"; // js-cookie import edildi

const DeviceIdContext = createContext();

export function DeviceIdProvider({ children }) {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Önce localStorage'dan alalım
      let storedDeviceId = localStorage.getItem("deviceId");

      if (!storedDeviceId) {
        // Eğer yoksa, yeni bir deviceId oluştur
        storedDeviceId = uuidv4();
        localStorage.setItem("deviceId", storedDeviceId);
      }

      setDeviceId(storedDeviceId);

      // Ayrıca, deviceId'yi cookie'ye set edelim
      Cookies.set("device-id", storedDeviceId, {
        path: "/", // Cookie'nin geçerli olduğu yol
        secure: true, // HTTPS üzerinden gönderilmeli
        expires: 365, // 1 yıl boyunca geçerli olacak
      });
    }
  }, []);

  return (
    <DeviceIdContext.Provider value={deviceId}>
      {children}
    </DeviceIdContext.Provider>
  );
}

export function useDeviceId() {
  return useContext(DeviceIdContext);
}
