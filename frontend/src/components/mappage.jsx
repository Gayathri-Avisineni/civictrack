import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer,Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMapEvents, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

function ClickFly() {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      map.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
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

      div.innerHTML += "<h4>Status</h4>";
      div.innerHTML += `
        <i style="background:red; width:15px; height:15px; display:inline-block; margin-right:5px;"></i> Pending <br>
        <i style="background:orange; width:15px; height:15px; display:inline-block; margin-right:5px;"></i> In Progress <br>
        <i style="background:green; width:15px; height:15px; display:inline-block; margin-right:5px;"></i> Resolved <br>
      `;

      return div;
    };

    legend.addTo(map);
    return () => legend.remove();
  }, [map]);

  return null;
}


  const statusColors = {
  pending: "red",
  in_progress: "orange",
  resolved: "green",
};

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
          map.flyTo(position, 16);
        },
      }}
    >
      {children}
    </Marker>
  );
}

export default function MapSection() {
  const [markers, setMarkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/issues/")
      .then(res => setMarkers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "40px 20px",textAlign: "center" }}>
      
      <h2 style={{ marginBottom: "20px" }}>Issues Location</h2>

      {/* Map Container */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <MapContainer
          center={[15.5, 80.0]}
          zoom={12}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {markers.map((issue) => (
            <FlyToMarker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createIcon(statusColors[issue.status.toLowerCase()] || "red")}
            >
              <Popup>
            <div style={{ width: "180px" }}>
              <h4 style={{ marginBottom: "5px" }}>{issue.title}</h4>

              <p style={{ margin: "4px 0", fontSize: "14px" }}>{issue.description}</p>

              <p style={{ margin: "4px 0", fontSize: "13px" }}>
                <strong>Status:</strong> {issue.status}
              </p>

              <button
                onClick={() => navigate(`/issue/${issue.id}`)}
                style={{
                  marginTop: "8px",
                  padding: "7px 12px",
                  background: "#007bff",
                  color: "white",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
                onMouseLeave={(e) => (e.target.style.background = "#007bff")}
              >
                View Details →
              </button>
            </div>
          </Popup>
            </FlyToMarker>
          ))}

          <Legend />
          <ClickFly />
        </MapContainer>
      </div>

      {/* Button */}
      <Link
        to="/map"
        style={{
          display: "inline-block",
          marginTop: "15px",
          padding: "10px 20px",
          background: "#007bff",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "500",
        }}
      >
        View Full Map
      </Link>
    </div>
  );
}
