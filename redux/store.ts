import { configureStore } from "@reduxjs/toolkit";
import gameListReducer from "./gameListSlice";
import playersListSlice from "./playersListSlice";
import scheduleSlice from './scheduleSlice'

export const store = configureStore({
  reducer: {
    gameList: gameListReducer,
    playersList: playersListSlice,
    scheduleList: scheduleSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
