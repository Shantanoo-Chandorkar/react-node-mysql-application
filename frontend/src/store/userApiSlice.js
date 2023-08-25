import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    delete: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/delete`,
        method: "DELETE",
      }),
    }),
    getMeals: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/profile/${id}`,
        method: "GET",
      }),
    }),
    addMeal: builder.mutation({
      query: ({ addFavMeals: data, userId: id }) => ({
        url: `${USERS_URL}/profile/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteMeal: builder.mutation({
      query: ({ addFavMeals: data, userId: id }) => ({
        url: `${USERS_URL}/profile/${id}`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useDeleteMutation,
  useGetMealsMutation,
  useAddMealMutation,
  useDeleteMealMutation,
} = userApiSlice;
