import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, User, Mail, Phone, MapPin, Building, Award, Save, X, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
  id?: string;
  userType: 'dsp' | 'agency' | 'trainer' | 'admin' | 'county';
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  professionalInfo: {
    title: string;
    bio: string;
    experience: string;
    certifications: string[];
    skills: string[];
    availability?: {
      fullTime: boolean;
      partTime: boolean;
      weekends: boolean;
      evenings: boolean;
    };
  };
  organizationInfo?: {
    organizationName: string;
    organizationType: string;
    licenseNumber?: string;
    capacity?: number;
    servicesOffered?: string[];
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisible: boolean;
      contactVisible: boolean;
    };
  };
}

interface ProfileManagerProps {
  userType: 'dsp' | 'agency' | 'trainer' | 'admin' | 'county';
  existingProfile?: ProfileData;
  onSave: (profile: ProfileData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const ProfileManager = ({ userType, existingProfile, onSave, onCancel, isEditing = false }: ProfileManagerProps) => {
  const [profile, setProfile] = useState<ProfileData>({
    userType,
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    },
    professionalInfo: {
      title: '',
      bio: '',
      experience: '',
      certifications: [],
      skills: []
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      privacy: {
        profileVisible: true,
        contactVisible: false
      }
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCertification, setNewCertification] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingProfile) {
      setProfile(existingProfile);
    }
  }, [existingProfile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profile.personalInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!profile.personalInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!profile.personalInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.personalInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!profile.personalInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Role-specific validations
    if (userType === 'agency' && profile.organizationInfo && !profile.organizationInfo.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required for agencies';
    }
    if (userType === 'trainer' && !profile.professionalInfo.title.trim()) {
      newErrors.title = 'Professional title is required for trainers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(profile);
    }
  };

  const addCertification = () => {
    if (newCertification.trim() && !profile.professionalInfo.certifications.includes(newCertification.trim())) {
      setProfile(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          certifications: [...prev.professionalInfo.certifications, newCertification.trim()]
        }
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setProfile(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        certifications: prev.professionalInfo.certifications.filter(c => c !== cert)
      }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.professionalInfo.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          skills: [...prev.professionalInfo.skills, newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        skills: prev.professionalInfo.skills.filter(s => s !== skill)
      }
    }));
  };

  const getUserTypeTitle = () => {
    const titles = {
      dsp: 'Direct Support Professional',
      agency: 'Agency Administrator',
      trainer: 'Certified Trainer',
      admin: 'System Administrator',
      county: 'County Board Member'
    };
    return titles[userType];
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        toast({
          title: "Success",
          description: "Profile image uploaded successfully"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const renderPersonalInfoTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={profileImage || "/placeholder.svg"} />
          <AvatarFallback className="text-lg">
            {profile.personalInfo.firstName[0]}{profile.personalInfo.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Button variant="outline" size="sm" onClick={triggerFileUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-500">Max size: 5MB. Formats: JPG, PNG, GIF</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={profile.personalInfo.firstName}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, firstName: e.target.value }
            }))}
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={profile.personalInfo.lastName}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, lastName: e.target.value }
            }))}
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={profile.personalInfo.email}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: e.target.value }
            }))}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={profile.personalInfo.phone}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        {userType === 'dsp' && (
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={profile.personalInfo.dateOfBirth || ''}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
              }))}
            />
          </div>
        )}
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h4 className="font-medium">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={profile.personalInfo.address.street}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo,
                  address: { ...prev.personalInfo.address, street: e.target.value }
                }
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={profile.personalInfo.address.city}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo,
                  address: { ...prev.personalInfo.address, city: e.target.value }
                }
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={profile.personalInfo.address.state}
              onValueChange={(value) => setProfile(prev => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo,
                  address: { ...prev.personalInfo.address, state: value }
                }
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OH">Ohio</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={profile.personalInfo.address.zipCode}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo,
                  address: { ...prev.personalInfo.address, zipCode: e.target.value }
                }
              }))}
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact for DSPs */}
      {userType === 'dsp' && (
        <div className="space-y-4">
          <h4 className="font-medium">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Name</Label>
              <Input
                id="emergencyName"
                value={profile.personalInfo.emergencyContact?.name || ''}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    emergencyContact: {
                      ...prev.personalInfo.emergencyContact,
                      name: e.target.value,
                      relationship: prev.personalInfo.emergencyContact?.relationship || '',
                      phone: prev.personalInfo.emergencyContact?.phone || ''
                    }
                  }
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship">Relationship</Label>
              <Input
                id="emergencyRelationship"
                value={profile.personalInfo.emergencyContact?.relationship || ''}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    emergencyContact: {
                      ...prev.personalInfo.emergencyContact,
                      name: prev.personalInfo.emergencyContact?.name || '',
                      relationship: e.target.value,
                      phone: prev.personalInfo.emergencyContact?.phone || ''
                    }
                  }
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Phone</Label>
              <Input
                id="emergencyPhone"
                value={profile.personalInfo.emergencyContact?.phone || ''}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    emergencyContact: {
                      ...prev.personalInfo.emergencyContact,
                      name: prev.personalInfo.emergencyContact?.name || '',
                      relationship: prev.personalInfo.emergencyContact?.relationship || '',
                      phone: e.target.value
                    }
                  }
                }))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfessionalInfoTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title {userType === 'trainer' && '*'}</Label>
          <Input
            id="title"
            value={profile.professionalInfo.title}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              professionalInfo: { ...prev.professionalInfo, title: e.target.value }
            }))}
            className={errors.title ? 'border-red-500' : ''}
            placeholder={userType === 'dsp' ? 'e.g., Direct Support Professional' : 
                        userType === 'trainer' ? 'e.g., Certified Healthcare Instructor' :
                        userType === 'agency' ? 'e.g., Agency Director' : ''}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea
            id="bio"
            value={profile.professionalInfo.bio}
            onChange={(e) => setProfile(prev => ({
              ...prev,
              professionalInfo: { ...prev.professionalInfo, bio: e.target.value }
            }))}
            rows={4}
            placeholder="Describe your professional background, experience, and expertise..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Select
            value={profile.professionalInfo.experience}
            onValueChange={(value) => setProfile(prev => ({
              ...prev,
              professionalInfo: { ...prev.professionalInfo, experience: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">0-1 years</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <h4 className="font-medium">Certifications</h4>
        <div className="flex space-x-2">
          <Input
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            placeholder="Add certification..."
            onKeyPress={(e) => e.key === 'Enter' && addCertification()}
          />
          <Button onClick={addCertification} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.professionalInfo.certifications.map((cert, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              <Award className="w-3 h-3 mr-1" />
              {cert}
              <button
                onClick={() => removeCertification(cert)}
                className="ml-2 text-gray-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h4 className="font-medium">Skills</h4>
        <div className="flex space-x-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill..."
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.professionalInfo.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="px-3 py-1">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 text-gray-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Availability for DSPs */}
      {userType === 'dsp' && (
        <div className="space-y-4">
          <h4 className="font-medium">Availability</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'fullTime', label: 'Full Time' },
              { key: 'partTime', label: 'Part Time' },
              { key: 'weekends', label: 'Weekends' },
              { key: 'evenings', label: 'Evenings' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={profile.professionalInfo.availability?.[key as keyof typeof profile.professionalInfo.availability] || false}
                  onCheckedChange={(checked) => setProfile(prev => ({
                    ...prev,
                    professionalInfo: {
                      ...prev.professionalInfo,
                      availability: {
                        ...prev.professionalInfo.availability,
                        fullTime: prev.professionalInfo.availability?.fullTime || false,
                        partTime: prev.professionalInfo.availability?.partTime || false,
                        weekends: prev.professionalInfo.availability?.weekends || false,
                        evenings: prev.professionalInfo.availability?.evenings || false,
                        [key]: !!checked
                      }
                    }
                  }))}
                />
                <Label htmlFor={key}>{label}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderOrganizationInfoTab = () => {
    if (userType !== 'agency' && userType !== 'county') return null;

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name *</Label>
            <Input
              id="organizationName"
              value={profile.organizationInfo?.organizationName || ''}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                organizationInfo: {
                  ...prev.organizationInfo,
                  organizationName: e.target.value,
                  organizationType: prev.organizationInfo?.organizationType || '',
                  licenseNumber: prev.organizationInfo?.licenseNumber,
                  capacity: prev.organizationInfo?.capacity,
                  servicesOffered: prev.organizationInfo?.servicesOffered || []
                }
              }))}
              className={errors.organizationName ? 'border-red-500' : ''}
            />
            {errors.organizationName && <p className="text-sm text-red-500">{errors.organizationName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationType">Organization Type</Label>
            <Select
              value={profile.organizationInfo?.organizationType || ''}
              onValueChange={(value) => setProfile(prev => ({
                ...prev,
                organizationInfo: {
                  ...prev.organizationInfo,
                  organizationName: prev.organizationInfo?.organizationName || '',
                  organizationType: value,
                  licenseNumber: prev.organizationInfo?.licenseNumber,
                  capacity: prev.organizationInfo?.capacity,
                  servicesOffered: prev.organizationInfo?.servicesOffered || []
                }
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent>
                {userType === 'agency' && (
                  <>
                    <SelectItem value="residential">Residential Agency</SelectItem>
                    <SelectItem value="day-program">Day Program</SelectItem>
                    <SelectItem value="supported-living">Supported Living</SelectItem>
                    <SelectItem value="vocational">Vocational Services</SelectItem>
                  </>
                )}
                {userType === 'county' && (
                  <>
                    <SelectItem value="county-board">County Board</SelectItem>
                    <SelectItem value="regional-office">Regional Office</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {userType === 'agency' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={profile.organizationInfo?.licenseNumber || ''}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    organizationInfo: {
                      ...prev.organizationInfo,
                      organizationName: prev.organizationInfo?.organizationName || '',
                      organizationType: prev.organizationInfo?.organizationType || '',
                      licenseNumber: e.target.value,
                      capacity: prev.organizationInfo?.capacity,
                      servicesOffered: prev.organizationInfo?.servicesOffered || []
                    }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Client Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={profile.organizationInfo?.capacity || ''}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    organizationInfo: {
                      ...prev.organizationInfo,
                      organizationName: prev.organizationInfo?.organizationName || '',
                      organizationType: prev.organizationInfo?.organizationType || '',
                      licenseNumber: prev.organizationInfo?.licenseNumber,
                      capacity: parseInt(e.target.value) || undefined,
                      servicesOffered: prev.organizationInfo?.servicesOffered || []
                    }
                  }))}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Notification Preferences</h4>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email Notifications', icon: Mail },
            { key: 'sms', label: 'SMS Notifications', icon: Phone },
            { key: 'push', label: 'Push Notifications', icon: User }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <Label htmlFor={key}>{label}</Label>
              </div>
              <Switch
                id={key}
                checked={profile.preferences.notifications[key as keyof typeof profile.preferences.notifications]}
                onCheckedChange={(checked) => setProfile(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    notifications: {
                      ...prev.preferences.notifications,
                      [key]: checked
                    }
                  }
                }))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Privacy Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <Label htmlFor="profileVisible">Profile Visible to Others</Label>
            </div>
            <Switch
              id="profileVisible"
              checked={profile.preferences.privacy.profileVisible}
              onCheckedChange={(checked) => setProfile(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  privacy: {
                    ...prev.preferences.privacy,
                    profileVisible: checked
                  }
                }
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <Label htmlFor="contactVisible">Contact Info Visible</Label>
            </div>
            <Switch
              id="contactVisible"
              checked={profile.preferences.privacy.contactVisible}
              onCheckedChange={(checked) => setProfile(prev => ({
                ...prev,
                preferences: {
                  ...prev.preferences,
                  privacy: {
                    ...prev.preferences.privacy,
                    contactVisible: checked
                  }
                }
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Profile' : 'Create Profile'}
          </h2>
          <p className="text-gray-600">{getUserTypeTitle()}</p>
        </div>
        <div className="flex space-x-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Save Changes' : 'Create Profile'}
          </Button>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <Alert>
          <AlertDescription>
            Please correct the errors below before saving your profile.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Complete your profile to get started with the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              {(userType === 'agency' || userType === 'county') && (
                <TabsTrigger value="organization">Organization</TabsTrigger>
              )}
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              {renderPersonalInfoTab()}
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              {renderProfessionalInfoTab()}
            </TabsContent>

            {(userType === 'agency' || userType === 'county') && (
              <TabsContent value="organization" className="space-y-6">
                {renderOrganizationInfoTab()}
              </TabsContent>
            )}

            <TabsContent value="preferences" className="space-y-6">
              {renderPreferencesTab()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManager;
