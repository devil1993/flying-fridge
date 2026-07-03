import { AppBar, Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../Store/auth-store";
import { useContext } from "react";

function HeartMark() {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "12px",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #ff7a59, #ffb547)",
        boxShadow: "0 4px 16px rgba(43,36,64,0.12)",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 20.5S3.5 14.6 3.5 8.9A4.4 4.4 0 0 1 12 6.7a4.4 4.4 0 0 1 8.5 2.2C20.5 14.6 12 20.5 12 20.5Z"
          fill="#fff"
        />
      </svg>
    </Box>
  );
}

function TopNavRouter() {
  const authcontext = useContext(AuthContext);
  const navigate = useNavigate();

  function onLoginClick() {
    navigate("/login");
  }

  function onLogOutClick() {
    authcontext.onLogout().then(() => {
      navigate("/");
    });
  }

  let user = authcontext.currentUser;

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: 72 }}>
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              cursor: "pointer",
              flexGrow: 1,
            }}
          >
            <HeartMark />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}
            >
              Gratitude
            </Typography>
          </Box>

          {!user && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Button onClick={onLoginClick} color="inherit" sx={{ fontWeight: 700 }}>
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                variant="contained"
                color="primary"
              >
                Get started
              </Button>
            </Box>
          )}
          {user && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Button onClick={() => navigate("/dashboard")} color="inherit" sx={{ fontWeight: 700 }}>
                Dashboard
              </Button>
              <Button onClick={onLogOutClick} variant="contained" color="primary">
                Log Out
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}

export default TopNavRouter;
