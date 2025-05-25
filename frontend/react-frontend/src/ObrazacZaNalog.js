import React, {useCallback, useEffect, useState} from "react";
import {json, Navigate, useNavigate} from "react-router-dom";
import './style.css'
import http from "./http-common"
import axios from "axios";

const ObrazacZaNalog = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    const [isFirstSubmitButton, setIsFirstSubmitButton] = useState(true);

    const firstButton = () => {
        setIsFirstSubmitButton(true);
    }

    const secondButton = () => {
        document.getElementById("datPoc").removeAttribute("required");
        document.getElementById("datKraj").removeAttribute("required");
        document.getElementById("drz").removeAttribute("required");
        document.getElementById("mjesto").removeAttribute("required");
        document.getElementById("razlog").removeAttribute("required");
        document.getElementById("akontacija").removeAttribute("required");
        document.getElementById("mjestoTroska").removeAttribute("required");
        document.getElementById("prijSredstvo").removeAttribute("required");
        setIsFirstSubmitButton(false);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (isFirstSubmitButton) {
            try {
                http.post("/novi-zahtjev", document.forms[0]).then(res => {
                    localStorage.setItem("message", JSON.stringify(res.data));
                    navigate("/dashboard");
                    console.log(document.forms[0])
                    if (res.data === "Zahtjev je poslan na obradu.") {
                        event.target.reset();
                    }
                });
            } catch (err) {
                console.log(err.message)
            }
        } else {
            try {
                http.post("/zahtjevUPripremi", document.forms[0]).then(res => {
                    localStorage.setItem("message", res.data);
                    navigate("/dashboard");
                    if (res.data === "Zahtjev je spremljen.") {
                        event.target.reset();
                    }
                });
            } catch (err) { console.log(err) }
            console.log("uspjesno nastavljeno")
        }
    }

    const [drzava, setDrzava] = useState([]);
    const [drzavaList, setDrzavaList] = useState([]);
    const [resultDrzave, setResultDrzave] = useState([]);
    const [result, setResult] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            const resDrzave = await http.get("/drzave").then(async resDrzave => {
                const resultDrzave = resDrzave.data
                setResultDrzave(resultDrzave)
                setResult(true)
            })
        } catch (error) {
        }
    }, [])

    useEffect(() => {
        fetchData();
    },[fetchData]);

    useEffect(() => {
        if(result === true) {
            setDrzavaList(resultDrzave);
            setDrzava(resultDrzave.at(0));
        }
    }, [result]);

    const handleCountryChange = (event) => {
        setDrzava(event.target.value)
    }

    return(result === false ? <p>Učitava se ...</p> :
        <>
            <div className="request">
                <h2>Zahtjev za putovanje</h2>
                <form onSubmit={handleSubmit}>
                    <div className="inputStyle">
                        <label className="text">Korisničko ime:</label>
                        <input id="username" type="text" name="username" value={userData.username} required readOnly />
                    </div>
                    <div className="inputStyle">
                        <label className="text">Ime: </label>
                        <input id="ime" type="text" name="ime" value={userData.ime} required readOnly />
                    </div>
                    <div className="inputStyle">
                        <label className="text">Prezime: </label>
                        <input id="prezime" type="text" name="prezime" value={userData.prezime} required readOnly />
                    </div>
                    <div className="inputStyle">
                        <label className="text">Datum putovanja: </label>
                        <input id="datPoc" type="datetime-local" name="datPoc" required />
                    </div>
                    <div className="inputStyle">
                        <label className="text">Datum povratka: </label>
                        <input id="datKraj" type="datetime-local" name="datKraj" required />
                    </div>
                    <div className="inputStyle" >
                        <label className="text">Država putovanja: </label>
                        <input type="search" list="countriesDropDown" name="drz" id="drz"></input>
                        <datalist id="countriesDropDown" name="drz" onChange={handleCountryChange}>
                            {
                                drzavaList.map((cijelaDrzava) => {
                                    return(
                                        <option value={cijelaDrzava.imeDrzave}>{cijelaDrzava.imeDrzave}</option>
                                    )
                                })
                            }
                        </datalist>
                    </div>
                    <div className="inputStyle">
                        <label className="text">Mjesto putovanja: </label>
                        <input id="mjesto" type="text" name="mjesto" required />
                    </div>
                    <div className="inputStyle" >
                        <label className="text">Razlog putovanja: </label>
                        <textarea id="razlog" required name="razlog"></textarea>
                    </div>
                    <div className="inputStyle" >
                        <label className="text">Akontacija: </label>
                        <textarea id="akontacija" required name="akontacija"></textarea>
                    </div>
                    <div className="inputStyle" >
                        <label className="text">Mjesto troška: </label>
                        <textarea id="mjestoTroska" required name="mjestoTroska"></textarea>
                    </div>
                    <div className="inputStyle" >
                        <label className="text">Prijevozno sredstvo: </label>
                        <select id="prijSredstvo" name="prijSredstvo" required>
                            <option>Osobni automobil</option>
                            <option>Poslovni automobil</option>
                            <option>Autobus</option>
                            <option>Avion</option>
                            <option>Brod</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="submit-resetBtn" onClick={firstButton}>Predaj</button>
                        <button type="reset" className="submit-resetBtn">Reset</button>
                        <button id="nastavi" type="submit" className="submit-resetBtn" onClick={secondButton}>Nastavi kasnije</button>
                    </div>
                </form>

            </div>
        </>
    );
}

export default ObrazacZaNalog;