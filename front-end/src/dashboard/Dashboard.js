import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { listReservations, listTables, deleteTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {today, next, previous} from "../utils/date-time"
import useQuery from "../utils/useQuery"




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

  const [finishTableError, setFinishTableError] = useState(null)
  
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

  function handleFinish(id) {
    setFinishTableError(null)
    const abortController = new AbortController();
    const deletePromt = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
    if(deletePromt) {
    deleteTable(id, abortController.signal)
    //.then((history.push(`/`)))
    .then(window.location.reload()) 
    //.catch((e)=>setFinishTableError(e))
    }
}

function handleCancel(reservation){
  setReservationsError(null)
  const abortController = new AbortController();
  const deletePromt = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
    if(deletePromt) {
    deleteTable(reservation.status, abortController.signal)
}
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
                <div className="row" key={reservation.reservation_id}>
                    <p className="col-3">{reservation.first_name} {reservation.last_name}</p>
                    <p className="col-3">Time: {reservation.reservation_time} People: {reservation.people}</p>
                    <p className="col-3">Status: {reservation.status}</p>
                    {reservation.status === "seated" ? null : (
                    <a href={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-primary">Seat</a>
                    )}
                    <a href={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-primary">Edit</a>
                    <a className="btn btn-primary">Cancel</a>
                </div>
            )

            )}
    <div>
      <h4>Tables</h4>
      {tables.map((table) => (
                <div className="row" key={table.table_id}>
                    <p className="col-4">{table.table_name}</p>
                    <p className="col-5">Capacity: {table.capacity}</p>
                    {table.reservation_id === null ? <p id={`data-table-id-status=${table.table_id}`}>Free</p> : <p id={`data-table-id-status=${table.table_id}`}>Occupied</p>}
                    {table.reservation_id !== null && (
                    <button type="button" className="btn btn-primary ml-4" data-table-id-finish={table.table_id} onClick={() => {handleFinish(table.table_id);}}>Finish</button>)}
                    </div>
                    ))}
                   
    </div>
            

            

      <ErrorAlert error={tablesError} />


    </main>
  );
}

export default Dashboard;
