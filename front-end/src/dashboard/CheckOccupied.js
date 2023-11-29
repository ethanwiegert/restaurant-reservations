import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function CheckOccupied(reserved){
if(reserved.length){
    return <p>Occupied</p>
}
else{
    return <p>Free</p>
}

}

export default CheckOccupied