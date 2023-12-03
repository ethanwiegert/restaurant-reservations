import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";
import{searchMobileNumber} from"../utils/api"
import DisplayReservations from "./DisplayReservations"

function SearchNumber(){

    const [reservations, setReservations] = useState([]);
    const [number, setNumber] = useState(null)
    const [formError, setFormError] = useState([]);
    
    const history=useHistory()
    
   

    function handleChange(target){
        setNumber(number)
    }
  

   function handleCancel(event){
        event.preventDefault()
        history.goBack()
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController();
        setFormError(null);
        try{
        let response= await searchMobileNumber(number, abortController)  
        setReservations(response)
        } catch (e){
            console.log(e.name)
            setFormError(e)
        }
        return () => abortController.abort();
      }
    

    
    return(
        <div>
            <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input id="mobile_number" name="mobile_number" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={number} onChange={handleChange} required/>
                </div>

                <button type="cancel button " className="btn btn-secondary mb-2" onClick={handleCancel}>Cancel</button>
                <button type="submit button" className="btn btn-success mb-2">Submit</button>
            </form>

            <DisplayReservations reservations={reservations} />
            <ErrorAlert error={formError} />

            
        </div>
    )
}

export default SearchNumber