import React from "react";

import { useHistory } from "react-router-dom";

function DisplayReservations(reservations){
   const history=useHistory()
   if(reservations){
      return reservations.map((reservation)=>(
         <div className="row">
             <p className="col-3">{reservation.first_name} {reservation.last_name}</p>
             <p className="col-3">Time: {reservation.reservation_time} People: {reservation.people}</p>
             <p className="col-3">Status: {reservation.status}</p>
             {reservation.status === "seated" ? null : (
             <a href={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-primary">Seat</a>
             )}
             <a href={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-primary">Edit</a>
         </div>
     )

     )
      
   }
}
export default DisplayReservations