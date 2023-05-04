import { useNavigate } from 'react-router-dom';
import { checkUserLoggedIn, getUserDetails } from '../Commons/FirebaseService'
import { Alert, Button, Container, Grid } from '@mui/material';
import ProfileInfo from './ProfileInfo';
import GratitudeList from './GratitudeList';
import GratitudeCard from '../Commons/GratitudeCard';
import { useState, useEffect } from 'react';

function Dashboard(){
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