import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css';
import http from "./http-common";
import Nalog from "./Nalog";
import Obracun from "./Obracun";
import Zaposlenici from "./Zaposlenici";
import ZahtjeviZaPromjenuLozinke from "./ZahtjeviZaPromjenuLozinke";
import ObrazacZaPromjenuLozinkeKodAdmina from "./ObrazacZaPromjenuLozinkeKodAdmina";

const Naslovnica = ({ sendOtvoriNalog }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    const [isShownZahtjev, setIsShownZahtjev] = useState(false);
    const [isShownObracun, setIsShownObracun] = useState(false);
    const [isShownPromjenaLozinke, setIsShownPromjenaLozinke] = useState(false);

    const promijeniLozinku = () => {
        //localStorage.setItem("korisnikToShow", JSON.stringify({"username": username}))
        setIsShownPromjenaLozinke(true);
        setIsShownNaslovnica(false);
    }
    const ugasiPromjenuLozinke = () => {
        setIsShownPromjenaLozinke(false);
        setIsShownNaslovnica(true);
        setResult(false)
    }

    //odabrana naslovnica
    const [isShownNaslovnica, setIsShownNaslovnica] = useState(true); //je li prikazana naslovnica
    //prikazi naslovnicu
    const showNaslovnica = event => {
        setIsShownNaslovnica(true);
    };
    const hideNaslovnica = event => {
        setIsShownNaslovnica(false);
    }

    const sendKorisnik = (username) => {
        localStorage.setItem("korisnikToShow", JSON.stringify({"username":username}))
    } 

    //za kad odaberes nalog da ti se prikaze
    const [isNalog, setIsNalog] = useState(false); //za kad odaberes nalog da ti se prikaze

    // otvori neki nalog postojeći
    const showIsNalog = () => {
        //BACKEND: spremi odabrani nalog i na local storage (ovo je onClick kada odaberemo nalog)
        setIsNalog(true);
        setIsShownNaslovnica(false);
    };
    const hideIsNalog = event => {
        setIsNalog(false);
    };

    //ugasi nalog gumb
    const sendUgasiNalog = () => { //ugasi nalog kada je stisnut gumb
        setIsNalog(false);
        setIsShownNaslovnica(true);
        setResult(false);
        navigate("/dashboard")
    }
    //za kad odaberes obracun da ti se prikaze
    const [isObracun, setIsObracun] = useState(false); //za kad odaberes obracun da ti se prikaze
    // otvori neki obracun postojeći
    const showIsObracun = event => {
        //console.log("event ", target.value)
        setIsShownNaslovnica(false);
        //setCuvajStatus(selectedCategoryStatus);
        //setCuvajZaposlenik(selectedCategoryZaposlenik);
        setIsObracun(true);

    };
    const hideIsObracun = event => {
        setIsObracun(false);
    };

    const sendBrNaloga = (brPutnogNaloga) => {

        localStorage.setItem("brPutnogNalogaToShow", brPutnogNaloga);
    }
    //ugasi obracun gumb
    const sendUgasiObracun = () => { //ugasi obracun kada je stisnut gumb
        setIsObracun(false);
        setIsShownNaslovnica(true);
        navigate("/dashboard")
        setResult(false)
    }

    // za sve
    const [uPripremi, setUPripremi] = useState([]);
    const [zaDoradu, setZaDoradu] = useState([]);
    const [zaObracun, setZaObracun] = useState([]);
    const [resultUPripremi, setResultUPripremi] = useState(null);
    const [resultZaDoradu, setResultZaDoradu] = useState(null);
    const [resultZaObracun, setResultZaObracun] = useState(null);
    const [result, setResult] = useState(false);
    const [mojiZahtjevi, setMojiZahtjevi] = useState([]);
    const [mojiObracuni, setMojiObracuni] = useState([]);
    const [resultMojiZahtjevi, setResultMojiZahtjevi] = useState(null);
    const [resultMojiObracuni, setResultMojiObracuni] = useState(null);
    const [resultObavijesti, setResultObavijesti] = useState(null)
    const [obavijesti, setObavijesti] = useState([])

    // za voditelja/zamjenika
    const [resultObracuniZaPotvrdu, setResultObracuniZaPotvrdu] = useState(null)
    const [obracuniZaPotvrdu, setObracuniZaPotvrdu] = useState([])
    const [resultZahtjeviTima, setResultZahtjeviTima] = useState(null)
    const [zahtjeviTima, setZahtjeviTima] = useState([])

    // za racunovodu
    const [resultZahtjeviRadnika, setResultZahtjeviRadnika] = useState(null)
    const [zahtjeviRadnika, setZahtjeviRadnika] = useState([])

    // za admina
    const [resultLozinke, setResultLozinke] = useState(null)
    const [lozinke, setLozinke] = useState([])

    console.log(result)
    const fetchDataBasic = useCallback(async () => {
        try {
            const result = await http.get("moji-zahtjevi/".concat(userData.username)).then(async resMojiZahtjevi => {
                const resultMojiZahtjevi = resMojiZahtjevi.data.zahtjevi;
                setResultMojiZahtjevi(resultMojiZahtjevi);
                const resMojiObracuni = await http.get("obracun/moji-obracuni/".concat(userData.username)).then(async resMojiObracuni => {
                    const resultMojiObracuni = resMojiObracuni.data.obracuni;
                    setResultMojiObracuni(resultMojiObracuni)
                    const listaObracuna = resultMojiObracuni;
                    console.log(resMojiObracuni)
                    const listaZahtjeva = resultMojiZahtjevi;
                    var zaobracun = []
                    if (listaZahtjeva.length != 0) {
                        setResultUPripremi(listaZahtjeva.filter(z => z.status == "U_PRIPREMI"))
                        console.log(listaZahtjeva.filter(z => z.status == "U_PRIPREMI"))
                        setResultZaDoradu(listaZahtjeva.filter(z => z.status == "VRACEN_NA_DORADU"))
                        if (listaObracuna.length != 0) {
                            setResultZaObracun(listaZahtjeva.filter(z => z.status == "ODOBREN" && listaObracuna.filter(o => o.brPutnogNaloga == z.brPutnogNaloga).length == 0))
                            zaobracun = listaZahtjeva.filter(z => z.status == "ODOBREN" && listaObracuna.filter(o => o.brPutnogNaloga == z.brPutnogNaloga).length == 0)
                        } else {
                            setResultZaObracun(listaZahtjeva.filter(z => z.status == "ODOBREN"))
                            zaobracun = listaZahtjeva.filter(z => z.status == "ODOBREN")

                        }
                    } else {
                        zaobracun = []
                        setResultUPripremi([])
                        setResultZaDoradu([])
                        setResultZaObracun([])
                    }
                    let obj = {}
                    for (let i = 0; i < zaobracun.length; i++) {
                        obj[i] = zaobracun.at(i).brPutnogNaloga
                    }
                    const resObavijesti = http.post('obavijesti', obj).then(async resObavijesti => {
                        const resultObavijesti = resObavijesti.data
                        console.log(resultObavijesti)
                        setResultObavijesti(resultObavijesti)
                        if (userData.uloga === "ZAPOSLENIK") {
                            setResult(true)
                        } else {
                            if (userData.uloga === "VODITELJ" || userData.uloga === "ZAMJENIK") {
                                const result = await http.get("/zahtjevi-tima/".concat(userData.username)).then(async (resZahtjeviTima) => {
                                    const resultZahtjeviTima = resZahtjeviTima.data.zahtjeviTima.filter(z => z.status === "PODNESEN");
                                    setResultZahtjeviTima(resultZahtjeviTima);
                                    console.log(resultZahtjeviTima)
                                    console.log("11")
                                    const resObracuniZaPotvrdu = await http.get("obracun/obracuni-tima/".concat(userData.username)).then(resObracuniZaPotvrdu => {
                                        const resultObracuniZaPotvrdu = resObracuniZaPotvrdu.data.obracuniTima.filter(o =>  o.statusObracuna === "OBRACUNATO" );
                                        setResultObracuniZaPotvrdu(resultObracuniZaPotvrdu);
                                        //setResult(true)
                                    }).then(()=>{setResult(true)})
                                })
                            } else {
                                if (userData.uloga === "RACUNOVODA") {
                                    const res = await http.post("/obracun/svi-obracuni/", JSON.parse("{\"status\":\"SPREMAN_ZA_OBRACUN\"}")).then((resZahtjeviRadnika) => {
                                        const resultZahtjeviRadnika = resZahtjeviRadnika.data.sviObracuni
                                        setResultZahtjeviRadnika(resultZahtjeviRadnika)
                                        console.log(resultZahtjeviRadnika)
                                        setResult(true)
                                    })

                                }else {
                                    if(userData.uloga === "ADMIN") {
                                        const resLozinke = await http.get("/zahtjevi-za-lozinke").then(async resLozinke=> {
                                            const resultLozinke = resLozinke.data
                                            setResultLozinke(resultLozinke)
                                            setResult(true)
                                        })
                                    }
                                }
                            }
                        }
                    })
                })
            })
            console.log(result)
        }
        catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        fetchDataBasic();
    }
        , [fetchDataBasic]);
    
    useEffect(() => {
        if (result == true) {
            setMojiObracuni(resultMojiObracuni)
            setMojiZahtjevi(resultMojiZahtjevi)

            setObavijesti(resultObavijesti)
            setUPripremi(resultUPripremi)
            setZaObracun(resultZaObracun)
            setZaDoradu(resultZaDoradu)
            setObracuniZaPotvrdu(resultObracuniZaPotvrdu)
            console.log(resultObracuniZaPotvrdu)
            setZahtjeviTima(resultZahtjeviTima)
            setZahtjeviRadnika(resultZahtjeviRadnika)
            setLozinke(resultLozinke)
            console.log(obracuniZaPotvrdu)
            console.log("1111")
            console.log(uPripremi)
        }

    }, [result]);
    const prikaziObavijest = (brPutnogNaloga) => {
        return (resultObavijesti[brPutnogNaloga]);
    }

    useEffect(() => {
        fetchDataBasic();
    }, [isShownNaslovnica]);

    if(result===true) {
        console.log(resultZaObracun)
    }
    return ((result == false || !result) ? <p>Učitava se ...</p> :
        userData.uloga == "ZAPOSLENIK" ?
        <>
            {isShownNaslovnica && (
                <div className="naslovnica">
                    <div className="lista">
                        <p className="hZ"> Moji zahtjevi u pripremi: </p>
                        {uPripremi.length > 0 && (
                            <div className="sveNotif"> {uPripremi.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {<button id={brPutnogNaloga} className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>}
                                    </div>
                                )
                            })}
                            </div>)}
                        {uPripremi.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                    </div>
                    <div className="lista">
                        <p className="hZ"> Moji zahtjevi vraćeni na doradu: </p>
                        {zaDoradu.length > 0 && (
                            <div className="sveNotif"> {zaDoradu.map(({ brPutnogNaloga, status }) => {                             
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button id={brPutnogNaloga} className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>}
                                    </div>
                                )
                            })}
                            </div>)
                        }
                        {zaDoradu.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                        <p className="hZ"> Moji zahtjevi koje moram poslati na obračun: </p>
                        {zaObracun.length > 0 && (
                            <div className="sveNotif"> {zaObracun.map(({ brPutnogNaloga, status }) => {                               
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {<p>
                                            {prikaziObavijest(brPutnogNaloga)}
                                        </p>}
                                        {
                                            <button id={brPutnogNaloga} className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zaObracun.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                    </div>
                </div>
            )}
            {isNalog && (
                <Nalog sendUgasiNalog={sendUgasiNalog}></Nalog>
            )}
        </> : userData.uloga == "VODITELJ" ?
        <>
            {isShownNaslovnica && (
                <div className="naslovnica">
                    <div className="lista">
                        <p className="hZ"> Moji zahtjevi u pripremi: </p>
                        {uPripremi.length > 0 && (
                            <div className="sveNotif"> {uPripremi.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={()=>{ sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {uPripremi.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                    </div>
                    <div className="lista">
                        <p className="hZ"> Moji zahtjevi vraćeni na doradu: </p>
                        {zaDoradu.length > 0 && (
                            <div className="sveNotif"> {zaDoradu.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>

                                )
                            })}
                            </div>)}
                        {zaDoradu.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                        <p className="hZ"> Moji zahtjevi koje moram poslati na obračun: </p>
                        {zaObracun.length > 0 && (
                            <div className="sveNotif"> {zaObracun.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            {localStorage.getItem(brPutnogNaloga)}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zaObracun.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                    </div>
                    <div className="lista">
                        <p className="hZ"> Potvrdi zahtjeve: </p>
                        {zahtjeviTima.length > 0 && (
                            <div className="sveNotif"> {zahtjeviTima.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zahtjeviTima.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}

                    </div>
                    <div className="lista">
                        <p className="hZ"> Potvrdi obračune: </p>
                        {obracuniZaPotvrdu.length > 0 && (
                            <div className="sveNotif"> {obracuniZaPotvrdu.map(({ brPutnogNaloga, statusObracuna }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {statusObracuna}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsObracun(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {obracuniZaPotvrdu.length == 0 && <p>{"Nema obračuna za prikaz."}</p>}
                    </div>
                </div>)}
            {isNalog && (
                <Nalog sendUgasiNalog={sendUgasiNalog}></Nalog>
            )}
            {isObracun && (
                <Obracun sendUgasiObracun={sendUgasiObracun}></Obracun>
            )}
        </> : userData.uloga == "ZAMJENIK" ?
        <>
            {isShownNaslovnica && (
                <div className="naslovnica">
                    <div className="lista">
                        <p className="hZ"> Moji zahtjevi u pripremi: </p>
                        {uPripremi.length > 0 && (
                            <div className="sveNotif"> {uPripremi.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {uPripremi.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                    </div>
                    <div className="lista">
                        <p className="hZ"> Moji zahtjevi vraćeni na doradu: </p>
                        {zaDoradu.length > 0 && (
                            <div className="sveNotif"> {zaDoradu.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zaDoradu.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                        <p className="hZ"> Moji zahtjevi koje moram poslati na obračun: </p>
                        {zaObracun.length > 0 && (
                            <div className="sveNotif"> {zaObracun.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {<p>
                                            {prikaziObavijest(brPutnogNaloga)}
                                        </p>}
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zaObracun.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                    </div>
                    <div className="lista">
                        <p className="hZ"> Potvrdi zahtjeve: </p>
                        {zahtjeviTima.length > 0 && (
                            <div className="sveNotif"> {zahtjeviTima.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zahtjeviTima.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                    </div>
                    <div className="lista">
                        <p className="hZ"> Potvrdi obračune: </p>
                        {obracuniZaPotvrdu.length > 0 && (
                            <div className="sveNotif"> {obracuniZaPotvrdu.map(({ brPutnogNaloga, statusObracuna }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {statusObracuna}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsObracun(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {obracuniZaPotvrdu.length == 0 && <p>{"Nema obračuna za prikaz."}</p>}
                    </div>
                </div>)}
            {isNalog && (
                <Nalog sendUgasiNalog={sendUgasiNalog}></Nalog>
            )}
            {isObracun && (
                <Obracun sendUgasiObracun={sendUgasiObracun}></Obracun>
            )}
        </> : userData.uloga == "RACUNOVODA" ?
        <>
            {isShownNaslovnica && (
                <div className="naslovnica">
                    <div className="lista">
                        <p className="hZ"> Moji zahtjevi u pripremi: </p>
                        {uPripremi.length > 0 && (
                            <div className="sveNotif"> {uPripremi.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {uPripremi.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                    </div>
                    <div className="lista">
                        <p className="hZ"> Moji zahtjevi vraćeni na doradu: </p>
                        {zaDoradu.length > 0 && (
                            <div className="sveNotif"> {zaDoradu.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zaDoradu.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                        <p className="hZ"> Moji zahtjevi koje moram poslati na obračun: </p>
                        {zaObracun.length > 0 && (
                            <div className="sveNotif"> {zaObracun.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {<p>
                                            {prikaziObavijest(brPutnogNaloga)}
                                        </p>}
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zaObracun.length == 0 && <p>Nema zahtjeva za prikaz.</p>}
                    </div>
                    <div className="lista">
                        <p className="hZ"> Obračuni za odobrenje: </p>
                        {zahtjeviRadnika.length > 0 && (
                            <div className="sveNotif"> {zahtjeviRadnika.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsObracun(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zahtjeviRadnika.length == 0 && <p>Nema zahtjeva za prikaz.</p>}
                    </div>
                </div>)}
            {isNalog && (
                <Nalog sendUgasiNalog={sendUgasiNalog}></Nalog>
            )}
            {isObracun && (
                <Obracun sendUgasiObracun={sendUgasiObracun}></Obracun>
            )}
        </> : userData.uloga == "ADMIN" ?
        <>
            {isShownNaslovnica && (
                <div className="naslovnica">
                    <div className="lista">
                        <p className="hZ"> Zahtjevi za promjenom lozinke: </p>
                        {lozinke.length > 0 && (
                            <div className="sveNotif"> {lozinke.map(({ username }) => {
                                return (
                                    <div key={username} className="oneNotif">
                                        <p>
                                            Korisničko ime: @{username}
                                        </p>
                                        
                                        {
                                            <button className="buttons" onClick={() => {sendKorisnik(username); promijeniLozinku(); }}>Promijeni lozinku</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {lozinke.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                        <p className="hZ"> Moji zahtjevi u pripremi: </p>
                        {uPripremi.length > 0 && (
                            <div className="sveNotif"> {uPripremi.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {uPripremi.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                    </div>
                    <div className="lista">
                        <p className="hZ"> Moji zahtjevi vraćeni na doradu: </p>
                        {zaDoradu.length > 0 && (
                            <div className="sveNotif"> {zaDoradu.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zaDoradu.length == 0 && <p>{"Nema zahtjeva za prikaz."}</p>}
                        <p className="hZ"> Moji zahtjevi koje moram poslati na obračun: </p>
                        {zaObracun.length > 0 && (
                            <div className="sveNotif"> {zaObracun.map(({ brPutnogNaloga, status }) => {
                                return (
                                    <div key={brPutnogNaloga} className="oneNotif">
                                        <p>
                                            Putni nalog: {brPutnogNaloga}
                                        </p>
                                        <p>
                                            Status: {status}
                                        </p>
                                        {<p>
                                            {prikaziObavijest(brPutnogNaloga)}
                                        </p>}
                                        {
                                            <button className="buttons" onClick={() => { sendBrNaloga(brPutnogNaloga); showIsNalog(); }}>Otvori nalog</button>
                                        }
                                    </div>
                                )
                            })}
                            </div>)}
                        {zaObracun.length == 0 && <p>Nema zahtjeva za prikaz.</p>}
                    </div>
                </div>)}
                {isShownPromjenaLozinke &&(
                    <ObrazacZaPromjenuLozinkeKodAdmina ugasiPromjenuLozinke={ugasiPromjenuLozinke}></ObrazacZaPromjenuLozinkeKodAdmina>
                )}
            {isNalog && (
                <Nalog sendUgasiNalog={sendUgasiNalog}></Nalog>
            )}
        </> : <p>Greška ...</p>)
}

export default Naslovnica;
