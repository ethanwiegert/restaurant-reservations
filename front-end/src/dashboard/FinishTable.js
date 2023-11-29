import React, { useEffect } from "react";
import { deleteTable } from "../utils/api";
import { useHistory } from "react-router-dom";

function FinishTable(reserved, tableId){
    const history=useHistory()

    useEffect(handleDeckDelete, [])

    function handleDeckDelete() {
        const deletePromt = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
        if(deletePromt) {
        deleteTable(tableId)
        .then((history.push(`/`)))
        .then(window.location.reload()) 
        }
    }

    if(reserved.length){
        return <button id="data-table-id-finish={table.table_id}" className="btn btn-danger">Finish</button>
    }
}

export default FinishTable