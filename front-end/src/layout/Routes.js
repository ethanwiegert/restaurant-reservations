import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";


import ReservationForm from "../reservations/ReservationForm";
import TableForm from "../tables/TableForm";
import UpdateTable from "../tables/UpdateTable";
import SearchNumber from "../reservations/SearchNumber";
import EditReservation from "../reservations/EditReservation";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route path="/dashboard">
        <Dashboard  />
      </Route>
      <Route path="/tables/new">
        <TableForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <UpdateTable />
      </Route>
      <Route path="/search">
        <SearchNumber />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
