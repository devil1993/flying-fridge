import { useNavigate } from 'react-router-dom';
import { checkUserLoggedIn, getUserDetails } from '../Commons/FirebaseService'
import { Alert, Button, Container, Grid } from '@mui/material';
import ProfileInfo from './ProfileInfo';
import GratitudeList from './GratitudeList';
import GratitudeCard from '../Commons/GratitudeCard';
import { useContext } from 'react';
import AuthContext from '../Store/auth-store';

function Dashboard(){
    let authContext = useContext(AuthContext);
    if(!authContext.currentUser)
      return <Alert severity='error'>User not logged in, please log in first.</Alert>
    return (<Container maxWidth="xl">
    <Grid container spacing={2}>
      <Grid item md={12} sm={12} xs={12} lg={12}>
        <ProfileInfo />
      </Grid>
      <Grid item sm={12} md={12} xs={12} lg={8}>
        <GratitudeList />
      </Grid>
      <Grid item sm={12} md={12} xs={12} lg={4}>
        <GratitudeCard />
      </Grid>
    </Grid>
  </Container>);
}

export default Dashboard;