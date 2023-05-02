import { useState } from "react";
import { checkUserLoggedIn, getUserDetails } from "./Commons/FirebaseService";
import SignIn from "./SignIn/SignIn";
import EditThanks from "./DashBoard/EditThanks";
import { useEffect } from "react";

function IndexPage(){
    let [userLoggedIn, setUserLoggedIn] = useState(false);
    useEffect(() => {
        let user = checkUserLoggedIn();
        if(!user){
            setUserLoggedIn(false);
        }
        else
            setUserLoggedIn(true);
    }, [userLoggedIn])
    const loginHandler = (event) => {
        setUserLoggedIn(true);
    }
    if(! userLoggedIn)
        return <SignIn onLogin={loginHandler}/>
    else
        return <EditThanks  />
}

export default IndexPage;