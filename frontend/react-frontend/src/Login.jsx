import React, { useState } from "react";
import {Redirect, Navigate, useNavigate, Link} from "react-router-dom";
import './Dashboard'
import './style.css'
import http from "./http-common"
import showPasswordImg from './eye.svg'
import hidePasswordImg from './closed-eye.svg'
import { HttpStatusCode } from "axios";


const Login = () => {

    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState({}); //pamti pogreske
    const [isLogin, setIsLogin] = useState(false); //pamti jesmo li se uspjesno ulogirali
    const [showPassword, setShowPassword] = useState(false); //mijenjamo vidimo li lozinku
    const [showLogin, setShowLogin] = useState(true);


    //Obraduje pogreske pri pokusaju prijave
    const renderErrorMessage = (name) => name === errorMessages.name && (
        <div className="error">
            {errorMessages.message}
        </div>
    );

    
    //Kad stisnemo Login, provjerava se jesu li podaci dobri
    const handleSubmitLogin = (event) => {
        event.preventDefault(); //prevent page reload
        var { username, password } = document.forms[0];
        try {
            http.post("/login", document.forms[0] ).then(res=>{
                if (res.status == 202) {
                    console.log(res.data);
                    localStorage.setItem("userData", JSON.stringify(res.data));
                    navigate("/dashboard");
                }
                else setErrorMessages({ name: "name", message: res.data });});
        } catch(err) {
            console.log(err.message)
        }
    };

    const handleSubmitNewPassword = (event) => {
        event.preventDefault();
        try {
            http.post("/nova-zaporka-zahtjev", document.forms[0]).then(res => {
                if (res.status == 202) {
                    console.log(res.data);
                    setErrorMessages({name: "name", message: res.data});
                    setShowLogin(true);
                }
                else {
                    setErrorMessages({name: "name", message: res.data});
                    setShowLogin(true);
                }})
        } catch(err) {
            console.log(err.message)
        }
    }

    const newPasswordClick = (event) => {
        setShowLogin(false);
    }

    const showLoginForm = (event) => {
        setShowLogin(true);
    }


    //Ono sto mi vracamo da se prikaze na login stranici
    return(
        <>
            <div className="center">
                <img className="image" src="logo.svg" alt="logo"/>
                {showLogin && (
                    <div className="login">
                        <form onSubmit={handleSubmitLogin}>
                            <div>
                                <div className="loginComponent">
                                    <label className="text">Korisničko ime: </label>
                                    <input type="text" name="username" required/>
                                </div>
                                <div className="loginComponent">
                                    <label className="text">Lozinka: </label>
                                    <input type={showPassword ? "text" : "password" } name="password" />
                                    <img
                                        title={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
                                        src={showPassword ? hidePasswordImg : showPasswordImg}
                                        onClick={() => setShowPassword(prevState => !prevState)}
                                    />
                                    {renderErrorMessage("name")}
                                </div>
                                <div className="loginButton">
                                    <button type="submit" className="submit-resetBtn" id="submit-login-bttn">
                                        Login
                                    </button>
                                </div>
                            </div>
                        </form>
                        <p className="password-change" onClick={newPasswordClick}>Zaboravljena lozinka?</p>
                    </div>
                )}
                {!showLogin && (
                    <div className="login">
                        <form onSubmit={handleSubmitNewPassword}>
                            <div className="loginComponent">
                                <label className="text">Korisničko ime:</label>
                                <input type="text" name="username" required/>
                            </div>
                            <button type="submit" className="submit-resetBtn">Zatraži novu lozinku</button>
                            <button type="button" className="submit-resetBtn" onClick={showLoginForm}>Odustani</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
    
}

export default Login;