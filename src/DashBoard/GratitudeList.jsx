import { Box } from "@mui/material";
import GratitudeItem from "./GratitudeItem";

function GratitudeList() {
  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7].map((item) => {
        return <GratitudeItem key={item} />;
      })}
    </Box>
  );
}

export default GratitudeList;
