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
import {
  uploadUserDetails,
  getUserDetails,
  uploadProfileImage,
} from "../Commons/FirebaseService";
import { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import AuthContext from "../Store/auth-store";
import IdentityForm from "../Commons/IdentityForm";

function ProfileInfo() {
  let authcontext = useContext(AuthContext);
  let fileInputRef = useRef();

  let [userData, setUserData] = useState({
    userName: "",
    description: "",
    profileImageUrl: "",
  });
  let [savedUserData, setSavedUserData] = useState({});
  
  useEffect(() => {
    getUserDetails(authcontext.currentUser.uid).then((result) => {
      setUserData(result);
      setSavedUserData(result);
    });
  }, [authcontext.currentUser]);

  const saveHandler = async (emittedUserData, profileImageFile) => {
    try {
      let selectedImageUrl = emittedUserData.profileImageUrl;
      console.log(selectedImageUrl);
      if (profileImageFile) {
        selectedImageUrl = await uploadProfileImage(
          authcontext.currentUser.uid,
          profileImageFile
        );
        console.log(selectedImageUrl);  
      }
      await uploadUserDetails(authcontext.currentUser.uid, {
        ...emittedUserData,
        profileImageUrl: selectedImageUrl,
      });
      setUserData((prevState) => {
        return {
          ...emittedUserData,
          profileImageUrl: selectedImageUrl,
        };
      });
      setSavedUserData((prevState) => {
        return {
          ...emittedUserData,
          profileImageUrl: selectedImageUrl,
        };
      });
      alert("Your data has been saved successfully");
    } catch (e) {
      console.log(e);
    }
  };
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
              <IdentityForm userData={userData} onSave={saveHandler}/>
              <Box width="25%" minWidth={150}>
                <img
                  src={savedUserData.profileImageUrl}
                  width="90%"
                  alt={savedUserData.userName}
                />
              </Box>
            </Stack>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default ProfileInfo;
