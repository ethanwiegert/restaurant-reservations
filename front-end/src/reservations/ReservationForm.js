import React from "react";

import { Link, useHistory } from "react-router-dom";

function ReservationForm(){
    
    const history=useHistory()
    
    
    
    
    
    /*
    Features left to add:
    submitting saves, sends to "/dashboard"
    display error messages from API(ErrorAlert?)
    */
    
    return(
        <div>
            <form className="row">
                <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input id="firstName" name="firstName" type="text" required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input id="lastName" name="lastName" type="text" required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input id="mobileNumber" name="mobileNumber" type="tel" pattern="tel" required/>
                </div>

                <div className="col-md-6">
                <label className="form-label">Reservation Date</label>
                <input id="date" name="date" type="date" required/>
                </div>
                
                <div className="col-md-6">
                <label className="form-label">Reservation Time</label>
                <input id="time" name="time" type="time" required/>
                </div>

                <button type="cancel button " className="btn btn-danger mb-2" onClick={(()=>history.go(-1))}></button>
                <button type="submit button" className="btn btn-success mb-2">Submit</button>
            </form>
        </div>
    )
}

export default ReservationForm