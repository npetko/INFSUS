import React, {useState, useCallback, useEffect} from "react";
import http from "./http-common"
import { Navigate, useNavigate } from "react-router-dom";
import ObrazacZaPromjenuLozinke from "./ObrazacZaPromjenuLozinkeKodAdmina";
//ne prikazuju se u formi username i email treba u backendu slozit da se salje sa zaposlenicima


const Zaposlenik = ({ugasiKorisnik}) => {
    //const korisnik = JSON.parse(localStorage.getItem("korisnikToShow"))
    //const korisnici = JSON.parse(localStorage.getItem("zaposlenici"))
    //const korisnik = korisnici.filter((item) => item.oib === oib)
    const navigate = useNavigate();

    const [isShownKorisnik, setIsShownKorisnik] = useState(true);
    const [isShownMijenjajKorisnik, setIsShownMijenjajKorisnik] = useState(false);
    const [isShownLozinka, setIsShownLozinka] = useState(false);
    const [update, setUpdate]= useState(false);
    const promijeniPodatke = () => {
        setIsShownKorisnik(false);
        setIsShownMijenjajKorisnik(true);
    }

    const promijeniLozinku = () => {
        setIsShownKorisnik(false);
        setIsShownLozinka(true);
    }

    const ugasiPromjenuLozinke = () => {
        setIsShownKorisnik(true);
        setIsShownLozinka(false);
    }

    const ugasiPromjenuPodataka = () => {
        setIsShownKorisnik(true);
        setIsShownMijenjajKorisnik(false);
    }

    const ispisiStatus = (ispis) => {
        document.getElementById("status-promjene").innerText = ispis;
    }

    const handlePromjenaPodatakaZaposlenika = (event) => {
        event.preventDefault();
        try{
            http.post("/updateKorisnik", document.forms[0]).then(res => {
                if(res.data === "Uspješno promijenjeni podaci") {
                    //event.target.reset();
                    setUpdate(true)
                    ispisiStatus(res.data);
                } else {
                    ispisiStatus(res.data);
                }
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    const deleteUser = (event) => {
        event.preventDefault();
        let obj = JSON.parse(localStorage.getItem("korisnikToShow")) 
        try{
            http.post("/izbrisi-korisnika", obj).then(res => {
                if(res.status === 200) {
                    localStorage.setItem("message", res.data)
                    ugasiKorisnik();
                    
                } else {
                    ispisiStatus(res.data);
                }
            })
        } catch (err) {
            console.log(err.message)
        }
        //ugasiKorisnik();
        
    }

    const [korisnik, setKorisnik] = useState([])
    const [result, setResult] = useState(null)
    let obj = { ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow") };


    const fetchData = useCallback(async () => {
        try {
            
                const resIme = await http.get('zaposlenici/' + JSON.parse(localStorage.getItem("korisnikToShow")).username).then(async resIme => {
                    const resultIme = resIme.data
                    console.log(resultIme)
                    setResult(resultIme)
                })
            

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
            setKorisnik(result.at(0))
        }
    }, [result]);

    useEffect(() => {
        if (isShownKorisnik === true) {
            fetchData();
        } 
    }, [isShownKorisnik]);

    useEffect(() => {
        if (update === true) {
            fetchData();
        } 
    }, [update]);
    
    return(!result?<p>Učitava se ...</p>:
        <>
            {isShownKorisnik && (

                <>
                    <form onSubmit={deleteUser}>
                        <h2>Podaci zaposlenika</h2>
                        <p>Korisničko ime: {korisnik.korisnickoIme}</p>
                        <p>E-mail: {korisnik.email}</p>
                        <p>OIB: {korisnik.oib}</p>
                        <p>Ime: {korisnik.ime}</p>
                        <p>Prezime: {korisnik.prezime}</p>
                        <p>Uloga: {korisnik.uloga}</p>
                        <p>ID tima: {korisnik.timId}</p>
                        
                        <button type="submit" className="submit-resetBtn">Obriši korisnika</button>
                        <button className="submit-resetBtn" onClick={promijeniPodatke}>Promijeni podatke</button>
                        <button className="submit-resetBtn" onClick={promijeniLozinku}>Promijeni lozinku</button>
                        <button className="submit-resetBtn" onClick={ugasiKorisnik}>Zatvori pregled korisnika</button>
                    </form>
                </>
            )}
            {isShownMijenjajKorisnik && (
                <>
                    <h2>Promjena podataka</h2>
                    <form onSubmit={handlePromjenaPodatakaZaposlenika}>
                        <div className="inputStyle">
                            <label className="text">Korisničko ime: </label>
                            <input type="text" name="username" required defaultValue={korisnik.korisnickoIme}/>
                        </div>
                        <div className="inputStyle">
                            <label className="text">E-mail: </label>
                            <input type="text" name="email" required defaultValue={korisnik.email}/>
                        </div>
                        <div className="inputStyle">
                            <label className="text">Oib: </label>
                            <input type="text" name="oib" required value={korisnik.oib}/>
                        </div>
                        <div className="inputStyle">
                            <label className="text">Ime: </label>
                            <input type="text" name="ime" required defaultValue={korisnik.ime}/>
                        </div>
                        <div className="inputStyle">
                            <label className="text">Prezime: </label>
                            <input type="text" name="prezime" required defaultValue={korisnik.prezime}/>
                        </div>
                        <div className="inputStyle">
                            <label className="text">Uloga: </label>
                            <input type="text" name="uloga" required defaultValue={korisnik.uloga}/>
                        </div>
                        <div className="inputStyle">
                            <label className="text">Tim: </label>
                            <input type="text" name="tim" required defaultValue={korisnik.timId}/>
                        </div>
                        <button type="submit" className="submit-resetBtn">Predaj</button>
                        <button type="reset" className="submit-resetBtn">Reset</button>
                        <button type="button" className="submit-resetBtn" onClick={ugasiPromjenuPodataka}>Odustani</button>
                    </form>
                    <p id="status-promjene"></p>
                </>
            )}
            {isShownLozinka && (
                <ObrazacZaPromjenuLozinke ugasiPromjenuLozinke={ugasiPromjenuLozinke}></ObrazacZaPromjenuLozinke>
            )}
        </>
    )

}

export default Zaposlenik;