import Marquee from "react-fast-marquee";
import GratitudeCard from "../Commons/GratitudeCard";
import {Stack, Typography} from '@mui/material'

function Published(){
    let publishedGratitudeList = ["hello", "Hi", "I-am-here"];
    let text = "published by"
    return (
        <Stack height="100%">
            <Marquee gradient={true} pauseOnHover={true} style={{height: "50%", marginTop: "5px  "}}>
                {publishedGratitudeList.map((item) => <GratitudeCard key={item}/> )}
            </Marquee>
            <Typography marginTop={1} align="center" variant="h5">{text}</Typography>
            <GratitudeCard height="50%"/>
        </Stack>
    );
}

export default Published;