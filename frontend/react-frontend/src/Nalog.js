import React, { useState, useCallback, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common"
import ObrazacZaNalog from "./ObrazacZaNalog";
import ObrazacZaObracun from "./ObrazacZaObracun";
import fileDownload from 'js-file-download';

const Nalog = ({ sendUgasiNalog }) => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    const brPutnogNaloga = localStorage.getItem("brPutnogNalogaToShow");

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate("/dashboard");
        try {
            http.post("/novi-zahtjev", document.forms[0]).then(res => {
                localStorage.setItem("message", JSON.stringify(res.data));
                setUpdate(true)
                navigate("/dashboard");
                if (res.data === "Zahtjev je poslan na obradu.") {
                    event.target.reset();
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    const handleDownload = () => {
        try {
            http.get('/zahtjev-pdf/' + nalog.brPutnogNaloga, {
                responseType: 'blob',
            }).then((res) => {
                console.log(res.data)
                fileDownload(res.data, nalog.brPutnogNaloga + "-nalog.pdf")
            })
        } catch (err) {
            console.log(err)
        }
    }

    const [isOdobren, setIsOdobren] = useState(false);
    const handleOdobrenjeNaloga = () => {
        console.log(localStorage.getItem("brPutnogNalogaToShow"));
        let obj = { ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow") };
        console.log(obj)
        try {
            http.post("/odobriZahtjev", obj).then(res => {
                localStorage.setItem("odobri", JSON.stringify(res.data));
                navigate("/dashboard");
                console.log(JSON.stringify(res.data))
                if (res.data === "Zahtjev odobren") {
                    setIsOdobren(true);
                    setUpdate(true)
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    const handleSubmitDoradenNalog = (event) => {
        event.preventDefault()
        let obj = { ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow") };
        console.log(document.forms[0])

        try {
            http.post("/prepraviNalog", document.forms[0]).then(res => {
                console.log(JSON.stringify(res.data))
                if (res.data === "Prepravljen zahtjev") {
                    setIsVracen(false);
                    setUpdate(true)
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    const [isOdbijen, setIsOdbijen] = useState(false);
    const handleOdbijanjeNaloga = () => {
        console.log(localStorage.getItem("brPutnogNalogaToShow"));
        let obj = { ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow") };
        console.log(obj)
        try {
            http.post("/odbijZahtjev", obj).then(res => {

                localStorage.setItem("odbij", JSON.stringify(res.data));
                navigate("/dashboard");
                console.log(JSON.stringify(res.data))
                if (res.data === "Zahtjev odbijen") {
                    setIsOdbijen(true);
                    setUpdate(true)
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    const [isVracen, setIsVracen] = useState(false);
    const [isOtvoriVracanje, setIsOtvoriVracanje] = useState(false);
    const handleOtvoriVracanje = (event) => {
        setIsOtvoriVracanje(true);
    }

    const handleVracanjeNaloga = (event) => {
        event.preventDefault();
        let razlog = document.getElementById("razlogVracanja").value;
        console.log(razlog);
        console.log(localStorage.getItem("brPutnogNalogaToShow"));
        let obj = {
            ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow"),
            ["razlogVracanja"]: razlog
        };
        console.log(obj)

        try {
            http.post("/vratiNaDoradu", obj).then(res => {
                localStorage.setItem("vrati", JSON.stringify(res.data));
                navigate("/dashboard");
                console.log(JSON.stringify(res.data))
                if (res.data === "Zahtjev je vracen na doradu.") {
                    setIsVracen(true);
                    setIsOtvoriVracanje(false);
                    setUpdate(true)
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    const [isShownObracun, setIsShownObracun] = useState(false);
    const [isShownNalog, setIsShownNalog] = useState(true);

    const otvoriObracun = (event) => {
        setIsShownObracun(true);
        setIsShownNalog(false);
    }

    const ugasiObracun = (event) => {
        setIsShownObracun(false);
        setIsShownNalog(true);
    }

    const [nalogList, setNalogList] = useState([]);
    const [resultNalogList, setResultNalogList] = useState(null);
    const [resultIme, setResultIme] = useState(null)
    const [ime, setIme] = useState([])
    const [result, setResult] = useState(false)
    const [update, setUpdate] = useState(false)
    let obj = { ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow") };

    const promijeniUpdate = (state) => {
        setUpdate(state);
    }

    const fetchData = useCallback(async () => {
        try {
            const res = await http.post("svi-zahtjevi/", obj).then(async res => {
                const resultNalogList = res.data.sviZahtjevi
                setResultNalogList(resultNalogList)
                const resIme = await http.get('zaposlenici/' + resultNalogList.at(0).username).then(async resIme => {
                    const resultIme = resIme.data
                    setResultIme(resultIme)
                    setResult(true)
                })
            })
        }
        catch (error) {
        }
    }, [])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (update) fetchData();
    }, [update]);

    useEffect(() => {
        if (result === true) {
            setNalogList(resultNalogList.at(0));
            setIme(resultIme.at(0))
        }
    }, [result]);

    const ugasiNalog = () => {
        sendUgasiNalog(false);
    }

    if (result === true) {
        var nalog = resultNalogList.at(0)
    }

    return (result === false ? <p> Učitava se ...</p> :
        <>
        {
            (nalog.status === "PODNESEN" && userData.uloga !== "VODITELJ" && userData.uloga !== "ZAMJENIK") ?
                <>
                <div>
                    <div>
                        <h2>Putni nalog br. {brPutnogNaloga} </h2>
                        <p>Ime: {ime.ime}</p>
                        <p>Prezime: {ime.prezime}</p>
                        <p>Datum putovanja: {nalog.pocPutovanja}</p>
                        <p>Datum povratka: {nalog.krajPutovanja}</p>
                        <p>Država putovanja: {nalog.drzava}</p>
                        <p>Mjesto putovanja: {nalog.mjesto}</p>
                        <p>Razlog putovanja: {nalog.razlog}</p>
                        <p>Akontacija: {nalog.akontacija}</p>
                        <p>Mjesto troška: {nalog.mjestoTroska}</p>
                        <p>Prijevozno sredstvo: {nalog.prijevoznoSredstvo}</p>
                        <p>Status: {nalog.status}</p>
                    </div>
                    <button className="submit-resetBtn" onClick={ugasiNalog}>Ugasi nalog</button>
                    <button className="submit-resetBtn" onClick={() => {
                        handleDownload();
                    }}>Preuzmi pdf prikaz</button>
                </div>
                </> : (nalog.status === "PODNESEN" && (userData.uloga === "VODITELJ" || userData.uloga === "ZAMJENIK")) ?
                <>
                <div>
                    <div>
                        <h2>Putni nalog br. {brPutnogNaloga} </h2>
                        <p>Ime: {ime.ime}</p>
                        <p>Prezime: {ime.prezime}</p>
                        <p>Datum putovanja: {nalog.pocPutovanja}</p>
                        <p>Datum povratka: {nalog.krajPutovanja}</p>
                        <p>Država putovanja: {nalog.drzava}</p>
                        <p>Mjesto putovanja: {nalog.mjesto}</p>
                        <p>Razlog putovanja: {nalog.razlog}</p>
                        <p>Akontacija: {nalog.akontacija}</p>
                        <p>Mjesto troška: {nalog.mjestoTroska}</p>
                        <p>Prijevozno sredstvo: {nalog.prijevoznoSredstvo}</p>
                        <p>Status: {nalog.status}</p>
                    </div>
                    {!isOdobren && !isOdbijen && !isVracen && !isOtvoriVracanje && (
                        <button className="submit-resetBtn" onClick={handleOdobrenjeNaloga}> Odobri nalog</button>
                    )}
                    {!isOdbijen && !isOdobren && !isVracen && !isOtvoriVracanje && (
                        <button className="submit-resetBtn" onClick={handleOdbijanjeNaloga}>Odbij nalog</button>
                    )}
                    {!isOdbijen && !isOdobren && !isVracen && !isOtvoriVracanje && (
                        <button className="submit-resetBtn" onClick={handleOtvoriVracanje}>Vrati na doradu</button>
                    )}
                    {!isOdbijen && !isOdobren && !isVracen && isOtvoriVracanje && (
                        <form onSubmit={handleVracanjeNaloga}>
                            <div className="inputStyle">
                                <label className="text">Razlog vraćanja: </label>
                                <textarea type="text" name="razlogVracanja" id="razlogVracanja" required />
                            </div>
                            <button type="submit" className="submit-resetBtn">Potvrda vraćanja na doradu</button>
                            <button className="submit-resetBtn" onClick={handleOdbijanjeNaloga}>Ipak odbij nalog</button>
                            <button className="submit-resetBtn" onClick={handleOdobrenjeNaloga}> Ipak odobri nalog</button>
                        </form>)
                    }
                    <button className="submit-resetBtn" onClick={ugasiNalog}>Ugasi nalog</button>
                </div>
                </> : nalog.status === "U_PRIPREMI" ?
                <>
                <div>
                    <h2>Nalog u pripremi</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="inputStyle">
                            <label className="text">Broj putnog naloga:</label>
                            <input type="text" name="brPutnogNaloga" readOnly defaultValue={nalog.brPutnogNaloga} />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Korisničko ime:</label>
                            <input type="text" name="username" value={ime.korisnickoIme} required readOnly />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Ime: </label>
                            <input type="text" name="ime" value={ime.ime} required readOnly />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Prezime: </label>
                            <input type="text" name="prezime" value={ime.prezime} required readOnly />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Datum putovanja: </label>
                            <input type="datetime-local" name="datPoc" required defaultValue={nalog.pocPutovanja} />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Datum povratka: </label>
                            <input type="datetime-local" name="datKraj" required defaultValue={nalog.krajPutovanja} />
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Država putovanja: </label>
                            <input type="text" name="drz" defaultValue={nalog.drzava} required />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Mjesto putovanja: </label>
                            <input type="text" name="mjesto" required defaultValue={nalog.mjesto} />
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Razlog putovanja: </label>
                            <textarea required name="razlog" defaultValue={nalog.razlog}></textarea>
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Akontacija: </label>
                            <textarea required name="akontacija" defaultValue={nalog.akontacija}></textarea>
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Mjesto troška: </label>
                            <textarea required name="mjestoTroska" defaultValue={nalog.mjestoTroska}></textarea>
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Prijevozno sredstvo: </label>
                            <select name="prijSredstvo" required defaultValue={nalog.prijevoznoSredstvo}>
                                <option>Osobni automobil</option>
                                <option>Poslovni automobil</option>
                                <option>Autobus</option>
                                <option>Avion</option>
                                <option>Brod</option>
                            </select>
                        </div>
                        <button type="submit" className="submit-resetBtn">Predaj</button>
                    </form>
                    <button className="submit-resetBtn" onClick={ugasiNalog}>Ugasi nalog</button>
                </div>
                </> : nalog.status === "VRACEN_NA_DORADU" ?
                <>
                <div>
                    <h2>Nalog vraćen na doradu</h2>
                    <form onSubmit={handleSubmitDoradenNalog}>
                        <div className="inputStyle">
                            <label className="text">Broj putnog naloga:</label>
                            <input type="text" name="brPutnogNaloga" readOnly defaultValue={nalog.brPutnogNaloga} />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Korisničko ime:</label>
                            <input type="text" name="username" value={ime.korisnickoIme} required readOnly />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Ime: </label>
                            <input type="text" name="ime" value={ime.ime} required readOnly />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Prezime: </label>
                            <input type="text" name="prezime" value={ime.prezime} required readOnly />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Datum putovanja: </label>
                            <input type="datetime-local" name="datPoc" required defaultValue={nalog.pocPutovanja} />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Datum povratka: </label>
                            <input type="datetime-local" name="datKraj" required defaultValue={nalog.krajPutovanja} />
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Država putovanja: </label>
                            <input type="text" name="drz" defaultValue={nalog.drzava} required />
                        </div>
                        <div className="inputStyle">
                            <label className="text">Mjesto putovanja: </label>
                            <input type="text" name="mjesto" required defaultValue={nalog.mjesto} />
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Razlog putovanja: </label>
                            <textarea required name="razlog" defaultValue={nalog.razlog}></textarea>
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Akontacija: </label>
                            <textarea required name="akontacija" defaultValue={nalog.akontacija}></textarea>
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Mjesto troška: </label>
                            <textarea required name="mjestoTroska" defaultValue={nalog.mjestoTroska}></textarea>
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Prijevozno sredstvo: </label>
                            <select name="prijSredstvo" required defaultValue={nalog.prijevoznoSredstvo}>
                                <option>Osobni automobil</option>
                                <option>Poslovni automobil</option>
                                <option>Autobus</option>
                                <option>Avion</option>
                                <option>Brod</option>
                            </select>
                        </div>
                        <div className="inputStyle" >
                            <label className="text">Razlog vraćanja na doradu: </label>
                            <textarea readOnly name="razlogVracanja" defaultValue={nalog.razlogVracanja}></textarea>
                        </div>
                        <button type="submit" className="submit-resetBtn">Predaj</button>
                    </form>
                    <button className="submit-resetBtn" onClick={ugasiNalog}>Ugasi nalog</button>
                </div>
                </> : nalog.status === "ODOBREN" && (userData.username === nalog.username) ?
                <>
                {isShownNalog && (
                    <div>
                        <div>
                            <h2>Putni nalog br. {brPutnogNaloga} </h2>

                            <p>Ime: {ime.ime}</p>
                            <p>Prezime: {ime.prezime}</p>
                            <p>Datum putovanja: {nalog.pocPutovanja}</p>
                            <p>Datum povratka: {nalog.krajPutovanja}</p>
                            <p>Država putovanja: {nalog.drzava}</p>
                            <p>Mjesto putovanja: {nalog.mjesto}</p>
                            <p>Razlog putovanja: {nalog.razlog}</p>
                            <p>Akontacija: {nalog.akontacija}</p>
                            <p>Mjesto troška: {nalog.mjestoTroska}</p>
                            <p>Prijevozno sredstvo: {nalog.prijevoznoSredstvo}</p>
                            <p>Status: {nalog.status}</p>
                        </div>
                        <button className="submit-resetBtn" onClick={ugasiNalog}>Ugasi nalog</button>
                        <button className="submit-resetBtn" id="otvori-obracun-bttn" onClick={otvoriObracun}>Otvori obračun</button>
                    </div>
                )
                }
                { isShownObracun && (
                    <ObrazacZaObracun ugasiObracun={ugasiObracun} promijeniUpdate={promijeniUpdate}></ObrazacZaObracun>
                )
                }
                </> :
                <>
                <div>
                    <div>
                        <h2>Putni nalog br. {brPutnogNaloga} </h2>
                        <p>Ime: {ime.ime}</p>
                        <p>Prezime: {ime.prezime}</p>
                        <p>Datum putovanja: {nalog.pocPutovanja}</p>
                        <p>Datum povratka: {nalog.krajPutovanja}</p>
                        <p>Država putovanja: {nalog.drzava}</p>
                        <p>Mjesto putovanja: {nalog.mjesto}</p>
                        <p>Razlog putovanja: {nalog.razlog}</p>
                        <p>Akontacija: {nalog.akontacija}</p>
                        <p>Mjesto troška: {nalog.mjestoTroska}</p>
                        <p>Prijevozno sredstvo: {nalog.prijevoznoSredstvo}</p>
                        <p id="status-naloga">Status: {nalog.status}</p>
                    </div>
                    <button className="submit-resetBtn" onClick={ugasiNalog}>Ugasi nalog</button>
                </div>
                </>
        }
        </>
    )
}
export default Nalog;