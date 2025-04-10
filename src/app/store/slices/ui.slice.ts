import { createSlice } from "@reduxjs/toolkit";

interface IUISlice {
  language: string;
  app: "erp" | "aiAgents";
}

const initialState: IUISlice = {
  language: "uz",
  app: "erp",
};

const uiSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setApp: (state, action) => {
      state.app = action.payload;
    },
  },
});

export default uiSlice.reducer;

export const { setLanguage, setApp } = uiSlice.actions;
