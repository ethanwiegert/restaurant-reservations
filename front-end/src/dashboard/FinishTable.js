import React, { useState } from "react";
import { deleteTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function FinishTable(reserved, tableId){
    const history=useHistory()

    const [requestError, setRequestError]=useState(null)

   

    function handleDeckDelete() {
        setRequestError(null)
        const deletePromt = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
        if(deletePromt) {
        deleteTable(tableId)
        .then((history.push(`/`)))
        .then(window.location.reload()) 
        .catch((e)=>setRequestError(e))
        }
    }

    if(reserved!==null){
        return (
        <div>
        <button id="data-table-id-finish={table.table_id}" className="btn btn-danger" onClick={handleDeckDelete}>Finish</button>
        <ErrorAlert error={requestError} />
        </div>
        )

    }
}

export default FinishTable