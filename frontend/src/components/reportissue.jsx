import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function LocationMarker({ setLocation }) {

  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );

      const data = await res.json();

      setLocation({
        lat: lat,
        lng: lng,
        address: data.display_name
      });

    }
  });

  return position ? <Marker position={position} icon={markerIcon}/> : null;
}

function ReportMap({ setLocation }) {

  return (

    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "300px", width: "100%" }}
    >

      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker setLocation={setLocation}/>

    </MapContainer>

  );
}

export default ReportMap;