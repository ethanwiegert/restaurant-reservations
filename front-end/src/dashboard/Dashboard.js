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

  function handleNext() {
    setDateToday(next(dateToday))
    history.push(`/dashboard?date=${next(dateToday)}`);
   
  }

  function handleToday() {
    setDateToday(today)
    history.push(`/dashboard?date=${date}`);
  }

  function handlePrev() {
    setDateToday(previous(dateToday))
    history.push(`/dashboard?date=${previous(dateToday)}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {date}</h4>
      </div>
      <button className="btn btn-primary mr-2 mb-3" type="next" onClick={handleNext}>Next</button>
      <button className="btn btn-primary mr-2 mb-3" type="today" onClick={handleToday}>Today</button>
        <button className="btn btn-primary mr-2 mb-3" type="previous" onClick={handlePrev}>Previous</button>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
