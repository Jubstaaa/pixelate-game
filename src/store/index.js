import { configureStore } from "@reduxjs/toolkit";

import { gameApi } from "@/lib/api/game-api";

export const store = configureStore({
  reducer: {
    [gameApi.reducerPath]: gameApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gameApi.middleware),
});
