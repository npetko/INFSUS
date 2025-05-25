import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common"


const ZakljuciGod = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();

    function handleSubmit(event) {
        
        event.preventDefault();
        navigate("/dashboard");
        try {
            http.post("zakljuci-godinu", document.forms[0]).then(res => {
                localStorage.setItem("message", res.data);
                if (res.status === 200) {
                    event.target.reset();
                }
                console.log("res");
                navigate("/dashboard");
                
            });
        } catch (err) {
            console.log(err.message)
        }
        
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="inputStyle">
                <label className="text">Zaključi sljedeću poslovnu godinu:</label>
                <input type="text" name="godina" />
            </div>

                <button className="submit-resetBtn" type="submit" value="Submit">Predaj</button>

        </form>
    )
}
export default ZakljuciGod;