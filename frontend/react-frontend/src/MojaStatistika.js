import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common"


const MojaStatistika = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    
    return (
        <div> Primjer moje statistike </div>
    )
}
export default MojaStatistika;