import React, {useState} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './style.css'
import http from "./http-common"


const PromjenaLozinke = () => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState({});
    const [isShownError, setIsShownError] = useState(false);
    const [isShownUspjeh, setIsShownUspjeh] = useState(false);

    const renderErrorMessage = (name) => name === errorMessages.name && (
        <div className="error">
            {errorMessages.message}
        </div>
    );

    const showError = () => {
        setIsShownError(true);
    };

    const hideError = () => {
        setIsShownError(false);
        hideUspjeh();
    }

    const showUspjeh = () => {
        setIsShownUspjeh(true);
    }

    const hideUspjeh = () => {
        setIsShownUspjeh(false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate("/dashboard");
        try {
            http.post("/change-password", document.forms[0]).then(res => {
                navigate("/dashboard");
                if(res.status === 202 ) {
                    console.log("Lozinka uspješno promijenjena");
                    showUspjeh();
                } else {
                    showError();
                    setErrorMessages({name: "name", message: res.data});
                }
            });
        } catch (err) {
            console.log(err.message)
        }
    };

    return (
        <>
            <div className="request">
                <h2>Promjena lozinke</h2>
                <form onSubmit={handleSubmit}>
                    <div className="inputStyle">
                        <label className="text">Korisničko ime: </label>
                        <input type="text" name="username" value={userData.username} required readOnly/>
                    </div>
                    <div className="inputStyle">
                        <label className="text">Stara zaporka: </label>
                        <input id="password" type="text" name="oldPassword" required/>
                    </div>
                    <div className="inputStyle">
                        <label className="text">Nova zaporka: </label>
                        <input id="password" type="text" name="newPassword"/>
                    </div>
                    {isShownError &&
                        renderErrorMessage("name")
                    }
                    {isShownUspjeh &&
                        <div className="error">
                            Lozinka uspješno promijenjena.
                        </div>
                    }
                    <div>
                        <button type="submit" className="submit-resetBtn" onClick={hideError}>Promjeni lozinku</button>
                        <button type="reset" className="submit-resetBtn" onClick={hideError}>Reset</button>
                    </div>
                </form>
            </div>
        </>
    );
}
export default PromjenaLozinke;