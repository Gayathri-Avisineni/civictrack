import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});


function LocationMarker({ location, setLocation, setAddress, setArea, setPincode }){

  const [position, setPosition] = useState(null);
  
  const map = useMap();

  useEffect(() => {
  if (location.lat && location.lng) {
    setPosition([location.lat, location.lng]);
  }
}, [location]);

  useMapEvents({
  click: async (e) => {

    try {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);
     

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            "User-Agent": "civictrack-app"
          }
  }
      );

      const data = await res.json();

      setLocation({
        lat: lat,
        lng: lng,
        address: data.display_name
      });

      setAddress(data.address.road || data.display_name);
      setArea(data.address.village || data.address.town || data.address.city || "");
      setPincode(data.address.postcode || "");

    } catch (error) {
      console.log("Network error:", error);
    }

  }
});

 
  return position ? <Marker position={position} icon={markerIcon}/> : null;
}




function ChangeMapView({ location }) {

  const map = useMap();

  useEffect(() => {
    if (location.lat && location.lng) {
      map.flyTo([location.lat, location.lng], 14);
    }
  }, [location]);

  return null;
}


function ReportMap({ location, setLocation, setAddress, setArea, setPincode }) {

  return (

    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={6}
      style={{ height: "300px", width: "100%" }}
    >

      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeMapView location={location} />
      <LocationMarker
        location={location}
        setLocation={setLocation}
        setAddress={setAddress}
        setArea={setArea}
        setPincode={setPincode}
      />
      

    </MapContainer>

  );
}

export default ReportMap;