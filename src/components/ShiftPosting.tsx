import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, DollarSign, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShiftData {
  title: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  hourlyRate: string;
  shiftType: string;
  requiredCredentials: string[];
  description: string;
  specialRequirements: string;
}

interface ShiftPostingProps {
  onShiftPosted?: (shiftData: ShiftData) => void;
}

const ShiftPosting = ({ onShiftPosted }: ShiftPostingProps) => {
  const { toast } = useToast();
  const [shiftData, setShiftData] = useState<ShiftData>({
    title: '',
    clientName: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    hourlyRate: '',
    shiftType: '',
    requiredCredentials: [],
    description: '',
    specialRequirements: ''
  });

  const shiftTypes = [
    'Personal Care',
    'Companionship',
    'Medication Administration',
    'Behavioral Support',
    'Respite Care',
    'Transportation'
  ];

  const availableCredentials = [
    'CPR Certification',
    'First Aid',
    'Medication Administration',
    'Background Check',
    'Behavioral Intervention',
    'Vehicle Insurance'
  ];

  const handleInputChange = (field: keyof ShiftData, value: string) => {
    setShiftData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCredentialToggle = (credential: string) => {
    setShiftData(prev => ({
      ...prev,
      requiredCredentials: prev.requiredCredentials.includes(credential)
        ? prev.requiredCredentials.filter(c => c !== credential)
        : [...prev.requiredCredentials, credential]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Shift posted:', shiftData);
    
    toast({
      title: "Shift Posted Successfully!",
      description: `"${shiftData.title}" has been posted and DSPs will be notified.`,
    });

    // Call the callback if provided
    onShiftPosted?.(shiftData);

    // Reset form
    setShiftData({
      title: '',
      clientName: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      address: '',
      hourlyRate: '',
      shiftType: '',
      requiredCredentials: [],
      description: '',
      specialRequirements: ''
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-6 h-6" />
          <span>Post New Shift</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Shift Title</Label>
              <Input
                id="title"
                value={shiftData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Personal Care for Senior Client"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={shiftData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="e.g., Mrs. Johnson"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={shiftData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Time</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  value={shiftData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                />
                <Input
                  type="time"
                  value={shiftData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>City</span>
              </Label>
              <Input
                id="location"
                value={shiftData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Sacramento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate" className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>Hourly Rate</span>
              </Label>
              <Input
                id="hourlyRate"
                value={shiftData.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                placeholder="e.g., 20"
                type="number"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              value={shiftData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Full address for GPS verification"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shiftType">Shift Type</Label>
            <Select value={shiftData.shiftType} onValueChange={(value) => handleInputChange('shiftType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select shift type" />
              </SelectTrigger>
              <SelectContent>
                {shiftTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Required Credentials</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableCredentials.map(credential => (
                <label key={credential} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shiftData.requiredCredentials.includes(credential)}
                    onChange={() => handleCredentialToggle(credential)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{credential}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Shift Description</Label>
            <Textarea
              id="description"
              value={shiftData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the care needs and responsibilities..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequirements">Special Requirements</Label>
            <Textarea
              id="specialRequirements"
              value={shiftData.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
              placeholder="Any special requirements or notes..."
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full bg-medical-blue hover:bg-blue-800" size="lg">
            Post Shift
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShiftPosting;
