
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Clock, MapPin, Play, Square, Navigation, AlertCircle, CheckCircle } from 'lucide-react';
import { useEVVShifts } from '@/hooks/useEVVShifts';
import { getCurrentLocation, LocationResult } from '@/utils/geoLocation';
import ClientSelector from '@/components/ClientSelector';
import { toast } from 'sonner';

const ClockInOut = () => {
  const { shifts, clients, currentShift, loading, clockIn, clockOut } = useEVVShifts();
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clockingIn, setClockingIn] = useState(false);
  const [clockingOut, setClockingOut] = useState(false);
  const [clockOutNotes, setClockOutNotes] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getLocation = async () => {
    setGettingLocation(true);
    try {
      const locationResult = await getCurrentLocation();
      setLocation(locationResult);
      setLocationError(null);
      toast.success('Location updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setLocationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGettingLocation(false);
    }
  };

  const handleStartShift = async () => {
    if (!selectedClientId || !location) return;

    setClockingIn(true);
    try {
      await clockIn(selectedClientId, location.coords, location.address);
      toast.success('Successfully clocked in!');
      setSelectedClientId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clock in';
      toast.error(errorMessage);
    } finally {
      setClockingIn(false);
    }
  };

  const handleClockOut = async () => {
    if (!location) return;

    setClockingOut(true);
    try {
      await clockOut(location.coords, location.address, clockOutNotes || undefined);
      toast.success('Successfully clocked out!');
      setClockOutNotes('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clock out';
      toast.error(errorMessage);
    } finally {
      setClockingOut(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-lg">Loading EVV system...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-lg text-gray-600">
            {currentTime.toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locationError ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          ) : location ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <Navigation className="w-3 h-3 mr-1" />
                  GPS Located
                </Badge>
                <span className="text-sm text-gray-600">
                  {location.coords.lat.toFixed(6)}, {location.coords.lng.toFixed(6)}
                </span>
              </div>
              {location.address && (
                <div className="text-sm text-gray-600 ml-6">
                  {location.address}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Navigation className="w-3 h-3 mr-1" />
                Getting Location...
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={getLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? 'Getting...' : 'Retry'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Shift Status */}
      {currentShift && (
        <Card>
          <CardHeader>
            <CardTitle>Current Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Client:</span>
                <span>{clients.find(c => c.id === currentShift.client_id)?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Facility:</span>
                <span>{currentShift.facility_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Start Time:</span>
                <span>{new Date(currentShift.actual_clock_in_time!).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>
                  {Math.floor((currentTime.getTime() - new Date(currentShift.actual_clock_in_time!).getTime()) / 60000)} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Medicaid ID:</span>
                <span className="font-mono text-sm">{currentShift.medicaid_id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clock In/Out Controls */}
      {!currentShift ? (
        <ClientSelector
          clients={clients}
          selectedClientId={selectedClientId}
          onClientSelect={setSelectedClientId}
          onStartShift={handleStartShift}
          loading={clockingIn}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>End Shift</CardTitle>
            <CardDescription>
              Add any notes about the shift and clock out
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Shift Notes (Optional)
              </label>
              <Textarea
                value={clockOutNotes}
                onChange={(e) => setClockOutNotes(e.target.value)}
                placeholder="Enter any notes about the shift, services provided, or client updates..."
                rows={3}
              />
            </div>
            
            <Button 
              onClick={handleClockOut}
              disabled={!location || clockingOut}
              className="w-full h-16 text-lg bg-red-600 hover:bg-red-700"
            >
              <Square className="w-6 h-6 mr-2" />
              {clockingOut ? 'Clocking Out...' : 'Clock Out'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* EVV Compliance Alert */}
      {!location && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            GPS location is required for EVV compliance. Please enable location services and allow location access.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Shifts Summary */}
      {shifts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shifts.slice(0, 3).map((shift) => (
                <div key={shift.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">
                      {clients.find(c => c.id === shift.client_id)?.name || 'Unknown Client'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(shift.shift_date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={shift.status === 'completed' ? 'default' : 'secondary'}>
                    {shift.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClockInOut;
