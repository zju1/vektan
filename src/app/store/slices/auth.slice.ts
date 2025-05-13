import type { AuthUser } from "@/features/LoginPage";
import { createSlice } from "@reduxjs/toolkit";

interface IAuthSlice {
  user: AuthUser | null;
  access_token: string | null;
}

const initialState: IAuthSlice = {
  user: null,
  access_token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.access_token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetAuth: () => initialState,
  },
});

export default authSlice.reducer;

export const { setUser, setToken, resetAuth } = authSlice.actions;
