import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

import {  useParams } from "react-router-dom";
import { readReservation} from"../utils/api"
import {formatAsDate} from "../utils/date-time"
import FormComponent from "./FormComponent";

function EditReservation(){

    let {reservation_id}=useParams()
    reservation_id=Number(reservation_id)

    const [reservation, setReservation] = useState({});
    const [formError, setFormError] = useState(null);

    useEffect(initialReservation, [reservation_id])

    async function initialReservation() {
        const abortController = new AbortController();
        setFormError(null)
        try {
          const response = await readReservation(reservation_id, abortController.signal);
          response.reservation_date = formatAsDate(response.reservation_date)
          setReservation(response);
          console.log("read reservation", reservation)
        } catch (e) {
          setFormError(e)
        }
        return () => {
          abortController.abort();
        };
      }

      const feature="edit"

 
    
    return(
        <div>
            <FormComponent feature={feature} reservation={reservation} setReservation={setReservation} formError={formError} setFormError={setFormError} />

          
        </div>
    )
}

export default EditReservation