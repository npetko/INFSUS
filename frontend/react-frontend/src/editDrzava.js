import React, { useState } from "react";
import http from "./http-common";

const EditDrzava = ({ drzava, onSave, onCancel }) => {
   const [sifraDrzave, setSifraDrzave] = useState(drzava.sifraDrzave);
   const [imeDrzave, setImeDrzave] = useState(drzava.imeDrzave);
   const [dnevnica, setDnevnica]   = useState(drzava.dnevnica);
   const [loading, setLoading]     = useState(false);
   const [error, setError]         = useState(null);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const { data } = await http.put(`/drzave/${drzava.sifraDrzave}`, {
         sifraDrzave,
         imeDrzave,
         dnevnica,
         });
      } catch (err) {
         setError("Greška pri spremanju.");
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async () => {
      setLoading(true);
      try {
         await http.delete(`/drzave/${drzava.sifraDrzave}`);
      } catch (err) {
         setError("Greška pri brisanju.");
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="edit-form">
         <h2>Uredi državu: {drzava.imeDrzave}</h2>

         {error && <p className="error">{error}</p>}

         <div>
         <label>Država:</label>
         <input
            value={imeDrzave}
            onChange={(e) => setImeDrzave(e.target.value)}
            required
         />
         </div>

         <div>
         <label>Dnevnica:</label>
         <input
            type="string"
            value={dnevnica}
            onChange={(e) => setDnevnica(e.target.value)}
            required
         />
         </div>

         <button type="submit" disabled={loading}>
         {loading ? "Spremam..." : "Spremi"}
         </button>
         <button type="button" onClick={onCancel} disabled={loading}>
            Odustani
         </button>
         <button
         type="button"
         onClick={handleDelete}
         disabled={loading}
         style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}
         >
         {loading ? "Brisanje..." : "Obriši"}
         </button>
      </form>
   );
};

export default EditDrzava;