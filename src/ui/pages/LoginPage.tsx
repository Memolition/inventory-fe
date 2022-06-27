import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { AuthContext } from "../app";

const LoginPage = () => {
    const navigate = useNavigate();
    const location:any = useLocation();
    const auth:any = useAuth(AuthContext);
    const [user, setUser] = useState({name: '', password: ''});
  
    let from = location.state?.from?.pathname || "/";
  
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
  
      let formData = new FormData(event.currentTarget);
  
      auth.signin(user.name, user.password, () => {
        navigate(from, { replace: true });
      });
    }

    const changeUser = (attr:string, val:any) => {
        setUser(prevUser => ({
            ...prevUser,
            [attr]: val
        }));
    }
  
    return (
      <div className="login-page">
        <form onSubmit={handleSubmit}>
          <label>
            <span>Usuario:</span>
            <input placeholder="Nombre de Usuario" type="text" value={user.name} onChange={(e) => {changeUser('name', e.target.value); }} />
          </label>{" "}
          <label>
          <span>Contraseña:</span>
            <input placeholder="Contraseña" type="password" value={user.password} onChange={(e) => {changeUser('password', e.target.value); }} />
          </label>{" "}
          <button type="submit" className="btn">Iniciar Sesion</button>
          <button
            type="button"
            className="btn danger"
            onClick={() => {
              document.dispatchEvent(new Event('closeApp'));
            }}
          >
            Salir
          </button>
        </form>
      </div>
    );
};

export default LoginPage;