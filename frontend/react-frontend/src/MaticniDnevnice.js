import React, { useState, useCallback, useMemo, useEffect } from "react";

import './style.css';
import http from "./http-common";
import { Navigate, useNavigate } from "react-router-dom";
import EditDrzava from "./editDrzava";

const MaticniDnevnice = () => {

    const [podaciList, setPodaciList] = useState([]);
    const [result, setResult] = useState(null);
    const [editingDrzava, setEditingDrzava] = useState(null);
    
    const fetchData = useCallback(async () => {
        try {
            const res = await http.get("/drzave");
            const result = res.data
            if (result) {
                setResult(result)
            }
            else {
                throw (error)
            }
        }
        catch (error) {
        }
        }, [])

        useEffect(() => {
            fetchData();
        }, [fetchData]);

        useEffect(() => {
            if(result) {
                setPodaciList(result);
                console.log(podaciList.at(0))
            }
        }, [result]);

    const ime = (ime) => {
        var words = ime.split(" ");
        for (var i = 0; i < words.length; i++) {
            words[i] += " ";
        }
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i].toLowerCase();
            words[i] = words[i].charAt(0).toUpperCase()+words[i].slice(1);
        }
        var drzava = "";
        for (var i = 0; i < words.length; i++) {
            drzava += words[i]
        }
        return drzava
    }

    const [selectedCategoryIme, setSelectedCategoryIme] = useState();

    function getFilteredList() {
        if(!selectedCategoryIme) {
            return podaciList;
        }
        return podaciList.filter((item) => (item.imeDrzave).toLowerCase().includes(selectedCategoryIme.toLowerCase()));
    }

    var filteredList =  useMemo(getFilteredList, [selectedCategoryIme,  podaciList]);

    function handleCategoryChangeIme(event) {
        setSelectedCategoryIme(event.target.value);
    }

    const handleSave = (updated) => {
        setPodaciList((old) =>
            old.map((d) => (d.sifraDrzave === updated.sifraDrzave ? updated : d))
        );
        setEditingDrzava(null);
    };

    const handleDelete = (updated) => {
        setPodaciList((old) =>
            old.map((d) => (d.sifraDrzave === updated.sifraDrzave ? updated : d))
        );
        setEditingDrzava(null);
    };

    return(result ?
        <>
            <div> Naknada za korištenje vlastitog automobila je 1.50 EUR po danu.</div>
            <div className="filteri">
                <div className="upisBroja">
                        <label >Pretraži po državi:  </label>
                        <input onChange={handleCategoryChangeIme}/>
                </div>
            </div>
            {editingDrzava && (
                <EditDrzava
                drzava={editingDrzava}
                onSave={handleSave}
                onCancel={() => setEditingDrzava(null)}
                onDelete={handleDelete}
                />
            )}
            <div className="sveNotif">
            {
                filteredList.map((drzava) => {
                    return(
                        <button className="dnevnice" key={drzava.sifraDrzave} onClick={() => setEditingDrzava(drzava)}>
                            <div> ID: {drzava.sifraDrzave}</div>
                            <div> Država: {ime(drzava.imeDrzave)}</div>
                            <div> Dnevnica: {drzava.dnevnica}</div>
                        </button>
                    )
                })
            }
            </div>
        </>
        :<p>Učitava se...</p>
    )
}

export default MaticniDnevnice;