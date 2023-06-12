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
        // width: "100%",
        margin: "auto",
      }}
    >
      {gratitudes.length === 0 && <CircularProgress />}
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
              let cnf = window.confirm(`Are you sure you want to delete the gratitude ${item.name}`);
              if(cnf){
                onDeleteGratitude(item);
                onItemClick(null)
              }
            }}
          />
        );
      })}
    </Box>
  );
}

export default GratitudeList;
