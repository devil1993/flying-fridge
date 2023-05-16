import { Box, CircularProgress } from "@mui/material";
import GratitudeItem from "./GratitudeItem";

function GratitudeList({
  gratitudes,
  onEdit,
  onItemClick,
  onToggleEnableDisable,
  onDeleteGratitude,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
      }}
    >
      {gratitudes.length == 0 && <CircularProgress />}
      {gratitudes.map((item) => {
        return (
          <GratitudeItem
            key={item.id}
            gratitudeItem={item}
            onEdit={onEdit}
            onClick={() => {
              onItemClick(item);
            }}
            onToggleEnableDisable={() => {
              if (onToggleEnableDisable) onToggleEnableDisable(item);
            }}
            onDelete={() => {
              onDeleteGratitude(item);
            }}
          />
        );
      })}
    </Box>
  );
}

export default GratitudeList;
