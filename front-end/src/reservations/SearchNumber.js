import React, { useEffect,useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";
import {listReservations} from"../utils/api"
import useQuery from "../utils/useQuery"


function SearchNumber(){
    const history=useHistory()
    const query = useQuery()


    const [reservations, setReservations] = useState([]);
    const [number, setNumber] = useState(query.get("mobile_number"))
    const [formError, setFormError] = useState(null);
    const [reservationError, setReservationsError]=useState(null)
    
    
    
    useEffect(loadDashboard, []);
   
    function loadDashboard() {
        const abortController = new AbortController();
        setReservationsError(null);
        if (number) {
        listReservations({ mobile_number: number }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
        }
        return () => abortController.abort();
        }

      function handleCancel(event){
        event.preventDefault()
        history.goBack()
    }

      function handleChange({target}){
        setNumber(target.value)
        }
    
     async function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController();
        setFormError(null);
        try{
        history.push(`/search?mobile_number=${number}`)
        await  loadDashboard()
        } catch (e){
            console.log(e.name)
            setFormError(e)
        }
        return () => abortController.abort();
      }
    

    
    return(
        <div>
            <form className="row mt-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input className="form-control" id="mobile_number" name="mobile_number" type="tel" value={number} onChange={handleChange} required/>
                </div>
                <button type="cancel" className="btn btn-secondary m-3" onClick={handleCancel}>Cancel</button>
                <button  type="submit" className="btn btn-success m-3">Find</button>
            </form>
           

            {reservations.length === 0 ? null : (
                    <h4>Reservations</h4>
                    )}
          {reservations.map((reservation)=>(
                <div className="row border m-3" key={reservation.reservation_id}>
               
                    <p className="col-2 m-2">{reservation.first_name} {reservation.last_name}</p>
                    <p className="col-2 m-2">Time: {reservation.reservation_time} People: {reservation.people}</p>
                    <p className="col-2 m-2">Status: {reservation.status}</p>
                    <div className="col-auto">
                    {reservation.status === "seated" ? null : (
                    <a href={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-primary m-2">Seat</a>
                    )}
                    <a href={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-secondary m-2">Edit</a>
                    <button data-reservation-id-cancel={reservation.reservation_id} onClick={() => {handleCancel(reservation.reservation_id);}} className="btn btn-danger m-2">Cancel</button>
                    </div>
                    
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