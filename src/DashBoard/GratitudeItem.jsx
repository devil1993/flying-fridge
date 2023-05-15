import { Card, Typography, Stack, Button } from "@mui/material";
function GratitudeItem({onEdit, gratitudeItem, onClick}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: "100%",
        margin: "5px",
        p: 2,
      }}
      elevation={3}
    >
      <Stack direction="row" spacing={2}>
        <Typography variant="h4" sx={{ flex: 1 }}>
          {gratitudeItem.name}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="secondary" onClick={(event) => {onEdit(gratitudeItem)}}>
            Edit
          </Button>
          <Button variant="contained" color="warning">
            Disable
          </Button>
          <Button variant="contained" color="error">
            Delete
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default GratitudeItem;
