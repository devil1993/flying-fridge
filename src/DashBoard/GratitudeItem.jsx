import { Card, Typography, Stack, Button } from "@mui/material";
function GratitudeItem({
  onEdit,
  gratitudeItem,
  onClick,
  onToggleEnableDisable,
  onDelete,
}) {
  if (!onToggleEnableDisable) {
    onToggleEnableDisable = () => {};
  }
  let enableDisableButtonString = gratitudeItem.isEnabled
    ? "Disable"
    : "Enable";
  return (
    <Card
      sx={{
        width: "100%",
        margin: "5px",
        p: 2,
      }}
      elevation={3}
    >
      <Stack direction="row" spacing={2}>
        <Typography variant="h4" sx={{ flex: 1 }} onClick={onClick}>
          {gratitudeItem.name}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="secondary"
            onClick={(event) => {
                onEdit(gratitudeItem);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={onToggleEnableDisable}
          >
            {enableDisableButtonString}
          </Button>
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default GratitudeItem;
