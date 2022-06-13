import axios from "axios";
import React from "react";
import { API_ROOT } from "../../../renderer";
import { AuthContext } from "../../app";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<any>(null);
  
    const signin = (name: string, password: string, callback: VoidFunction) => {
        return axios.post(`${API_ROOT}/users/login`, {name, password})
        .then((r:any) => {
            setUser({
                user: r.data,
                loggedIn: new Date().getTime(),
            });
            callback();
        });
    };
  
    const signout = (callback: VoidFunction) => {
      return new Promise((res, rej) => {
        setUser(null);
        callback();
        res(true);
      });
    };
  
    return (
        <AuthContext.Provider value={{ user, signin, signout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;