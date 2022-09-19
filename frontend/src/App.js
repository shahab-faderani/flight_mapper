import { useRef, useEffect, useState } from 'react';
import './App.css'
import FlightRoutesList from "./FlightRoutesList";
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import * as tt from '@tomtom-international/web-sdk-maps'


const App = () => {
  const mapElement = useRef()
  const [map, setMap] = useState({})

  //an arbitrary pair of coordinates, i.e. Berlin's
  const [longitude, setLongitude] = useState(13.40495463)
  const [latitude, setLatitude] = useState(52.52000872)

  //the plans information (routes and their corresponding IDs) ideally are stored on and retrieved from the backend.
  //here however as mentioned in the assignment sheet they are store in the frontend:
  const [flightRoutes, setFlightRoute] = useState([])
  let currentRouteID = 1

  const [activeRoute, initiateRoute] = useState({})
  const [loadedRoute, loadRoute] = useState({})
  const [plansVisibility, switchPlansVisibility] = useState(false)

  const loadFlightRoute = (routeID) => {
    for (let i = 0; i < flightRoutes.length; i++) {
      if (flightRoutes[i].ID == routeID){
        loadRoute(flightRoutes[i])
        const pre_route_stops = document.getElementsByClassName('flight-plan-stop ' + loadedRoute.ID)
        for (let j = 0; j < pre_route_stops.length; j++) {
          pre_route_stops[j].classList.remove("selected")
        }
        const route_stops = document.getElementsByClassName('flight-plan-stop ' + routeID)
        for (let k = 0; k < route_stops.length; k++) {
          route_stops[k].classList.add("selected")
        }
      }
    }
  }

  const addFlightRouteStop = (lngLat, map, stops, route_ID) => {
      
    const stop_element = document.createElement('div')
    stop_element.className = 'flight-plan-stop ' + route_ID
    new tt.Marker({
      element: stop_element
    })
      .setLngLat(lngLat)
      .addTo(map)
    if (stops.length > 1){
      const edgeID = 'edge-'+ currentRouteID + '-' + stops.length
      map.addSource(edgeID, {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                    [stops[stops.length -2].lng , stops[stops.length -2].lat],
                    [stops[stops.length -1].lng , stops[stops.length -1].lat]
                ]
            }
        }
      });
      map.addLayer({
          'id': edgeID,
          'type': 'line',
          'source': edgeID,
          'layout': {
              'line-join': 'round',
              'line-cap': 'round'
          },
          'paint': {
              'line-color': '#1C3030',
              'line-width': 4,
              'line-opacity': 0.5,
          }
      });
    }
  }
  
  useEffect (() => {
    let stops = []
    let map = tt.map({
      //ideally keys are handled with higher security measures, i.e. as environmental variables/secrets
      //for simplicity I have written it as a string:
      key: "umS428uO7AdKqpTvU5xCiIVKDmwRItHb",
      container: mapElement.current,
      center: [longitude, latitude],
      zoom: 15
    })

    setMap(map)

    // a timeout has been implemented to differentiate between single and double clicks
    let clicks = 0
    map.on('click', (e) => {
      initiateRoute({})
      clicks ++
      setTimeout(()=>{
        if (clicks ===  1){
          stops.push(e.lngLat)
          addFlightRouteStop(e.lngLat, map, stops, currentRouteID)
          clicks = 0
        } else {
          clicks = 0
        }
      },300)
    })

    map.on('dblclick', () => {
      clicks = 0
      if (stops.length > 1){
        switchPlansVisibility(true)
        const route = {
          ID: currentRouteID,
          stops: stops
        }
        let routes_temp = flightRoutes
        routes_temp.push(route)
        setFlightRoute(routes_temp)
        currentRouteID = currentRouteID +1
        stops = []
        initiateRoute(route)
      }
    }) 

    map.on('dragend', (e) => {
      setLatitude((e.target.transform._center.lat).toFixed(8))
      setLongitude((e.target.transform._center.lng).toFixed(8))
    })

    return () => map.remove()
  }, [])

  return (
    <>
      {map && <div className='app'>
        <div className='map' ref={mapElement}/>
        <div className='flightPlannerWrapper'> 
          <h2 className='title'> Flight Planner </h2> 
          <div className='contentWrapper'>
            <hr className='separator'></hr>
            <div className='content region'>
              <h3 className='title'>Principal Point</h3>  
              <div className='longitude' title='Longitude'> {longitude} </div> 
              <div className='latitude' title='Latitude'> {latitude} </div> 
            </div>
          </div>
          <div className= {'contentWrapper' + (!plansVisibility ? " hidden" : "") }>
            <hr className='separator'></hr>
            <FlightRoutesList
              flightRoutes={flightRoutes}
              loadFlightRoute={loadFlightRoute}
              loadedRoute={loadedRoute}
            />
          </div>
        </div>
      </div>
      }
    </>
  )
}

export default App
