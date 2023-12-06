import React from "react";
import { useHistory } from "react-router-dom";

function SeatReservation({reservation}){
    const history=useHistory()
if(reservation.status==="booked"){
return(
    <div>
        <button href="/reservations/${reservation_id}/seat" className="btn btn-primary" onClick={()=>history.push(`/reservations/${reservation.reservation_id}/seat`)}>Seat</button>
    </div>
)
}
}

export default SeatReservation