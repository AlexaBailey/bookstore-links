import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const visitorsApi = createApi({
  reducerPath: "visitorsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  endpoints: (builder) => ({
    fetchVisitors: builder.query({
      query: () => "/visitors",
    }),
    fetchLazyVisitors: builder.query({
      query: (search = "") => `/visitors?query=${search}`,
    }),
  }),
});

export const { useFetchVisitorsQuery, useLazyFetchLazyVisitorsQuery } =
  visitorsApi;
