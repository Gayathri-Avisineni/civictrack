import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fit map to markers
const FitBounds = ({ issues }) => {
  const map = useMap();

  useEffect(() => {
    if (!issues || issues.length === 0) return;

    const bounds = L.latLngBounds(
      issues.map((i) => [i.latitude, i.longitude])
    );

    map.fitBounds(bounds, { padding: [80, 80] });
  }, [issues, map]);

  return null;
};

const AuthorityMap = ({ issues }) => {
  // Correct location pin icons (colored)
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const yellowIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const getStatusIcon = (status) => {
    if (status === "pending") return redIcon;
    if (status === "in_progress") return yellowIcon;
    return greenIcon;
  };

  return (
    <MapContainer
      center={[15.9129, 79.73999]}
      zoom={10}
      style={{ height: "80vh", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FitBounds issues={issues} />

      {issues?.map((issue) => (
        <Marker
          key={issue.id}
          position={[issue.latitude, issue.longitude]}
          icon={getStatusIcon(issue.status)}
        >
          <Popup>
            <b>{issue.title}</b> <br />
            {issue.description} <br />
            Status: <b>{issue.status}</b> <br />
            {issue.area}, {issue.pincode}
            <br />
            <a
              href={`/issue/${issue.id}`}
              onClick={() => localStorage.setItem("authority_last_menu", "map")}
              style={{ display: "inline-block", marginTop: "5px", color: "blue", textDecoration: "underline", fontWeight: "bold" }}
            >
              View Details →
            </a>
            
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AuthorityMap;