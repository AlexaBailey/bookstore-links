import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employeesApi = createApi({
  reducerPath: "employeesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  endpoints: (builder) => ({
    fetchEmployees: builder.query({
      query: () => "/librarians",
    }),
    fetchLazyEmployees: builder.query({
      query: (search) => `/librarians?query=${search}`,
    }),
  }),
});

export const { useFetchEmployeesQuery, useLazyFetchLazyEmployeesQuery } =
  employeesApi;
