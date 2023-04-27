import './App.css';
import TopNavRouter from './Commons/TopNavRouter';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import EditThanks from './DashBoard/EditThanks';
import Published from './Published/Published';
import { RouterProvider, createBrowserRouter} from 'react-router-dom';
import ErrorPage from './Commons/ErrorPage';
import { Box, Button, Card, CardActions, CardContent, Container, Grid, Input, Stack, TextField, Typography } from '@mui/material';
import { Save, FileUpload } from '@mui/icons-material'

const router = createBrowserRouter([
  {
     path: '/', 
     element: <TopNavRouter />,
     errorElement: <ErrorPage />,
     children: [
      { index: true, element: <Hi />, },
      { path: '/login', element: <SignIn />, },
      { path: '/register', element: <SignUp />, },
      { path: '/dashboard', element: <EditThanks />, },
      { path: '/published-gratitude', element: <Published />, }
     ]
   }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

function Hi(){
  return (
    <>
      <Container maxWidth="xl" >
        <Grid container spacing={2} >
            <Grid item md={12} sm={12} xs={12} lg={4}>
              <Box sx={{
                color: 'black'
              }}>
                <Typography variant='h3'>Welcome Samanway</Typography>
              </Box>
            </Grid>
            <Grid item md={12} sm={12} xs={12} lg={8}>
                <Card sx={{ minWidth: 275 }} elevation={4}>
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <Stack width="75%" spacing={2}>
                        <TextField id="outlined-basic" label="Name" variant="outlined" />
                        <TextField id="outlined-basic" label="Description" variant="outlined" />
                        <TextField id="outlined-basic" label="Image URL" variant="outlined" />
                        <Button 
                            variant="contained"
                            component="label"
                        > 
                            <Typography padding={2}>Upload Image</Typography>
                            <FileUpload />
                            <input
                              type="file"
                              hidden
                            />
                        </Button>
                        {/* <Input type='file' id="outlined-basic" label="Image" variant="outlined" /> */}
                      </Stack>
                      <Box width="25%" sx={{border: "1px solid red"}}></Box>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{
                    alignSelf: "stretch",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    marginRight: 5
                  }}>
                    <Button variant='contained' size="large" color='success'> Save <Save/> </Button>
                  </CardActions>
                </Card>
            </Grid>
        </Grid>
      </Container>
      {/* <Stack direction="row">
          <Box sx={
            {
              backgroundColor : 'primary.light',
              height: "25%",
              width: "25%",
              p: 2,
              border: '1px solid red'
            }
          }>
            
          </Box>
      </Stack> */}
    </>
  );
}

export default App;
