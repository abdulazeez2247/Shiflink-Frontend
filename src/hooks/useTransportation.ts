
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface RideRequest {
  id: string;
  pickup_address: string;
  destination_address: string;
  ride_type: string;
  requested_pickup_time: string;
  status: string;
  passenger_count: number;
  special_requirements?: string;
  assigned_driver_id?: string;
  total_fare?: number;
  created_at: string;
}

export interface AgencyRequest {
  id: string;
  client_name: string;
  pickup_address: string;
  destination_address: string;
  requested_pickup_time: string;
  status: string;
  wheelchair_accessible: boolean;
  passenger_count: number;
  special_needs?: string;
  estimated_fare?: number;
  created_at: string;
}

export const useTransportation = () => {
  const { user } = useAuth();
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [agencyRequests, setAgencyRequests] = useState<AgencyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRideRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRideRequests(data || []);
    } catch (error) {
      console.error('Error fetching ride requests:', error);
      toast({
        title: "Error",
        description: "Failed to load ride requests",
        variant: "destructive"
      });
    }
  };

  const fetchAgencyRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agency_transportation_requests')
        .select('*')
        .eq('agency_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgencyRequests(data || []);
    } catch (error) {
      console.error('Error fetching agency requests:', error);
      toast({
        title: "Error",
        description: "Failed to load agency requests",
        variant: "destructive"
      });
    }
  };

  const submitRideRequest = async (requestData: Partial<RideRequest>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('ride_requests')
        .insert({
          requester_id: user.id,
          pickup_address: requestData.pickup_address || '',
          destination_address: requestData.destination_address || '',
          ride_type: requestData.ride_type || '',
          requested_pickup_time: requestData.requested_pickup_time || '',
          passenger_count: requestData.passenger_count || 1,
          special_requirements: requestData.special_requirements,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Ride Request Submitted",
        description: "Your ride request has been sent to available drivers.",
      });

      fetchRideRequests();
      return true;
    } catch (error) {
      console.error('Error submitting ride request:', error);
      toast({
        title: "Error",
        description: "Failed to submit ride request",
        variant: "destructive"
      });
      return false;
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
      return true;
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast({
        title: "Error",
        description: "Failed to cancel ride request",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRideRequests();
      fetchAgencyRequests();
      setLoading(false);
    }
  }, [user]);

  return {
    rideRequests,
    agencyRequests,
    loading,
    submitRideRequest,
    cancelRideRequest,
    fetchRideRequests,
    fetchAgencyRequests
  };
};
