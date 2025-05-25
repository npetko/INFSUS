import React from "react";
import http from "./http-common";

const ObrazacZaPromjenuLozinkeKodAdmina = ({ ugasiPromjenuLozinke}) => {

    const ispisiStatus = (ispis) => {
        document.getElementById("status-lozinke").innerText = ispis;
    }

    const korisnik = JSON.parse(localStorage.getItem("korisnikToShow"))

    const handlePromjenuLozinke = (event) => {
        event.preventDefault();
        try {
            http.post("/promjena-lozinke", document.forms[0]).then(res => {
                if(res.data === "Zaporka je promijenjena") {
                    event.target.reset();
                } else {

                }
                ispisiStatus(res.data);
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    return(
        <>
            <form onSubmit={handlePromjenuLozinke}>
                <div className="inputStyle">
                    <label className="text">Korisničko ime: </label>
                    <input type="text" name="username" required readOnly value={korisnik.username}/>
                </div>
                <div className="inputStyle">
                    <label className="text">Nova lozinka: </label>
                    <input type="text" name="password" required/>
                </div>
                <button type="submit" className="submit-resetBtn">Predaj</button>
                <button type="reset" className="submit-resetBtn">Reset</button>
                <button type="button" className="submit-resetBtn" onClick={ugasiPromjenuLozinke}>Odustani</button>
            </form>
            <p id="status-lozinke"></p>
        </>
    )
}

export default ObrazacZaPromjenuLozinkeKodAdmina;