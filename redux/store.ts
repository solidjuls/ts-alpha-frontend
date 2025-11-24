import { configureStore } from "@reduxjs/toolkit";
import gameListReducer from "./gameListSlice";
import scheduleSlice from './scheduleSlice'

export const store = configureStore({
  reducer: {
    gameList: gameListReducer,
    scheduleList: scheduleSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
