import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {today, next, previous} from "../utils/date-time"
import useQuery from "../utils/useQuery"

import CheckOccupied from "./CheckOccupied"
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  const history=useHistory()
  const query = useQuery()

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [dateToday, setDateToday] = useState(query.get("date") || today());
  const [tables, setTables]=useState([])
  const [tablesError, setTablesError]=useState(null)
  
  useEffect(loadDashboard, [dateToday]);
  useEffect(loadTables, [])

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: dateToday }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  function loadTables() {
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  function handleNext() {
    setDateToday(next(dateToday))
    history.push(`/dashboard?date=${next(dateToday)}`);
   
  }

  function handleToday() {
    setDateToday(today())
    history.push(`/dashboard?date=${today()}`);
  }

  function handlePrev() {
    setDateToday(previous(dateToday))
    history.push(`/dashboard?date=${previous(dateToday)}`);
  }

  function handleOccupied(tables){
    tables.forEach((table)=>{
      if(table.reservation_id===null){
        table.reservation_id="Free"
      }
      table.reservation_id="Occupied"
    })
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date {dateToday}</h4>
      </div>
      <button className="btn btn-primary mr-2 mb-3" type="next" onClick={handleNext}>Next</button>
      <button className="btn btn-primary mr-2 mb-3" type="today" onClick={handleToday}>Today</button>
        <button className="btn btn-primary mr-2 mb-3" type="previous" onClick={handlePrev}>Previous</button>
      <ErrorAlert error={reservationsError} />
      <h4>Reservations</h4>
      {reservations.map((reservation)=>(
                <div className="row">
                    <p className="col-4">{reservation.first_name} {reservation.last_name}</p>
                    <p className="col-5">Time: {reservation.reservation_time} People: {reservation.people}</p>
                    <button href="/reservations/${reservation_id}/seat" className="btn btn-primary" onClick={()=>history.push(`/reservations/${reservation.reservation_id}/seat`)}>Seat</button>
                </div>
            )

            )}
      <h4>Tables</h4>
      {tables.map((table)=>(
                <div className="row">
                    <p className="col-4">{table.table_name}</p>
                    <p className="col-5">Capacity: {table.capacity}</p>
                    <div id="data-table-id-status=${table.table_id}"><CheckOccupied reserved={table.reservation_id}/></div>
                </div>
            )

            )}

      <ErrorAlert error={tablesError} />


    </main>
  );
}

export default Dashboard;
