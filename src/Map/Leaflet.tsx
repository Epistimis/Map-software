import { SetStateAction, useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import L, { Layer as LeafletLayer } from 'leaflet';
import {Feature, Geometry} from "geojson";
import 'leaflet-defaulticon-compatibility';
import LeafletControlGeocoder from '../Components/LeafletControlGeocoder'
import countriesData from '../Map/data/countries.geo.json'


interface CountryGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}


interface Country {
  name: string;
  properties: {
    name: string;
  };
  geometry: CountryGeometry;
}

interface Layer {
  options: any;
  on: (eventType: string, handler: () => void) => void;
  bindTooltip: (tooltip: string) => void;
}

interface MapViewProps {
  center: [number, number] | null;
  zoom: number;
}

const countryStyle = {
  color: 'white',
};

const selectedStyle = {
  color: 'blue',
  weight: 2,
};

const Leaflet: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Feature<Geometry, Country> | null>(null);
  const [selectedCountryData, setSelectedCountryData] = useState<number[]>([]);

  const southWest: L.LatLng = L.latLng(66.451887,-175.423452);
  const northEast: L.LatLng = L.latLng(5.255068,180.218384);
  const bounds: L.LatLngBounds = L.latLngBounds(southWest, northEast);
  
  const onEachCountry = (feature: Feature<Geometry, any>, layer: LeafletLayer) => {
    const country = feature as Feature<Geometry, Country>;
    layer.on('click', () => {
      setSelectedCountry(country);
      const chartData = [10, 20, 30];
      setSelectedCountryData(chartData);
    });
    layer.bindTooltip(country.properties.name);
  };

  const getCountryStyle = (feature: GeoJSON.Feature<Geometry, Country> | null | undefined) => {
    let color = "white";
  
    if (feature?.properties?.name === selectedCountry?.properties.name) {
      color = "red";
    }
  
    return { color };
  };
  
  

 const defaultPosition: [number, number] = [0, 0]; // Default to coordinates (0,0)

 const getMarkerPosition = () : [number, number] | null => {
  if (
    selectedCountry &&
    selectedCountry.geometry.type === 'Polygon'
  ) {
    const coords = (selectedCountry.geometry as GeoJSON.Polygon).coordinates[0] as [number, number][];
    const lat =
      coords.reduce((sum: number, coord: [number, number]) => sum + coord[1], 0) /
      coords.length;
    const lng =
      coords.reduce((sum: number, coord: [number, number]) => sum + coord[0], 0) /
      coords.length;
    return [lat, lng];
  } else if (
    selectedCountry &&
    selectedCountry.geometry.type === 'MultiPolygon'
  ) {
    const coords = (selectedCountry.geometry as GeoJSON.MultiPolygon).coordinates[0][0] as [number, number][];
    const lat =
      coords.reduce((sum: number, coord: [number, number]) => sum + coord[1], 0) /
      coords.length;
    const lng =
      coords.reduce((sum: number, coord: [number, number]) => sum + coord[0], 0) /
      coords.length;
    return [lat, lng];
  }
  return null;
};

const MapView: React.FC<MapViewProps> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

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
       
       <GeoJSON data={countriesData as GeoJSON.FeatureCollection} style={getCountryStyle} onEachFeature={onEachCountry}></GeoJSON>
  {selectedCountry && (
    <Marker position={getMarkerPosition() as [number, number]}></Marker>
  )}
  <LeafletControlGeocoder/>
  <MapView center={getMarkerPosition() as [number, number]} zoom={3} />
</MapContainer>

    </div>
  );
};

export default Leaflet;






