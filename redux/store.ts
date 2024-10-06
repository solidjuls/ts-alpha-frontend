import { configureStore } from "@reduxjs/toolkit";
import gameListReducer from "./gameListSlice";
import playersListSlice from "./playersListSlice";

export const store = configureStore({
  reducer: {
    gameList: gameListReducer,
    playersList: playersListSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
