import type { AuthUser } from "@/features/LoginPage";
import { createSlice } from "@reduxjs/toolkit";

interface IAuthSlice {
  user: AuthUser | null;
  access_token: string | null;
}

const initialState: IAuthSlice = {
  user: {
    _id: "67f4268f782d063b42c6cb9a",
    username: "ucatco",
    firstName: "Azamat",
    lastName: "Jumabaev",
    role: "admin",
    lastLogin: "2025-05-09T20:30:43.458Z",
    createdAt: "2025-04-07T19:25:03.521Z",
    updatedAt: "2025-05-09T20:30:43.459Z",
  },
  access_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjQyNjhmNzgyZDA2M2I0MmM2Y2I5YSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDA1ODQyNiwiZXhwIjoxNzc1NTk0NDI2fQ.0Sueb4Qg7fC78CHK5ypLU0nwx8SjeMohftpB8vwiv3M",
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
