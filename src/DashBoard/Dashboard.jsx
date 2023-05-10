import { useNavigate } from "react-router-dom";
import { getUserGratitude } from "../Commons/FirebaseService";
import { Alert, Button, Container, Grid } from "@mui/material";
import ProfileInfo from "./ProfileInfo";
import GratitudeList from "./GratitudeList";
import GratitudeCard from "../Commons/GratitudeCard";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Store/auth-store";
import GratitudeForm from "./GratitudeForm";

function Dashboard() {
  let authContext = useContext(AuthContext);
  let [isEditing, setIsEditing] = useState(false);
  let [gratitudes, setGratitude] = useState([]);

  useEffect(() => {
    if (authContext.currentUser) {
      getUserGratitude(authContext.currentUser.uid).then(
        (gratitudes_response) => {
          console.log("My Gratitides: ", gratitudes_response);
          setGratitude(gratitudes_response);
        }
      );
    }
  }, []);

  if (!authContext.currentUser) {
    return (
      <Alert severity="error">User not logged in, please log in first.</Alert>
    );
  }

  const gratitudeEditHandler = (grat) => {
    setIsEditing(true);
  };
  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item md={12} sm={12} xs={12} lg={12}>
          <ProfileInfo />
        </Grid>
        <Grid item sm={12} md={12} xs={12} lg={8}>
          <GratitudeList
            gratitudes={gratitudes}
            onEdit={gratitudeEditHandler}
          />
        </Grid>
        <Grid item sm={12} md={12} xs={12} lg={4}>
          {!isEditing && <GratitudeCard />}
          {isEditing && <GratitudeForm />}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
