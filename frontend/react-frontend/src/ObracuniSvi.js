import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common";
import Obracun from "./Obracun";


/*
• Opis osnovnog tijeka:
1. Odabir opcije ’Pregled svih obracuna’ ˇ
2. Administrator/Racunovodstveni djelatnik se preusmjerava na stranicu ˇ
’Svi obracuni’ ˇ
3. Administrator/Racunovodstveni djelatnik upisuje filter prema kojem ˇ zeli ˇ
pregledati obracune ˇ
4. Administratoru/Racunovodstvenom djelatniku se prikazuju putni na- ˇ
lozi koji odgovaraju filteru
5. Administrator/Racunovodstveni djelatnik ima mogu ˇ cnost preuzimanja ´
obracuna u pdf obliku
*/
const ObracuniSvi = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    
    const [cuvajStatus, setCuvajStatus] = useState();
    const [cuvajZaposlenik, setCuvajZaposlenik] = useState();
    const [cuvajBroj, setCuvajBroj] = useState();
    
    //otvori moje timove obracune
    const [isShownObracuniSvi, setIsShownObracuniSvi] = useState(true);
    const showObracuniSvi = event => {
        setIsShownObracuniSvi(true);
    };
    const hideObracuniSvi = event => {
        setIsShownObracuniSvi(false);
     }
    
    //za kad odaberes obracun da ti se prikaze
    const [isObracun, setIsObracun] = useState(false); //za kad odaberes obracun da ti se prikaze
    // otvori neki obracun postojeći
    const showIsObracun = event => {
        setIsShownObracuniSvi(false);
        //setCuvajStatus(selectedCategoryStatus);
        //setCuvajZaposlenik(selectedCategoryZaposlenik);
        setIsObracun(true);
    };
    const hideIsObracun = event => {
        setIsObracun(false);
    };

    //ugasi obracun gumb
    const sendUgasiObracun = () => { //ugasi obracun kada je stisnut gumb
        setIsObracun(false);
        setIsShownObracuniSvi(true);
      }
      const sendBrNaloga = (brPutnogNaloga) => {
        localStorage.setItem("brPutnogNalogaToShow", brPutnogNaloga);
    }
    
    // funkcija koja hendla kada odaberemo filtar u listi
    const [selectedCategoryStatus, setSelectedCategoryStatus] = useState();
    const [selectedCategoryZaposlenik, setSelectedCategoryZaposlenik] = useState();
    const [selectedCategoryBroj, setSelectedCategoryBroj] = useState();
    const [obracunList, setObracunList] = useState([]);
    const [result, setResult] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await http.post("obracun/svi-obracuni",JSON.parse("{}"));
            const result = res.data.sviObracuni
            if (result) {
                // Add any data transformation
                setResult(result)
                setObracunList(result)
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
    }, [fetchData]);

    useEffect(() => {
        setObracunList(result);
    }, [result]);

    // Function to get filtered list
    function getFilteredList() {
        setCuvajStatus(selectedCategoryStatus);
        setCuvajZaposlenik(selectedCategoryZaposlenik);
        if (!selectedCategoryStatus && !selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return obracunList;
            }
            if (!selectedCategoryStatus && selectedCategoryZaposlenik && !selectedCategoryBroj) {
                return obracunList.filter((item) => item.username === selectedCategoryZaposlenik);
                }
            if (selectedCategoryStatus && !selectedCategoryZaposlenik && !selectedCategoryBroj) {
                return obracunList.filter((item) => item.status === selectedCategoryStatus);
                }
            if (!selectedCategoryStatus && !selectedCategoryZaposlenik && selectedCategoryBroj) {
                
                return obracunList.filter((item) => item.brPutnogNaloga.includes(selectedCategoryBroj));
                }
            if (selectedCategoryStatus && !selectedCategoryZaposlenik && selectedCategoryBroj) {
                return obracunList.filter((item) => item.status === selectedCategoryStatus && item.brPutnogNaloga.includes(selectedCategoryBroj));
                }
             if (!selectedCategoryStatus && selectedCategoryZaposlenik && selectedCategoryBroj) {
                return obracunList.filter((item) => item.username === selectedCategoryZaposlenik && item.brPutnogNaloga.includes(selectedCategoryBroj));
                }
             if (selectedCategoryStatus && selectedCategoryZaposlenik && !selectedCategoryBroj) {
                return obracunList.filter((item) => item.status === selectedCategoryStatus && item.username=== selectedCategoryZaposlenik);
                }
            return obracunList.filter((item) => item.status === selectedCategoryStatus && item.username === selectedCategoryZaposlenik && item.brPutnogNaloga.includes(selectedCategoryBroj));
        }

    // Avoid duplicate function calls with useMemo
    var filteredList =  useMemo(getFilteredList, [selectedCategoryStatus, selectedCategoryZaposlenik, selectedCategoryBroj, obracunList]);

    function handleCategoryChangeStatus(event) {
        setSelectedCategoryStatus(event.target.value);
        setCuvajStatus(selectedCategoryStatus);
    }

    function handleCategoryChangeZaposlenik(event) {
        setSelectedCategoryZaposlenik(event.target.value);
        setCuvajZaposlenik(selectedCategoryZaposlenik);
    }
    
    function handleCategoryChangeBroj(event) {
        setSelectedCategoryBroj(event.target.value);
        setCuvajBroj(event.target.value);
    }

    if (result) {
        if (obracunList.length == 0) {
            var listaImena = []
        } else {
            var listaImena = [...new Set(obracunList.map(obracun => obracun.username))]
        }
        console.log(listaImena)
    }

    return (!result? <p>Učitava se ...</p>:
        <>
        {isShownObracuniSvi && (
        <div className="naslovnica">
            <div className="lista"> 
                <p className="hZ"> Svi obračuni: </p>
                <div className="filteri">
                    <div className="filter-container">
                        <div>Filtiraj po zaposleniku:</div>
                        <div>
                            <select
                                name="category-list"
                                id="category-list"
                                onChange={handleCategoryChangeZaposlenik}
                                value = {cuvajZaposlenik}
                            >
                                <option value="">Svi zaposlenici</option>
                                {
                                    listaImena.map((imeZaposlenika) => { return (
                                        <option value={imeZaposlenika}>{imeZaposlenika}</option>
                                )})}
                            </select>
                        </div>
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
                            </select>
                        </div>
                    </div>
                </div>
                <div className="upisBroja">
                            <label>Broj putnog naloga:</label>
                            <input value={cuvajBroj} onChange={handleCategoryChangeBroj} />
                </div>
                <div className="sveNotif"> {filteredList.map(({brPutnogNaloga, status, username}) => { return (
                    <div id={brPutnogNaloga} className="oneNotif"> 
                        <p> 
                            Putni nalog: {brPutnogNaloga}
                        </p>
                        <p>
                        Status: {status.replace(/_/g, " ")}
                        </p>
                        <p>
                            Ime: {username}
                        </p>
                        {
                        <button className="buttons" id="otvori-obracun" onClick={()=>{sendBrNaloga(brPutnogNaloga); showIsObracun();}}>Otvori obračun</button>
                        }
                    </div>
                )})}
                </div>
            </div>
        </div>)}

        {isObracun &&(
            <Obracun sendUgasiObracun={sendUgasiObracun}></Obracun>
        )}
        </>
        );
}
export default ObracuniSvi;