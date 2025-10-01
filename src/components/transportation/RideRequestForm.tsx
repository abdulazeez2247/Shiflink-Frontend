
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MapPin, Clock, User } from 'lucide-react';

const RideRequestForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup_address: '',
    destination_address: '',
    ride_type: '',
    requested_pickup_time: '',
    special_requirements: '',
    passenger_count: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ride_requests')
        .insert({
          requester_id: user.id,
          ...formData,
          requested_pickup_time: new Date(formData.requested_pickup_time).toISOString()
        });

      if (error) throw error;

      toast({
        title: "Ride Request Submitted",
        description: "Your ride request has been sent to available drivers in your area.",
      });

      // Reset form
      setFormData({
        pickup_address: '',
        destination_address: '',
        ride_type: '',
        requested_pickup_time: '',
        special_requirements: '',
        passenger_count: 1
      });

    } catch (error) {
      console.error('Error submitting ride request:', error);
      toast({
        title: "Error",
        description: "Failed to submit ride request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Request Transportation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickup">Pickup Address</Label>
              <Input
                id="pickup"
                value={formData.pickup_address}
                onChange={(e) => handleInputChange('pickup_address', e.target.value)}
                placeholder="Enter pickup address"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="destination">Destination Address</Label>
              <Input
                id="destination"
                value={formData.destination_address}
                onChange={(e) => handleInputChange('destination_address', e.target.value)}
                placeholder="Enter destination address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ride_type">Ride Type</Label>
              <Select onValueChange={(value) => handleInputChange('ride_type', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select ride type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to_shift">To Shift</SelectItem>
                  <SelectItem value="from_shift">From Shift</SelectItem>
                  <SelectItem value="agency_client">Agency Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pickup_time">Pickup Time</Label>
              <Input
                id="pickup_time"
                type="datetime-local"
                value={formData.requested_pickup_time}
                onChange={(e) => handleInputChange('requested_pickup_time', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="passengers">Passengers</Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="8"
                value={formData.passenger_count}
                onChange={(e) => handleInputChange('passenger_count', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="requirements">Special Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.special_requirements}
              onChange={(e) => handleInputChange('special_requirements', e.target.value)}
              placeholder="Any special requirements or notes for the driver..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Request Ride'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RideRequestForm;
