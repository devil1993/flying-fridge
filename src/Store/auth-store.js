import React, { useState, useEffect } from "react";
import { setAuthStateChanged, signInToApp, signOutFromApp } from "../Commons/FirebaseAuthService";
import { checkUserLoggedIn } from "../Commons/FirebaseAuthService";

const AuthContext = React.createContext({
  currentUser: null,
  onLogout: async () => {},
  onLogin: async (email, password) => {},
});

export const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let user = checkUserLoggedIn();
    if (user) {
      setCurrentUser(user);
    }
    setAuthStateChanged(setCurrentUser)
  }, []);

  const logoutHandler = async () => {
    await signOutFromApp();
    setCurrentUser(null);
  };

  const loginHandler = async (email, password, shouldKeepLoggedIn = false) => {
    await signInToApp(email, password, shouldKeepLoggedIn);
    let user = checkUserLoggedIn();
    setCurrentUser(user);
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
