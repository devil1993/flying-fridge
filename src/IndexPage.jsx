import { useState } from "react";
import { checkUserLoggedIn, getUserDetails } from "./Commons/FirebaseService";
import SignIn from "./SignIn/SignIn";
import Dashboard from "./DashBoard/Dashboard";
import { useEffect } from "react";
import { redirect } from "react-router-dom";

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
        return redirect("/login")
    else
        return redirect("/dashboard")
}

export default IndexPage;