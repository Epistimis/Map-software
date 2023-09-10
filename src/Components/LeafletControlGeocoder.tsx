import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import icon from './Constants'
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css"; 

const LeafletControlGeocoder = () => {
  const map = useMap();
  
  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new (GeoSearchControl as any)({
      provider,
      marker: {
        icon
      }
    });

    map.addControl(searchControl);

    // Added the return statement after map.removeControl
    return () => {
      map.removeControl(searchControl);
      return;
    };
  }, [map]);

  return null;
}

export default LeafletControlGeocoder;




  


 