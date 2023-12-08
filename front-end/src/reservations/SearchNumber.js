import React, { useEffect,useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";
import {listReservations} from"../utils/api"
import useQuery from "../utils/useQuery"


function SearchNumber(){
    const query = useQuery()


    const [reservations, setReservations] = useState([]);
    const [number, setNumber] = useState(query.get("mobile_number"))
    const [formError, setFormError] = useState(null);
    const [reservationError, setReservationsError]=useState(null)
    
    const history=useHistory()
    
    useEffect(loadDashboard, [number]);
   
    function loadDashboard() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ mobile_number: number }, abortController.signal)
          .then(setReservations)
          .catch(setReservationsError);
        return () => abortController.abort();
      }

    function handleChange(target){
    setNumber(target.value)
    console.log(number)
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
        history.push(`/search?mobile_number=${number}`)
        } catch (e){
            console.log(e.name)
            setFormError(e)
        }
        return () => abortController.abort();
      }
    

    
    return(
        <div>
            <form className="row">
                <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input id="mobile_number" name="mobile_number" type="tel" value={number} onChange={handleChange} required/>
                </div>

            </form>
            <button type="cancel" className="btn btn-secondary mb-2" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="btn btn-success mb-2" onClick={handleSubmit}>Find</button>

            
            <h4>Reservations</h4>
      {reservations.map((reservation)=>(
                <div className="row" key={reservation.reservation_id}>
                    <p className="col-3">{reservation.first_name} {reservation.last_name}</p>
                    <p className="col-3">Time: {reservation.reservation_time} People: {reservation.people}</p>
                    <p className="col-3">Status: {reservation.status}</p>
                    {reservation.status === "seated" ? null : (
                    <a href={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-primary">Seat</a>
                    )}
                    <a href={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-primary">Edit</a>
                </div>
            )

            )}
    <div>
    <ErrorAlert error={reservationError} />
            <ErrorAlert error={formError} />

            
        </div>
        </div>
    )
}

export default SearchNumber