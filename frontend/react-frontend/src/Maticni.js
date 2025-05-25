import React, { useState, useCallback, useEffect } from "react";

import './style.css';
import http from "./http-common";
import { Navigate, useNavigate } from "react-router-dom";
import Zaposlenici from "./Zaposlenici";
import MaticniFirma from "./MaticniFirma";
import MaticniAuti from "./MaticniAuti";
import MaticniValute from "./MaticniValute";
import MaticniDnevnice from "./MaticniDnevnice";


const Maticni = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();

    const [isShownMaticni, setIsShownMaticni] = useState(true);
    const showMaticni = event => {
        setIsShownMaticni(true);    
    };
    const [selectedCategory, setSelectedCategory] = useState();

    function handleChange(event) {
        console.log(event.target.value)
        setSelectedCategory(event.target.value);
        if(selectedCategory === "") {
            return(
                <div> Nije odabrana niti jedna kategorija.</div>
            )}; 
         
      }
    
    const [podaciList, setPodaciList] = useState();
    const [result, setResult] = useState(null);
    //let obj = { ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow") };


    const fetchData = useCallback(async () => {
        try {
            const res = await http.get("/firma-podatci");
            const result = res.data

            if (result) {
                // Add any data transformation
                setResult(result)
                setPodaciList(result)
            }
            else {
                throw (error)
            }
        }
        catch (error) {
            //Handle error
        }
        }, [])
        useEffect(() => {
            //Attempt to retreive data

            fetchData();
        }
            , [fetchData]);

        useEffect(() => {
            setPodaciList(result);
            
        }, [result]);


        //console.log()
        //const ugasiNalog = () => {

            //sendUgasiNalog(false);

        //}

        if (result) {
            var podaci = result.at(0);
            localStorage.setItem("podaci", JSON.stringify(podaci))
            console.log(podaci);
        }

    

        //console.log()
        //const ugasiNalog = () => {

            //sendUgasiNalog(false);

        //}

        /*if (result) {
            var podaci = result.at(0);
            localStorage.setItem("podaci", JSON.stringify(podaci))
            console.log(podaci);
        }*/

    
    
    return (
        <>
        {isShownMaticni && (

            <div className="naslovnica">
                <div className="lista"> 
                    <p className="hZ"> Matični podaci: </p>

                    <div className="filteri">
                        <div className="filter-container">
                            <div>Koje matične podatke želiš vidjeti? </div>
                                <div>
                                    <select
                                        name="category-list"
                                        id="category-list"
                                        onChange={handleChange}
                                    >
                                        <option value=""></option>
                                        <option value="tvrtka">Podaci o tvrtki</option>
                                        <option value="zaposlenici">Zaposlenici</option>
                                        <option value="auti">Službeni automobili</option>
                                        <option value="valuta">Valute</option>
                                        <option value="dnevnice">Dnevnice i naknade</option>
                                        
                                    </select>
                                </div>  
                        </div>        
                    </div>
                    <div>
                        {!selectedCategory && (
                        <div> Nije odabrana niti jedna kategorija.</div>  
                        )}
                        {selectedCategory === "tvrtka" && (
                                
                            
                            
                                
                                <MaticniFirma></MaticniFirma>
                           
                            
                        )}
                        {selectedCategory === "zaposlenici" && (
                        <Zaposlenici></Zaposlenici>  
                        )}
                        
                        {selectedCategory === "auti" && (
                            <MaticniAuti></MaticniAuti>
                        )}
                        {selectedCategory === "valuta" && (
                            <MaticniValute></MaticniValute>
                        )}
                        {selectedCategory === "dnevnice" && (
                            <MaticniDnevnice></MaticniDnevnice>
                        )}
                    </div>
                    
                    
                    <div className="sveNotif"> 
                        {}
                    </div>
                </div>
            </div>)}

        {//isObracun &&(
           // <Obracun sendUgasiObracun={sendUgasiObracun}></Obracun>)
        }
        </>
     );
}
export default Maticni;