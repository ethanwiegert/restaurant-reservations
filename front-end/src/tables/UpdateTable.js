import React, { useEffect, useState } from "react";
import { listTables, updateTable } from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";


function UpdateTable(){
    let {reservation_id}=useParams()
    reservation_id=Number(reservation_id)

    const initialData = {
        reservation_id,
        table_id: 0,
      };

    const history=useHistory()
    

    const [tables, setTables]=useState([])
    const [tablesError, setTablesError]=useState(null)
    const [updatedTable, setUpdatedTable]=useState({...initialData})


    useEffect(loadTables, [])
    

    function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
          .then(setTables)
          .catch(setTablesError);
        return () => abortController.abort();
      }


      const handleChange = ({ target }) => {
       
        let value = target.value;
        setUpdatedTable({
        ...updatedTable,
        [target.name]: Number(value),
        });
        
        };

    function handleCancel(event){
        event.preventDefault()
        history.goBack()
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        async function seatReservationAtTable() {
        try {
        await updateTable({ data: updatedTable }, abortController.signal);
        history.push(`/dashboard`);
        } catch (error) {
        setTablesError(error);
        }
        }
        seatReservationAtTable();
        return () => abortController.abort();
        };

    
    return (
        <div>
        <form className="row" id="seatReservationForm">
        <div className="col-md-6">
        <label className="form-label m-2">Table Name</label>
        <select id="table_id" name="table_id" onChange={handleChange} required value={updatedTable.table_id}>
        <option defaultValue>Open Tables</option>
        {tables.map(
        (table) =>
        table.reservation_id === null && (
        <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
        </option>
        )
        )}
        </select>
        </div>
        </form>
        <button type="cancel" className="btn btn-secondary m-2" onClick={handleCancel}>Cancel</button>
        <button form="seatReservationForm" type="submit" className="btn btn-primary m-2" onClick={handleSubmit}>Submit</button>
        <ErrorAlert error={tablesError} />
        </div>
        );
}

export default UpdateTable