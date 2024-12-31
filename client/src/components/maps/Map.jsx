import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Component to handle map interactions and routing
const MapInteraction = ({ position, onDestinationSet }) => {
  const map = useMap();
  const [routingControl, setRoutingControl] = useState(null);

  // Handle map clicks
  useMapEvents({
    click: (e) => {
      if (position) {
        onDestinationSet([e.latlng.lat, e.latlng.lng]);
        
        // Remove existing routing control if it exists
        if (routingControl) {
          map.removeControl(routingControl);
        }

        // Create new routing control
        const newRoutingControl = L.Routing.control({
          waypoints: [
            L.latLng(position[0], position[1]),
            L.latLng(e.latlng.lat, e.latlng.lng)
          ],
          routeWhileDragging: true,
          showAlternatives: true,
          addWaypoints: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [{ color: '#6366f1', weight: 4 }]
          }
        }).addTo(map);

        setRoutingControl(newRoutingControl);
      }
    }
  });

  // Update route when position changes
  useEffect(() => {
    if (routingControl && position) {
      const waypoints = routingControl.getWaypoints();
      waypoints[0].latLng = L.latLng(position[0], position[1]);
      routingControl.setWaypoints(waypoints);
    }
  }, [position, routingControl]);

  return null;
};

// Component to handle current location marker
const LocationMarker = ({ position }) => {
  const map = useMap();
  const [initialZoom, setInitialZoom] = useState(true);

  useEffect(() => {
    console.log("re-render")
    if (position) {
      // Only zoom to position on initial load
      if (initialZoom) {
        map.flyTo(position, 16);
        setInitialZoom(false);
      } else {
        // For subsequent updates, just pan to new position
        // map.panTo(position);
      }
    }
  }, [position]);

  return position ? (
    <Marker position={position}>
      <Popup>
        Your current location<br />
        Lat: {position[0].toFixed(4)}<br />
        Lng: {position[1].toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
};

const OpenStreetMap = () => {
  const [position, setPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    // Set up continuous location watching
    const id = navigator.geolocation.watchPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        setError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    setWatchId(id);

    // Cleanup function to stop watching location
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[800px] bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-medium">Loading map...</div>
          <div className="text-sm text-gray-500">Getting your location</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[800px] bg-gray-50">
        <div className="text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-0">
      <MapContainer 
        center={position || [51.505, -0.09]} 
        zoom={16} 
        scrollWheelZoom={true}
        className="w-full h-[800px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} />
        {destination && (
          <Marker position={destination}>
            <Popup>
              Destination<br />
              Lat: {destination[0].toFixed(4)}<br />
              Lng: {destination[1].toFixed(4)}
            </Popup>
          </Marker>
        )}
        <MapInteraction 
          position={position} 
          onDestinationSet={setDestination}
        />
      </MapContainer>
    </div>
  );
};

export default OpenStreetMap;