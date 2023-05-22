import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { FileUpload, Save } from "@mui/icons-material";

const IdentityForm = ({ userData, onSave }) => {
  let fileInputRef = useRef();
  let [selectedFile, setSelectedFile] = useState("");
  let [userName, setUsername] = useState('');
  let [userDescription, setUserDescription] = useState('');
  let [userProfileImage, setUserProfileImage] = useState('');
  useEffect(()=> {
    setUsername(userData.userName);
    setUserDescription(userData.description);
    setUserProfileImage(userData.profileImageUrl);
    setSelectedFile("No files selected for upload");
  }, [userData])
  
  function saveHandler(event) {
    let userDataState = {
      userName: userName,
      description: userDescription,
      profileImageUrl: userProfileImage
    }
    if (fileInputRef.current.files.length > 0){
      onSave(userDataState, fileInputRef.current.files[0]);
    }
    else{
      onSave(userDataState)
    }
  }
  return (
    <Stack width="75%" spacing={2}>
      <TextField
        id="outlined-basic"
        label="Name"
        variant="outlined"
        value={userName || ""}
        onChange={(event) => {setUsername(event.target.value)}}
      />
      <TextField
        id="outlined-basic"
        label="Description"
        variant="outlined"
        multiline
        value={userDescription || ""}
        onChange={(event) => {setUserDescription(event.target.value)}}
      />
      <TextField
        id="outlined-basic"
        label="Image URL"
        variant="outlined"
        value={userProfileImage || ""}
        onChange={(event) => {setUserProfileImage(event.target.value)}}
      />
      <Stack direction="row" spacing={2} width="100%">
        <Button variant="contained" component="label">
          <Typography padding={2}>Select Image From Disk</Typography>
          <FileUpload />
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={() => {
              setSelectedFile(fileInputRef.current.files[0].name);
            }}
          />
        </Button>
        <Button
          variant="contained"
          component="label"
          onClick={saveHandler}
          color="success"
        >
          <Typography padding={2}>Save Details</Typography>
          <Save />
        </Button>
      </Stack>
      <Typography>{selectedFile}</Typography>
    </Stack>
  );
};

export default IdentityForm;
