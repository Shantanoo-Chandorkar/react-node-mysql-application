// store.js
import { configureStore } from "@reduxjs/toolkit";
import recipeCategoriesReducer from "./recipeCategoriesSlice";
import mealsByCategoryReducer from "./mealsByCategorySlice";
import mealDetailsByIdReducer from "./mealDetailsByIdSlice";
import authReducer from "./authSlice";
import userProfileReducer from "./userProfileSlice";
import { apiSlice } from "./apiSlice";

const store = configureStore({
  reducer: {
    recipeCategories: recipeCategoriesReducer,
    mealsByCategory: mealsByCategoryReducer,
    mealDetailsById: mealDetailsByIdReducer,
    auth: authReducer,
    userProfile: userProfileReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
