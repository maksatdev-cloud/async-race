import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Car } from "../../types";
import type { RootState, AppDispatch } from "../../app/store";
import { getRandomName, getRandomColor } from "../../utils/carGenerator";
import * as api from "../../api";
import * as winnersApi from "../../api/winners";
import { saveWinnerThunk } from "../winners/winnersSlice";
import * as engineApi from "../../api/engine";

export interface WinnerInfo {
  id: number;
  name: string;
  time: number;
}

export interface PageRaceState {
  isRacing: boolean;
  winner: WinnerInfo | null;
  isRaceFinished: boolean;
  finishedCars: Record<number, number>; 
  brokenCars: Record<number, boolean>;
}

interface GarageState {
  cars: Car[];
  totalCount: number;
  page: number;
  loading: boolean;
  selectedCar: Car | null;
  isRacing: boolean;
  winner: WinnerInfo | null;
  isRaceFinished: boolean;
  finishedCars: Record<number, number>; 
  brokenCars: Record<number, boolean>;
  pageStates: Record<number, PageRaceState>;
}

const getSavedPage = (): number => {
  const saved = localStorage.getItem("garagePage");
  return saved ? Number(saved) : 1;
};

const createInitialPageState = (): PageRaceState => ({
  isRacing: false,
  winner: null,
  isRaceFinished: false,
  finishedCars: {},
  brokenCars: {},
});

const savedPage = getSavedPage();

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  page: getSavedPage(),
  loading: false,
  selectedCar: null,
  isRacing: false,
  winner: null,
  isRaceFinished: false,
  finishedCars: {},
  brokenCars: {},
  pageStates: {
    [savedPage]: createInitialPageState(),
  },
};

const getCurrentPageState = (state: GarageState): PageRaceState => {
  if (!state.pageStates[state.page]) {
    state.pageStates[state.page] = createInitialPageState();
  }
  return state.pageStates[state.page];
};

export const fetchCars = createAsyncThunk(
  "garage/fetchCars",
  async (page: number) => {
    const data = await api.getCars(page);
    return data;
  },
);

export const createCarThunk = createAsyncThunk(
  "garage/createCar",
  async (car: Omit<Car, "id">, { dispatch, getState }) => {
    await api.createCar(car);
    const state = getState() as { garage: GarageState };
    dispatch(fetchCars(state.garage.page));
  },
);

export const updateCarThunk = createAsyncThunk<
  void,
  { id: number; car: Omit<Car, "id"> },
  { state: RootState; dispatch: AppDispatch }
>("garage/updateCar", async ({ id, car }, { dispatch, getState }) => {
  await api.updateCar(id, car);
  const currentPage = getState().garage.page;
  await dispatch(fetchCars(currentPage));
});

export const deleteCarThunk = createAsyncThunk<
  void,
  number,
  { state: RootState; dispatch: AppDispatch }
>("garage/deleteCar", async (id, { dispatch, getState }) => {
  await api.deleteCar(id);

  await winnersApi.deleteWinner(id);

  const { page, cars } = getState().garage;

  const newPage = cars.length === 1 && page > 1 ? page - 1 : page;

  if (newPage !== page) {
    dispatch(setPage(newPage));
  }

  await dispatch(fetchCars(newPage));
});

export const generateCarsThunk = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>("garage/generateCars", async (_, { dispatch, getState }) => {
  const randomCars = Array.from({ length: 100 }).map(() => ({
    name: getRandomName(),
    color: getRandomColor(),
  }));

  await Promise.all(randomCars.map((car) => api.createCar(car)));

  const currentPage = getState().garage.page;
  await dispatch(fetchCars(currentPage));
});

export const deleteAllCarsThunk = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>("garage/deleteAllCars", async (_, { dispatch }) => {
  const allCars = await api.getAllCars();

  await Promise.all(
    allCars.map(async (car) => {
      await api.deleteCar(car.id);
      await winnersApi.deleteWinner(car.id);
    }),
  );

  dispatch(setPage(1));
  await dispatch(fetchCars(1));
});

export const reportRaceWinnerThunk = createAsyncThunk(
  "garage/reportWinner",
  async (winnerInfo: WinnerInfo, { dispatch, getState }) => {
    const state = getState() as { garage: GarageState };
    const currentPage = state.garage.page;
    const pageState = state.garage.pageStates[currentPage];
    if (pageState && !pageState.isRaceFinished) {
      dispatch(setWinner(winnerInfo));
      dispatch(saveWinnerThunk(winnerInfo));
    }
  },
);

export const resetRaceThunk = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>("garage/resetRace", async (_, { dispatch, getState }) => {
  const { cars } = getState().garage;

  dispatch(resetRaceState());

  await Promise.all(
    cars.map(async (car) => {
      try {
        await api.stopEngine(car.id);
      } catch (error) {
        console.error(`Failed to stop engine for car ${car.id}`, error);
      }
    }),
  );
});

const garageSlice = createSlice({
  name: "garage",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      localStorage.setItem("garagePage", action.payload.toString());
      if (!state.pageStates[action.payload]) {
        state.pageStates[action.payload] = createInitialPageState();
      }
    },
    setSelectedCar: (state, action: PayloadAction<Car | null>) => {
      state.selectedCar = action.payload;
    },
    startRaceState: (state) => {
      const pageState = getCurrentPageState(state);
      pageState.isRacing = true;
      pageState.winner = null;
      pageState.isRaceFinished = false;
      pageState.finishedCars = {};
      pageState.brokenCars = {};
    },
    resetRaceState: (state) => {
      const pageState = getCurrentPageState(state);
      pageState.isRacing = false;
      pageState.winner = null;
      pageState.isRaceFinished = false;
      pageState.finishedCars = {};
      pageState.brokenCars = {};
    },

    markCarFinished: (
      state,
      action: PayloadAction<{ id: number; time: number }>,
    ) => {
      const pageState = getCurrentPageState(state);
      pageState.finishedCars[action.payload.id] = action.payload.time;
    },
    markCarBroken: (state, action: PayloadAction<number>) => {
      const pageState = getCurrentPageState(state);
      pageState.brokenCars[action.payload] = true;
    },
    clearCarState: (state, action: PayloadAction<number>) => {
      const pageState = getCurrentPageState(state);
      delete pageState.finishedCars[action.payload];
      delete pageState.brokenCars[action.payload];
    },
    setWinner: (state, action: PayloadAction<WinnerInfo>) => {
      const pageState = getCurrentPageState(state);
      if (!pageState.isRaceFinished) {
        pageState.winner = action.payload;
        pageState.isRaceFinished = true;
      }
    },
    clearWinner: (state) => {
      const pageState = getCurrentPageState(state);
      pageState.winner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchCars.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateCarThunk.fulfilled, (state) => {
        state.selectedCar = null;
      });
  },
});

export const {
  setPage,
  setSelectedCar,
  startRaceState,
  resetRaceState,
  setWinner,
  clearWinner,
  markCarFinished,
  markCarBroken,
  clearCarState,
} = garageSlice.actions;
export default garageSlice.reducer;
