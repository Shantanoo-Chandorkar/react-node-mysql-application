// mealDetailsByIdSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDataFromApi } from "../utils/FetchMealData";

export const fetchMealDetailsById = createAsyncThunk(
  "mealDetailsById/fetchMealDetailsById",
  async (id, thunkAPI) => {
    const endpoint = `/lookup.php?i=${id}`;

    try {
      const response = await fetchDataFromApi(endpoint);
      // console.log(response);
      return response.meals;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const mealDetailsByIdSlice = createSlice({
  name: "mealDetailsById",
  initialState: { data: [], loading: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealDetailsById.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchMealDetailsById.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMealDetailsById, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });
  },
});

export default mealDetailsByIdSlice.reducer;
