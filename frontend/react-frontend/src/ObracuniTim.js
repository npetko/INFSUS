import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common";
import Obracun from "./Obracun";


/*
• Opis osnovnog tijeka:
1. Odabir opcije ’Pregled obracuna tima’ ˇ
2. Voditelja se preusmjerava na stranicu ’Obracuni ˇ clanova tima’ ˇ
3. Voditelj upisuje filter prema kojem zeli pregledati obra ˇ cune ˇ
4. Voditelju se ucitavaju odgovaraju ˇ ci obra ´ cuni ˇ
5. Voditelj ima mogucnost preuzimanja obra ´ cuna u pdf obliku
*/
const ObracuniTim = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();


    const [cuvajStatus, setCuvajStatus] = useState();
    const [cuvajZaposlenik, setCuvajZaposlenik] = useState();
    const [cuvajBroj, setCuvajBroj] = useState();

    const sendBrNaloga = (brPutnogNaloga) => {

        localStorage.setItem("brPutnogNalogaToShow", brPutnogNaloga);
    }

    //otvori moje timove obracune
    const [isShownObracuniTim, setIsShownObracuniTim] = useState(true);
    const showObracuniTim = event => {
        setIsShownObracuniTim(true);


    };
    const hideObracuniTim = event => {

        setIsShownObracuniTim(false);
    }

    //za kad odaberes obracun da ti se prikaze
    const [isObracun, setIsObracun] = useState(false); //za kad odaberes obracun da ti se prikaze
    // otvori neki obracun postojeći
    const showIsObracun = event => {
        //console.log("event ", target.value)
        setIsShownObracuniTim(false);
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

        showObracuniTim();

    }

    // ODABIR FILTRA
    // BACKEND: obje liste trebam iz backenda i PAZITI DA IME ZAPOSLENIKA BUDE IME + PREZIME u ovakvom string formatu i IME isto tako u donjoj listi

    const [obracunList, setObracunList] = useState([]);
    const [result, setResult] = useState(null);
    const [resultLjudi, setResultLjudi] = useState(null);
    const [listaLjudi, setListaLjudi] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const res = await http.get("obracun/obracuni-tima/".concat(userData.username));

            const result = res.data.obracuniTima
            const resultLjudi = res.data.clanoviTima

            console.log(res.data)
            console.log(result)

            if (result) {
                if (res.status == 200) {
                    // Add any data transformation
                    setResult(result)
                    setResultLjudi(resultLjudi)
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
        //Attempt to retreive data

        fetchData();
    }
        , [fetchData]);

    useEffect(() => {
        if (result) {
            setObracunList(result)
            setListaLjudi(resultLjudi)

        }
    }, [result]);

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
            return obracunList;
        }
        if (!selectedCategoryStatus && selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return obracunList.filter((item) => item.username === selectedCategoryZaposlenik);
        }
        if (selectedCategoryStatus && !selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return obracunList.filter((item) => item.statusObracuna === selectedCategoryStatus);
        }
        if (!selectedCategoryStatus && !selectedCategoryZaposlenik && selectedCategoryBroj) {

            return obracunList.filter((item) => item.brPutnogNaloga.includes(selectedCategoryBroj));
        }
        if (selectedCategoryStatus && !selectedCategoryZaposlenik && selectedCategoryBroj) {
            return obracunList.filter((item) => item.statusObracuna === selectedCategoryStatus && item.brPutnogNaloga.includes(selectedCategoryBroj));
        }
        if (!selectedCategoryStatus && selectedCategoryZaposlenik && selectedCategoryBroj) {
            return obracunList.filter((item) => item.username === selectedCategoryZaposlenik && item.brPutnogNaloga.includes(selectedCategoryBroj));
        }
        if (selectedCategoryStatus && selectedCategoryZaposlenik && !selectedCategoryBroj) {
            return obracunList.filter((item) => item.statusObracuna === selectedCategoryStatus && item.username === selectedCategoryZaposlenik);
        }
        return obracunList.filter((item) => item.statusObracuna === selectedCategoryStatus && item.username === selectedCategoryZaposlenik && item.brPutnogNaloga.includes(selectedCategoryBroj));
    }

    // Avoid duplicate function calls with useMemo
    var filteredList = useMemo(getFilteredList, [selectedCategoryStatus, selectedCategoryZaposlenik, selectedCategoryBroj, obracunList]);


    function handleCategoryChangeStatus(event) {
        setSelectedCategoryStatus(event.target.value);
        setCuvajStatus(selectedCategoryStatus);
        console.log("status", selectedCategoryStatus)

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



    return (!result ? <p>Učitava se ...</p> :
        <>
            {isShownObracuniTim && (
                <div className="naslovnica">
                    <div className="lista">
                        <p className="hZ"> Obračuni mojeg tima: </p>
                        {/*  <div>Moj tim (odaberi čije obračune želiš vidjeti):</div>

                              <div className="filteri">
                            <div className="filter-buttons">
                                <button value="" name="category-list" id="category-list" onClick={handleCategoryChangeZaposlenik}>Svi zaposlenici</button>
                            </div>
                        </div>*/}

                        {/*    <div  className="sveNotif">
                                            {
                                                listaLjudi.map(({ ime, prezime, username }) => {
                                                    return (
                                                        <div className="filter-buttons">
                                                            <button value={username} name="category-list" id="category-list" onClick={handleCategoryChangeZaposlenik}>{ime} {prezime}</button>
                                                        </div>
                                                    )
                                            })}
                        </div>*/}
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

                        <div className="sveNotif"> {filteredList.map(({ brPutnogNaloga, statusObracuna, ime, prezime }) => { //BACKEND: povuci ime i prezime prema korisnickom imenu iz zahtjeva i dodati dolje
                            //BACKEND: let ime = povuci i let prezime = povuci                                    
                            return (
                                <div key={brPutnogNaloga} className="oneNotif">
                                    <p>
                                        Putni nalog: {brPutnogNaloga}
                                    </p>
                                    <p> 
                                            Zaposlenik: {ime} {prezime}
                                        </p>
                                        
                                    <p>
                                    Status: {statusObracuna.replace(/_/g, " ")}
                                    </p>
                                    {
                                        <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsObracun(); }}>Otvori obračun</button>
                                    }
                                </div>


                            )
                        })}
                        </div>
                    </div>
                </div>)}

            {isObracun && (
                <Obracun sendUgasiObracun={sendUgasiObracun}></Obracun>
            )}
        </>
    );

}
export default ObracuniTim;