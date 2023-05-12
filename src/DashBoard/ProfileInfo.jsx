import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  CardActions,
} from "@mui/material";
import { FileUpload, Save } from "@mui/icons-material";
import { uploadUserDetails, getUserDetails, uploadProfileImage } from "../Commons/FirebaseService";
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import AuthContext from "../Store/auth-store";

function ProfileInfo() {
  let authcontext = useContext(AuthContext);
  let fileInputRef = useRef();
  let [userData, setUserData] = useState({
    userName: '',
    description: '',
    profileImageUrl: ''
  });
  let [savedUserData, setSavedUserData] = useState({});
  let [selectedFile, setSelectedFile] = useState('No files selected for upload');
  useEffect(() => {
    getUserDetails(authcontext.currentUser.uid).then((result) => {
      setUserData(result);
      setSavedUserData(result);
    });
  }, [authcontext.currentUser]);
  function updateName(event){
    let name = event.target.value;
    setUserData((prevState) => {
      return {
        ...prevState,
        userName: name
      }
    })
  }
  function updateDescription(event){
    let desc = event.target.value;
    setUserData((prevState) => {
      return {
        ...prevState,
        description: desc
      }
    })
  }
  function updateUrl(event){
    let url = event.target.value;
    setUserData((prevState) => {
      return {
        ...prevState,
        profileImageUrl: url
      }
    })
  }

  const saveData = async (event) => {
    try{
      let selectedImageUrl = userData.profileImageUrl;
      console.log(selectedImageUrl)
      if(fileInputRef.current.files.length > 0){
        selectedImageUrl = await uploadProfileImage(authcontext.currentUser.uid, fileInputRef.current.files[0])
        console.log(selectedImageUrl)
      }
      await uploadUserDetails(authcontext.currentUser.uid, {...userData, profileImageUrl: selectedImageUrl});
      setUserData((prevState) => {
        return {
          ...prevState,
          profileImageUrl: selectedImageUrl
        }
      })
      setSavedUserData((prevState) => {
        return {
          ...prevState,
          profileImageUrl: selectedImageUrl
        }
      });
      alert("Your data has been saved successfully");
    }
    catch(e){
      console.log(e)
    }
  }
  return (
    <>
      <Card sx={{ minWidth: 275, marginTop: 2 }} elevation={4}>
        <CardContent>
          <Grid container sx={{ width: "100%" }}>
            <Grid item md={12} sm={12} xs={12} lg={12}>
              <Box
                sx={{
                  color: "black",
                }}
              >
                <Typography variant="h4" sx={{ color: "primary.dark", p: 1 }}>
                  Welcome {savedUserData && savedUserData.userName}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: "secondary.light", p: 1 }}
                >
                  You can edit your details here.
                </Typography>
              </Box>
            </Grid>
            <Stack direction="row" spacing={2} width="100%">
              <Stack width="75%" spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  value={userData.userName || ''}
                  onChange={updateName}
                />
                <TextField
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  multiline
                  value={userData.description || ''}
                  onChange={updateDescription}

                />
                <TextField
                  id="outlined-basic"
                  label="Image URL"
                  variant="outlined"
                  value={userData.profileImageUrl || ''}
                  onChange={updateUrl}

                />
                <Button variant="contained" component="label">
                  <Typography padding={2}>Select Image From Disk</Typography>
                  <FileUpload />
                  <input type="file" hidden ref={fileInputRef} onChange={()=>{setSelectedFile(fileInputRef.current.files[0].name)}}/>
                </Button>
                <Typography>{selectedFile}</Typography>
              </Stack>
              <Box
                width="25%"
                minWidth={150}
              >
                <img src={savedUserData.profileImageUrl}  width="90%"  alt={savedUserData.userName}
            />
              </Box>
            </Stack>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            alignSelf: "stretch",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            marginRight: 5,
          }}
        >
          <Button variant="contained" size="large" color="success" onClick={saveData}>
            {" "}
            Save <Save />{" "}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

export default ProfileInfo;
