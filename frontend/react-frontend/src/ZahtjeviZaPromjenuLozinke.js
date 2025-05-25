import React from "react";
import http from "./http-common"
import { useState, useCallback, useEffect } from "react";
import ObrazacZaPromjenuLozinkeKodAdmina from "./ObrazacZaPromjenuLozinkeKodAdmina";
import { json } from "react-router-dom";

const ZahtjeviZaPromjenuLozinke = ({ ugasi }) => {


    const [imaZahtjeva, setImaZahtjeva] = useState(false);
    const sendKorisnik = (username) => {
        localStorage.setItem("korisnikToShow", JSON.stringify({"username":username}))
    } 

    const [showZahtjevi, setShowZahtjevi] = useState(true);
    const [showPromijeniLozinku, setShowPromijeniLozinku] = useState(false);
    const promijeniLozinku = () => {
        setShowPromijeniLozinku(true);
        setShowZahtjevi(false);
    }

    const ugasiPromjenuLozinke = () => {
        setShowPromijeniLozinku(false);
        setShowZahtjevi(true);
    }

    const [zahtjevi, setZahtjevi] = useState([]);
    const [result, setResult] = useState(null);
    const fetchData = useCallback(async () => {
        try {
            const res = await http.get("/zahtjevi-za-lozinke");
            const result = res.data

            if (result) {
                setResult(result)
            }
            else {
                throw (error)
            }
        }
        catch (error) {
        }
    }, [])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (result) {
            setZahtjevi(result);
        }
    }, [result]);

    useEffect(() => {
        if (showZahtjevi == true) fetchData();
    }, [showZahtjevi]);

    console.log(zahtjevi)
    return (
        result === null ? <p>Učitava se ...</p>:
        <>
            <div className="naslovnica">
                <div className="lista">
                    <h2>Zahtjevi za promjenu lozinke</h2>
                    <div>
                        {showZahtjevi && zahtjevi.length !== 0 && (
                            <div className="sveNotif"> {zahtjevi.map((user) => {
                                return (
                                    <div key={user.username} className="oneNotif">
                                        <p>Korisničko ime: @{user.username}</p>
                                        <button className="buttons" onClick={()=>{ sendKorisnik(user.username);promijeniLozinku();}}>Promijeni lozinku</button>
                                    </div>
                                )
                            })}
                            </div>
                        )}
                        <div>
                            <button className="submit-resetBtn" onClick={ugasi}>Povratak</button>
                        </div>
                        {showZahtjevi && zahtjevi.length === 0 && (
                            <>
                                <p>Nema zahtjeva</p>
                                
                            </>
                        )}
                        {showPromijeniLozinku && (
                            <ObrazacZaPromjenuLozinkeKodAdmina ugasiPromjenuLozinke={ugasiPromjenuLozinke}></ObrazacZaPromjenuLozinkeKodAdmina>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ZahtjeviZaPromjenuLozinke;