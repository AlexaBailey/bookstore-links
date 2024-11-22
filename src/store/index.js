import { configureStore } from "@reduxjs/toolkit";
import { booksApi } from "./slices/api/booksApi";
import { categoriesApi } from "./slices/api/categoriesApi";
import { visitorsApi } from "./slices/api/visitorsApi";
import { employeesApi } from "./slices/api/employeesApi";
import { authApi } from "./slices/api/authApi";
import authReducer from "../store/slices/auth";
const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [visitorsApi.reducerPath]: visitorsApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      categoriesApi.middleware,
      visitorsApi.middleware,
      employeesApi.middleware,
      authApi.middleware
    ),
});

export default store;
