import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  getUserGratitude,
  saveUserGratitude,
  deleteUserGratitude,
  uploadGratitudeImage,
} from "../Commons/FirebaseGratitudeService";
import { Alert, Button, Card, Container, Grid, Link, Snackbar } from "@mui/material";
import ProfileInfo from "./ProfileInfo";
import GratitudeList from "./GratitudeList";
import GratitudeCard from "../Commons/GratitudeCard";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Store/auth-store";
import GratitudeForm from "./GratitudeForm";
import { v4 } from "uuid";

function Dashboard() {
  let authContext = useContext(AuthContext);
  let [snackOpen, setSnackOpen] = useState(false);
  let [isEditing, setIsEditing] = useState(false);
  let [gratitudes, setGratitudes] = useState([]);
  let [editingGratitude, setEditingGratitude] = useState({});
  let [selectedGratitude, setSelectedGratitude] = useState(null);
  let [gratitudeListChanged, changeGratitudeList] = useState(0);

  useEffect(() => {
    if (authContext.currentUser) {
      getUserGratitude(authContext.currentUser.uid).then(
        (gratitudes_response) => {
          console.log("My Gratitides: ", gratitudes_response.gratitudes);
          setGratitudes(gratitudes_response.gratitudes);
          if (gratitudes_response.gratitudes.length > 0) {
            setSelectedGratitude(previousGratitude => previousGratitude ? previousGratitude : gratitudes_response.gratitudes[0]);
          }
        }
      );
    }
  }, [authContext.currentUser, gratitudeListChanged]);

  if (!authContext.currentUser) {
    return (
      <Alert severity="error">User not logged in, please log in first.</Alert>
    );
  }

  const gratitudeEditHandler = (grat) => {
    setIsEditing(true);
    setEditingGratitude(grat);
  };
  const gratitudeSaveHandler = async (gratitude, imageFile) => {
    console.log(gratitude);
    setIsEditing(false);
    try {
      let selectedImageUrl = gratitude.imagesrc;
      if (imageFile) {
        selectedImageUrl = await uploadGratitudeImage(gratitude.id, imageFile);
      }
      await saveUserGratitude({ ...gratitude, imagesrc: selectedImageUrl });
      changeGratitudeList((gl) => gl + 1);
    } catch (e) {
      console.log(e);
    }
  };
  const gratitudeCreateHandler = () => {
    let newGratitude = {
      name: "",
      description: "",
      imagesrc: "",
      id: v4(),
      isEnabled: true,
    };
    setEditingGratitude(newGratitude);
    setIsEditing(true);
  };
  const toggleEnableDisableHandler = async (gratitude) => {
    gratitude.isEnabled = !gratitude.isEnabled;
    try {
      await saveUserGratitude(gratitude);
      changeGratitudeList((gl) => gl + 1);
    } catch (e) {
      console.log(e);
    }
  };
  const deleteGratitudeHandler = async (gratitude) => {
    try {
      await deleteUserGratitude(gratitude);
      changeGratitudeList((gl) => gl + 1);
    } catch (e) {
      console.log(e);
    }
  };
  let publishedRef = `${window.location.protocol}//${window.location.host}/published-gratitude/${authContext.currentUser.uid}`
  return (
    <Container maxWidth="xl">
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => {setSnackOpen(false)}}
        message="URL copied to clipboard"
      />
      <Grid container spacing={5}>
        <Grid item md={12} sm={12} xs={12} lg={12}>
          <ProfileInfo />
          <Card sx={{ margin: "5px", p: 1 }}>
            <Link
              href={publishedRef}
              target="_blank"
              rel="noreferrer"
            >
              URL to published gratitudes
            </Link>
            <Button onClick={(event)=>{
              navigator.clipboard.writeText(publishedRef);
              setSnackOpen(true);
            }}>
            <ContentCopyIcon />
            </Button>
          </Card>
        </Grid>
        <Grid
          item
          sm={12}
          md={12}
          xs={12}
          lg={6}
          alignContent="center"
          justifyContent="center"
        >
          <GratitudeList
            gratitudes={gratitudes}
            onEdit={gratitudeEditHandler}
            onItemClick={(gratitude) => {
              console.log(gratitude);
              setSelectedGratitude(gratitude);
              setIsEditing(false);
              changeGratitudeList((gl) => gl + 1);
            }}
            onToggleEnableDisable={toggleEnableDisableHandler}
            onDeleteGratitude={deleteGratitudeHandler}
          />
          <Button
            variant="contained"
            component="label"
            onClick={gratitudeCreateHandler}
          >
            Add a gratitude
          </Button>
        </Grid>
        <Grid item sm={12} md={12} xs={12} lg={6}>
          {!isEditing && selectedGratitude && (
            <GratitudeCard gratitude={selectedGratitude} />
          )}
          {!isEditing && !selectedGratitude && <h1>Add few gratitudes....</h1>}

          {isEditing && editingGratitude && (
            <GratitudeForm
              onSave={gratitudeSaveHandler}
              gratitude={editingGratitude}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
