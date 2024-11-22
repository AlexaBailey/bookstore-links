import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/auth",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerLibrarian: builder.mutation({
      query: (librarianData) => ({
        url: "/register",
        method: "POST",
        body: librarianData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterLibrarianMutation } = authApi;
