import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import getAxiosInstance from "utils/axios";
import { MultiSelectItemType } from "types/types";

interface PLayersListState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: {
    playersSelected: MultiSelectItemType[];
    countriesSelected: string[];
    playdeckInput: string;
  };
  currentPage: number;
  totalPages: number;
}

// Define initial state
const initialState: PLayersListState = {
  items: [],
  status: "idle",
  error: null,
  filters: {
    playersSelected: [],
    countriesSelected: [],
    playdeckInput: "",
  },
  currentPage: 1,
  totalPages: 1,
};

// Async thunk for fetching the list
export const fetchPlayersList = createAsyncThunk(
  "list/fetchPlayersList",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { playersSelected } = state.playersList.filters;
    const { countriesSelected } = state.playersList.filters;
    const { playdeckInput } = state.playersList.filters;
    const { currentPage } = state.playersList;

    const response = await getAxiosInstance().get(
      `/api/rating?playerFilter=${playersSelected.map((item) => item.code)}&p=${currentPage}&countrySelected=${countriesSelected}&playdeck=${playdeckInput}&pso=20`,
    );

    return {
      items: response.data,
      totalPages: Math.ceil(response.data.totalRows / 20),
    };
  },
);

const listSlice = createSlice({
  name: "playersList",
  initialState,
  reducers: {
    setClearFilter: (state) => {
      state.currentPage = 1;
      state.filters.playersSelected = [];
      state.filters.countriesSelected = [];
    },
    setPlayersFilter: (state, action) => {
      state.currentPage = 1;
      state.filters.playersSelected = action.payload;
    },
    setCountriesFilter: (state, action) => {
      state.currentPage = 1;
      state.filters.countriesSelected = action.payload;
    },
    setPlaydeckFilter: (state, action) => {
      state.currentPage = 1;
      state.filters.playdeckInput = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayersList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlayersList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPlayersList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const {
  setPlayersFilter,
  setCountriesFilter,
  setPlaydeckFilter,
  setClearFilter,
  setCurrentPage,
} = listSlice.actions;

export default listSlice.reducer;
