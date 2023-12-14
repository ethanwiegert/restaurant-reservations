import React from "react";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";
import { updateReservation, createReservation } from"../utils/api"


function FormComponent({feature, reservation, setReservation, formError, setFormError}){
    const history=useHistory()


    
    const handleNumber = ({ target }) => {
        setReservation({
          ...reservation,
          [target.name]: Number(target.value),
        });
      };

    function handleChange({target}){
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
        if(feature==="edit"){
          try{
          await updateReservation(reservation, abortController.signal)  
          history.push(`/dashboard?date=${reservation.reservation_date}`)
          } catch (e){
          setFormError(e)
          }
        return () => abortController.abort();
        }
        if(feature==="create"){
            try{
            let response=await createReservation(reservation, abortController.signal)  
            history.push(`/dashboard?date=${reservation.reservation_date}`)
            } catch (e){
            setFormError(e)
            }
        }
      }
   

 
    
    return(
        <div>
            <form className="row mt-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input className="form-control" id="first_name" name="first_name" type="text" value={reservation.first_name} onChange={handleChange} required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input className="form-control" id="last_name" name="last_name" type="text" value={reservation.last_name} onChange={handleChange}  required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input className="form-control" id="mobile_number" name="mobile_number" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={reservation.mobile_number} onChange={handleChange}  required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Reservation Date</label>
                <input className="form-control" id="reservation_date" name="reservation_date" type="date" value={reservation.reservation_date} onChange={handleChange} required/>
                </div>
                
                <div className="col-md-6">
                <label className="form-label">Reservation Time</label>
                <input className="form-control" id="reservation_time" name="reservation_time" type="time" value={reservation.reservation_time} onChange={handleChange} required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">People</label>
                <input className="form-control" id="people" name="people" type="number" value={reservation.people} onChange={handleNumber}  required/>
                </div>

                <button type="cancel" className="btn btn-secondary m-3" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-success m-3">Submit</button>
            </form>
            <ErrorAlert error={formError} />
        </div>
    )
}

export default FormComponent