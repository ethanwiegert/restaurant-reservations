import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";
import{createReservation} from"../utils/api"

function ReservationForm(){

    const [reservation, setReservation] = useState({});
    const [formError, setFormError] = useState([]);
    
    const history=useHistory()
    
    useEffect(()=>handleSubmit)

    function handleChange(target){
        setReservation({
            ...reservation,
            [target.name]: target.value
        })
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
         await createReservation(reservation, abortController)  
        } catch (e){
            console.log(e.name)
            setFormError(e)
        }
        return () => abortController.abort();
      }
    
    /*
    Features left to add:
    submitting saves, sends to "/dashboard"
    display error messages from API(ErrorAlert?)
    */
    
    return(
        <div>
            <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input id="first_name" name="first_name" type="text" onChange={handleChange} required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input id="last_name" name="last_name" type="text" onChange={handleChange} required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input id="mobile_number" name="mobile_number" type="tel" pattern="tel" onChange={handleChange} required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Reservation Date</label>
                <input id="reservation_date" name="reservation_date" type="date" onChange={handleChange} required/>
                </div>
                
                <div className="col-md-6">
                <label className="form-label">Reservation Time</label>
                <input id="reservation_time" name="reservation_time" type="time" onChange={handleChange} required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">People</label>
                <input id="people" name="people" type="number" onChange={handleChange} required/>
                </div>

                <button type="cancel button " className="btn btn-secondary mb-2" onClick={handleCancel}>Cancel</button>
                <button type="submit button" className="btn btn-success mb-2">Submit</button>
            </form>

            <ErrorAlert error={formError} />
        </div>
    )
}

export default ReservationForm