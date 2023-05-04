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
import { checkUserLoggedIn, getUserDetails } from "../Commons/FirebaseService";
import { useState } from "react";
import { useEffect } from "react";

function ProfileInfo() {
  console.log("in profile info:")
  let [userData, setUserData] = useState({})
  useEffect(()=>{
      let user = checkUserLoggedIn();
      getUserDetails(user.uid).then(result => {
        setUserData(result)
      })
  }, [])
  console.log(userData
    )
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
                  Welcome {userData && userData.userName}
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
                  defaultValue={userData.userName}
                />
                <TextField
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  multiline
                  defaultValue={userData.description}
                />
                <TextField
                  id="outlined-basic"
                  label="Image URL"
                  variant="outlined"
                />
                <Button variant="contained" component="label">
                  <Typography padding={2}>Upload Image</Typography>
                  <FileUpload />
                  <input type="file" hidden />
                </Button>
                {/* <Input type='file' id="outlined-basic" label="Image" variant="outlined" /> */}
              </Stack>
              <Box
                width="25%"
                minWidth={150}
                sx={{ border: "1px solid red" }}
              ></Box>
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
          <Button variant="contained" size="large" color="success">
            {" "}
            Save <Save />{" "}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

export default ProfileInfo;
