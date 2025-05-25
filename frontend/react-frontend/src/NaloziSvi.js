import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common";
import Nalog from "./Nalog";


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
const NaloziSvi = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();

    const [cuvajStatus, setCuvajStatus] = useState();
    const [cuvajZaposlenik, setCuvajZaposlenik] = useState();
    const [cuvajBroj, setCuvajBroj] = useState();

    const [isShownNaloziSvi, setIsShownNaloziSvi] = useState(true);
    const showNaloziSvi = event => {
        setIsShownNaloziSvi(true);
    };
    const hideNaloziSvi = event => {
        setIsShownNaloziSvi(false);
    }

    //za kad odaberes nalog da ti se prikaze
    const [isNalog, setIsNalog] = useState(false); //za kad odaberes nalog da ti se prikaze
    // otvori neki nalog postojeći
    const showIsNalog = event => {
        setIsShownNaloziSvi(false);
        //setCuvajStatus(selectedCategoryStatus);
        //setCuvajZaposlenik(selectedCategoryZaposlenik);
        setIsNalog(true);

    };
    const hideIsNalog = event => {
        setIsNalog(false);
    };

    //ugasi obracun gumb
    const sendUgasiNalog = () => { //ugasi obracun kada je stisnut gumb
        setIsNalog(false);
        showNaloziSvi();
    }
    const sendBrNaloga = (brPutnogNaloga) => {
        localStorage.setItem("brPutnogNalogaToShow", brPutnogNaloga);
    }
    // ODABIR FILTRA
    // funkcija koja hendla kada odaberemo filtar u listi
    const [selectedCategoryStatus, setSelectedCategoryStatus] = useState();
    const [selectedCategoryZaposlenik, setSelectedCategoryZaposlenik] = useState();
    const [selectedCategoryBroj, setSelectedCategoryBroj] = useState();
    const [nalogList, setNalogList] = useState([]);
    const [imaNaloga, setImaNaloga] = useState(false)

    const [result, setResult] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await http.post("svi-zahtjevi", JSON.parse("{}"));
            const result = res.data.sviZahtjevi
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
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if(result) {
        setNalogList(result);}
    }, [result]);

    // Function to get filtered list
    function getFilteredList() {
        setCuvajStatus(selectedCategoryStatus);
        setCuvajZaposlenik(selectedCategoryZaposlenik);
        if (!selectedCategoryStatus && !selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return nalogList;
        }
        if (!selectedCategoryStatus && selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return nalogList.filter((item) => item.username === selectedCategoryZaposlenik);
        }
        if (selectedCategoryStatus && !selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return nalogList.filter((item) => item.status === selectedCategoryStatus);
        }
        if (!selectedCategoryStatus && !selectedCategoryZaposlenik && selectedCategoryBroj) {

            return nalogList.filter((item) => item.brPutnogNaloga.includes(selectedCategoryBroj));
        }
        if (selectedCategoryStatus && !selectedCategoryZaposlenik && selectedCategoryBroj) {
            return nalogList.filter((item) => item.status === selectedCategoryStatus && item.brPutnogNaloga.includes(selectedCategoryBroj));
        }
        if (!selectedCategoryStatus && selectedCategoryZaposlenik && selectedCategoryBroj) {
            return nalogList.filter((item) => item.username === selectedCategoryZaposlenik && item.brPutnogNaloga.includes(selectedCategoryBroj));
        }
        if (selectedCategoryStatus && selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return nalogList.filter((item) => item.status === selectedCategoryStatus && item.username === selectedCategoryZaposlenik);
        }
        return nalogList.filter((item) => item.status === selectedCategoryStatus && item.username === selectedCategoryZaposlenik && item.brPutnogNaloga.includes(selectedCategoryBroj));
    }

    // Avoid duplicate function calls with useMemo
    var filteredList = useMemo(getFilteredList, [selectedCategoryStatus, selectedCategoryZaposlenik, selectedCategoryBroj, nalogList]);

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
        var listaImena =  [...new Set(nalogList.map(nalog => nalog.username))]
        console.log(listaImena)
    }

    return (!result ? <p>Učitava se ...</p> :
    <>
        {isShownNaloziSvi && (
            <div className="naslovnica">
                <div className="lista">
                    <p className="hZ"> Svi nalozi: </p>
                    <div className="filteri">
                        <div className="filter-container">
                            <div>Filtiraj po zaposleniku:</div>
                            <div>
                                <select
                                    name="category-list"
                                    id="category-list"
                                    onChange={handleCategoryChangeZaposlenik}
                                    value={cuvajZaposlenik}
                                >
                                    <option value="">Svi zaposlenici</option>
                                    {
                                        listaImena.map(( imeZaposlenika ) => {
                                            return (
                                                <option value={imeZaposlenika}>{imeZaposlenika}</option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div>Filtiraj po statusu:</div>
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
                                    <option value="VRACEN NA DORADU">Vraćen na doradu</option>
                                    <option value="ODOBREN">Odobren</option>
                                    <option value="ODBIJEN">Odbijen</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="upisBroja">
                            <label>Broj putnog naloga:</label>
                            <input value={cuvajBroj} onChange={handleCategoryChangeBroj} />
                    </div>
                    <div className="sveNotif"> {filteredList.map(({ brPutnogNaloga, status, username }) => {
                        return (
                            <div key={brPutnogNaloga} className="oneNotif">
                                <p>
                                    Putni nalog: {brPutnogNaloga}
                                </p>
                                <p>
                                Status: {status.replace(/_/g, " ")}
                                </p>
                                <p>
                                    Ime: {username}
                                </p>
                                <button className="buttons" onClick={()=>{ sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                            </div>
                        )
                    })}
                    </div>
                </div>
            </div>)}
        {isNalog && (
            <Nalog sendUgasiNalog={sendUgasiNalog}></Nalog>
        )}
    </>
    );
}
export default NaloziSvi;