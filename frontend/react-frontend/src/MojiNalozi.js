import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import { useState, useEffect, useMemo, useCallback } from "react";
import http from "./http-common";
import Nalog from "./Nalog";


/*
• Opis osnovnog tijeka:
1. Odabir opcije ’Pregled mojih naloga’
2. Zaposlenik se preusmjerava na stranicu ’Moji nalozi’
3. Prikaz svih putnih naloga i njihovih statusa
4. Zaposlenik ima mogucnost preuzimanja naloga u pdf obliku ´
5. Administrator potvrduje ispravnost podataka
6. Novi korisnik se upisuje u bazu podataka
*/
const MojiNalozi = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();


    //otvori moje sve naloge
    const [isShownMojiNalozi, setIsShownMojiNalozi] = useState(true);
    const showMojiNalozi = event => {
        setIsShownMojiNalozi(true);
    };
    const hideMojiNalozi = event => {
        setIsShownMojiNalozi(false);
    }

    //za kad odaberes nalog da ti se prikaze
    const [isNalog, setIsNalog] = useState(false); //za kad odaberes nalog da ti se prikaze
    // otvori neki nalog postojeći
    const showIsNalog = event => {
        setIsShownMojiNalozi(false);
        setIsNalog(true);
    };
    const sendBrNaloga = (brPutnogNaloga) => {

        localStorage.setItem("brPutnogNalogaToShow", brPutnogNaloga);
    }
    const hideIsNalog = event => {
        setIsNalog(false);
    };

    //ugasi nalog gumb
    const sendUgasiNalog = () => { //ugasi nalog kada je stisnut gumb

        setIsNalog(false);
        setIsShownMojiNalozi(true);

    }
    const [nalogList, setNalogList] = useState([]);
    const [result, setResult] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await http.get("/moji-zahtjevi/".concat(userData.username));

            const result = res.data.zahtjevi

            console.log(res.data)

            if (result) {
                // Add any data transformation
                setResult(result)
                //setNalogList(result.zahtjevi)

            }
            else {
                console.log(666)
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
        if(result){
         setNalogList(result);
        }
        console.log(result)
    }, [result]);

    console.log(result)


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
            return nalogList;
        }
        console.log(selectedCategoryStatus)
        console.log("filtrirsno: ",nalogList.filter((item) => item.status === selectedCategoryStatus))
        return nalogList.filter((item) => item.status === selectedCategoryStatus);
    }

    var filteredList =  useMemo(getFilteredList, [selectedCategoryStatus, nalogList]);

    return (result===null ? <p>Učitava se ...</p> :
        <>
        {isShownMojiNalozi && (
            <div className="naslovnica">
                <div className="lista">
                    <p className="hZ"> Moji nalozi: </p>
                    <div>Filtiraj po statusu naloga:</div>
                    <div>
                        <select
                            name="category-list"
                            id="category-list"
                            onChange={handleCategoryChangeStatus}
                            value={cuvajStatus}
                        >
                            <option value="">Svi nalozi</option>
                            <option value="U_PRIPREMI">U pripremi</option>
                            <option value="PODNESEN">Podnesen</option>
                            <option value="VRACEN_NA_DORADU">Vraćen na doradu</option>
                            <option value="ODOBREN">Odobren</option>
                            <option value="ODBIJEN">Odbijen</option>
                            <option value="STORNIRAN">Storniran</option>
                            <option value="POSLAN_NA_OBRACUN">Poslan na obračun</option>
                        </select>
                    </div>
                    {nalogList.length == 0 && <p>Nema zahtjeva za prikaz.</p>}
                    { isShownMojiNalozi &&
                        <div className="sveNotif"> {filteredList.map(({ brPutnogNaloga, status }) => {
                            return (
                                <div key={brPutnogNaloga} className="oneNotif">
                                    <p>
                                        Putni nalog: {brPutnogNaloga}
                                    </p>
                                    <p>
                                        Status: {status.replace(/_/g, " ")}
                                    </p>
                                    {
                                        <button className="buttons" name="otvori-nalog" id={brPutnogNaloga} onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                    }
                                </div>
                            )
                        })}
                        </div>
                    }
                </div>
            </div>)
        }

            {isNalog && (
                <Nalog sendUgasiNalog={sendUgasiNalog}></Nalog>
            )}
        </>
    );
}
export default MojiNalozi;