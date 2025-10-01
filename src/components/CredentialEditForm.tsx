import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CredentialItem {
  id: string;
  name: string;
  type: 'certification' | 'license' | 'training';
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'pending_renewal';
  progress: number;
  attachments: number;
}

interface CredentialEditFormProps {
  credential: CredentialItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCredentialUpdated?: (credential: CredentialItem) => void;
}

const CredentialEditForm = ({ credential, open, onOpenChange, onCredentialUpdated }: CredentialEditFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: credential?.name || '',
    type: credential?.type || '',
    issuer: credential?.issuer || '',
    issueDate: credential?.issueDate || '',
    expiryDate: credential?.expiryDate || ''
  });

  // Update form data when credential changes
  React.useEffect(() => {
    if (credential) {
      setFormData({
        name: credential.name,
        type: credential.type,
        issuer: credential.issuer,
        issueDate: credential.issueDate,
        expiryDate: credential.expiryDate
      });
    }
  }, [credential]);

  const calculateStatus = (expiryDate: string): 'active' | 'expiring_soon' | 'expired' => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring_soon';
    return 'active';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credential || !formData.name || !formData.type || !formData.issuer || !formData.issueDate || !formData.expiryDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newStatus = calculateStatus(formData.expiryDate);
    const updatedCredential = {
      ...credential,
      name: formData.name,
      type: formData.type as 'certification' | 'license' | 'training',
      issuer: formData.issuer,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      status: newStatus
    };

    onCredentialUpdated?.(updatedCredential);
    
    toast({
      title: "Success",
      description: "Credential updated successfully!"
    });

    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!credential) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
          <DialogDescription>
            Update the details for your credential.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Credential Name *</Label>
            <Input
              id="edit-name"
              placeholder="e.g., CPR Certification"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select credential type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="license">License</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-issuer">Issuing Organization *</Label>
            <Input
              id="edit-issuer"
              placeholder="e.g., American Red Cross"
              value={formData.issuer}
              onChange={(e) => handleInputChange('issuer', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-issueDate">Issue Date *</Label>
              <Input
                id="edit-issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expiryDate">Expiry Date *</Label>
              <Input
                id="edit-expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Update Credential
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialEditForm;
