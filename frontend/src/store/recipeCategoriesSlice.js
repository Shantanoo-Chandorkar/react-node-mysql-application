import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDataFromApi } from "../utils/FetchMealData";

export const fetchRecipeCategories = createAsyncThunk(
  "recipeCategories/fetchRecipeCategories",
  async (_, thunkAPI) => {
    try {
      const response = await fetchDataFromApi("/list.php?c=list");
      return response.meals;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const recipeCategoriesSlice = createSlice({
  name: "recipeCategories",
  initialState: { data: [], loading: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeCategories.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchRecipeCategories.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchRecipeCategories.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export default recipeCategoriesSlice.reducer;
