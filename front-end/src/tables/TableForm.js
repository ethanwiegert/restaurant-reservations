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
    

    
    return(
        <div>
            <form className="row mt-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                <label className="form-label">Table Name</label>
                <input className="form-control" id="table_name" name="table_name" type="text" value={table.table_name} onChange={handleChange}/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Capacity</label>
                <input className="form-control" id="capacity" name="capacity" type="number" value={table.capacity} onChange={handleNumber}/>
                </div>

                

                <button type="cancel button " className="btn btn-secondary m-3" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-success m-3">Submit</button>
            </form>

            <ErrorAlert error={formError} />

            
        </div>
    )
}

export default TableForm