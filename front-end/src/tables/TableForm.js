import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

import { Link, useHistory } from "react-router-dom";
import{createTable} from"../utils/api"

function TableForm(){

    const [table, setTable] = useState({});
    const [formError, setFormError] = useState([]);
    
    const history=useHistory()
    
    useEffect(()=>handleSubmit, [])

    function handleChange(target){
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
        try{
         const response= await createTable(table, abortController)  
         history.push("/dashboard")
        } catch (e){
            console.log(e.name)
            if(formError=[]){setFormError([e])}
            else{formError.push(e)}
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
                <input id="table_name" name="table_name" type="text" onChange={handleChange} minLength="2" required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Capacity</label>
                <input id="capacity" name="capacity" type="number" onChange={handleChange} min="1" required/>
                </div>

                

                <button type="cancel button " className="btn btn-secondary mb-2" onClick={handleCancel}>Cancel</button>
                <button type="submit button" className="btn btn-success mb-2">Submit</button>
            </form>

            {formError.map((error)=>(
                <div>
                    <h5 className="alert alert-danger">{error}</h5>
                </div>
            )

            )}
        </div>
    )
}

export default TableForm