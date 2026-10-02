import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#B7E637", contrastText: "#090909" },
    error: { main: "#D94A3A" },
    text: { primary: "#090909", secondary: "#5C5C5C" },
    background: { default: "#F2F0EB", paper: "#FFFFFF" },
    divider: "#E4E1DA",
  },
  typography: {
    fontFamily: "Manrope, sans-serif",
    h1: { fontWeight: 800, fontSize: "2rem" },
  },
  shape: { borderRadius: 8 },
});
