import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import getAxiosInstance from "utils/axios";
import { MultiSelectItemType } from "types/types";

interface ScheduleState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: {
    setTournamentFilter: string;
  };
  modeUI: 'ADMIN' | 'SUPER_ADMIN' | 'PLAYER_VIEW';
  currentPage: number;
  totalPages: number;
}

// Define initial state
const initialState: ScheduleState = {
  modeUI: 'PLAYER_VIEW',
  items: [],
  status: "idle",
  error: null,
  filters: {
    setTournamentFilter: "",
  },
  currentPage: 1,
  totalPages: 1,
};

interface FetchScheduleParams {
  isSuperAdmin: boolean;
  tournaments: string[];
  userId: string
}

export const fetchScheduleList = createAsyncThunk(
  "list/fetchScheduleList",
  async (params: FetchScheduleParams, { getState }) => {
    const { isSuperAdmin, tournaments, userId } = params
    const state = getState() as RootState;
    
    const URLparams = new URLSearchParams();
    if (userId) URLparams.append("uid", userId);
    if (tournaments && tournaments.length > 0) URLparams.append("t", tournaments.join(","));

    // isSuperAdmin & tournament filter selected
    const response = await getAxiosInstance().get(
      `/api/schedule?${URLparams.toString()}`,
    );

    return {
      items: response.data,
      // totalPages: Math.ceil(response.data.totalRows / 20),
    };
  },
);

const listSlice = createSlice({
  name: "scheduleList",
  initialState,
  reducers: {
    setTournamentFilter: (state) => {
      state.currentPage = 1;
      state.filters.setTournamentFilter = "";
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduleList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchScheduleList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchScheduleList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const {
  setTournamentFilter,
} = listSlice.actions;

export default listSlice.reducer;
