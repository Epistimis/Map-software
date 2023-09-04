// Import necessary modules and components
// React: A JavaScript library for building user interfaces
// React-Leaflet: React components for Leaflet maps
import { SetStateAction, useEffect, useState, useRef } from 'react'; 
import { MapContainer, TileLayer, GeoJSON, Marker, useMap, Popup } from 'react-leaflet'; // GeoJSON: used for encoding geographical data structures
import 'leaflet/dist/leaflet.css'; 
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import L, { Layer as LeafletLayer } from 'leaflet'; // Leaflet: Library for interactive maps
import { Feature, Geometry } from "geojson"; // GeoJSON types
import 'leaflet-defaulticon-compatibility';
import LeafletControlGeocoder from '../Components/LeafletControlGeocoder' // Custom geocoder component
import countriesData from '../Map/data/countries.geo.json'; // GeoJSON data for countries
import ApiService from '@/Components/apiService';
import * as turf from '@turf/turf'; // Turf: Advanced geospatial library

// Define interfaces for country geometry and country objects
// Learn more about coordinates: https://en.wikipedia.org/wiki/Geographic_coordinate_system
interface CountryGeometry {
  type: 'Polygon' | 'MultiPolygon'; // Polygon types
  coordinates: number[][][] | number[][][][]; // Geographic coordinates
}

interface Country {
  name: string;
  properties: {
    name: string;
  };
  geometry: CountryGeometry;
}

// Define interface for map view props
interface MapViewProps {
  center: [number, number] | null;
  zoom: number;
}

// Define country and selected styles
const countryStyle = {
  color: 'white',
};

const selectedStyle = {
  color: 'blue',
  weight: 2,
};

// Define Leaflet component
const Leaflet: React.FC = () => {
  // State for selected country and data for that country
  const [selectedCountry, setSelectedCountry] = useState<Feature<Geometry, Country> | null>(null);
  const [selectedCountryData, setSelectedCountryData] = useState<number[]>([]);
  const {data, loading, error} = ApiService();

  // Define map boundaries
  const southWest: L.LatLng = L.latLng(66.451887, -175.423452);
  const northEast: L.LatLng = L.latLng(5.255068, 180.218384);
  const bounds: L.LatLngBounds = L.latLngBounds(southWest, northEast);

  // Handle click event on each country and set the selected country
  const onEachCountry = (feature: Feature<Geometry, any>, layer: LeafletLayer) => {
    const country = feature as Feature<Geometry, Country>;
    layer.on('click', () => {
      setSelectedCountry(country);
      const chartData = [10, 20, 30]; // Dummy chart data for the selected country
      setSelectedCountryData(chartData);
    });
    layer.bindTooltip(country.properties.name); // Tooltip to show the country name
  };

  // Style each country polygon based on whether it's selected or not
  const getCountryStyle = (feature: GeoJSON.Feature<Geometry, Country> | null | undefined) => {
    let color = "red";
    if (feature?.properties?.name === selectedCountry?.properties.name) {
      color = "white";
    }
    return { color };
  };

  // Define default marker position and get marker position for the selected country
  const defaultPosition: [number, number] = [0, 0]; 
  const getMarkerPosition = (): [number, number] | null => {
    if (selectedCountry) {
      const centroid = turf.centroid(selectedCountry as any); // Calculate the centroid of the selected country
      return [centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]];
    }
    return null;
  };

  // Function to find the law data for the selected country
  const findLawForCountry = (countryName: string) => {
    if (Array.isArray(data)) {
      const countryData = data.find((entry) => entry[countryName]);
      return countryData ? countryData[countryName] : null;
    }
    return null;
  };

  // Render the Leaflet component
  return (
    <div className='map-container' style={{ marginTop: '10%', marginLeft: '15%' }}>
      <h1>Interactive Map</h1>
      <MapContainer
        style={{
          height: '100vh',
          width: '85%',
        }}
        center={[46.2276, 2.2137]} // Initial center of the map
        zoom={2} // Initial zoom level
        maxZoom={2}
        minZoom={2}
        maxBounds={bounds}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={countriesData as GeoJSON.FeatureCollection} style={getCountryStyle} onEachFeature={onEachCountry}></GeoJSON>
        {selectedCountry && (
        <Popup position={getMarkerPosition()!}>
          {loading ? (
            "Loading..."
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              {selectedCountry.properties.name && (
                <div>
                  <h2>{selectedCountry.properties.name}</h2>
                  {findLawForCountry(selectedCountry.properties.name) ? (
                    <div>
                      <h3>Law:</h3>
                      <p>{findLawForCountry(selectedCountry.properties.name)?.law}</p>
                      <h3>Regulator:</h3>
                      <p>{findLawForCountry(selectedCountry.properties.name)?.regulator}</p>
                      <h3>Description:</h3>
                      <p>{findLawForCountry(selectedCountry.properties.name)?.description}</p>
                    </div>
                  ) : (
                    <p>No law data available</p>
                  )}
                </div>
              )}
            </>
          )}
        </Popup>
      )}
        <LeafletControlGeocoder  />
      </MapContainer>
    </div>
  );
};

export default Leaflet;





