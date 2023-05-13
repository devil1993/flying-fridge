import { Box, CircularProgress } from "@mui/material";
import GratitudeItem from "./GratitudeItem";

function GratitudeList({gratitudes, onEdit, onItemClick}) {
  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
      }}
    >
      {gratitudes.length == 0 && <CircularProgress />}
      {gratitudes.map((item) => {
        return <GratitudeItem key={item.id} gratitudeItem={item} onEdit={onEdit} onClick={() => {onItemClick(item)}} />;
      })}
    </Box>
  );
}

export default GratitudeList;
