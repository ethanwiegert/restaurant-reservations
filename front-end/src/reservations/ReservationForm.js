import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

import FormComponent from "./FormComponent";

function ReservationForm(){
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
      };

    const [reservation, setReservation] = useState({ ...initialFormData });
    const [formError, setFormError] = useState(null);
    
    const feature="create"
    
    return(
        <div>
            <FormComponent feature={feature} reservation={reservation} setReservation={setReservation} formError={formError} setFormError={setFormError} />

      
        </div>
    )
}

export default ReservationForm