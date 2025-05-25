import React, { useState } from "react";
import './style.css'
import http from "./http-common";
import {Navigate, useNavigate} from "react-router-dom";

const ObrazacZaDodavanjeKorisnika = ({sendUgasiAddUser}) => {

    const navigate = useNavigate();
    const [odustani, setOdustani] = useState(false);
    function handleSubmit(event) {
        event.preventDefault();
        navigate("/dashboard");
        try {
            http.post("/novi-korisnik", document.forms[0]).then(res => {
                localStorage.setItem("message", JSON.stringify(res.data));
                //if(res.status == 202) {
                //sendUgasiAddUser(false)}
                navigate("/dashboard");
            

            });
        } catch (err) {
            console.log(err.message)
        }
    }
    const ugasiAddUser = (event) => {
        event.preventDefault();
        sendUgasiAddUser(false);

    }
    
    return(
        <>
            <div className="request">
                <form onSubmit={handleSubmit}>
                    <h2>Dodavanje korisnika</h2>
                    <div className="inputStyle">
                        <label className="text">Ime: </label>
                        <input type="text" name="ime" required/>
                    </div>
                    <div className="inputStyle">
                        <label className="text">Prezime: </label>
                        <input type="text" name="prezime" required/>
                    </div>
                    <div className="inputStyle">
                        <label className="text">Oib: </label>
                        <input type="text" name="oib" required/>
                    </div>
                    <div className="inputStyle">
                        <label className="text">Korisničko ime: </label>
                        <input type="text" name="username" required/>
                    </div>
                    <div className="inputStyle">
                        <label className="text">Zaporka: </label>
                        <input type="text" name="password" required/>
                    </div>
                    <div className="inputStyle">
                        <label className="text">E-mail: </label>
                        <input type="text" name="email" required/>
                    </div>
                    
                    <div className="inputStyle">
                        <label className="text">Tim id: </label>
                        <input type="text" name="tim_id" required/>
                    </div>
                    <div className="inputStyle">
                        <label className="text">Uloga: </label>
                        <select name="uloga" required>
                            <option>Zaposlenik</option>
                            <option>Voditelj</option>
                            <option>Zamjenik</option>
                            <option>Računovođa</option>
                            <option>Admin</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="submit-resetBtn">Predaj</button>
                        <button type="reset" className="submit-resetBtn"> Reset</button>
                        <button className="submit-resetBtn" onClick={ugasiAddUser}>Odustani</button>
                    </div>
                </form>

            </div>
        </>
    )
}

export default ObrazacZaDodavanjeKorisnika;