import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

import { useHistory } from "react-router-dom";
import{createTable} from"../utils/api"

function TableForm(){
    const initialFormData = {
        table_name: "",
        capacity: 0,
      };

    const [table, setTable] = useState({ ...initialFormData });
    const [formError, setFormError] = useState(null);
    
    const history=useHistory()

    const handleNumber = ({ target }) => {
        setTable({
          ...table,
          [target.name]: Number(target.value),
        });
      };

    function handleChange({target}){
        setTable({
            ...table,
            [target.name]: target.value
        })
    }
  

   function handleCancel(event){
        event.preventDefault()
        history.goBack()
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController();
        setFormError(null);
        console.log(table)
        try{
         await createTable(table, abortController.signal)  
         history.push("/dashboard")
        } catch (e){
            console.log(e.name)
            setFormError(e)
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
                <input id="table_name" name="table_name" type="text" value={table.table_name} onChange={handleChange} required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Capacity</label>
                <input id="capacity" name="capacity" type="number" value={table.capacity} onChange={handleNumber} required/>
                </div>

                

                <button type="cancel button " className="btn btn-secondary mb-2" onClick={handleCancel}>Cancel</button>
                <button type="submit button" className="btn btn-success mb-2">Submit</button>
            </form>

            <ErrorAlert error={formError} />

            
        </div>
    )
}

export default TableForm