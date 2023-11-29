import React from "react";


function CheckOccupied(reserved){
if(reserved.length){
    return <p>Occupied</p>
}
else{
    return <p>Free</p>
}

}

export default CheckOccupied