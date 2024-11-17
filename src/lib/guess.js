"use server";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { getDevice } from "./device";
import { getTotalCharacters } from "./character";
import { getTranslations } from "next-intl/server";

export const guess = async (values) => {
  const g = await getTranslations("Guess");

  try {
    const cookieStore = await cookies();

    const deviceId = cookieStore.get("device-id");

    if (!deviceId) {
      throw "Device ID is required.";
    }

    if (!values.categoryId) {
      throw "Category ID is required.";
    }

    let device;
    let options = {};

    if (cookieStore.get("options")) {
      options = JSON.parse(cookieStore.get("options").value);
    }

    device = await getDevice(
      deviceId.value,
      values.categoryId,
      values.level_type,
      options
    );

    if (!device) {
      throw "No Device Found";
    }

    if (device.character_id == values.id) {
      const totalCharacters = await getTotalCharacters(values.categoryId);
      const randomIndex = Math.floor(Math.random() * totalCharacters.length); // Rastgele bir index seçiyoruz
      const character = totalCharacters[randomIndex];

      await prisma.device.update({
        where: {
          category_id_device_id_level_type: {
            device_id: deviceId.value,
            category_id: values.categoryId,
            level_type: values.level_type,
          },
        },
        data: {
          count: 0,
          character_id: character.id,
        },
      });

      cookieStore.set(
        "options",
        JSON.stringify({
          ...options,
          [values.categoryId]: {
            ...options?.[values.categoryId],
            [values.level_type]: {
              count: 0,
              key: randomIndex * 123456,
            },
          },
        })
      );

      return { message: g("ResponseMessage") };
    } else {
      await prisma.device.update({
        where: {
          category_id_device_id_level_type: {
            device_id: deviceId.value,
            category_id: values.categoryId,
            level_type: values.level_type,
          },
        },
        data: {
          count: device.count + 1,
        },
      });

      cookieStore.set(
        "options",
        JSON.stringify({
          ...options,
          [values.categoryId]: {
            ...options[values.categoryId],
            [values.level_type]: {
              ...options?.[values.categoryId]?.[values.level_type],
              count: device.count + 1,
            },
          },
        })
      );

      throw g("ErrorMessage");
    }
  } catch (error) {
    console.log(error);
    return {
      error,
    };
  }
};
