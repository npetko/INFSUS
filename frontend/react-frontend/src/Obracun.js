import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common"
import fileDownload from 'js-file-download';


const Obracun = ({ sendUgasiObracun }) => {
    const [update, setUpdate] = useState(false)
    let brPutnogNaloga = localStorage.getItem("brPutnogNalogaToShow");
    let obj = { ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow") };

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    //const brPutnogNaloga = JSON.parse(localStorage.getItem("brPutnogNalogaToShow"));

    const [isStorn, setIsStorn] = useState(false);

    const handleStavljanjeStorno = (event) => {
        setIsStorn(true)
    }

    const handleOdobri = (event) => {
        //event.preventDefault()

        try {
            http.post("obracun/odobri", obj).then(res => {
                localStorage.setItem("message", JSON.stringify(res.data));
                navigate('/dashboard')
                console.log(update)
                setIsStorn(false)
                setUpdate(true)
                setResult(false)
                console.log(update)
            })

        } catch (err) {
            console.log(err)
        }
    }
    const handleStorniraj = (event) => {
        event.preventDefault();
        console.log("1")
        let razlog = document.getElementById("razlogStorn").value;
        let obj2 = {
            ["brPutnogNaloga"]: localStorage.getItem("brPutnogNalogaToShow"),
            ["razlogStorn"]: razlog
        }
        console.log("2")
        try {
            http.post("obracun/storniraj", obj2).then(res => {
                console.log("3")
                localStorage.setItem("message", JSON.stringify(res.data));
                navigate('/dashboard')
                console.log(update)
                setIsStorn(false)
                setUpdate(true)
                setResult(false)
                console.log(update)
            })
        } catch (err) {
            console.log(err)
        }
    }


    const handleObracunaj = (event) => {
        //event.preventDefault()
        try {
            http.post("obracun/statusObracunato", obj).then(res => {
                localStorage.setItem("message", JSON.stringify(res.data));
                navigate('/dashboard')
                console.log(update)
                setIsStorn(false)
                setUpdate(true)
                setResult(false)
                console.log(update)
            })

        } catch (err) {
            console.log(err)
        }
    }

    const handleDownload = () => {
        try { 
            http.get('/obracun-pdf/'+obracun.brPutnogNaloga,  {
                responseType: 'blob',
              }).then((res)=>{
                console.log(res.data)
                fileDownload(res.data, obracun.brPutnogNaloga+"-obracun.pdf")
            })
        } catch (err) {
            console.log(err)
        }
    }
    const ugasiObracun = () => {
        setIsStorn(false)
        sendUgasiObracun(true);

    }
    const [nalog, setNalog] = useState([]);
    const [resultNalog, setResultNalog] = useState(null);
    const [resultObracun, setResultObracun] = useState(null)
    const [obracun, setObracun] = useState([]);
    const [obracunList, setObracunList] = useState([]);
    const [result, setResult] = useState(false);
    const [troskovi, setTroskovi] = useState([]);
    const [resultTroskovi, setResultTroskovi] = useState([]);
    const [boravci, setBoravci] = useState([]);
    const [resultBoravci, setResultBoravci] = useState([]);
    const [obracunExtra, setObracunExtra] = useState([]);
    const [resultObracunExtra, setResultObracunExtra] = useState([]);

    const [imaBoravaka, setImaBoravaka] = useState(false);
    const [imaTroskova, setImaTroskova] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const resObracun = await http.post("obracun/svi-obracuni/", obj).then(async resObracun => {
                const resultObracun = resObracun.data.sviObracuni
                setResultObracun(resultObracun)
                console.log(resObracun.data)
                const resNalog = await http.post("svi-zahtjevi", obj).then(async resNalog => {
                    const resultNalog = resNalog.data.sviZahtjevi
                    setResultNalog(resultNalog)
                    const resTroskovi = await http.get("trosak/troskoviObracuna/" + brPutnogNaloga).then(async resTroskovi => {
                        if (resTroskovi.status == 200) {
                            const resultTroskovi = resTroskovi.data.troskovi
                            setResultTroskovi(resultTroskovi)
                            setImaTroskova(true);
                        } else {
                            setImaTroskova(false);
                            setResultTroskovi([])
                        }
                        const resBoravci = await http.get("boravak/boravci-Zahtjeva/" + brPutnogNaloga).then(async resBoravci => {
                            if (resBoravci.status == 200) {
                                setImaBoravaka(true);
                                const resultBoravci = resBoravci.data.sviBoravci;
                                setResultBoravci(resultBoravci)
                            } else {
                                setImaBoravaka(false);
                                setResultBoravci([])
                            }
                            const resObracunExtraInfo = await http.get("obracun/obracunato/" + brPutnogNaloga).then(async resObracunExtra => {
                                const resultObracunExtra = resObracunExtra.data
                                // console.log(resultObracunExtra)
                                setResultObracunExtra(resultObracunExtra)
                                setResult(true)
                            })
                        })
                    })

                })
            })

        }
        catch (error) {
            //Handle error
            console.log(error)
        }
    }, [])
    useEffect(() => {
        //Attempt to retreive data

        fetchData();
    }
        , [fetchData]);

    useEffect(() => {
        //Attempt to retreive data

        fetchData(); console.log(update)
    }
        , [update]);

    useEffect(() => {
        if (result === true) {
            setObracunList(resultObracun);
            setObracun(resultObracun.at(0))
            setNalog(resultNalog.at(0))
            setTroskovi(resultTroskovi)
            setBoravci(resultBoravci)
            setObracunExtra(resultObracunExtra)

            // console.log(resultObracunExtra)
        }
    }, [result]);


    return (!result ? <p> Učitava se ...</p> :
        <>

            {obracun.status === "ODOBREN" ?
                <>
                    <div>
                        <div>
                            <h2>Obračun naloga br. {obracun.brPutnogNaloga} </h2>

                            <p id="status-obracuna">Status: {obracun.status}</p>
                            <p>Datum putovanja: {obracun.vrijPolazak}</p>
                            <p>Datum povratka: {obracun.vrijDolazak}</p>
                            <p>Država putovanja: {nalog.drzava}</p>
                            <p>Mjesto putovanja: {nalog.mjesto}</p>
                            <p>Opis: {obracun.opis}</p>
                            <p>Registracijska oznaka automobila: {obracun.regAuto}</p>
                            <p>Akontacija: {obracunExtra.akontacija}</p>
                            <p>Prijeđeni kilometri: {obracunExtra.kilometri}</p>
                            <p>Ukupni troškovi: {obracunExtra.troskovi}</p>
                            <p>Ukupne dnevnice: {obracunExtra.dnevnice}</p>
                            <p>Isplata: {obracunExtra.isplata}</p>
                        </div>
                        <button className="submit-resetBtn" onClick={ugasiObracun}>Ugasi obračun</button>
                        <button className="submit-resetBtn" onClick={() => {
                            handleDownload();
                        }}>Preuzmi pdf prikaz</button>
                    </div>
                    <div>
                        <div>
                            <h3>Troškovi: </h3>
                            {!imaTroskova && (
                                <p className="text1">Nema troškova.</p>
                            )}
                            <div className="sveNotif">

                                {
                                    troskovi.map((trosak) => {
                                        return (
                                            <>
                                                <div className="oneNotif">
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
                                                <div className="oneNotif">
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
                </> :
                obracun.status === "SPREMAN_ZA_OBRACUN" && userData.uloga === "RACUNOVODA" ?
                    <>
                        <div>
                            <div>
                                <h2>Obračun naloga br. {obracun.brPutnogNaloga} </h2>

                                <p id="status-obracuna">Status: {"SPREMAN ZA OBRAČUN"}</p>
                                <p>Datum putovanja: {obracun.vrijPolazak}</p>
                                <p>Datum povratka: {obracun.vrijDolazak}</p>
                                <p>Država putovanja: {nalog.drzava}</p>
                                <p>Mjesto putovanja: {nalog.mjesto}</p>
                                <p>Opis: {obracun.opis}</p>
                                <p>Registracijska oznaka automobila: {obracun.regAuto}</p>
                                <p>Akontacija: {obracunExtra.akontacija}</p>
                                <p>Prijeđeni kilometri: {obracunExtra.kilometri}</p>
                                <p>Ukupni troškovi: {obracunExtra.troskovi}</p>
                                <p>Ukupne dnevnice: {obracunExtra.dnevnice}</p>
                                <p>Isplata: {obracunExtra.isplata}</p>
                            </div>
                            {isStorn && (
                                <>
                                    <form onSubmit={handleStorniraj}>
                                        <div className="inputStyle">
                                            <label className="text">Razlog storniranja: </label>
                                            <textarea name="razlogStorn" id="razlogStorn" required></textarea>
                                        </div>
                                        <button type="button" className="submit-resetBtn" onClick={handleObracunaj}>Ipak obračunaj obračun</button>
                                        <button type="submit" className="submit-resetBtn">Storniraj obračun</button>
                                        <button type="button" className="submit-resetBtn" onClick={ugasiObracun}>Ipak ugasi obračun</button>
                                    </form>

                                </>
                            )}
                            {!isStorn && (
                                <>
                                    <button id="obracunaj-obracun" className="submit-resetBtn" onClick={handleObracunaj}>Obračunaj obračun</button>
                                    <button className="submit-resetBtn" onClick={handleStavljanjeStorno}>Storniraj obračun</button>
                                    <button className="submit-resetBtn" onClick={ugasiObracun}>Ugasi obračun</button>
                                </>
                            )}

                        </div>
                        <div>
                            <div>
                                <h3>Troškovi: </h3>
                                {!imaTroskova && (
                                    <p className="text1">Nema troškova.</p>
                                )}
                                <div className="sveNotif">

                                    {
                                        troskovi.map((trosak) => {
                                            return (
                                                <>
                                                    <div className="oneNotif">
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
                                                    <div className="oneNotif">
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
                    </> :
                    obracun.status === "OBRACUNATO" && (userData.uloga === "VODITELJ" || userData.uloga === "ZAMJENIK") ?
                        <>
                            <div>
                                <div>
                                    <h2>Obračun naloga br. {"OBRAČUNATO"} </h2>

                                    <p id="status-obracuna">Status: {"OBRAČUNATO"}</p>
                                    <p>Datum putovanja: {obracun.vrijPolazak}</p>
                                    <p>Datum povratka: {obracun.vrijDolazak}</p>
                                    <p>Država putovanja: {nalog.drzava}</p>
                                    <p>Mjesto putovanja: {nalog.mjesto}</p>
                                    <p>Opis: {obracun.opis}</p>
                                    <p>Registracijska oznaka automobila: {obracun.regAuto}</p>
                                    <p>Akontacija: {obracunExtra.akontacija}</p>
                                    <p>Prijeđeni kilometri: {obracunExtra.kilometri}</p>
                                    <p>Ukupni troškovi: {obracunExtra.troskovi}</p>
                                    <p>Ukupne dnevnice: {obracunExtra.dnevnice}</p>
                                    <p>Isplata: {obracunExtra.isplata}</p>
                                </div>
                                {isStorn && (
                                    <>
                                        <form onSubmit={handleStorniraj}>
                                            <div className="inputStyle">
                                                <label className="text">Razlog storniranja: </label>
                                                <textarea name="razlogStorn" id="razlogStorn" required></textarea>
                                            </div>
                                            <button type="button" className="submit-resetBtn" onClick={handleOdobri}>Ipak dobri obračun</button>
                                            <button type="submit" className="submit-resetBtn">Storniraj obračun</button>
                                            <button type="button" className="submit-resetBtn" onClick={ugasiObracun}>Ipak ugasi obračun</button>
                                        </form>

                                    </>
                                )}
                                {!isStorn && (
                                    <>
                                        <button className="submit-resetBtn" onClick={handleOdobri}>Odobri obračun</button>
                                        <button className="submit-resetBtn" onClick={handleStavljanjeStorno}>Storniraj obračun</button>
                                        <button className="submit-resetBtn" onClick={ugasiObracun}>Ugasi obračun</button>
                                    </>
                                )}

                            </div>
                            <div>
                                <div>
                                    <h3>Troškovi: </h3>
                                    {!imaTroskova && (
                                        <p className="text1">Nema troškova.</p>
                                    )}
                                    <div className="sveNotif">

                                        {
                                            troskovi.map((trosak) => {
                                                return (
                                                    <>
                                                        <div className="oneNotif">
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
                                                        <div className="oneNotif">
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

                        :
                        <>
                            <div>
                                <div>
                                    <h2>Obračun naloga br. {obracun.brPutnogNaloga} </h2>

                                    <p id="status-obracuna">Status: {obracun.status}</p>
                                    <p>Datum putovanja: {obracun.vrijPolazak}</p>
                                    <p>Datum povratka: {obracun.vrijDolazak}</p>
                                    <p>Država putovanja: {nalog.drzava}</p>
                                    <p>Mjesto putovanja: {nalog.mjesto}</p>
                                    <p>Opis: {obracun.opis}</p>
                                    <p>Registracijska oznaka automobila: {obracun.regAuto}</p>
                                    <p>Akontacija: {obracunExtra.akontacija}</p>
                                    <p>Prijeđeni kilometri: {obracunExtra.kilometri}</p>
                                    <p>Ukupni troškovi: {obracunExtra.troskovi}</p>
                                    <p>Ukupne dnevnice: {obracunExtra.dnevnice}</p>
                                    <p>Isplata: {obracunExtra.isplata}</p>
                                </div>
                                <button className="submit-resetBtn" onClick={ugasiObracun}>Ugasi obračun</button>
                            </div>
                            <div>
                                <div>
                                    <h3>Troškovi: </h3>
                                    {!imaTroskova && (
                                        <p className="text1">Nema troškova.</p>
                                    )}
                                    <div className="sveNotif">

                                        {
                                            troskovi.map((trosak) => {
                                                return (
                                                    <>
                                                        <div className="oneNotif">
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
                                                        <div className="oneNotif">
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
                        </>}</>)



}
export default Obracun;