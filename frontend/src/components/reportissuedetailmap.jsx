import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function IssueMap({ lat, lng }) {

  return (

    <MapContainer
      center={[lat, lng]}
      zoom={16}
      style={{ height: "250px", width: "100%" }}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng]} icon={markerIcon}>

        <Popup>
          Reported Issue Location
        </Popup>

      </Marker>

    </MapContainer>

  );
}

export default IssueMap;