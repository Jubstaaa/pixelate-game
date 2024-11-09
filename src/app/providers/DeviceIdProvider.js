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
      let storedDeviceId = Cookies.get("deviceId");

      setDeviceId(storedDeviceId);
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
