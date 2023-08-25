import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userMeals: localStorage.getItem("userMeals")
    ? JSON.parse(localStorage.getItem("userMeals"))
    : null,
};

const userProfileSlice = createSlice({
  name: "userMeals",
  initialState,
  reducers: {
    setMeals: (state, action) => {
      state.userMeals = action.payload;
      localStorage.setItem("userMeals", JSON.stringify(action.payload));
    },
  },
});

export const { setMeals, addMeal, deleteMeal } = userProfileSlice.actions;
export default userProfileSlice.reducer;
