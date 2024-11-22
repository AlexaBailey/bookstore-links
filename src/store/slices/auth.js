import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem("authToken") || null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuthState(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
