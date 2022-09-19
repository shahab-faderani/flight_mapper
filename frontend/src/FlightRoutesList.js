import React from "react";

const FlightRoutesList = ({
  flightRoutes
}) => {
  return (flightRoutes.map((route) => {
    return (
      <div className='content plans' key={route.ID}>
        <h3 className='title'>Route {route.ID}</h3>
      </div>
    )
  }))
}

export default FlightRoutesList;