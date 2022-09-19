import { useRef, useEffect, useState } from 'react';
import './App.css'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import * as tt from '@tomtom-international/web-sdk-maps'
import FlightRoutesList from "./FlightRoutesList";

const App = () => {
  const mapElement = useRef()
  const [map, setMap] = useState({})

  //an arbitrary pair of coordinates, i.e. Berlin's
  const [longitude, setLongitude] = useState(13.40495463)
  const [latitude, setLatitude] = useState(52.52000872)

  //the plans information ideally is stored to and retrieved from the backend:
  const [flightRoutes, setFlightRoute] = useState([])
  let currentRouteID = 1


  const [selectedRoute, setSelectedRoute] = useState({})
  const [plansVisibility, switchPlansVisibility] = useState(false)
  const addFlightPlanStop = (lngLat, map, stops) => {


    const stopPopupOffset = {
      bottom: [0, -25]
    }
    const popoupText = 'Route' + '<br>' + currentRouteID
    const popup = new tt.Popup({offset: stopPopupOffset}).setHTML(popoupText)
      
    const element = document.createElement('div')
    element.className = 'flight-plan-stop'
    const stop = new tt.Marker({
      element: element
    })
    

    .setLngLat(lngLat)
    .addTo(map)

    stop.setPopup(popup).togglePopup()

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
    const origin = {
      lng: longitude,
      lat: latitude
    }
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

    let clicks = 0
    map.on('click', (e) => {
      //no route can be selected in edit mode
      setSelectedRoute({})
      clicks ++
      setTimeout(()=>{
        if (clicks ===  1){
          stops.push(e.lngLat)
          addFlightPlanStop(e.lngLat, map, stops)
          clicks = 0
        } else {
          clicks = 0
        }
      },300)
    })

    map.on('dblclick', () => {
      switchPlansVisibility(true)
      clicks = 0
      if (stops.length > 1){
        const route = {
          ID: currentRouteID,
          stops: stops
        }
        let routes_temp = flightRoutes
        routes_temp.push(route)
        setFlightRoute(routes_temp)
        console.log(flightRoutes)
        currentRouteID = currentRouteID +1
        stops = []
        setSelectedRoute(route)
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
          <hr className='seprator'></hr>
          <div className='content region'>
            <h3 className='title'>Principal Point</h3>  
            <div
              className='longitude'
              title='Longitude'
            > 
            {longitude} </div> 
            <div
              className='latitude'
              title='Latitude'
            >
            {latitude} </div> 
          </div>
        </div>
        <div className= {'contentWrapper' + (!plansVisibility ? " hidden" : "") }>
          <hr className='seprator'></hr>
          <FlightRoutesList
            flightRoutes={flightRoutes}
          />
        </div>
      </div>
      
    </div>}
    </>
  )
}

export default App
