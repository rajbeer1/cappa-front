'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axiosClient from '@/helpers/axios';
import Cookies from 'js-cookie';
import Map from '@/components/ui/map';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

interface UserData {
  name: string;
  email: string;
  DOB: string;
  contactNumber: string;
  fatherName: string;
  emergencyContactNumber: string;
  bloodGroup: string;
  address: string;
  height: number;
  createdAt: string;
}

const HomePage = () => {
    const handleLogout = () => {
      Cookies.remove('user');
      window.location.reload(); 
    };
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<{
      lat: number;
      lng: number;
    } | null>(null);

  const sendLocationToBackend = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setCoordinates({ lat: latitude, lng: longitude }); 
    try {
      const token = Cookies.get('user');
      await axiosClient.post(
        '/api/readings',
        {
          location: {
            "type": "Point",
            "coordinates":[position.coords.latitude,position.coords.longitude]
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error sending location data:', error);
      toast.error('Failed to send location data');
    }
  };

  const handleLocationPermission = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermission(true);
        sendLocationToBackend(position);
      },
      (error) => {
        console.error('Error getting location:', error);
        if (error.code === 1) {
          toast.error('Location permission denied');
        } else if (error.code === 2) {
          toast.error('Location unavailable. Please check your GPS settings.');
        } else if (error.code === 3) {
          toast.error('Location request timed out. Please try again.');
        }
        setLocationPermission(false);
      }
    );
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('user');
        const response = await axiosClient.get('/api/auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    // Request location permission first


    // Only fetch user data if location permission is granted
    if (locationPermission) {
      fetchUserData();

      // Set up interval to fetch location every minute
      const locationInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            sendLocationToBackend(position);
          },
          (error) => {
            console.error('Error fetching location:', error);
            toast.error('Failed to fetch location');
          }
        );
      }, 60000); // 60000 ms = 1 minute

      // Cleanup function to clear the interval
      return () => clearInterval(locationInterval);
    }
  }, [locationPermission]);
  useEffect(() => {
    handleLocationPermission();
  }, [handleLocationPermission]); 
  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div className="flex flex-col space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-4 w-[250px]" />
      ))}
    </div>
  );

  if (!locationPermission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Location Permission Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This app requires location access to function properly. Please
              enable location services to continue.
            </p>
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              onClick={handleLocationPermission}
            >
              Enable Location Access
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSkeleton />
              ) : userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="Full Name" value={userData.name} />
                  <InfoItem label="Email" value={userData.email} />
                  <InfoItem
                    label="Date of Birth"
                    value={new Date(userData.DOB).toLocaleDateString()}
                  />
                  <InfoItem
                    label="Contact Number"
                    value={userData.contactNumber}
                  />
                  <InfoItem label="Father's Name" value={userData.fatherName} />
                  <InfoItem
                    label="Emergency Contact"
                    value={userData.emergencyContactNumber}
                  />
                  <InfoItem label="Blood Group" value={userData.bloodGroup} />
                  <InfoItem label="Height" value={`${userData.height} cm`} />
                  <div className="col-span-full">
                    <InfoItem label="Address" value={userData.address} />
                  </div>
                  <InfoItem
                    label="Member Since"
                    value={new Date(userData.createdAt).toLocaleDateString()}
                  />
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Failed to load user data
                </p>
              )}
            </CardContent>
          </Card>
          <div className="w-full lg:w-1/2 p-6">
            <Button onClick={handleLogout} className="bg-red-500 text-white">
              Logout
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-6 h-full">
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle>Location Tracking</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)]">
              {coordinates ? (
                <Map /> // Pass valid coordinates to Map
              ) : (
                <p className="text-center text-muted-foreground">
                  Waiting for location data...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
