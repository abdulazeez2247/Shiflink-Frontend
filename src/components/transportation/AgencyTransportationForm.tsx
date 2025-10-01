
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Building, User, Calendar, Accessibility } from 'lucide-react';

const AgencyTransportationForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    pickup_address: '',
    destination_address: '',
    requested_pickup_time: '',
    is_recurring: false,
    wheelchair_accessible: false,
    passenger_count: 1,
    special_needs: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('agency_transportation_requests')
        .insert({
          agency_id: user.id,
          ...formData,
          requested_pickup_time: new Date(formData.requested_pickup_time).toISOString()
        });

      if (error) throw error;

      toast({
        title: "Transportation Request Submitted",
        description: "Your client transportation request has been posted. Transportation companies will provide quotes.",
      });

      // Reset form
      setFormData({
        client_name: '',
        pickup_address: '',
        destination_address: '',
        requested_pickup_time: '',
        is_recurring: false,
        wheelchair_accessible: false,
        passenger_count: 1,
        special_needs: '',
        notes: ''
      });

    } catch (error) {
      console.error('Error submitting transportation request:', error);
      toast({
        title: "Error",
        description: "Failed to submit transportation request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Request Client Transportation
        </CardTitle>
        <p className="text-sm text-gray-600">
          Submit transportation requests for your clients. Transportation companies will provide quotes.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                placeholder="Enter client's name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="passengers">Number of Passengers</Label>
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

          <div>
            <Label htmlFor="pickup_time">Requested Pickup Time</Label>
            <Input
              id="pickup_time"
              type="datetime-local"
              value={formData.requested_pickup_time}
              onChange={(e) => handleInputChange('requested_pickup_time', e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) => handleInputChange('is_recurring', !!checked)}
              />
              <Label htmlFor="recurring" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                This is a recurring transportation need
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="wheelchair"
                checked={formData.wheelchair_accessible}
                onCheckedChange={(checked) => handleInputChange('wheelchair_accessible', !!checked)}
              />
              <Label htmlFor="wheelchair" className="flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                Wheelchair accessible vehicle required
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="special_needs">Special Needs</Label>
            <Textarea
              id="special_needs"
              value={formData.special_needs}
              onChange={(e) => handleInputChange('special_needs', e.target.value)}
              placeholder="Any special accommodations or medical needs..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information for transportation providers..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <User className="h-4 w-4 mr-2" />
            {loading ? 'Submitting...' : 'Submit Transportation Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgencyTransportationForm;
