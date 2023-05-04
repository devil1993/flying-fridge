import {
    Card,
    CardContent,
    Box,
    Typography,
  } from "@mui/material";
function GratitudeCard({ scalingFactor }){
    scalingFactor = scalingFactor ?? 100;
    let height = 420 * scalingFactor / 100.0 + "px";
    let width = 300 * scalingFactor / 100.0 + "px";
    return (<Box sx={{
        // border: "1px solid red",
        width: {width},
        height: {height},
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
      </Box>);
}
export default GratitudeCard;