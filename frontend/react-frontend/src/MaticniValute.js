import React, { useState, useCallback, useMemo, useEffect } from "react";

import './style.css';
import http from "./http-common";
import { Navigate, useNavigate } from "react-router-dom";

const MaticniValute = () => {

    const [podaciList, setPodaciList] = useState([]);
    const [result, setResult] = useState(null);
    
    const fetchData = useCallback(async () => {
        try {
            const res = await http.get("trosak/popisValuta/");
            const result = res.data

            if (result) {
                // Add any data transformation
                setResult(result)
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
            if(result) {
            setPodaciList(result);
            console.log(result)}
            
        }, [result]);
        
    return(result?
        <>
            <div className="sveNotif">

            {
                podaciList.map((valuta) => {
                    return(
                        <div className="oneNotif">
                            <div>{valuta.valuta}</div>
                            <div>  {valuta.drzava} </div>
                            <div> kupovni tečaj: {valuta.kupovni_tecaj} EUR</div>
                            <div> srednji tečaj: {valuta.srednji_tecaj} EUR</div>
                            <div> prodajni tečaj: {valuta.prodajni_tecaj} EUR</div>
                        </div>
                    )
                })
            }
            </div>
        </>
        :<p>Učitava se...</p>
    )
}

export default MaticniValute;