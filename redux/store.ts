import { configureStore } from "@reduxjs/toolkit";
import gameListReducer from "./gameListSlice";

export const store = configureStore({
  reducer: {
    gameList: gameListReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
