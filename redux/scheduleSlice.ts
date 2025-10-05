import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import getAxiosInstance, { clearAllCache } from "utils/axios";
import { MultiSelectItemType } from "types/types";

interface ScheduleState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: {
    tournamentSelected: string;
    adminView: boolean;
    byPlayer: string;
    invalidateCache: boolean
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
    tournamentSelected: "",
    adminView: false,
    byPlayer: "",
    invalidateCache: false
  },
  currentPage: 1,
  totalPages: 1,
};

interface FetchScheduleParams {
  isSuperAdmin: boolean;
  tournaments: string[];
  userFilter?: string
  userId: string
}
interface DeletePlayerParams {
  userId: string;
  tournamentId: string;
}

export const deletePlayerFromSchedule = createAsyncThunk(
  "list/deletePlayerFromSchedule",
  async (params: DeletePlayerParams, { getState }) => {
    const { userId, tournamentId = "303" } = params
    const URLparams = new URLSearchParams();
    if (userId) URLparams.append("u", userId);
    if (tournamentId) URLparams.append("t", tournamentId);
    
    const response = await getAxiosInstance().patch(
      `/api/schedule?${URLparams.toString()}`,
    );
    return {
      items: response.data,
      // totalPages: Math.ceil(response.data.totalRows / 20),
    };
  }
)

export const fetchScheduleList = createAsyncThunk(
  "list/fetchScheduleList",
  async (params: FetchScheduleParams, { getState }) => {
    const { isSuperAdmin, tournaments, userFilter, userId } = params
    const state = getState() as RootState;
    const { currentPage, totalPages, filters } = state.scheduleList;

    const URLparams = new URLSearchParams();
    if (userId) URLparams.append("uid", userId);
    if (currentPage) URLparams.append("p", currentPage.toString());
    URLparams.append("pso", "20");
    if (tournaments && tournaments.length > 0) URLparams.append("t", tournaments.join(","));
    if (filters.adminView) URLparams.append("a", filters.adminView ? '1' : '0');
    if (filters.byPlayer) URLparams.append("u", filters.byPlayer);

    await clearAllCache("schedule-list");
    // isSuperAdmin & tournament filter selected
    const response = await getAxiosInstance().get(
      `/api/schedule?${URLparams.toString()}`,
      { id: `schedule-list` },
    );

    return {
      items: response.data.results,
      totalPages: Math.ceil(response.data.totalRows / 20),
    };
  },
);

const listSlice = createSlice({
  name: "scheduleList",
  initialState,
  reducers: {
    setTournamentFilter: (state, action) => {
      state.currentPage = 1;
      state.filters.invalidateCache = state.filters.tournamentSelected !== action.payload;
      state.filters.tournamentSelected = action.payload;
    },
    setAdminView: (state, action) => {
      state.filters.invalidateCache = state.filters.adminView !== action.payload;
      state.filters.adminView = action.payload;
    },
    setPlayerFilter: (state, action) => {
      state.filters.invalidateCache = state.filters.byPlayer !== action.payload;
      state.filters.byPlayer = action.payload;
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
  setAdminView,
  setPlayerFilter,
  setCurrentPage
} = listSlice.actions;

export default listSlice.reducer;
