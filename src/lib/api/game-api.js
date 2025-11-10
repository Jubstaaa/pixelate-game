"use client";

import { addToast } from "@heroui/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { v4 as uuidv4 } from "uuid";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/",
  prepareHeaders: (headers) => {
    if (typeof window === "undefined") return headers;

    let id = localStorage.getItem("device-id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("device-id", id);
    }

    headers.set("x-device-id", id);
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const isMutation =
    typeof args === "object" &&
    "method" in args &&
    ["POST", "PUT", "DELETE", "PATCH"].includes(args.method?.toUpperCase() || "");

  if (isMutation) {
    if (result.error) {
      console.log(result.error);
      const errorMessage =
        result.error.data?.error || result.error?.message || "An unexpected error occurred.";

      addToast({ title: "Error", description: errorMessage, color: "danger" });
    } else {
      console.log(result);
      const message =
        result?.data?.message || result?.data?.data?.message || "Operation completed successfully.";
      addToast({ title: "Success", description: message, color: "success" });
    }
  }
  return result;
};

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery,
  tagTypes: ["Device"],
  endpoints: (builder) => ({
    getDevice: builder.query({
      query: () => ({
        url: "api/device",
        method: "GET",
      }),
      transformResponse: (response) => response.data ?? response,
      providesTags: ["Device"],
    }),
    saveDevice: builder.mutation({
      query: ({ username }) => ({
        url: "api/device",
        method: "POST",
        body: { username },
      }),
      transformResponse: (response) => response.data ?? response,
      invalidatesTags: ["Device"],
    }),
    getCharacters: builder.query({
      query: ({ categoryId }) => ({
        url: "api/characters",
        params: { categoryId },
      }),
      transformResponse: (response) => response.data ?? response,
    }),
    getLeaderboard: builder.query({
      query: ({ categoryId, level_type }) => ({
        url: "api/leaderboard",
        params: { categoryId, level_type },
      }),
      transformResponse: (response) => response.data ?? response,
    }),
    getGameData: builder.query({
      query: ({ categoryId, levelType }) => ({
        url: "api/game",
        params: {
          categoryId,
          level_type: levelType,
        },
      }),
      transformResponse: (response) => response.data ?? response,
    }),
    submitGuess: builder.mutation({
      query: ({ id, categoryId, level_type }) => ({
        url: "api/game",
        method: "POST",
        body: { id, categoryId, level_type },
      }),
      transformResponse: (response) => response.data ?? response,
    }),
    sendFeedback: builder.mutation({
      query: ({ feedback, rating }) => ({
        url: "api/feedback",
        method: "POST",
        body: { feedback, rating },
      }),
      transformResponse: (response) => response.data ?? response,
    }),
  }),
});

export const {
  useGetGameDataQuery,
  useSubmitGuessMutation,
  useGetCharactersQuery,
  useGetLeaderboardQuery,
  useGetDeviceQuery,
  useSaveDeviceMutation,
  useSendFeedbackMutation,
} = gameApi;
