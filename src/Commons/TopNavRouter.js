import { AppBar } from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, Outlet, useNavigate } from "react-router-dom";
  
function TopNavRouter(props){
  const navigate = useNavigate();

  function onLoginClick(event){
    navigate("/login");
  }
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
            <Button onClick={onLoginClick} color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        <Outlet />
    </>);
}

export default TopNavRouter;