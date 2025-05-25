import React, {useEffect, useMemo, useState, useCallback} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common"
import Zaposlenik from "./Zaposlenik";
import ObrazacZaDodavanjeKorisnika from "./ObrazacZaDodavanjeKorisnika";
import ZahtjeviZaPromjenuLozinke from "./ZahtjeviZaPromjenuLozinke";


const Zaposlenici = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    const [isShownZaposlenici, setIsShownZaposlenici] = useState(true);
    const [isShownKorisnik, setIsShownKorisnik] = useState(false);
    var kor;



    const [korisnikList, setKorisnikList] = useState([]);
    const [result, setResult] = useState(null);
    const [greska, setGreska] = useState(true)

    const fetchData = useCallback(async () => {
        try {
            const res = await http.get("/prikazi-zaposlenike/");

            const result = res.data

            console.log(res.data)

            if (result) {
                // Add any data transformation
                if (res.status == 200) {
                    setResult(result)
                    //setNalogList(result.zahtjevi)
                    setGreska(false)
                } else {
                    if (res.status == 202) {
                        setResult(result)

                    }
                }
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
        if (greska == false) {
            setKorisnikList(result.korisnici);
        } 
        console.log(result)
    }, [result]);

    useEffect(() => {
        if (isShownZaposlenici === true) fetchData();
    }, [isShownZaposlenici]);

    if (result) {
        if (korisnikList.length == 0) {
            var listaTimova = []
        } else {
            var listaTimova = [...new Set(korisnikList.map(korisnik => korisnik.timId))]
        }
        console.log(listaTimova)
    }

    const showKorisnik = (oib, ime, prezime, uloga, tim, korIme, email) => {
        kor = {"oib" : oib, "ime" : ime, "prezime" : prezime,"uloga" : uloga,"tim" : tim, "username" : korIme, "email" : email};
        localStorage.setItem("korisnikToShow", JSON.stringify(kor))
        navigate("/dashboard")
        setIsShownKorisnik(true);
        setIsShownZaposlenici(false);
    }

    const ugasiKorisnik = () => {
        setIsShownKorisnik(false);
        setIsShownZaposlenici(true);
        navigate("/dashboard")
    }

    const [selectedCategoryTim, setSelectedCategoryTim] = useState();
    const [selectedCategoryIme, setSelectedCategoryIme] = useState();

    function getFilteredList() {
        if(!selectedCategoryIme && !selectedCategoryTim) {
            return korisnikList;
        }
        if(selectedCategoryTim && !selectedCategoryIme) {
            return korisnikList.filter((item) => (item.timId === selectedCategoryTim));
        }
        if(!selectedCategoryTim && selectedCategoryIme) {
            return korisnikList.filter((item) => (item.ime + " " + item.prezime).toLowerCase().includes(selectedCategoryIme.toLowerCase()));
        }
        if(selectedCategoryTim && selectedCategoryIme) {
            return korisnikList.filter((item) => (item.timId === selectedCategoryTim && item.ime + " " + item.prezime).toLowerCase().includes(selectedCategoryIme.toLowerCase()));
        }
    }

    var filteredList =  useMemo(getFilteredList, [selectedCategoryIme, selectedCategoryTim, korisnikList]);

    const [cuvajIme, setCuvajIme] = useState();
    const [cuvajTim, setCuvajTim] = useState();

    function handleCategoryChangeIme(event) {
        setSelectedCategoryIme(event.target.value);
        setCuvajIme(event.target.value);
    }

    function handleCategoryChangeTim(event) {
        setSelectedCategoryTim(event.target.value);
        setCuvajTim(event.target.value);
    }

    const [isShownAddUser, setIsShownAddUser] = useState(false);
    const showAddUser = () => {
        setIsShownZaposlenici(false);
        setIsShownKorisnik(false);
        setIsShownAddUser(true);
    }
    const sendUgasiAddUser = (isShownAddUser) => { //ugasi obracun kada je stisnut gumb
        setIsShownKorisnik(false);
        setIsShownAddUser(false);
        setIsShownZaposlenici(true);
        navigate("/dashboard")

    }

    const [isShownZahtjeviLozinka, setIsShownZahtjeviLozinka] = useState(false);
    const showZahtjeviZaPromjenomLozinke = () => {
        setIsShownZaposlenici(false);
        setIsShownZahtjeviLozinka(true);
    }

    const hideZahtjeviZaLoz = () => {
        setIsShownZaposlenici(true);
        setIsShownZahtjeviLozinka(false);
    }

    return(!result? <p>Učitava se ...</p>:
    greska? <p>Greška u dohvaćanju podataka.</p>:
        <>
            {isShownZaposlenici && (
                <div className="naslovnica">
                    <div className="lista">

                        <h2>Popis zaposlenika</h2>
                        {greska == true && <p>{result}</p> }

                        <div>
                            <button className="submit-resetBtn" onClick={showAddUser}>Dodaj korisnika</button>
                            <button className="submit-resetBtn" onClick={showZahtjeviZaPromjenomLozinke}>Pregledaj zahtjeve za promjenom lozinke</button>
                        </div>

                        <div className="filteri">

                                <div className="upisBroja">

                                        <label >Pretraži po imenu i prezimenu:  </label>
                                        <input value={cuvajIme} onChange={handleCategoryChangeIme}/>
                                </div>

                        </div>
                        <div className="filteri">
                            <div>
                                    <label>Pretraži tim: </label>
                                    <select
                                        name="category-list"
                                        id="category-list"
                                        onChange={handleCategoryChangeTim}
                                        value={cuvajTim}

                                    >
                                        <option value="">Svi timovi</option>

                                        {
                                            listaTimova.map((timId) => {
                                                
                                                return (
                                                    <option value={timId}>Tim {timId}</option>
                                                )
                                            })}


                                    </select>
                                </div>
                        </div>
                        <div className="sveNotif"> {filteredList.map((user) => {
                            return (
                                <div className="oneNotif" key={user.oib}>
                                    <p>OIB: {user.oib}</p>
                                    <p>Ime: {user.ime}</p>
                                    <p>Prezime: {user.prezime}</p>
                                    <button className="buttons" onClick={() => {showKorisnik(user.oib, user.ime, user.prezime, user.uloga, user.timId, user.korisnickoIme, user.email)}}>Otvori pregled korisnika</button>
                                    
                                </div>
                            )
                        })}

                        </div>

                    </div>
                </div>
                )}
            {isShownKorisnik && (
                <>
                    <Zaposlenik ugasiKorisnik={ugasiKorisnik}></Zaposlenik>
                </>
            )}
            {isShownAddUser && (
                <>
                <div className="request">
                    <ObrazacZaDodavanjeKorisnika sendUgasiAddUser={sendUgasiAddUser}></ObrazacZaDodavanjeKorisnika>
                    </div>
                </>
            )}
            {isShownZahtjeviLozinka && (
                <>
                    <ZahtjeviZaPromjenuLozinke ugasi={hideZahtjeviZaLoz}></ZahtjeviZaPromjenuLozinke>
                </>
            )}
        </>
    )
}
export default Zaposlenici;