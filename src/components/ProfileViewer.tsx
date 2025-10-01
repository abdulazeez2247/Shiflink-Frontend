
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Building, Award, Edit, Star, Calendar, Users } from 'lucide-react';

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
  stats?: {
    rating?: number;
    shiftsCompleted?: number;
    yearsActive?: number;
    clientsServed?: number;
  };
}

interface ProfileViewerProps {
  profile: ProfileData;
  onEdit?: () => void;
  canEdit?: boolean;
  isOwnProfile?: boolean;
}

const ProfileViewer = ({ profile, onEdit, canEdit = false, isOwnProfile = false }: ProfileViewerProps) => {
  const getUserTypeTitle = () => {
    const titles = {
      dsp: 'Direct Support Professional',
      agency: 'Agency Administrator',
      trainer: 'Certified Trainer',
      admin: 'System Administrator',
      county: 'County Board Member'
    };
    return titles[profile.userType];
  };

  const getAvailabilityText = () => {
    if (!profile.professionalInfo.availability) return 'Not specified';
    
    const available = [];
    if (profile.professionalInfo.availability.fullTime) available.push('Full Time');
    if (profile.professionalInfo.availability.partTime) available.push('Part Time');
    if (profile.professionalInfo.availability.weekends) available.push('Weekends');
    if (profile.professionalInfo.availability.evenings) available.push('Evenings');
    
    return available.length > 0 ? available.join(', ') : 'Not specified';
  };

  const renderContactInfo = () => {
    if (!isOwnProfile && !profile.preferences.privacy.contactVisible) {
      return (
        <div className="text-sm text-gray-500 italic">
          Contact information is private
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="w-4 h-4 text-gray-500" />
          <span>{profile.personalInfo.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="w-4 h-4 text-gray-500" />
          <span>{profile.personalInfo.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>
            {profile.personalInfo.address.city}, {profile.personalInfo.address.state} {profile.personalInfo.address.zipCode}
          </span>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    if (!profile.stats) return null;

    const statItems = [
      { label: 'Rating', value: profile.stats.rating ? `${profile.stats.rating}/5` : 'N/A', icon: Star },
      { label: 'Shifts Completed', value: profile.stats.shiftsCompleted || 0, icon: Calendar },
      { label: 'Years Active', value: profile.stats.yearsActive || 0, icon: Award },
      { label: 'Clients Served', value: profile.stats.clientsServed || 0, icon: Users }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <div key={index} className="text-center">
            <stat.icon className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-start space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-lg">
                  {profile.personalInfo.firstName[0]}{profile.personalInfo.lastName[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.personalInfo.firstName} {profile.personalInfo.lastName}
                </h1>
                <p className="text-lg text-blue-600 mb-2">{profile.professionalInfo.title}</p>
                <p className="text-sm text-gray-600 mb-3">{getUserTypeTitle()}</p>
                
                {renderContactInfo()}
              </div>
            </div>

            {canEdit && (
              <Button onClick={onEdit} variant="outline" className="self-start">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {profile.stats && (
            <>
              <Separator className="my-6" />
              {renderStats()}
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Professional Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.professionalInfo.bio && (
                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-gray-700">{profile.professionalInfo.bio}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Experience</h4>
                <p className="text-gray-700">{profile.professionalInfo.experience}</p>
              </div>

              {profile.professionalInfo.certifications.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.professionalInfo.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.professionalInfo.skills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.professionalInfo.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.userType === 'dsp' && profile.professionalInfo.availability && (
                <div>
                  <h4 className="font-medium mb-2">Availability</h4>
                  <p className="text-gray-700">{getAvailabilityText()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organization Information */}
          {profile.organizationInfo && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <Building className="w-5 h-5 inline mr-2" />
                  Organization Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">Organization</h4>
                  <p className="text-gray-700">{profile.organizationInfo.organizationName}</p>
                </div>

                <div>
                  <h4 className="font-medium">Type</h4>
                  <p className="text-gray-700">{profile.organizationInfo.organizationType}</p>
                </div>

                {profile.organizationInfo.licenseNumber && (
                  <div>
                    <h4 className="font-medium">License Number</h4>
                    <p className="text-gray-700">{profile.organizationInfo.licenseNumber}</p>
                  </div>
                )}

                {profile.organizationInfo.capacity && (
                  <div>
                    <h4 className="font-medium">Client Capacity</h4>
                    <p className="text-gray-700">{profile.organizationInfo.capacity} clients</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">User Type</span>
                <span className="font-medium">{getUserTypeTitle()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{profile.professionalInfo.experience}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">
                  {profile.personalInfo.address.city}, {profile.personalInfo.address.state}
                </span>
              </div>

              {profile.userType === 'dsp' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-medium">{getAvailabilityText()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact (for own profile only) */}
          {isOwnProfile && profile.userType === 'dsp' && profile.personalInfo.emergencyContact && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <h4 className="font-medium">{profile.personalInfo.emergencyContact.name}</h4>
                  <p className="text-sm text-gray-600">{profile.personalInfo.emergencyContact.relationship}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{profile.personalInfo.emergencyContact.phone}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileViewer;
