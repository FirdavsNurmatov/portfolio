import { createTheme } from "@mui/material/styles";

// --- Common typography
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h4: { fontWeight: 700, fontSize: "2rem" },
  h5: { fontWeight: 600, fontSize: "1.5rem" },
  body1: { fontSize: "1rem" },
  body2: { fontSize: "0.875rem" },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" }, // primary buttons, links
    secondary: { main: "#ff9800" }, // accent color
    background: {
      default: "#f5f5f5", // page background
      paper: "#fff", // card / paper background
    },
    text: {
      primary: "#212121",
      secondary: "#555",
    },
    success: { main: "#4caf50" },
    error: { main: "#f44336" },
    warning: { main: "#ff9800" },
    info: { main: "#0288d1" },
  },
  typography,
  shape: { borderRadius: 8 },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#ffb74d" },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#fff",
      secondary: "#aaa",
    },
    success: { main: "#81c784" },
    error: { main: "#e57373" },
    warning: { main: "#ffb74d" },
    info: { main: "#4fc3f7" },
  },
  typography,
  shape: { borderRadius: 8 },
});
