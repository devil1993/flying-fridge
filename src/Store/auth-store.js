import React, { useState, useEffect } from "react";
import { signInToApp, signOutFromApp } from "../Commons/FirebaseService";
import { checkUserLoggedIn } from "../Commons/FirebaseService";

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
  }, []);

  const logoutHandler = async () => {
    await signOutFromApp();
    setCurrentUser(null);
  };

  const loginHandler = async (email, password) => {
    await signInToApp(email, password);
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
