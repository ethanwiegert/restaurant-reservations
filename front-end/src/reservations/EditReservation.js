import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory, useParams } from "react-router-dom";
import{updateReservation, readReservation} from"../utils/api"

function EditReservation(){
    const history=useHistory()
    let {reservation_id}=useParams()
    reservation_id=Number(reservation_id)

    const initialFormData = {
        reservation_id,
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
      };
    const [reservation, setReservation] = useState(null);
    const [updatedReservation, setUpdatedReservation] = useState({ ...initialFormData });
    const [formError, setFormError] = useState(null);

    useEffect(readReservation, [reservation_id])

    async function readReservation() {
        const abortController = new AbortController();
        setFormError(null)
        try {
          const response = await readReservation(reservation_id, abortController.signal);
          setReservation(response);
        } catch (e) {
          setFormError(e)
        }
        return () => {
          abortController.abort();
        };
      }
    

    
    const handleNumber = ({ target }) => {
        setUpdatedReservation({
          ...updatedReservation,
          [target.name]: Number(target.value),
        });
      };

    function handleChange({target}){
        setUpdatedReservation({
            ...updatedReservation,
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
          await updateReservation(updatedReservation, abortController.signal)  
          history.goBack()
        } catch (e){
          setFormError(e)
        }
        return () => abortController.abort();
      }
     

      /*const placeHolders = {
        first_name: `${reservation.first_name}`,
        last_name: `${reservation.last_name}`,
        mobile_number: `${reservation.mobile_number}`,
        reservation_date: `${reservation.reservation_date}`,
        reservation_time: `${reservation.reservation_time}`,
        people: `${reservation.people}`,
      };*/
   

 
    
    return(
        <div>
            <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input id="first_name" name="first_name" type="text" value={updatedReservation.first_name} onChange={handleChange} required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input id="last_name" name="last_name" type="text" value={updatedReservation.last_name} onChange={handleChange}  required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input id="mobile_number" name="mobile_number" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={updatedReservation.mobile_number} onChange={handleChange}  required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Reservation Date</label>
                <input id="reservation_date" name="reservation_date" type="date" value={updatedReservation.reservation_date} onChange={handleChange} required/>
                </div>
                
                <div className="col-md-6">
                <label className="form-label">Reservation Time</label>
                <input id="reservation_time" name="reservation_time" type="time" value={updatedReservation.reservation_time} onChange={handleChange} required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">People</label>
                <input id="people" name="people" type="number" value={updatedReservation.people} onChange={handleNumber}  required/>
                </div>

                <button type="cancel" className="btn btn-secondary mb-2" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-success mb-2">Submit</button>
            </form>

            <ErrorAlert error={formError} />
        </div>
    )
}

export default EditReservation