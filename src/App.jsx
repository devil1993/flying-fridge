import './App.css';
import TopNavRouter from './Commons/TopNavRouter';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import EditThanks from './DashBoard/EditThanks';
import Published from './Published/Published';
import { RouterProvider, createBrowserRouter} from 'react-router-dom';
import ErrorPage from './Commons/ErrorPage';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Grid, Input, Stack, TextField, Typography } from '@mui/material';
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
            <Grid item md={12} sm={12} xs={12} lg={12}>
              <Box sx={{
                color: 'black'
              }}>
                <Typography variant='h3'>Welcome Samanway</Typography>
              </Box>
            </Grid>
            <Grid item md={12} sm={12} xs={12} lg={12}>
                <Card sx={{ minWidth: 275 }} elevation={4}>
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <Stack width="75%" spacing={2}>
                        <TextField id="outlined-basic" label="Name" variant="outlined" />
                        <TextField id="outlined-basic" label="Description" variant="outlined" multiline />
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
                      <Box width="25%" minWidth={150} sx={{border: "1px solid red"}}></Box>
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
            <Grid item sm={12} md={12} xs={12} lg={8}>
              <Box sx={{
                // border: "1px solid red",
                width: "100%",
                margin: "auto"
              }}>
              {
                [1,2,3,4,5,6,7].map((item) => {
                  return <Card 
                            key={item}
                            sx={
                              {
                                width: "100%", 
                                margin:"5px", 
                                p:2
                              }
                            }
                            elevation={3}
                          >
                            <Stack direction='row' spacing={2}>
                              <Typography variant="h4" sx={{flex:1}}>John Doe</Typography>
                              <Stack direction="row" spacing={1}>
                              <Button variant='contained' color='secondary'>Edit</Button>
                              <Button variant='contained' color='warning'>Disable</Button>
                              <Button variant='contained' color='error'>Delete</Button>
                              </Stack>
                            </Stack>
                          </Card>;
                })
              }
              </Box>
            </Grid>
            <Grid item sm={12} md={12} xs={12} lg={4}>
              <Box sx={{
                // border: "1px solid red",
                width: "325px",
                height: "455px",
                p:2,
                marginBottom: "10px",
                marginX: "auto"
              }}
              flex={1}>
                <Card height={100} width={100} elevation={5}>
                    {/* <CardMedia
                      sx={{
                        borderRadius: "50%",
                        margin: "5"
                      }}  
                      component="img"
                      image="https://media.licdn.com/dms/image/C5103AQEr0yfePU317w/profile-displayphoto-shrink_800_800/0/1525779610666?e=2147483647&v=beta&t=ktzbmdxUG8yVOOMmyNH6ZvCe8Yjq5BkhkMz5ET8ONZo"
                      alt="green iguana"
                    /> */}
                    <img src="https://media.licdn.com/dms/image/C5103AQEr0yfePU317w/profile-displayphoto-shrink_800_800/0/1525779610666?e=2147483647&v=beta&t=ktzbmdxUG8yVOOMmyNH6ZvCe8Yjq5BkhkMz5ET8ONZo"
                    width="90%" style={{borderRadius: "50%", margin: "16px"}} alt='green iguana'
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Lizard
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
                      </Typography>
                    </CardContent>
                </Card>
              </Box>
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
