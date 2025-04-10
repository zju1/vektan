/* eslint-disable @typescript-eslint/no-explicit-any */
import { Middleware } from "@reduxjs/toolkit";
import { resetAuth } from "../slices/auth.slice";

export const authMiddleWare: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action: any) => {
    if (action?.payload?.status === 401) {
      dispatch(resetAuth());
      localStorage.clear();
    }
    next(action);
  };
