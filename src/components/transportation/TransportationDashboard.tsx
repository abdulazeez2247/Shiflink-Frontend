
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RideRequestForm from './RideRequestForm';
import RideRequestsList from './RideRequestsList';
import AgencyTransportationForm from './AgencyTransportationForm';
import { useAuth } from '@/hooks/useAuth';
import { Car, MapPin, Building } from 'lucide-react';

const TransportationDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Transportation Services</h2>
        <p className="text-gray-600">Manage transportation requests and services</p>
      </div>

      <Tabs defaultValue="request-ride" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="request-ride" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Request Ride
          </TabsTrigger>
          <TabsTrigger value="my-requests" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            My Requests
          </TabsTrigger>
          <TabsTrigger value="agency-services" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Agency Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request-ride" className="space-y-6">
          <RideRequestForm />
        </TabsContent>

        <TabsContent value="my-requests" className="space-y-6">
          <RideRequestsList />
        </TabsContent>

        <TabsContent value="agency-services" className="space-y-6">
          <AgencyTransportationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportationDashboard;
