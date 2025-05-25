import React, { useState, useCallback, useEffect } from "react";

import './style.css';
import http from "./http-common";
import { Navigate, useNavigate } from "react-router-dom";
import Zaposlenici from "./Zaposlenici";

const MaticniObrazac = ({ sendUgasiObrazac }) => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();


    const [isShownMaticni, setIsShownMaticni] = useState(true);
    const showMaticni = event => {
        setIsShownMaticni(true);    
    };

    const handleOdustani = () => {
        ugasiObrazac();
    }
    const ugasiObrazac = () => {

        sendUgasiObrazac(false);

    }
    let podaci = JSON.parse(localStorage.getItem("podaci"));
    console.log(podaci)

    const [isShownMessage, setIsShownMessage] = useState("");
    


    const [podaciList, setPodaciList] = useState();
    const [result, setResult] = useState(null);
    //let obj = { ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow") };
    const handleSubmit = event => {
        event.preventDefault();
        //stavljanje u json
        let obj = { ["oib"]: document.getElementById("oib").value,
                    ["ime"]: document.getElementById("ime").value,
                    ["adresa"]: document.getElementById("adresa").value,
                    ["email"]: document.getElementById("email").value };
        
        console.log("novo",obj)
        // stavljanje na local neceg sto se sprema kao Object object
        localStorage.setItem("podaci",JSON.stringify(obj))
        //handleOdustani();

        try {
            http.post("/firma-podatci",localStorage.getItem("podaci")).then(res => {
                localStorage.setItem("message", JSON.stringify(res.data));
                //navigate("/dashboard");
                if (res.data === "Pohranjene promjene") {
                    localStorage.setItem("message", res.data);
                    setIsShownMessage(res.data)
                    //event.target.reset();
                }
                //else setErrorMessages({ name: "name", message: res.data });
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    
    
    return ( <div>
       
                        
                                
                            <div> Podaci o tvrtki:</div>  
                            <form onSubmit={handleSubmit}>
                                <div className="inputStyle">
                                    <label className="text">OIB:</label>
                                    <input type="text" name="oib" id="oib" defaultValue={podaci.oib} required  />
                                </div>
                                <div className="inputStyle">
                                    <label className="text">Ime:</label>
                                    <input type="text" name="ime" id="ime" defaultValue={podaci.ime} required  />
                                </div>
                                <div className="inputStyle">
                                    <label className="text">Adresa:</label>
                                    <input type="text" name="adresa" id="adresa" defaultValue={podaci.adresa} required  />
                                </div>
                                <div className="inputStyle">
                                    <label className="text">Email:</label>
                                    <input type="text" name="email" id="email" defaultValue={podaci.email} required  />
                                </div>
                               
                                <button type="submit" className="submit-resetBtn"> Potvrdi promjenu</button>
                                <button className="submit-resetBtn" onClick={handleOdustani}> Odustani</button>
                            </form>

                            {isShownMessage}
                            
                        
                        
            </div>)

       
        
    
}
export default MaticniObrazac;