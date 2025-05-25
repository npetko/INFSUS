import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common"


const AktivniNalozi = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    
    return (
        <div> Primjer aktivnih naloga </div>
    )
}
export default AktivniNalozi;