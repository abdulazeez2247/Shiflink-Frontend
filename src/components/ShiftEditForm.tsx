
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { PostedShift } from './PostedShiftsList';

interface ShiftEditFormProps {
  shift: PostedShift;
  onShiftUpdated: (updatedShift: PostedShift) => void;
  onCancel: () => void;
}

const ShiftEditForm = ({ shift, onShiftUpdated, onCancel }: ShiftEditFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: shift.title,
    clientName: shift.clientName,
    date: shift.date,
    startTime: shift.startTime,
    endTime: shift.endTime,
    location: shift.location,
    address: shift.address,
    hourlyRate: shift.hourlyRate,
    shiftType: shift.shiftType,
    requiredCredentials: shift.requiredCredentials,
    description: shift.description,
    specialRequirements: shift.specialRequirements,
    status: shift.status
  });

  const credentialOptions = [
    'CPR Certification',
    'First Aid',
    'Background Check',
    'Medication Administration',
    'Behavioral Intervention',
    'Vehicle Insurance',
    'Food Safety',
    'HIPAA Training'
  ];

  const shiftTypes = [
    'Personal Care',
    'Medication Administration',
    'Behavioral Support',
    'Transportation',
    'Overnight Care',
    'Respite Care',
    'Community Integration',
    'Medical Assistance'
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'filled', label: 'Filled' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleCredentialChange = (credential: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requiredCredentials: checked 
        ? [...prev.requiredCredentials, credential]
        : prev.requiredCredentials.filter(c => c !== credential)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.clientName || !formData.date || !formData.startTime || !formData.endTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const updatedShift: PostedShift = {
      ...shift,
      ...formData
    };

    onShiftUpdated(updatedShift);
    
    toast({
      title: "Shift Updated",
      description: `"${formData.title}" has been updated successfully.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Shift</CardTitle>
        <CardDescription>Update the details for this shift posting</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Shift Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Personal Care Assistant"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Client or individual's name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City or general area"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Complete address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                placeholder="25.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shiftType">Shift Type</Label>
              <Select value={formData.shiftType} onValueChange={(value) => setFormData(prev => ({ ...prev, shiftType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent>
                  {shiftTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'active' | 'filled' | 'cancelled') => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Required Credentials</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {credentialOptions.map((credential) => (
                <div key={credential} className="flex items-center space-x-2">
                  <Checkbox
                    id={credential}
                    checked={formData.requiredCredentials.includes(credential)}
                    onCheckedChange={(checked) => handleCredentialChange(credential, checked as boolean)}
                  />
                  <Label htmlFor={credential} className="text-sm font-normal cursor-pointer">
                    {credential}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Shift Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the shift requirements, duties, and any important information..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequirements">Special Requirements</Label>
            <Textarea
              id="specialRequirements"
              value={formData.specialRequirements}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
              placeholder="Any special requirements, equipment needed, or additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-medical-blue hover:bg-blue-800">
              Update Shift
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShiftEditForm;
