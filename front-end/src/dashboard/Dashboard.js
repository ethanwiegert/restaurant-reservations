import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {today, next, previous} from "../utils/date-time"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  const history=useHistory()

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [dateToday, setDateToday] = useState(date)
  
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handleNextDay = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${next(dateToday)}`);
    setDateToday(next(dateToday))
    console.log(dateToday)
  }

  const handleToday = (event) =>{
    event.preventDefault();
    history.push(`/dashboard?date=${today()}`);
    setDateToday(today())
    console.log(dateToday)
  }

const handlePreviousDay = (event) => {
  event.preventDefault();
  history.push(`/dashboard?date=${previous(dateToday)}`);
  setDateToday(previous(dateToday))
  console.log(dateToday)
}

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <button onClick={handleNextDay}>Next Day</button>
      <button onClick={handleToday}>Today</button>
      <button onClick={handlePreviousDay}>Previous Day</button>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
