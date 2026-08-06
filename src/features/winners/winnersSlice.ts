import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import * as winnersApi from "../../api/winners";
import { setWinner } from "../garage/garageSlice"; 

interface WinnersState {
  items: winnersApi.WinnerData[];
  totalCount: number;
  page: number;
  sort?: "id" | "wins" | "time";
  order?: "ASC" | "DESC";
  loading: boolean;
}
export const saveWinnerThunk = createAsyncThunk(
  "winners/saveWinner",
  async (
    { id, name, time }: { id: number; name: string; time: number },
    { dispatch },
  ) => {
    dispatch(setWinner({ id, name, time }));

    try {
      const existingWinner = await winnersApi.getWinner(id);

      await winnersApi.updateWinner(id, {
        wins: existingWinner.wins + 1,
        time: time < existingWinner.time ? time : existingWinner.time, 
      });
    } catch (error) {
      await winnersApi.createWinner({
        id,
        wins: 1,
        time,
      });
    }
  },
);

export const fetchWinnersThunk = createAsyncThunk(
  "winners/fetchWinners",
  async (_, { getState }) => {
    const state = getState() as { winners: WinnersState };
    const { page, sort, order } = state.winners;

    const data = await winnersApi.getWinners(page, 10, sort, order);
    return data;
  },
);

const initialState: WinnersState = {
  items: [],
  totalCount: 0,
  page: 1,
  sort: undefined,
  order: undefined,
  loading: false,
};

const winnersSlice = createSlice({
  name: "winners",
  initialState,
  reducers: {
    setWinnersPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSorting: (state, action: PayloadAction<"wins" | "time">) => {
      const selectedSort = action.payload;
      if (state.sort === selectedSort) {
        state.order = state.order === "ASC" ? "DESC" : "ASC";
      } else {
        state.sort = selectedSort;
        state.order = "DESC";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWinnersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWinnersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchWinnersThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setWinnersPage, setSorting } = winnersSlice.actions;
export default winnersSlice.reducer;
