import { useRef, useEffect, useState } from 'react';
import './App.css'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import * as tt from '@tomtom-international/web-sdk-maps'

const App = () => {
  const mapElement = useRef()
  const [map, setMap] = useState({})

  //an arbitrary pair of coordinates, i.e. Berlin's
  const [longitude, setLongitude] = useState(13.40495463)
  const [latitude, setLatitude] = useState(52.52000872)
  const [planID, setPlanID] = useState("")
  const [plansVisibility, switchPlansVisibility] = useState(false)
  
 

  const addFlightPlanStop = (lngLat, map, stops) => {


    const stopPopupOffset = {
      bottom: [0, -25]
    }
    const popoupText = String(lngLat.lng.toFixed(6)) + '<br>' + String(lngLat.lat.toFixed(6))
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
      const routeID = 'route-'+stops.length
      map.addSource(routeID, {
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
          'id': routeID,
          'type': 'line',
          'source': routeID,
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
    const stops = []

    let map = tt.map({
      //ideally keys are handled with higher security measures, i.e. as environmental variables/secrets
      //for simplicity I have written it as a string:
      key: "umS428uO7AdKqpTvU5xCiIVKDmwRItHb",
      container: mapElement.current,
      center: [longitude, latitude],
      zoom: 15
    })

    setMap(map)

   
  

    
    
    map.on('click', (e) => {
      stops.push(e.lngLat)
      addFlightPlanStop(e.lngLat, map, stops)
      switchPlansVisibility(true)
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
          <div className='content plans'>
            <h3 className='title'>Plan {planID ? "#" + planID + " :" : ""}</h3>
            <input
              type='text'
              className='planID'
              placeholder={'Please Insert an ID'}
              onChange={(e) => {setPlanID(e.target.value)}}
            />
            <button 
            className='button save'
            title='save'
            disabled={planID != "" ? false : true}
            onClick={(e) => {
              e.target.className += " active"
              e.target.disabled = true
            }}
            >save</button>
          </div>
        </div>
      </div>
      
    </div>}
    </>
  )
}

export default App
