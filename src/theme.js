import { createTheme } from "@mui/material/styles";

// Shared "Gratitude" theme — warm coral/amber + violet on a soft cream canvas.
// Matches the look of the landing page across the whole application.
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff7a59",
      dark: "#f1542e",
      light: "#ffb547",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6c5ce7",
      light: "#a29bfe",
      dark: "#4b2b6b",
      contrastText: "#ffffff",
    },
    warning: { main: "#ffb547", dark: "#ff9f1c", contrastText: "#2b2440" },
    success: { main: "#00b894", dark: "#0aa17e", contrastText: "#ffffff" },
    error: { main: "#f1542e", contrastText: "#ffffff" },
    background: { default: "#fff8f2", paper: "#ffffff" },
    text: { primary: "#2b2440", secondary: "#6b6480" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    h1: { fontWeight: 850, letterSpacing: "-0.02em" },
    h2: { fontWeight: 850, letterSpacing: "-0.02em" },
    h3: { fontWeight: 800, letterSpacing: "-0.01em" },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: "none" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 22, paddingBlock: 9 },
        containedPrimary: {
          background: "linear-gradient(135deg, #ff7a59 0%, #f1542e 100%)",
          boxShadow: "0 12px 26px rgba(241,84,46,0.30)",
          "&:hover": { boxShadow: "0 18px 34px rgba(241,84,46,0.40)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, border: "1px solid rgba(43,36,64,0.06)" },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "default" },
      styleOverrides: {
        root: {
          background: "rgba(255,248,242,0.82)",
          backdropFilter: "saturate(160%) blur(10px)",
          color: "#2b2440",
          borderBottom: "1px solid rgba(43,36,64,0.06)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 14 } },
    },
  },
});

export default theme;
