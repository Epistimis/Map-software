import React,{useEffect} from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import icon from './Constants'
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

const LeafletControlGeocoder = () => {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      marker: {
        icon
      }
    });

    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
}

 

export default LeafletControlGeocoder;
  


 