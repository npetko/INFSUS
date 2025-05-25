import React, { useState, useCallback, useEffect } from "react";

import './style.css';
import http from "./http-common";
import { Navigate, useNavigate } from "react-router-dom";
import Zaposlenici from "./Zaposlenici";
import MaticniObrazac from "./MaticniObrazac";

const MaticniFirma = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();

    const [isShownMaticni, setIsShownMaticni] = useState(true);
    const showMaticni = event => {
        setIsShownMaticni(true);    
    };
    
    const [isObrazac, setIsObrazac] = useState(false);
    const handlePromijeni = (event) => {
        console.log("blah")
        setIsShownMaticni(false);
        setIsObrazac(true);
    }
    
    const sendUgasiObrazac = (isObrazac) => { //ugasi nalog kada je stisnut gumb


        setIsObrazac(false);
        setIsShownMaticni(true);

    }
    
    
    let podaci = JSON.parse(localStorage.getItem("podaci"));
    console.log(podaci)
    return ( <div>
        {isShownMaticni && (
            <div>
       
                        
                                
                            <div> Podaci o tvrtki:</div>  
                            <div>
                                <p>OIB: {podaci.oib
                                }</p>
                                <p>Ime: {podaci.ime
                                }</p>
                                <p>Adresa: {podaci.adresa
                                }</p>
                                <p>Email: {podaci.email
                                }</p>
                                <button className="submit-resetBtn" onClick={handlePromijeni}> Promijeni podatke</button>
                            </div>
                            
                            </div>      
                        
        )}
        {isObrazac && (
            <MaticniObrazac sendUgasiObrazac={sendUgasiObrazac}></MaticniObrazac>
        )}
        </div>)


       
        
    
}
export default MaticniFirma;