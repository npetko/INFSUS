import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "./http-common";


const ObrazacZaObracun = ({ ugasiObracun , promijeniUpdate}) => {
    const brPutnogNaloga = (localStorage.getItem("brPutnogNalogaToShow"));
    const [update, setUpdate] = useState(false);
    const [buttonsShown, setButtonsShown] = useState(true);

    console.log(brPutnogNaloga);
    const navigate = useNavigate();
    const [isShownUploadFile, setIsShownUploadFile] = useState(false);
    const [isFirstSubmitButton, setIsFirstSubmitButton] = useState(true);
    const [currentFile, setCurrentFile] = useState(null);
    const [resultUpload, setResultUpload] = useState(null);
    const firstButton = () => {
        setIsFirstSubmitButton(true);
    }

    const ispisiStatus = (ispis) => {
        document.getElementById("status-obracuna").innerText = ispis;
    }

    const handleSelectFile = (event) => {
        event.preventDefault()
        console.log(event.target.files)
        setCurrentFile(event.target.files[0]);
    }

    const uploadFile = () => {
        let formData = new FormData();

        formData.append("file", currentFile);
        console.log(currentFile)
        try {
            http.post("/upload/" + trosakId, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(res => {
                if (res.status === 200 || res.status === 202) {
                    setResultUpload(res.data.message)
                }
                if (res.status === 200) { setDodanTrosak(false) } // otvori obrazac za novi trošak
            });
        } catch (err) {
            console.log(err);
        }

    }

    const secondButton = () => {
        document.getElementById("regAuto").removeAttribute("required");
        document.getElementById("km").removeAttribute("required");
        document.getElementById("vrijPolazak").removeAttribute("required");
        document.getElementById("vrijDolazak").removeAttribute("required");
        document.getElementById("opis").removeAttribute("required");
        setIsFirstSubmitButton(false);
    }

    const [dodanBoravak, setDodanBoravak] = useState(null);
    const [dodanTrosak, setDodanTrosak] = useState(false);
    const [msg, setMsg] = useState(null)
    const [isMsg, setIsMsg] = useState(null)
    const [trosakId, setTrosakId] = useState("")



    const handleDodajBoravak = (event) => {
        event.preventDefault();
        try {
            http.post("/boravak/noviBoravak", document.forms[1]).then(res => {
                if (res.data === "Uspješno unesen boravak.") {
                    setResult(false)
                    setUpdate(true);
                } setIsMsg(res.data);
            })
        } catch (err) {
            console.log(err.message);
        }
        document.getElementById("ime-drzave-boravak").value = "";
        document.getElementById("dat-dolaska-boravak").value = "";
        document.getElementById("dat-odlaska-boravak").value = "";
    }

    const handleDodajTrosak = (event) => {
        event.preventDefault();
        try {
            http.post("trosak/noviTrosak", document.forms[2]).then(res => {
                if (res.status === 200) {
                    setResult(false)
                    setUpdate(true);
                    localStorage.setItem("trosakId", res.data)
                    setIsShownUploadFile(true);
                    setIsMsg("Trošak uspješno unesen.")
                    setDodanTrosak(true)
                } else { setIsMsg(res.data); }
            })
        } catch (err) {
            console.log(err.message)
        }
        document.getElementById("opis-trosak").value = "";
        document.getElementById("iznos-trosak").value = "";
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isFirstSubmitButton === true) {
            try {
                console.log(8888)
                http.post("obracun/novi-obracun", document.forms[0]).then(res => {
                    if (res.status == 200) {
                        event.target.reset();
                        localStorage.removeItem("trosakId")
                        setIsMsg(res.data)
                        setButtonsShown(false);
                    } else if(res.status == 202) {
                        setIsMsg(res.data)
                    }
                });
            } catch (error) {
                console.log(error.message)
            }
        } else {
            ugasiObracun();
        }

    }
    const handleCategoryChangeValuta = (event) => {
        setValuta(event.target.value)
    }
    const handleTrosakIdChange = (event) => {
        event.preventDefault()
        console.log(event.target.value)
        setTrosakId(event.target.value)
    }


    const [valuta, setValuta] = useState([]);

    const [valutaList, setValutaList] = useState([]);

    const [resultValuta, setResultValuta] = useState(null);

    const [nalogList, setNalogList] = useState([]);
    const [resultNalogList, setResultNalogList] = useState(null);
    const [resultIme, setResultIme] = useState(null)
    const [ime, setIme] = useState([])
    const [result, setResult] = useState(false)
    const [nalog, setNalog] = useState([])
    let obj = { ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow") };
    const [troskovi, setTroskovi] = useState([]);
    const [resultTroskovi, setResultTroskovi] = useState([]);
    const [boravci, setBoravci] = useState([]);
    const [resultBoravci, setResultBoravci] = useState([]);
    const [drzava, setDrzava] = useState([]);
    const [drzavaList, setDrzavaList] = useState([]);
    const [resultDrzave, setResultDrzave] = useState([]);

    useEffect(() => {
        if (isMsg) {
            setMsg(isMsg)
        }
    }, [isMsg]);

    const [imaBoravaka, setImaBoravaka] = useState(false);
    const [imaTroskova, setImaTroskova] = useState(false);
    
    const fetchData = useCallback(async () => {
        try {
            const res = await http.post("svi-zahtjevi/", obj).then(async res => {
                const resultNalogList = res.data.sviZahtjevi
                setResultNalogList(resultNalogList)
                const resIme = await http.get('zaposlenici/' + resultNalogList.at(0).username).then(async resIme => {
                    console.log("1")
                    const resultIme = resIme.data
                    setResultIme(resultIme)
                    const resValuta = await http.get("trosak/popisValuta/").then(async resValuta => {
                        console.log("2")
                        const resultValuta = resValuta.data
                        setResultValuta(resultValuta)
                        const resDrzave = await http.get("/drzave").then(async resDrzave => {
                            const resultDrzave = resDrzave.data
                            setResultDrzave(resultDrzave)
                            const resTroskovi = await http.get("trosak/troskoviObracuna/" + brPutnogNaloga).then(async resTroskovi => {
                                if (resTroskovi.status == 200) {
                                    const resultTroskovi = resTroskovi.data.troskovi
                                    setResultTroskovi(resultTroskovi)
                                    setImaTroskova(true);
                                } else {
                                    setResultTroskovi([])
                                    setImaTroskova(false);
                                }

                                const resBoravci = await http.get("boravak/boravci-Zahtjeva/" + brPutnogNaloga).then(async resBoravci => {
                                    console.log("4")
                                    if (resBoravci.status == 200) {
                                        const resultBoravci = resBoravci.data.sviBoravci;
                                        setResultBoravci(resultBoravci)
                                        setImaBoravaka(true);
                                    } else {
                                        setResultBoravci([])
                                        setImaBoravaka(false);
                                    }
                                    setResult(true);
                                })
                            })
                        })

                    }
                    )

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
        if (result === true) {
            setNalog(resultNalogList.at(0));
            setIme(resultIme.at(0))
            setValutaList(resultValuta);
            setValuta(resultValuta.at(0))
            setTroskovi(resultTroskovi)
            setBoravci(resultBoravci)
            setDrzavaList(resultDrzave);
            setDrzava(resultDrzave.at(0));
            setButtonsShown(true);
        }
    }, [result]);

    useEffect(() => {
        if (update) {
            fetchData();
            setUpdate(false)
        }
    }, [update])

    const handleUgasiObracun = (event) => {
      setButtonsShown(true);
      ugasiObracun(true);
      promijeniUpdate(true);
      navigate("/dashboard")
    }

    const handleCountryChange = (event) => {
        setDrzava(event.target.value)
    }

    const brisanjeTroskovaIBoravaka = () => {
        try {
            console.log(obj)
            localStorage.removeItem("trosakId")
            http.post("/obracun/obrisiTroskoveBoravke", obj).then(res => {
                console.log(res.data)
                if (res.data === "Obračun uspješno obrisan") {
                    console.log(res.data)
                    ugasiObracun();
                    navigate("/dashboard")
                }
            })
        } catch (error) {
        }
    }

    return ((result === false) ? <p>Učitava se ...</p> :
        <>
            <h2>Zahtjev za obračun</h2>
            <div className="responsivity">


                <form id="obracun-form" onSubmit={handleSubmit}>
                    <div className="inputStyle">
                        <label className="text">Broj putnog naloga:</label>
                        <input id="brPutnogNaloga" type="text" name="brPutnogNaloga" required readOnly value={brPutnogNaloga} />
                    </div>
                    <div className="inputStyle">
                        <label className="text">Registracija: </label>
                        <input id="regAuto" type="text" name="regAuto" />
                    </div>
                    <div className="inputStyle">
                        <label className="text">Prijeđeni kilometri: </label>
                        <input id="km" type="number" name="km" />
                    </div>
                    <div className="inputStyle">
                        <label className="text">Vrijeme polaska:</label>
                        <input id="vrijPolazak" type="datetime-local" name="vrijPolazak" required defaultValue={nalog.pocPutovanja} />
                    </div>

                    <div className="inputStyle">
                        <label className="text">Vrijeme dolaska:</label>
                        <input id="vrijDolazak" type="datetime-local" name="vrijDolazak" required defaultValue={nalog.krajPutovanja} />
                    </div>
                    <div className="inputStyle">
                        <label className="text">Opis: </label>
                        <textarea id="opis" type="text" name="opis" required />
                    </div>

                </form>
            </div>
            <hr />
            <div className="boravak-trosak-container">
                <form id="boravak-form" className="boravak-trosak" onSubmit={handleDodajBoravak}>
                    <p id="boravak-naslov">Boravak: </p>
                    <input type="hidden" value={brPutnogNaloga} name="brPutnogNaloga" />
                    <div className="inputStyle">
                        <label className="text">Ime države:</label>
                        <input type="search" list="countriesDropDown" name="imeDrzave" id="ime-drzave-boravak"></input>
                        <datalist id="countriesDropDown" name="imeDrzave" onChange={handleCountryChange}>
                            {
                                drzavaList.map((cijelaDrzava) => {
                                    return (
                                        <option value={cijelaDrzava.imeDrzave}>{cijelaDrzava.imeDrzave}</option>
                                    )
                                })
                            }
                        </datalist>
                    </div>

                    <div className="inputStyle">
                        <label className="text">Datum dolaska:</label>
                        <input id="dat-dolaska-boravak" type="datetime-local" name="vrijDolazak" />
                    </div>

                    <div className="inputStyle">
                        <label className="text">Datum odlaska:</label>
                        <input id="dat-odlaska-boravak" type="datetime-local" name="vrijOdlazak" />
                    </div>
                    <button type="submit" className="submit-resetBtn">Dodaj boravak</button>
                </form>
                <div className="boravak-trosak">

                <form id="trosak-form"  onSubmit={handleDodajTrosak}>
                    <p>Trošak: </p>
                    <input type="hidden" value={brPutnogNaloga} name="brPutnogNaloga" />
                    <div className="inputStyle">
                        <label className="text">Opis:</label>
                        <input id="opis-trosak" type="text" name="opis" required />
                    </div>

                    <div className="inputStyle">
                        <label className="text">Iznos troška: </label>
                        <input id="iznos-trosak" type="text" name="iznosTroska" required />
                    </div>

                    <div className="inputStyle">
                        <label className="text">Valuta: </label>
                        <input type="search" list="category-list" name="valuta" id="valuta"></input>
                        <datalist id="category-list" name="valuta" onChange={handleCategoryChangeValuta}>
                            <option value="EUR">EUR (Europska Unija)</option>
                            {
                                valutaList.map((cijelaValuta) => {
                                    return (
                                        <option value={cijelaValuta.valuta}>{cijelaValuta.valuta} ({cijelaValuta.drzava})</option>
                                    )
                                })
                            }
                        </datalist>
                    </div>
                    <fieldset>
                        <label>Povrat novca: </label>
                        <div>
                            <input type="radio" name="refund" id="povrat-da" value="true" />
                            <label for="povrat-da">Da</label>
                        </div>
                        <div>
                            <input type="radio" name="refund" id="povrat-ne" value="false" checked />
                            <label htmlFor="povrat-ne">Ne</label>
                        </div>
                    </fieldset>
                    <button type="submit" className="submit-resetBtn">Dodaj trošak</button>
                </form>
                    <hr/>
                    {<div>
                        <div className="inputStyle">
                            <p> Datoteka(pdf, jpeg, jpg, png) za trošak #{trosakId} </p>

                            <label for="trosakId">Odaberi id troška:</label>
                            <select list="troskovi-list" name="trosakId" id="trosakId" onClick={handleTrosakIdChange} defaultValue="">
                                <option value={trosakId} ></option>
                                {
                                    troskovi.map((trosak) => {
                                        console.log(trosak)
                                        return (
                                            <option value={trosak.idTrosak}>{trosak.idTrosak}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <button className="submit-resetBtn" htmlFor="selectFile">Odaberi datoteku...</button>
                        <input disabled={trosakId === ""} id="selectFile" type="file" onChange={handleSelectFile} style={{ display: "none" }} />
                        {currentFile &&
                            <>
                                <div>
                                    <p>Odabrana datoteka</p>
                                    <ul>
                                        <li className="list-group-item">
                                            <a href={currentFile.url}>{currentFile.name}</a>
                                        </li>
                                    </ul>
                                </div>
                                <button className="submit-resetBtn"
                                    onClick={() => uploadFile(currentFile)}
                                >
                                    Pošalji
                                </button>
                            </>
                        }
                        { resultUpload && <p>{resultUpload}</p> }
                    </div>}
                </div>
            </div>
            <div>
                {buttonsShown && (
                    <>
                        <button id="predaja-obracuna-bttn" form="obracun-form" type="submit" className="submit-resetBtn" onClick={firstButton}>Predaj</button>
                        <button form="obracun-form" type="reset" className="submit-resetBtn">Reset</button>
                        <button form="obracun-form" type="button" className="submit-resetBtn" onClick={() => { brisanjeTroskovaIBoravaka(); }}>Odustani</button>
                        <button form="obracun-form" type="submit" className="submit-resetBtn" onClick={secondButton}>Nastavi kasnije</button>
                    </>
                )}
                {!buttonsShown && (
                    <button id="izadi-obracun-bttn" form="obracun-form" type="button" className="submit-resetBtn" onClick={handleUgasiObracun}>Izađi</button>
                )}

            </div>
            {msg && <p  id="status-obracuna">{msg}</p>}

            <div>
                <div>
                    <h3>Troškovi: </h3>
                    {!imaTroskova && (
                        <p className="text1">Nema troškova za prikaz.</p>
                    )}
                    <div className="sveNotif">
                        {
                            troskovi.map((trosak) => {
                                return (
                                    <>
                                        <div className="oneNotif" key={trosak.idTrosak}>
                                            <p>Id: {trosak.idTrosak}</p>
                                            <p>Opis: {trosak.opis}</p>
                                            <p>Iznos: {trosak.iznos}</p>
                                            <p>Refundacija: {trosak.refund ===true ? <>DA</>:<>NE</>}</p>
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
                <div>
                    <h3>Boravci: </h3>
                    {!imaBoravaka && (
                        <p className="text1">Nema boravaka.</p>
                    )}
                    <div className="sveNotif">
                        {
                            boravci.map((boravak) => {
                                return (
                                    <>
                                        <div className="oneNotif" key={boravak.boravakId}>
                                            <p>Država: {boravak.drzava}</p>
                                            <p>Boravak: {boravak.boravak}</p>
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </>
    )

}

export default ObrazacZaObracun;