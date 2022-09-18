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
        <hr className='seprator'></hr>
        <h3 className='region'> Principal Point 
        <input
        type='text'
        id='longitude'
        className='longitude'
        title='Longitude'
        placeholder={longitude}
        onChange={(e) => {setLongitude(e.target.value)}}
      /> 
        <input
        type='text'
        id='latitude'
        className='latitude'
        title='Latitude'
        placeholder={latitude}
        onChange={(e) => {setLatitude(e.target.value)}}
      />
      </h3> 
      </div>
      
    </div>}
    </>
  )
}

export default App
