// mealsByCategorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDataFromApi } from "../utils/FetchMealData";

export const fetchMealsByCategory = createAsyncThunk(
  "mealsByCategory/fetchMealsByCategory",
  async (category, thunkAPI) => {
    const endpoint = `/filter.php?c=${category}`;
    try {
      const response = await fetchDataFromApi(endpoint);
      return { response: response.meals, category: category };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const mealsByCategorySlice = createSlice({
  name: "mealsByCategory",
  initialState: { data: [], loading: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealsByCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchMealsByCategory.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMealsByCategory.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export default mealsByCategorySlice.reducer;
