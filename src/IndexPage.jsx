import { useContext, useState } from "react";
import { checkUserLoggedIn, getUserDetails } from "./Commons/FirebaseService";
import SignIn from "./SignIn/SignIn";
import Dashboard from "./DashBoard/Dashboard";
import { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import AuthContext from "./Store/auth-store";

function IndexPage(){
    let authContext = useContext(AuthContext);
    let navigate = useNavigate();
    useEffect(() => {
        if(!authContext.currentUser){
            navigate("/login")
        }
        else
            navigate("/dashboard")
    }, [])
}

export default IndexPage;