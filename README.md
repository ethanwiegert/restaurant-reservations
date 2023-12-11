# Restaurant Reservation Capstone
This project involves both the frontend in React and the backend in Node for a restaurant reservation application.  The frontend involved making components in React along with Bootstrap whilst the backend used knex and an elephant SQL database.  The main features include 
-Making a reservation 
-Being able to edit or cancel it 
-making tables to seat reservations 
-seating the reservations 
-finishing the reservation and making the table free to be used again 
-searching reservations by phone number
The project also includes middleware for each feature on the backend that will display its errors as the user performs a request.  For example: not allowing the user to make a reservation on Tuesday since the restaurant is closed, or allowing a reservation to be made or changed to the past.


The frontend is deployed [here](https://restaurant-reservations-peach.vercel.app/dashboard)
The backend is deployed [here](https://backend-nine-olive.vercel.app/)

### Backend Routes

#### Reservations
-GET "/reservations" allows a query for date or mobile number to retrieve matching reservations
-POST "/reservations" creates a new reservation
-GET "/reservations/:reservationId" retrieves the reservation with the matching ID
-PUT "/reservations/:reservationId" updates the reservation with the matching ID
-PUT "/reservations/:reservationId/status" updates the status of the reservation

### Tables
-GET "/tables" lists all of the tables
-POST "/tables" creates a new table
-GET "/tables/:tableId" retrieves the table with the matching table ID
-PUT "/tables/:tableId/seat" updates the table and seats a reservation
-DELETE "/tables/:tableId/seat" removes the reservation from the table and prepares it to be used again
