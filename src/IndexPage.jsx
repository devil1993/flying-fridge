import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    })
}

export default IndexPage;