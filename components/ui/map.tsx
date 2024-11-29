'use client';

import axiosClient from '@/helpers/axios';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
  Libraries,
} from '@react-google-maps/api';
import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Loader from '@/components/loader';

interface LocationData {
  location: {
    type: string; 
    coordinates: [number, number]; 
  };
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  _id: string;
  userId: string;
  crashDetected: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Map() {
  const libraries: Libraries = ['visualization'] as const;
  const [isloading, setisloading] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAN6b_-hDFORuqIbR3NITLQOv9L8IMmHzs',
    libraries,
  });

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [map, setMap] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const POLLING_INTERVAL = 20000; // 20 seconds

  const fetchLatestLocation = useCallback(async () => {
    try {
      const token = Cookies.get('user');
      if (!token) {
        toast.error('Authentication token missing');
        return;
      }

      const response = await axiosClient.get('/api/readings/latest', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLocationData(response.data);
      setisloading(false);
    } catch (error) {
      console.error('Error fetching location:', error);
      toast.error('Error updating location data');
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLatestLocation();
  }, [fetchLatestLocation]);

  // Setup polling
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchLatestLocation();
    }, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  }, [fetchLatestLocation]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error loading the map</div>
      </div>
    );
  }

  if (!isLoaded || isloading) {
    return <Loader />;
  }

  if (!locationData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">No Location Data</h2>
          <p className="text-gray-600 mb-6">
            Waiting for location data from your device...
          </p>
          <button
            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300"
            onClick={fetchLatestLocation}
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  const center = {
    lat: locationData.location.coordinates[0],
    lng: locationData.location.coordinates[1],
  };

  return (
    <div className="h-full w-full relative">
      <GoogleMap
        mapContainerStyle={{
          height: '100%',
          width: '100%',
        }}
        zoom={15}
        onLoad={(loadedMap) => setMap(loadedMap)}
        center={center}
      >
        <Marker
          position={center}
          onClick={() => setShowInfo(!showInfo)}
          icon={{
            url: locationData.crashDetected
              ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          }}
        >
          {showInfo && (
            <InfoWindow onCloseClick={() => setShowInfo(false)}>
              <div className="p-2">
                <h3 className="font-bold mb-2">Device Location</h3>
                <p>Lat: {center.lat.toFixed(6)}</p>
                <p>Lng: {center.lng.toFixed(6)}</p>
            
                <p className="mt-2">
                  Status:{' '}
                  {locationData.crashDetected ? (
                    <span className="text-red-500 font-bold">
                      Crash Detected!
                    </span>
                  ) : (
                    <span className="text-green-500">Normal</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Last Updated:{' '}
                  {new Date(locationData.updatedAt).toLocaleString()}
                </p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>

      {/* Optional: Add a crash alert overlay */}
      {locationData.crashDetected && (
        <div className="absolute top-4 right-4 text-4x bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-pulse">
          ⚠️ Crash Detected!
        </div>
      )}
    </div>
  );
}
