import { Box } from "@mui/material";
import GratitudeItem from "./GratitudeItem";

function GratitudeList({gratitudes, onEdit}) {
  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
      }}
    >
      {gratitudes.map((item) => {
        return <GratitudeItem key={item.id} gratitudeItem={item} />;
      })}
    </Box>
  );
}

export default GratitudeList;
