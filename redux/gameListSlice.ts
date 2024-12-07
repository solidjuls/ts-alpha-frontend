import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import getAxiosInstance, { clearAllCache } from "utils/axios";

interface GameListState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: {
    tournamentSelected: string[];
    playersSelected: string[];
    invalidateCache: boolean;
  };
  currentPage: number;
  totalPages: number;
}

// Define initial state
const initialState: GameListState = {
  items: [],
  status: "idle",
  error: null,
  filters: {
    tournamentSelected: [],
    playersSelected: [],
    invalidateCache: false
  },
  currentPage: 1,
  totalPages: 1,
};

// Async thunk for fetching the list
export const fetchGameList = createAsyncThunk("list/fetchGameList", async (_, { getState }) => {
  const state = getState() as RootState;
  const { tournamentSelected, playersSelected, invalidateCache } = state.gameList.filters;
  const { currentPage } = state.gameList;

  await clearAllCache("game-list")

  const response = await getAxiosInstance().get(
    `/api/game?toFilter=${tournamentSelected.map((item) => item.code)}&userFilter=${playersSelected.map((item) => item.code)}&p=${currentPage}&pso=20`,
    { id: `game-list` },
  );

  return {
    items: response.data,
    totalPages: Math.ceil(response.data.totalRows / 20),
  };
});

const listSlice = createSlice({
  name: "gameList",
  initialState,
  reducers: {
    setClearFilter: (state) => {
      state.currentPage = 1;
      state.filters.tournamentSelected = [];
      state.filters.playersSelected = [];
    },
    setTournamentFilter: (state, action) => {
      state.currentPage = 1;
      state.filters.invalidateCache = state.filters.tournamentSelected !== action.payload
      state.filters.tournamentSelected = action.payload;
    },
    setPlayersFilter: (state, action) => {
      state.currentPage = 1;
      state.filters.invalidateCache = state.filters.playersSelected !== action.payload
      state.filters.playersSelected = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGameList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchGameList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setTournamentFilter, setPlayersFilter, setClearFilter, setCurrentPage } =
  listSlice.actions;

export default listSlice.reducer;
