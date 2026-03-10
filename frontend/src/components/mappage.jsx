// src/components/map.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"
import { useMapEvents ,useMap} from "react-leaflet";
import { Link } from "react-router-dom";

function ClickFly() {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;   // captured coordinates
      console.log("Clicked coordinates:", lat, lng); // see in console
      map.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
    },
  });
  return null;
};

function Legend() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const status = ["Pending", "Rejected", "InProgress"];
      const colors = ["red", "blue", "orange"];

      div.innerHTML += "<h4>Problem Types</h4>";
      status.forEach((cat, i) => {
        div.innerHTML +=
          `<i style="background:${colors[i]}; width:18px; height:18px; display:inline-block; margin-right:5px;"></i>` +
          `${cat}<br>`;
      });
      return div;
    };

    legend.addTo(map);

    // Cleanup on unmount
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}

// Category colors
const statusColors = {
  Pending: "red",
  Rejected: "blue",
  InProgress: "orange",
};

// Function to create colored marker
function createIcon(color) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}
function FlyToMarker({ position, icon, children }) {
  const map = useMap();

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => {
          map.flyTo(position, 16, {
            animate: true,
            duration: 1.5,
          });
        },
      }}
    >
      {children}
    </Marker>
  );
}
export default function MapSection({ problemData }) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Load problem data (can come from backend)
    if (problemData && problemData.length > 0) {
      setMarkers(problemData);
    } else {
      // Sample data for demo
      setMarkers([
        {
          id: 1,
          title: "Big pothole",
          status: "Pending",
          lat: 17.385044,
          lon: 78.486671,
          description: "Huge pothole near MG Road.",
        },
        {
          id: 2,
          title: "Water leakage",
          status:"InProgress",
          lat: 17.4399,
          lon: 78.4980,
          description: "Broken pipeline causing leakage.",
        },
        {
          id: 3,
          title: "Garbage overflow",
          status: "Rejected",
          lat: 17.4500,
          lon: 78.5000,
          description: "Garbage bin overflowing in the street.",
        },
      ]);
    }
  }, [problemData]);

  return (
     <div className="map-section">
      <h2 className="map-heading">Issues Location</h2>
    <div className="map-wrapper">
    <div className="map-preview-container">
    <MapContainer
      center={[17.385044, 78.486671]}
      zoom={13}
      className="problem-map"
      scrollWheelZoom={true}
      dragging={true}
      touchZoom={true}
      doubleClickZoom={true}
      zoomControl={true}
      inertia={true}
      inertiaDeceleration={3000}
      inertiaMaxSpeed={1500}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((problem) => (
       <FlyToMarker
  key={problem.id}
  position={[problem.lat, problem.lon]}
  icon={createIcon(statusColors[problem.status] || "red")}
>
          <Popup>
            <div style={{ width: "200px" }}>
              <h4>{problem.title}</h4>
              <p>Status: {problem.status}</p>
              <p>{problem.description}</p>
              <p>
                Lat: {problem.lat.toFixed(4)}, Lon: {problem.lon.toFixed(4)}
              </p>
            </div>
          </Popup>
        </FlyToMarker>
      ))}
      <Legend/>
      <ClickFly/>
    </MapContainer>
    </div>
    <div className="map-button">
        <Link to="/map" className="view-map-btn">
      View Full Map
      </Link>
    </div>
</div>
</div>
  );
}
