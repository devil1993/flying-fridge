import { Card, Stack, Typography } from "@mui/material";
import GratitudeCard from "./Commons/GratitudeCard";

function IndexPage() {
  return (
    <>
      <Typography variant="h1" align="center">
        Welcome to Gratitude.
      </Typography>
      <Stack direction="row" spacing={2} width="100%">
        <Typography variant="h3" allign="center">
          <Card  elevation={3}>
              Sign Up
          </Card>
        </Typography>
        <Typography variant="h3" allign="center">
          <Card  elevation={3}>
              Post your gratitudes
          </Card>
        </Typography>
        <Typography variant="h3" allign="center">
          <Card  elevation={3}>
              Publish
          </Card>
        </Typography>
        <Typography variant="h3" allign="center">
          <Card  elevation={3}>
              Share
          </Card>
        </Typography>
      </Stack>
      <GratitudeCard gratitude={{name: "hi", description: "hello"}}/>
    </>
  );
}

export default IndexPage;
