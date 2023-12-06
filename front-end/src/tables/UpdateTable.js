import React, { useEffect, useState } from "react";
import { listTables, updateTable } from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function UpdateTable(){
    const {reservationId}=useParams()

    const initialData = {
        table_name: "",
        reservation_id: {reservationId},
        capacity: 0,
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


    function handleChange(target){
        setUpdatedTable({
            ...updatedTable,
            [target.name]: target.value
        })
    }

    function handleCancel(event){
        event.preventDefault()
        history.goBack()
    }

    async function handleSubmit(event) {
     
        const abortController = new AbortController();
        setTablesError(null);
        try{
        await updateTable(updatedTable, abortController.signal)  
         history.push("/dashboard")
        } catch (e){
            console.log(e.name)
            setTablesError(e)
        }
        return () => abortController.abort();
      }
    
    /*
    Features left to add:
    submitting saves, sends to "/dashboard"
    display error messages from API(ErrorAlert?)
    */
    
    return(
        <div>
            <form className="row" onSubmit={handleSubmit}>
                
                <div className="col-md-6">
                <label className="form-label">Table Name</label>
                <select id="table_id" name="table_id" onChange={handleChange} required>
                {tables.map((table)=>{
                         return <option value="table">{table.table_name} - {table.capacity}</option>
                    })}
                    </select>
                </div>

                <button type="cancel" className="btn btn-secondary mb-2" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-success mb-2">Submit</button>
            </form>
            <ErrorAlert error={tablesError} />

          
        </div>
    )
}

export default UpdateTable