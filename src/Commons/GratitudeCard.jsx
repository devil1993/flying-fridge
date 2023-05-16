import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
function GratitudeCard({ scalingFactor, gratitude }) {
  scalingFactor = scalingFactor ?? 100;
  let height = (420 * scalingFactor) / 100.0 + "px";
  let width = (300 * scalingFactor) / 100.0 + "px";
  if (!gratitude) {
    return <CircularProgress />;
  }
  let initials = gratitude.name
    .split(" ")
    .map((s) => s.trim())
    .reduce((acc, item) => {
      if (item) {
        acc += item[0];
      }
      return acc;
    }, "");
  console.log(initials);
  return (
    <Box
      sx={{
        // border: "1px solid red",
        width: { width },
        height: { height },
        p: 2,
        marginBottom: "10px",
        marginX: "auto",
      }}
      flex={1}
    >
      <Card height={100} width={100} elevation={5}>
        {gratitude.imagesrc && (
          <img
            src={gratitude.imagesrc}
            width="90%"
            style={{ borderRadius: "50%", margin: "16px" }}
            alt={gratitude.name}
          />
        )}

        <CardContent>
          <Box sx={{ alignItems: "center" }}>
            {!gratitude.imagesrc && (
              <Avatar sx={{ bgcolor: "warning.light" }}>
                {initials.toUpperCase()}
              </Avatar>
            )}
            <Typography gutterBottom variant="h5" component="div">
              {gratitude.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {gratitude.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
export default GratitudeCard;
