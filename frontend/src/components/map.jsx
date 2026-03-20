// src/pages/ProblemMap.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ClickFly() {
  const map = useMapEvents({
    click(e) {
      map.flyTo([e.latlng.lat, e.latlng.lng], 15);
    },
  });
  return null;
}

function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const status = ["Pending", "Rejected", "In Progress"];
      const colors = ["red", "blue", "orange"];

      div.innerHTML += "<h4>Status</h4>";
      status.forEach((s, i) => {
        div.innerHTML +=
          `<i style="background:${colors[i]}; width:15px; height:15px; display:inline-block; margin-right:5px;"></i>${s}<br>`;
      });

      return div;
    };

    legend.addTo(map);
    return () => legend.remove();
  }, [map]);

  return null;
}

const statusColors = {
  pending: "red",
  rejected: "blue",
  in_progress: "orange",
};

function createIcon(color) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
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

export default function ProblemMap() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/issues/")
      .then(res => setMarkers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <MapContainer
      center={[15.5, 80.0]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {markers.map((issue) => (
        <FlyToMarker
          key={issue.id}
          position={[issue.latitude, issue.longitude]}
          icon={createIcon(statusColors[issue.status.toLowerCase()] || "red")}
        >
          <Popup>
            <h4>{issue.title}</h4>
            <p>{issue.description}</p>
            <p>{issue.address}</p>
            <p>Status: {issue.status}</p>
          </Popup>
        </FlyToMarker>
      ))}

      <Legend />
      <ClickFly />
    </MapContainer>
  );
}