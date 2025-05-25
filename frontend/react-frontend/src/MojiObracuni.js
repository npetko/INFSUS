import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import { useState, useEffect, useMemo, useCallback } from "react";
import http from "./http-common";
import Obracun from "./Obracun";


/*
• Opis osnovnog tijeka:
1. Odabir opcije ’Pregled mojih obracuna’ ˇ
2. Zaposlenik se preusmjerava na stranicu ’Moji obracuni’ ˇ
3. Prikaz svih obracuna i njihovih statusa ˇ
4. Zaposlenik ima mogucnost preuzimanja obra ´ cuna u pdf obliku
*/
const MojiObracuni = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();

    //otvori moje obracune
    const [isShownMojiObracuni, setIsShownMojiObracuni] = useState(true);
    const showMojiObracuni = event => {
        setIsShownMojiObracuni(true);
    };
    const hideMojiObracuni = event => {
        setIsShownMojiObracuni(false);
    }
    const sendBrNaloga = (brPutnogNaloga) => {

        localStorage.setItem("brPutnogNalogaToShow", brPutnogNaloga);
    }

    //za kad odaberes obracun da ti se prikaze
    const [isObracun, setIsObracun] = useState(false); //za kad odaberes obracun da ti se prikaze
    // otvori neki obracun postojeći
    const showIsObracun = event => {
        setIsShownMojiObracuni(false);
        setIsObracun(true);

    };
    const hideIsObracun = event => {
        setIsObracun(false);
    };

    //ugasi obracun gumb
    const sendUgasiObracun = () => { //ugasi obracun kada je stisnut gumb
        setIsObracun(false);
        setIsShownMojiObracuni(true);
    }

    const [listaObracuna, setListaObracuna] = useState([]);
    const [result, setResult] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await http.get("obracun/moji-obracuni/".concat(userData.username));

            const result = res.data.obracuni

            console.log(res.data)

            if (result) {
                if (res.status == 200) {
                    // Add any data transformation
                    setResult(result)
                }
                //setNalogList(result.zahtjevi)
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
        fetchData();
    }
        , [fetchData]);

    useEffect(() => {
        if (result) {
            setListaObracuna(result)
        }
    }, [result]);

    const [cuvajStatus, setCuvajStatus] = useState();
    const [selectedCategoryStatus, setSelectedCategoryStatus] = useState();
    
    function handleCategoryChangeStatus(event) {
        setSelectedCategoryStatus(event.target.value);
        setCuvajStatus(selectedCategoryStatus);
    }

    function getFilteredList() {
        setCuvajStatus(selectedCategoryStatus);
        console.log("ude u filtar")
        if(!selectedCategoryStatus) {
            console.log("nije selektirana kat")
            return listaObracuna;
        }
        console.log(selectedCategoryStatus)
        console.log("filtrirano: ",listaObracuna.filter((item) => item.status === selectedCategoryStatus))
        return listaObracuna.filter((item) => item.status === selectedCategoryStatus);
    }
    var filteredList =  useMemo(getFilteredList, [selectedCategoryStatus, listaObracuna]);


    return (!result ? <p>Učitava se ...</p> :
        <>
        {isShownMojiObracuni && (
            <div className="naslovnica">
                <div className="lista">
                    <p className="hZ"> Moji obračuni: </p>
                    <div>Filtiraj po statusu:</div>
                        <div>
                            <select
                                name="category-list"
                                id="category-list"
                                onChange={handleCategoryChangeStatus}
                                value = {cuvajStatus}
                            >
                                <option value="">Svi obračuni</option>
                                <option value="U_PRIPREMI">U pripremi</option>
                                <option value="SPREMAN_ZA_OBRACUN">Spreman za obračun</option>
                                <option value="STORNIRAN">Storniran</option>
                                <option value="OBRACUNAT">Obračunat</option>
                                <option value="ODOBREN">Odobren</option>
                            </select>
                        </div>
                    {listaObracuna.length == 0 && <p>Nema obračuna za prikaz</p>}
                    {isShownMojiObracuni &&
                        <div className="sveNotif">{filteredList.map(({ brPutnogNaloga, status }) => {
                            return (
                                <div key={brPutnogNaloga} id={brPutnogNaloga} className="oneNotif">
                                    <p>
                                        Putni nalog: {brPutnogNaloga}
                                    </p>
                                    <p>
                                    Status: {status.replace(/_/g, " ")}
                                    </p>
                                    <button className="buttons" id={brPutnogNaloga} onClick={() => { sendBrNaloga(brPutnogNaloga); showIsObracun(); }}>Otvori obračun</button>
                                </div>
                            )
                        })}
                        </div>
                    }
                </div>
            </div>)
        }

        {isObracun && (
            <Obracun sendUgasiObracun={sendUgasiObracun}></Obracun>
        )}
        </>
    );




}
export default MojiObracuni;