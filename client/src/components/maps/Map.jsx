import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// Component to handle map interactions and routing
const MapInteraction = ({ position, waypoints, onWaypointAdd }) => {
  const map = useMap();
  const [routingControl, setRoutingControl] = useState(null);

  // Handle map clicks
  useMapEvents({
    click: (e) => {
      onWaypointAdd([e.latlng.lat, e.latlng.lng]);
    },
  });

  // Update or create routing when waypoints change
  useEffect(() => {
    if (routingControl) {
      map.removeControl(routingControl);
    }

    if (waypoints.length >= 2) {
      // Convert waypoints to Leaflet latLng format
      const routeWaypoints = waypoints.map((wp) => L.latLng(wp[0], wp[1]));

      const newRoutingControl = L.Routing.control({
        show: false,
        waypoints: routeWaypoints,
        routeWhileDragging: true,
        showAlternatives: true,
        addWaypoints: false,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: "#6366f1", weight: 4 }],
        },
      }).addTo(map);

      setRoutingControl(newRoutingControl);
    }

    // Cleanup function
    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, waypoints]);

  return null;
};

// Component to handle current location marker
const LocationMarker = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16);
    }
  }, [map, position]);

  return position ? (
    <Marker position={position}>
      <Popup>
        Your current location
        <br />
        Lat: {position[0].toFixed(4)}
        <br />
        Lng: {position[1].toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
};

const OpenStreetMap = ({waypoints, setWaypoints}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setPosition(newPosition);
        setWaypoints([newPosition]); // Set current position as first waypoint
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    // Set up continuous location watching
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        setPosition(newPosition);
        setWaypoints((prev) => {
          if (prev.length > 0) {
            return [newPosition, ...prev.slice(1)];
          }
          return [newPosition];
        });
      },
      (error) => {
        setError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const handleAddWaypoint = (newWaypoint) => {
    setWaypoints((prev) => [...prev, newWaypoint]);
  };

  const handleResetWaypoints = () => {
    setWaypoints(position ? [position] : []);
  };

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
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative z-0">
      <MapContainer
        center={position || [51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-[800px] z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waypoints.map((waypoint, index) => (
          <Marker
            key={`${waypoint[0]}-${waypoint[1]}-${index}`}
            position={waypoint}
          >
            <Popup>
              {index === 0 ? "Start" : `Waypoint ${index}`}
              <br />
              Lat: {waypoint[0].toFixed(4)}
              <br />
              Lng: {waypoint[1].toFixed(4)}
            </Popup>
            {waypoint[0] === position[0] && waypoint[1] === position[1] ? (
              <Circle
                center={{ lat: waypoint[0], lng: waypoint[1] }}
                fillColor="blue"
                radius={200}
              />
            ) : (
              ""
            )}
          </Marker>
        ))}
        <MapInteraction
          position={position}
          waypoints={waypoints}
          onWaypointAdd={handleAddWaypoint}
        />
      </MapContainer>
    </div>
  );
};

export default OpenStreetMap;
