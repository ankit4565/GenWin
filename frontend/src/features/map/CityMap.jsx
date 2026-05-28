import { useState } from 'react'

import Map, {
  NavigationControl,
  Source,
  Layer,
  Marker,
  Popup,
} from 'react-map-gl/maplibre'

import 'maplibre-gl/dist/maplibre-gl.css'

export default function CityMap({ interactive = true, allowZoom = true }) {

  const [showTraffic, setShowTraffic] = useState(true)
  const [showFlood, setShowFlood] = useState(true)

  const [selectedPlace, setSelectedPlace] = useState(null)

  // Traffic Data
  const trafficData = {
    type: 'FeatureCollection',

    features: [
      {
        type: 'Feature',

        geometry: {
          type: 'LineString',

          coordinates: [
            [77.4126, 23.2599],
            [77.4200, 23.2650],
          ],
        },
      },
    ],
  }

  // Flood Data
  const floodData = {
    type: 'FeatureCollection',

    features: [
      {
        type: 'Feature',

        geometry: {
          type: 'Polygon',

          coordinates: [[
            [77.4000, 23.2500],
            [77.4100, 23.2550],
            [77.4150, 23.2480],
            [77.4000, 23.2500],
          ]],
        },
      },
    ],
  }
const bhopalBounds = [
  [77.2500, 23.1200], // southwest
  [77.5500, 23.3500], // northeast
]

  return (
    <div className="relative h-screen w-full">

      {/* Controls */}
      <div className="absolute left-4 top-4 z-50 flex flex-col gap-3">

        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className="rounded-xl bg-black/70 px-4 py-2 text-white"
        >
          Toggle Traffic
        </button>

        <button
          onClick={() => setShowFlood(!showFlood)}
          className="rounded-xl bg-black/70 px-4 py-2 text-white"
        >
          Toggle Flood
        </button>

      </div>

      {/* Metrics */}
      <div className="absolute right-4 top-4 z-50 rounded-xl bg-black/70 p-4 text-white">

        <h2 className="text-lg font-bold">
          Smart City Metrics
        </h2>

        <p>Traffic: High</p>
        <p>AQI: 132</p>

      </div>

     

      <Map
    interactive={interactive}
    initialViewState={{
  longitude: 77.4126,
  latitude: 23.2599,
  zoom: 14.5,
  pitch: 60,
  bearing: -15,
}}

  maxBounds={bhopalBounds}
  maxBoundsViscosity={1}

  minZoom={13}
  scrollZoom={interactive && allowZoom}
  dragPan={interactive}
  touchZoomRotate={interactive && allowZoom}

  style={{
    width: '100%',
    height: '100%',
  }}

  mapStyle="https://tiles.openfreemap.org/styles/bright"
>

  <NavigationControl position="top-right" />

  {/* 3D Buildings */}
  <Layer
    id="3d-buildings"

    source="openmaptiles"

    source-layer="building"

    type="fill-extrusion"

    minzoom={15}

    paint={{
      'fill-extrusion-color': '#aaa',

      'fill-extrusion-height': [
        'get',
        'render_height',
      ],

      'fill-extrusion-base': [
        'get',
        'render_min_height',
      ],

      'fill-extrusion-opacity': 0.8,
    }}
  />

  {/* Traffic Layer */}
  {showTraffic && (
    <Source
      id="traffic"
      type="geojson"
      data={trafficData}
    >

      <Layer
        id="traffic-layer"
        type="line"

        paint={{
          'line-color': 'red',
          'line-width': 6,
        }}
      />

    </Source>
  )}

  {/* Flood Layer */}
  {showFlood && (
    <Source
      id="flood"
      type="geojson"
      data={floodData}
    >

      <Layer
        id="flood-layer"
        type="fill"

        paint={{
          'fill-color': '#0077ff',
          'fill-opacity': 0.4,
        }}
      />

    </Source>
  )}

  {/* Marker */}
  <Marker
    longitude={77.4126}
    latitude={23.2599}
    anchor="bottom"
  >

    <div
      className="cursor-pointer text-4xl"
      onClick={() =>
        setSelectedPlace({
          name: 'Smart Hospital',
          longitude: 77.4126,
          latitude: 23.2599,
        })
      }
    >
      🏥
    </div>

  </Marker>

  {/* Popup */}
  {selectedPlace && (
    <Popup
      longitude={selectedPlace.longitude}
      latitude={selectedPlace.latitude}

      onClose={() => setSelectedPlace(null)}
    >

      <div>
        <h2 className="font-bold">
          {selectedPlace.name}
        </h2>

        <p>
          Emergency Services Active
        </p>
      </div>

    </Popup>
  )}

</Map>

    </div>
  )
}