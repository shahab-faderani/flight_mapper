import React from "react";

const FlightRoutesList = ({
  flightRoutes,
  loadFlightRoute,
  loadedRoute
}) => {
  return (flightRoutes.map((route) => {
    return (
      <div className={'content plan' + (loadedRoute.ID == route.ID ? " active" : "")}key={route.ID}>
        <h3 className='title'>Route {route.ID}</h3>
        <button className='button load' onClick={()=>{loadFlightRoute(route.ID)}}>load</button>
      </div>
    )
  }))
}

export default FlightRoutesList;