export const envVariables = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  IS_PRODUCTION: import.meta.env.MODE === "PRODUCTION",
};
