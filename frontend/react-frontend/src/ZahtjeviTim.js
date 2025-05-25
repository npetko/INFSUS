import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css';
import { useState, useEffect, useMemo, useCallback } from "react";
import http from "./http-common"
import Nalog from "./Nalog";

/*
• Opis osnovnog tijeka:
1. Odabir opcije ’Pregled naloga clanova tima’ ˇ
2. Voditelja se preusmjerava na stranicu ’Nalozi clanova tima’ ˇ
3. Voditelju su prikazani svi clanovi tima ˇ
4. Voditelj bira clana tima ˇ cije naloge ˇ zeli pregledati ˇ
5. Voditelju se ucitavaju putni nalozi odabranog ˇ clana tima ˇ
6. Voditelj ima mogucnost preuzimanja naloga u pdf obliku
*/

const ZahtjeviTim = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();


    const [cuvajStatus, setCuvajStatus] = useState();
    const [cuvajZaposlenik, setCuvajZaposlenik] = useState();
    const [cuvajBroj, setCuvajBroj] = useState();

    const sendBrNaloga = (brPutnogNaloga) => {

        localStorage.setItem("brPutnogNalogaToShow", brPutnogNaloga);
    }
    //otvori ZahtjeviTim
    const [isShownZahtjeviTim, setIsShownZahtjeviTim] = useState(true);
    const showZahtjeviTim = event => {
        setIsShownZahtjeviTim(true);
    };
    const hideZahtjeviTim = event => {
        setIsShownZahtjeviTim(false);
    }

    //za kad odaberes nalog da ti se prikaze
    const [isNalog, setIsNalog] = useState(false); //za kad odaberes nalog da ti se prikaze
    // otvori neki nalog postojeći
    const showIsNalog = event => {
        setIsShownZahtjeviTim(false);
        setIsNalog(true);

    };
    const hideIsNalog = event => {
        setIsNalog(false);
    };
    //ugasi nalog gumb
    const sendUgasiNalog = (isNalog) => { //ugasi nalog kada je stisnut gumb
        setIsNalog(false);
        setIsShownZahtjeviTim(true);

    }

    const [listaZahtjeva, setListaZahtjeva] = useState([]);
    const [result, setResult] = useState(null);
    const [resultLjudi, setResultLjudi] = useState(null);
    const [listaLjudi, setListaLjudi] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const res = await http.get("/zahtjevi-tima/".concat(userData.username));

            const result = res.data.zahtjeviTima
            const resultLjudi = res.data.clanoviTima

            console.log(res.data)

            if (result && resultLjudi) {
                if (res.status == 200) {
                    // Add any data transformation
                    setResultLjudi(resultLjudi)

                    setResult(result)
                }

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
    }
        , [fetchData]);
    useEffect(() => {
        if (isShownZahtjeviTim === true) {
            fetchData();
        }
    }, [isShownZahtjeviTim]);

    useEffect(() => {
        if (result) {
            setListaZahtjeva(result)
            setListaLjudi(resultLjudi)
        }
    }, [result]);

    if (result) {
        if (listaZahtjeva.length == 0) {
            var listaImena = []
        } else {
            var listaImena = [...new Set(listaZahtjeva.map(zahtjev => zahtjev.username))]
        }
        console.log(listaImena)
    }

    // funkcija koja hendla kada odaberemo filtar u listi
    const [selectedCategoryStatus, setSelectedCategoryStatus] = useState();
    const [selectedCategoryZaposlenik, setSelectedCategoryZaposlenik] = useState();
    const [selectedCategoryBroj, setSelectedCategoryBroj] = useState();

    // Function to get filtered list
    function getFilteredList() {
        // Avoid filter when selectedCategory is null
        setCuvajStatus(selectedCategoryStatus);
        setCuvajZaposlenik(selectedCategoryZaposlenik);
        //setCuvajBroj(selectedCategoryBroj);

        if (!selectedCategoryStatus && !selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return listaZahtjeva;
        }
        if (!selectedCategoryStatus && selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return listaZahtjeva.filter((item) => item.username === selectedCategoryZaposlenik);
        }
        if (selectedCategoryStatus && !selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return listaZahtjeva.filter((item) => item.status === selectedCategoryStatus);
        }
        if (!selectedCategoryStatus && !selectedCategoryZaposlenik && selectedCategoryBroj) {
            return listaZahtjeva.filter((item) => item.brPutnogNaloga.includes(selectedCategoryBroj));
        }
        if (selectedCategoryStatus && !selectedCategoryZaposlenik && selectedCategoryBroj) {
            return listaZahtjeva.filter((item) => item.status === selectedCategoryStatus && item.brPutnogNaloga.includes(selectedCategoryBroj));
        }
        if (!selectedCategoryStatus && selectedCategoryZaposlenik && selectedCategoryBroj) {
            return listaZahtjeva.filter((item) => item.username === selectedCategoryZaposlenik && item.brPutnogNaloga.includes(selectedCategoryBroj));
        }
        if (selectedCategoryStatus && selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return listaZahtjeva.filter((item) => item.status === selectedCategoryStatus && item.username === selectedCategoryZaposlenik);
        }

        return listaZahtjeva.filter((item) => item.status === selectedCategoryStatus && item.username === selectedCategoryZaposlenik && item.brPutnogNaloga.includes(selectedCategoryBroj));
    }

    // Avoid duplicate function calls with useMemo
    var filteredList = useMemo(getFilteredList, [selectedCategoryStatus, selectedCategoryZaposlenik, selectedCategoryBroj, listaZahtjeva]);

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

    return (!result ? <p>Učitava se ...</p> :
        <>
            {isShownZahtjeviTim && (
                <div className="naslovnica">
                    <div className="lista">
                        <p className="hZ"> Putni nalozi moga tima: </p>
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
                                    <select name="category-list" id="category-list" onChange={handleCategoryChangeStatus} value={cuvajStatus}>
                                        <option value="">Svi nalozi</option>
                                        <option value="U_PRIPREMI">U pripremi</option>
                                        <option value="PODNESEN">Podnesen</option>
                                        <option value="VRACEN_NA_DORADU">Vracen na doradu</option>
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
                        <div className="sveNotif"> {filteredList.map(({ brPutnogNaloga, status, sifDrzava, mjesto, ime, prezime }) => {
                            return (
                                <div key={brPutnogNaloga} className="oneNotif">
                                    <p>
                                        Putni nalog: {brPutnogNaloga}
                                    </p>
                                    <p>
                                        Zaposlenik: {ime} {prezime}
                                    </p>
                                    <p>
                                        Putovanje: {mjesto} {sifDrzava.toUpperCase()}
                                    </p>

                                    <p>
                                        Status: {status.replace(/_/g, " ")}
                                    </p>
                                    {
                                        <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                    }
                                </div>
                            )
                        })}
                        </div>
                    </div>
                </div>)}

            {isNalog && (
                <Nalog sendUgasiNalog={sendUgasiNalog}></Nalog>
            )}
        </>);
}
export default ZahtjeviTim;
