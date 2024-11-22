import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  endpoints: (builder) => ({
    fetchCategories: builder.query({
      query: () => "/categories",
    }),
  }),
});

export const { useFetchCategoriesQuery } = categoriesApi;
