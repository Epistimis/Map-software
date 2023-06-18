import { SetStateAction, useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker,} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import LeafletControlGeocoder from '../Components/LeafletControlGeocoder'
import countriesData from '../Map/data/countries.geo.json'


interface CountryGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][];
}

interface Country {
  properties: {
    name: string;
  };
  geometry: CountryGeometry;
}

interface Layer {
  on: (eventType: string, handler: () => void) => void;
  bindTooltip: (tooltip: string) => void;
}

const countryStyle = {
  color: 'white',
};

const selectedStyle = {
  color: 'blue',
  weight: 2,
};

const Leaflet: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCountryData, setSelectedCountryData] = useState<number[]>([]);

  const southWest: L.LatLng = L.latLng(66.451887,-175.423452);
  const northEast: L.LatLng = L.latLng(5.255068,180.218384);
  const bounds: L.LatLngBounds = L.latLngBounds(southWest, northEast);
  
  

  const onEachCountry = (country: Country, layer: Layer) => {
    layer.on('click', () => {
      setSelectedCountry(country);
      const chartData = [10, 20, 30];
      setSelectedCountryData(chartData);
    });
    layer.bindTooltip(country.properties.name);
  };

  const getCountryStyle = (feature: Country | null) => {
    if (feature === selectedCountry) {
      return selectedStyle;
    }
    return countryStyle;
  };

  const getMarkerPosition = () => {
    if (
      selectedCountry &&
      selectedCountry.geometry &&
      selectedCountry.geometry.type === 'Polygon'
    ) {
      const coords = selectedCountry.geometry.coordinates[0];
      const lat =
        coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0) /
        coords.length;
      const lng =
        coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0) /
        coords.length;
      return [lat, lng];
    } else if (
      selectedCountry &&
      selectedCountry.geometry &&
      selectedCountry.geometry.type === 'MultiPolygon'
    ) {
      const coords = selectedCountry.geometry.coordinates[0][0];
      const lat =
        coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0) /
        coords.length;
      const lng =
        coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0) /
        coords.length;
      return [lat, lng];
    }
    return null;
  };

  return (
    <div className='map-container' style={{ marginTop: '10%', marginLeft: '15%' }}>
      <h1>Interactive Map</h1>
      <MapContainer
        style={{
          height: '100vh',
          width: '85%',
        }}

        center={[46.2276, 2.2137]}
        zoom={2}
        scrollWheelZoom={true}
        minZoom={2}
        maxBounds={bounds}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
       
        <GeoJSON data={countriesData} style={getCountryStyle} onEachFeature={onEachCountry}></GeoJSON>
        {selectedCountry && (
          <Marker position={getMarkerPosition()}></Marker>
        )}
        <LeafletControlGeocoder/>
      </MapContainer>

    </div>
  );
};

export default Leaflet;






