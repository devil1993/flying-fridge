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
  let [gratitudes, setGratitudes] = useState([]);
  let [editingGratitude, setEditingGratitude] = useState({});
  let [selectedGratitude, setSelectedGratitude] = useState(null);

  useEffect(() => {
    if (authContext.currentUser) {
      getUserGratitude(authContext.currentUser.uid).then(
        (gratitudes_response) => {
          console.log("My Gratitides: ", gratitudes_response.gratitudes);
          setGratitudes(gratitudes_response.gratitudes);
          if(gratitudes_response.gratitudes.length > 0){
            setSelectedGratitude(gratitudes_response.gratitudes[0]);
          }
        }
      );
    }
  }, [authContext.currentUser]);

  if (!authContext.currentUser) {
    return (
      <Alert severity="error">User not logged in, please log in first.</Alert>
    );
  }

  const gratitudeEditHandler = (grat) => {
    setIsEditing(true);
    setEditingGratitude(grat);
  };
  const gratitudeSaveHandler = (gratitude) => {
    console.log(gratitude)
    setIsEditing(false);
    if(gratitudes.map(g => +g.id).includes(gratitude.id)){

    }
    else{
      setGratitudes((prevGratitudes) => [...prevGratitudes, gratitude])
    }
  };
  const gratitudeCreateHandler = () => {
      let newGratitude = {
        name: '',
        description: '',
        imagesrc: '',
        id: new Date().getTime()
      }
      setEditingGratitude(newGratitude);
      setIsEditing(true);
  };
  const toggleEnableDisableHandler = (gratitude) => {
    if(gratitude.isEnabled){
      alert('Disabled')
    }
    else{
      alert('Enabled')
    }
  }
  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item md={12} sm={12} xs={12} lg={12}>
          <ProfileInfo />
        </Grid>
        <Grid item sm={12} md={12} xs={12} lg={8} alignContent='center' justifyContent="center">
          <GratitudeList
            gratitudes={gratitudes}
            onEdit={gratitudeEditHandler}
            onItemClick={(gratitude) => {console.log(gratitude);setSelectedGratitude(gratitude);setIsEditing(false)}}
            onToggleEnableDisable={toggleEnableDisableHandler}
          />
          <Button
            variant="contained"
            component="label"
            onClick={gratitudeCreateHandler}
          >Add a gratitude</Button>
        </Grid>
        <Grid item sm={12} md={12} xs={12} lg={4}>
          {!isEditing && <GratitudeCard gratitude={selectedGratitude} />}
          {isEditing && editingGratitude && <GratitudeForm onSave={gratitudeSaveHandler} gratitude={editingGratitude}/>}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
