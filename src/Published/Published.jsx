import Marquee from "react-fast-marquee";
import GratitudeCard from "../Commons/GratitudeCard";
import { Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../Commons/FirebaseAuthService";
import { getPublishedGratitudes } from "../Commons/FirebaseGratitudeService";
import { useState } from "react";
import { useEffect } from "react";

const Published = (props) => {
  const params = useParams();
  let userId = params.userId;
  let [userDetailForCard, setUserDetails] = useState(null);
  let [publishedGratitudeList, setPublishedGratitudes] = useState([]);
  useEffect(() => {
    getPublishedGratitudes(userId).then((pubGrats) => {
      setPublishedGratitudes(pubGrats.gratitudes);
    });

    getUserDetails(userId).then((userDetail) => {
      setUserDetails({
        name: userDetail.userName,
        description: userDetail.description,
        imagesrc: userDetail.profileImageUrl,
      });
    });
  }, [userId]);
  let text = "published by";
  console.log("PGL:", publishedGratitudeList);
  console.log("UD:", userDetailForCard);
  return (
    <Stack height="100%">
      <Marquee
        gradient={true}
        pauseOnHover={false}
        pauseOnClick={true}
        style={{ height: "50%", marginTop: "5px  " }}
      >
        {publishedGratitudeList.map((item) => (
          <GratitudeCard gratitude={item} />
        ))}
      </Marquee>
      <Typography marginTop={1} align="center" variant="h5">
        {text}
      </Typography>
      {userDetailForCard && (
        <GratitudeCard height="50%" gratitude={userDetailForCard} />
      )}
    </Stack>
  );
};

export default Published;
