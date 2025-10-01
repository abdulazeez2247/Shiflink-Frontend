
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MapPin, Clock, User, Phone, Star } from 'lucide-react';
import { format } from 'date-fns';

interface RideRequest {
  id: string;
  pickup_address: string;
  destination_address: string;
  ride_type: string;
  requested_pickup_time: string;
  status: string;
  passenger_count: number;
  special_requirements?: string;
  assigned_driver_id?: string;
  drivers?: {
    driver_name: string;
    driver_phone: string;
    rating: number;
    vehicle_make?: string;
    vehicle_model?: string;
  };
}

const RideRequestsList = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRideRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ride_requests')
        .select(`
          *,
          drivers (
            driver_name,
            driver_phone,
            rating,
            vehicle_make,
            vehicle_model
          )
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching ride requests:', error);
      toast({
        title: "Error",
        description: "Failed to load ride requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelRideRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('ride_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId)
        .eq('requester_id', user?.id);

      if (error) throw error;

      toast({
        title: "Ride Cancelled",
        description: "Your ride request has been cancelled.",
      });

      fetchRideRequests();
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast({
        title: "Error",
        description: "Failed to cancel ride request",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRideTypeLabel = (type: string) => {
    switch (type) {
      case 'to_shift': return 'To Shift';
      case 'from_shift': return 'From Shift';
      case 'agency_client': return 'Agency Client';
      default: return type;
    }
  };

  useEffect(() => {
    fetchRideRequests();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Ride Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No ride requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {getRideTypeLabel(request.ride_type)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-gray-600">{request.pickup_address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm text-gray-600">{request.destination_address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(new Date(request.requested_pickup_time), 'MMM d, yyyy h:mm a')}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {request.passenger_count} passenger{request.passenger_count > 1 ? 's' : ''}
                  </div>
                </div>

                {request.drivers && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <h4 className="font-medium text-sm mb-2">Assigned Driver</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{request.drivers.driver_name}</p>
                        <p className="text-sm text-gray-600">
                          {request.drivers.vehicle_make} {request.drivers.vehicle_model}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{request.drivers.rating}/5</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${request.drivers.driver_phone}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {request.special_requirements && (
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Special Requirements:</strong> {request.special_requirements}
                  </div>
                )}

                {request.status === 'pending' && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => cancelRideRequest(request.id)}
                  >
                    Cancel Request
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideRequestsList;
