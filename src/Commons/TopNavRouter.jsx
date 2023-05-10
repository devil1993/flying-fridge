import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../Store/auth-store";
import { useContext } from "react";

function TopNavRouter(props) {
  const authcontext = useContext(AuthContext);
  const navigate = useNavigate();

  function onLoginClick(event) {
    navigate("/login");
  }

  function onLogOutClick(event) {
    authcontext.onLogout()
    .then(() => {
      navigate("/");
    });
  }

  let user = authcontext.currentUser;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gratitude
          </Typography>
          {!user && (
            <Button onClick={onLoginClick} color="inherit">
              Login
            </Button>
          )}
          {user && (
            <>
              <Button
                onClick={() => {
                  navigate("/dashboard");
                }}
                color="inherit"
              >
                Dashboard
              </Button>
              <Button onClick={onLogOutClick} color="inherit">
                Log Out
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}

export default TopNavRouter;
