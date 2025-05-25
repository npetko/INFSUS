import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ObrazacZaNalog from "./ObrazacZaNalog";
import "./style.css"
import ObrazacZaDodavanjeKorisnika from "./ObrazacZaDodavanjeKorisnika";
import Naslovnica from "./Naslovnica";
import Nalog from "./Nalog";
import MojiNalozi from "./MojiNalozi";
import MojaStatistika from "./MojaStatistika";
import PromjenaLozinke from "./PromjenaLozinke";
import ZahtjeviTim from "./ZahtjeviTim";
import ObracuniTim from "./ObracuniTim";
import AktivniNalozi from "./AktivniNalozi";
import Zaposlenici from "./Zaposlenici";
import ZakljuciGod from "./ZakljuciGod";
import MojiObracuni from "./MojiObracuni";
import NaloziSvi from "./NaloziSvi";
import ObracuniSvi from "./ObracuniSvi";
import Maticni from "./Maticni";

const Dashboard = () => {
    const navigate = useNavigate();
    var msg = ""
    if (localStorage.getItem("message")) {
        msg = localStorage.getItem("message");
        localStorage.setItem("message", "");
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(userData);


    function handleClick() {
        navigate("/login");
        localStorage.clear();
    }
    
    const [isShownNalog, setIsShownNalog] = useState(false);
    const [isShownMaticni, setIsShownMaticni] = useState(false);
    const [isShownNaloziSvi, setIsShownNaloziSvi] = useState(false);
    const [isShownObracuniSvi, setIsShownObracuniSvi] = useState(false);
    const [isShownMojiObracuni, setIsShownMojiObracuni] = useState(false);
    const [isShownZaposlenici, setIsShownZaposlenici] = useState(false);
    const [isShownZakljuciGod, setIsShownZakljuciGod] = useState(false);
    const [isShownAktivniNalozi, setIsShownAktivniNalozi] = useState(false);
    const [isShownZahtjeviTim, setIsShownZahtjeviTim] = useState(false);
    const [isShownObracuniTim, setIsShownObracuniTim] = useState(false);
    const [isShownPromjenaLoz, setIsShownPromjenaLoz] = useState(false);
    const [isShownMojiNalozi, setIsShownMojiNalozi] = useState(false);
    const [isShownMojaStatistika, setIsShownMojaStatistika] = useState(false);
    const [isShownDodajKorisnika, setIsShownDodajKorisnika] = useState(false);
    const [isNalog, setIsNalog] = useState(false); //za kad odaberes nalog da ti se prikaze
    const [isShownNaslovnica, setIsShownNaslovnica] = useState(true); //je li prikazana naslovnica
    const [isShownUserInfo, setIsShownUserInfo] = useState(false);

    
    //dobivanje informacije da netko s Naslovnice želi otvoriti neki nalog
    const closeAllWindows = () => { // svaki put treba zatvoriti sve u info-containeru da bi se otvorio zeljeni prozor u showProzor
        setIsNalog(false); // -> otvoren neki random nalog
        setIsShownNaslovnica(false); // -> otvorena naslovnica
        setIsShownNalog(false); // -> otvoren nalog za upis
        setIsShownDodajKorisnika(false); // -> otvoreno za dodavanje korisnika
        setIsShownMojaStatistika(false); // -> otvorena statistika
        setIsShownMojiNalozi(false); // -> otvoreno moji nalozi
        setIsShownPromjenaLoz(false); // -> otvoreno promjena lozinke
        setIsShownZahtjeviTim(false); // -> otvoreni zahtjevi tima
        setIsShownObracuniTim(false); // -> otvoreni obracuni tima
        setIsShownAktivniNalozi(false); // -> otvoreno aktivni nalozi
        setIsShownZaposlenici(false); // -> otvoreni zaposlenike
        setIsShownZakljuciGod(false); // -> otvoreno zakljucavanje godine
        setIsShownMojiObracuni(false); // -> otvoreno moji obracuni
        setIsShownNaloziSvi(false); // -> otvoreno svi nalozi
        setIsShownObracuniSvi(false); // -> otvoreno svi obracuni
        setIsShownMaticni(false); // -> otvoreno svi obracuni
        setIsShownUserInfo(false);
    }

    //otvori moje sve naloge
    const showMojiNalozi = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownMojiNalozi(true);
    };

    //otvori moje obracune
    const showMojiObracuni = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownMojiObracuni(true);
    };
    //otvori sve aktivne naloge
    const showAktivniNalozi = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownAktivniNalozi(true);
    };

    //otvori zatrazi promjenu lozinke
    const showPromjenaLoz = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownPromjenaLoz(true);
    };

    //otvori zaposlenike
    const showZaposlenici = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownZaposlenici(true);
    };

    //otvori zakljucavanje godine
    const showZakljuciGod = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownZakljuciGod(true);
    };

    //otvori moju statistiku
    const showMojaStatistika = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownMojaStatistika(true);
    };

    //otvori zahtjeve mojeg tima
    const showZahtjeviTim = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownZahtjeviTim(true);
    };

    //otvori obracune mojeg tima
    const showObracuniTim = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownObracuniTim(true);
    };

    
    //stvori nalog
    const showNalog = event => {
        closeAllWindows(); //treba sve moguće prozore onemogućiti
        setIsShownNalog(true);
    };

    
    //dodaj korisnika
    const showDodajKorisnika = event => {
        closeAllWindows();
        setIsShownDodajKorisnika(true);
        setOdustani(true)
    }

    // otvori neki nalog postojeći
    const showIsNalog = event => {
        closeAllWindows();
        setIsNalog(true);
    };

    //prikazi naslovnicu
    const showNaslovnica = event => {
        closeAllWindows();
        setIsShownNaslovnica(true);
    };

    //prikazi sve naloge
    const showNaloziSvi = event => {
        closeAllWindows();
        setIsShownNaloziSvi(true);
    };

    //prikazi sve obracune
    const showObracuniSvi = event => {
        closeAllWindows();
        setIsShownObracuniSvi(true);
    };

    //prikazi maticne
    const showMaticni = event => {
        closeAllWindows();
        setIsShownMaticni(true);
    };

    const showUserInfo = event => {
        closeAllWindows();
        setIsShownUserInfo(true);
    };

    if (userData.uloga == "ZAPOSLENIK") {
        return (
            <>
                <div className="nav-bar">
                    <img className="logo" src="logo.svg" alt="logo"/>
                    <button className="responsiveBtn" onClick={showUserInfo}>☰</button>
                    <button className="logoutBtn" onClick={handleClick}>Odjava</button>
                </div>

                <div className="row">

                    {
                        isShownUserInfo && (
                            <div className="user-containershow">

                                <div className="user-info">
                                    <img src={require('./sstanic.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: {userData.uloga}</p>

                                </div>
                                <div className="user-options">
                                    <button  className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button id="moji-nalozi-bttn" className="optionsBtn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button  className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button  className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button  className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                </div>
                            </div>
                        )
                    }



                    {
                        !isShownUserInfo && (
                            <div className="user-container">

                                <div className="user-info">
                                    <img src={require('./sstanic.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: {userData.uloga}</p>

                                </div>
                                <div className="user-options">
                                    <button  className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button id="moji-nalozi-bttn" className="optionsBtn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button  className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button  className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button  className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                </div>
                            </div>
                        )
                    }

                    <div className="info-container">
                        {isShownNaslovnica && (
                            <Naslovnica></Naslovnica>)
                        }
                        {isShownNalog && (
                            <ObrazacZaNalog></ObrazacZaNalog>
                        )}
                        {isShownMojiNalozi && (
                            <MojiNalozi></MojiNalozi>
                        )}
                        {isShownMojiObracuni && (
                            <MojiObracuni></MojiObracuni>
                        )}
                        {isShownMojaStatistika && (
                            <MojaStatistika></MojaStatistika>
                        )}
                        {isShownPromjenaLoz && (
                            <PromjenaLozinke></PromjenaLozinke>
                        )}
                        <p>{msg.replaceAll("\"", "")}</p>

                    </div>
                </div>
            </>
        );
    }

    if (userData.uloga == "VODITELJ") {
        return (
            <>
                <div className="nav-bar">
                    <img className="logo" src="logo.svg" alt="logo"/>
                    <button className="responsiveBtn" onClick={showUserInfo}>☰</button>
                    <button className="logoutBtn" onClick={handleClick}>Odjava</button>
                </div>
                <div className="row">

                    {
                        isShownUserInfo && (
                            <div className="user-containershow">

                                <div className="user-info">
                                    <img src={require('./voditelj.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: {userData.uloga}</p>

                                </div>
                                <div className="user-options">
                                    <button  className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button  className="optionsBtn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button  className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button  className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                    <button className="optionsBtn" onClick={showZahtjeviTim}>Pregledaj putne naloge tima</button>
                                    <button  className="optionsBtn" onClick={showObracuniTim}>Pregledaj obračune putnih naloga tima</button>
                                </div>
                            </div>
                        )
                    }

                    {
                        !isShownUserInfo && (
                            <div className="user-container">

                                <div className="user-info">
                                    <img src={require('./voditelj.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: {userData.uloga}</p>

                                </div>
                                <div className="user-options">
                                    <button className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button  className="optionsBtn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button  className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button  className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button  className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                    <button   className="optionsBtn" onClick={showZahtjeviTim}>Pregledaj putne naloge tima</button>
                                    <button  className="optionsBtn" onClick={showObracuniTim}>Pregledaj obračune putnih naloga tima</button>
                                </div>
                            </div>
                        )
                    }


                    <div className="info-container">
                        {isShownNaslovnica && (
                            <Naslovnica></Naslovnica>)
                        }
                        {isShownNalog && (
                            <ObrazacZaNalog></ObrazacZaNalog>
                        )}
                        {isShownMojiNalozi && (
                            <MojiNalozi></MojiNalozi>
                        )}
                        {isShownMojaStatistika && (
                            <MojaStatistika></MojaStatistika>
                        )}
                        {isShownPromjenaLoz && (
                            <PromjenaLozinke></PromjenaLozinke>
                        )}
                        {isShownZahtjeviTim && (
                            <ZahtjeviTim></ZahtjeviTim>
                        )}
                         {isShownObracuniTim && (
                            <ObracuniTim></ObracuniTim>
                        )}
                        {isShownMojiObracuni && (
                            <MojiObracuni></MojiObracuni>
                        )}
                        <p>{msg.replaceAll("\"", "")}</p>
                    </div>
                </div>
            </>
        );
    }

    if (userData.uloga == "ZAMJENIK") {
        return (
            <>
                <div className="nav-bar">
                    <img className="logo" src="logo.svg" alt="logo"/>
                    <button className="responsiveBtn" onClick={showUserInfo}>☰</button>
                    <button className="logoutBtn" onClick={handleClick}>Odjava</button>
                </div>

                <div className="row">

                    {
                        isShownUserInfo && (
                            <div className="user-containershow">

                                <div className="user-info">
                                    <img src={require('./zamjenik.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: {userData.uloga}</p>

                                </div>
                                <div className="user-options">
                                    <button className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button className="optionsBtn" id="moji-nalozi-bttn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                    <button className="optionsBtn" onClick={showZahtjeviTim}>Pregledaj putne naloge tima</button>
                                    <button className="optionsBtn" onClick={showObracuniTim}>Pregledaj obračune putnih naloga tima</button>
                                </div>
                            </div>
                        )
                    }

                    {
                        !isShownUserInfo && (
                            <div className="user-container">

                                <div className="user-info">
                                    <img src={require('./zamjenik.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: {userData.uloga}</p>

                                </div>
                                <div className="user-options">
                                    <button  className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button id="moji-nalozi-bttn" className="optionsBtn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button  className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button  className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                    <button  className="optionsBtn" onClick={showZahtjeviTim}>Pregledaj putne naloge tima</button>
                                    <button  className="optionsBtn" onClick={showObracuniTim}>Pregledaj obračune putnih naloga tima</button>
                                </div>
                            </div>
                        )
                    }
                            <div className="info-container">
                                {isShownNaslovnica && (
                                    <Naslovnica></Naslovnica>)
                                }
                                {isShownNalog && (
                                    <ObrazacZaNalog></ObrazacZaNalog>
                                )}
                                {isShownMojiNalozi && (
                                    <MojiNalozi></MojiNalozi>
                                )}
                                {isShownMojaStatistika && (
                                    <MojaStatistika></MojaStatistika>
                                )}
                                {isShownPromjenaLoz && (
                                    <PromjenaLozinke></PromjenaLozinke>
                                )}
                                {isShownZahtjeviTim && (
                                    <ZahtjeviTim></ZahtjeviTim>
                                )}
                                {isShownObracuniTim && (
                                    <ObracuniTim></ObracuniTim>
                                )}
                                {isShownMojiObracuni && (
                                    <MojiObracuni></MojiObracuni>
                                )}
                                <p>{msg.replaceAll("\"", "")}</p>
                            </div>
                </div>
            </>
        );
    }

    if (userData.uloga === "RACUNOVODA") {
        return (
            <>
                <div className="nav-bar">
                    <img className="logo" src="logo.svg" alt="logo"/>
                    <button className="responsiveBtn" onClick={showUserInfo}>☰</button>
                    <button className="logoutBtn" onClick={handleClick}>Odjava</button>
                </div>
                <div className="row">

                    {
                        isShownUserInfo && (
                            <div className="user-containershow">

                                <div className="user-info">
                                    <img src={require('./praviRacunovoda.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: RAČUNOVOĐA</p>

                                </div>
                                <div className="user-options">
                                    <button  className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button  className="optionsBtn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button  className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button  className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button  className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                    <button  className="optionsBtn" onClick={showNaloziSvi}>Pregledaj sve putne naloge</button>
                                    <button id="racunovoda-svi-obracuni" className="optionsBtn" onClick={showObracuniSvi}>Pregledaj sve obračune</button>
                                </div>
                            </div>
                        )
                    }

                    {
                        !isShownUserInfo && (
                            <div className="user-container">

                                <div className="user-info">
                                    <img src={require('./praviRacunovoda.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: RAČUNOVOĐA</p>

                                </div>
                                <div className="user-options">
                                    <button  className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button  className="optionsBtn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button  className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button  className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                    <button  className="optionsBtn" onClick={showNaloziSvi}>Pregledaj sve putne naloge</button>
                                    <button id="racunovoda-svi-obracuni" className="optionsBtn" onClick={showObracuniSvi}>Pregledaj sve obračune</button>
                                </div>
                            </div>
                        )
                    }

                    <div className="info-container">
                        {isShownNaslovnica && (
                            <Naslovnica></Naslovnica>)
                        }

                        {isShownNalog && (
                            <ObrazacZaNalog></ObrazacZaNalog>
                        )}

                        {isShownMojiNalozi && (
                            <MojiNalozi></MojiNalozi>
                        )}
                        {isShownMojaStatistika && (
                            <MojaStatistika></MojaStatistika>
                        )}
                        {isShownPromjenaLoz && (
                            <PromjenaLozinke></PromjenaLozinke>
                        )}
                        {isShownAktivniNalozi && (
                            <AktivniNalozi></AktivniNalozi>
                        )}
                        {isShownMojiObracuni && (
                            <MojiObracuni></MojiObracuni>
                        )}
                        {isShownObracuniSvi && (
                            <ObracuniSvi></ObracuniSvi>
                        )}
                        {isShownNaloziSvi && (
                            <NaloziSvi></NaloziSvi>
                        )}
                        <p>{msg.replaceAll("\"", "")}</p>

                    </div>


                </div>
            </>
        );
    }

    if (userData.uloga === "ADMIN") {
        return (
            <>
                <div className="nav-bar">
                    <img className="logo" src="logo.svg" alt="logo"/>
                    <button className="responsiveBtn" onClick={showUserInfo}>☰</button>
                    <button className="logoutBtn" onClick={handleClick}>Odjava</button>
                </div>
                <div className="row">
                    {
                        isShownUserInfo && (
                            <div className="user-containershow">

                                <div className="user-info">
                                    <img src={require('./racunovoda.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: {userData.uloga}</p>

                                </div>
                                <div className="user-options">
                                    <button  className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button  className="optionsBtn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button  className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button  className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                    <button  className="optionsBtn" onClick={showZaposlenici}>Pregled zaposlenika</button>
                                    <button  className="optionsBtn" onClick={showNaloziSvi}>Pregledaj sve putne naloge</button>
                                    <button   className="optionsBtn" onClick={showObracuniSvi}>Pregledaj sve obračune</button>
                                    <button  className="optionsBtn" onClick={showDodajKorisnika}>Dodaj korisnika</button>
                                    <button  className="optionsBtn" onClick={showZakljuciGod}>Zaključi poslovnu godinu</button>
                                    <button  className="optionsBtn" onClick={showMaticni}>Matični podaci</button>
                                </div>
                            </div>
                        )
                    }

                    {
                        !isShownUserInfo && (
                            <div className="user-container">

                                <div className="user-info">
                                    <img src={require('./racunovoda.jpg')} alt="profile" className="profileImg"/>
                                    <p>@{userData.username}</p>
                                    <p>E-mail: {userData.email}</p>
                                    <p>Ime i prezime: {userData.ime} {userData.prezime}</p>
                                    <p>OIB: {userData.oib}</p>
                                    <p>Uloga: {userData.uloga}</p>

                                </div>
                                <div className="user-options">
                                    <button  className="optionsBtn" onClick={showNaslovnica}>Naslovnica</button>
                                    <button  className="optionsBtn" onClick={showMojiNalozi}>Pregled mojih naloga</button>
                                    <button  className="optionsBtn" onClick={showMojiObracuni}>Pregled mojih obračuna</button>
                                    <button  className="optionsBtn" onClick={showNalog}>Stvori novi nalog</button>
                                    <button  className="optionsBtn" onClick={showPromjenaLoz}>Promjena lozinke</button>
                                    <button  className="optionsBtn" onClick={showZaposlenici}>Pregled zaposlenika</button>
                                    <button  className="optionsBtn" onClick={showNaloziSvi}>Pregledaj sve putne naloge</button>
                                    <button  className="optionsBtn" onClick={showObracuniSvi}>Pregledaj sve obračune</button>
                                    <button className="optionsBtn" onClick={showDodajKorisnika}>Dodaj korisnika</button>
                                    <button className="optionsBtn" onClick={showZakljuciGod}>Zaključi poslovnu godinu</button>
                                    <button  className="optionsBtn" onClick={showMaticni}>Matični podaci</button>
                                </div>
                            </div>
                        )
                    }

                    <div className="info-container">
                        
                        {isShownNaslovnica && (
                            <Naslovnica></Naslovnica>)
                        }

                        {isShownNalog && (
                            <ObrazacZaNalog></ObrazacZaNalog>
                        )}
                        
                        {isShownMojiNalozi && (
                            <MojiNalozi></MojiNalozi>
                        )}
                        {isShownDodajKorisnika &&
                            (<ObrazacZaDodavanjeKorisnika ></ObrazacZaDodavanjeKorisnika>)}
                        
                        {isShownMojaStatistika && (
                            <MojaStatistika></MojaStatistika>
                        )}
                        {isShownPromjenaLoz && (
                            <PromjenaLozinke></PromjenaLozinke>
                        )}
                        {isShownZaposlenici && (
                            <>
                            <p>{msg.replaceAll("\"", "")}</p>
                            <Zaposlenici></Zaposlenici>
                            </>
                        )}
                        {isShownZakljuciGod && (
                            <ZakljuciGod></ZakljuciGod>
                        )}
                        {isShownMojiObracuni && (
                            <MojiObracuni></MojiObracuni>
                        )}
                        {isShownObracuniSvi && (
                            <ObracuniSvi></ObracuniSvi>
                        )}
                        {isShownNaloziSvi && (
                            <NaloziSvi></NaloziSvi>
                        )}
                        {isShownMaticni && (
                            <Maticni></Maticni>
                        )}
                        {!isShownZaposlenici && (
                            <p>{msg.replaceAll("\"", "")}</p>
                        )}
                        

                    </div>


                </div>
            </>
        );
    }
};
export default Dashboard;