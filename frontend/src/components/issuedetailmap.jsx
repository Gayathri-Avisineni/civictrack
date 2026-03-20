import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function ZoomToLocation({ lat, lng }) {
  const map = useMap();

  const handleClick = () => {
    
    map.flyTo([lat, lng], 18, {
      animate: true
    });
  };

  return (
    <Marker position={[lat, lng]} icon={markerIcon} eventHandlers={{
      click: handleClick
    }}>
      <Popup>Reported Issue Location</Popup>
    </Marker>
  );
}


function IssueMap({ lat, lng }) {

  return (

    <MapContainer
      center={[lat, lng]}
      zoom={10}
      style={{ height: "250px", width: "100%" }}
    >

      

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomToLocation lat={lat} lng={lng} />

    </MapContainer>

  );
}

export default IssueMap;