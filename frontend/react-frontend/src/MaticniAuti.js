import React, { useState, useCallback, useMemo, useEffect } from "react";

import './style.css';
import http from "./http-common";
import { Navigate, useNavigate } from "react-router-dom";
import Zaposlenici from "./Zaposlenici";



const MaticniAuti = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();

    const [autiList, setAutiList] = useState([]);
    const [result, setResult] = useState(null);
    
    const fetchAutoList = useCallback(async () => {
        try {
            const res = await http.get("/sluzbeniAuto/popisAuta");
            const result = res.data
            

            if (result) {
                // Add any data transformation
                
                setResult(result)
                console.log(result)
                setAutiList(result.sluzbeniAuti);
                console.log(autiList)
                
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

            fetchAutoList();
        }
            , [fetchAutoList]);

    const [dodajAutoObrazac, setDodajAutoObrazac] = useState(false);
    const handleOtvoriObrazac = (event) => {
        setDodajAutoObrazac(true)
        document.getElementById("status").innerText = "";

    }
    const handleZatvoriObrazac = (event) => {
        event.preventDefault();
        setDodajAutoObrazac(false)
        
    }

    const izbrisiAuto = (registracija) => {
        
        //event.preventDefault();
        return () => {
            console.log("regi", registracija)
            
            try{
                http.post("/sluzbeniAuto/izbrisi-auto", {"regAuto" : registracija}).then(res => {
                    if(res.data === "Uspješno izbrisan auto") {
                        
                        ispisiStatus(res.data + " registracije: " + registracija);
                        setUpdate(true)
                        
                    } else {
                        ispisiStatus(res.data);
                    }
                })
            } catch (err) {
                console.log(err.message)
        }}
    }
        
    const ispisiStatus = (ispis) => {
        document.getElementById("status").innerText = ispis;
    }
    const [update, setUpdate] = useState(false);
    const handleSubmit = event => {
        event.preventDefault();
        console.log(document.forms[0])
        let reg = document.getElementById("regAuto").value
        try{
            http.post("/sluzbeniAuto/novi-auto", document.forms[0]).then(res => {
                if(res.data === "Uspješno unesen auto") {
                    
                    ispisiStatus(res.data + " registracije: " + reg);
                    setUpdate(true)
                    setDodajAutoObrazac(false)
                } else {
                    ispisiStatus(res.data);
                }
            })
        } catch (err) {
            console.log(err.message)
        }
        document.getElementById("regAuto").value = "";
        document.getElementById("model").value = "";
        
    }
    useEffect(() => {
        //Attempt to retreive data
        if( update === true) {
            fetchAutoList();
            setUpdate(false)
        }
        
    }
        , [update]);

    const [cuvajReg, setCuvajReg] = useState();
    const [selectedCategory, setSelectedCategory] = useState();
    const handleCategoryChange = event => {
        setSelectedCategory(event.target.value);
        setCuvajReg(event.target.value);
    }
    function getFilteredList() {
        if(!selectedCategory) {
            return autiList;
        }
        return autiList.filter((item) => item.regAuto.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    var filteredList =  useMemo(getFilteredList, [selectedCategory, autiList]);
        
return(
       <>
       <div className="lista">
        <p id="status"></p>
        <div>
                {!dodajAutoObrazac &&(
                            <div>
                                <button className="submit-resetBtn" onClick={handleOtvoriObrazac}>Dodaj auto</button>
                                
                            </div>)}
        </div>
        <div>
            {dodajAutoObrazac && (
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="inputStyle">
                            <label className="text">Registracija: </label>
                            <input type="text" name="regAuto" id="regAuto" required />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Model automobila: </label>
                            <input type="text" name="model" id="model" required />

                        </div>
                        <div className="">
                            <button type="submit" className="submit-resetBtn">Dodaj auto</button>
                            <button className="submit-resetBtn" onClick={handleZatvoriObrazac}>Odustani</button>
                        </div>
                    </form>
                </div>)
            }
        </div>
            {//!dodajAutoObrazac && ()
            }
            <h2>Popis službenih autiju:</h2>
            <div className="filteri">
                            <div className="upisBroja">
                                <label>Pretraži po registraciji: </label>
                                <input value={cuvajReg} onChange={handleCategoryChange}/>
                            </div>
                        </div>
            <div>
                <div className="sveNotif">

                {filteredList.map((auto) => {
                    return (
                        <div className="oneNotif">
                            <p>Registracija: {auto.regAuto}</p>
                            <p>Model automobila: {auto.model}</p>
                            <button className="buttons" onClick={izbrisiAuto(auto.regAuto)}>Ukloni auto</button>
                            
                            
                        </div>)})}
                </div>
            </div>
        </div>  
        </>
)
}
export default MaticniAuti;