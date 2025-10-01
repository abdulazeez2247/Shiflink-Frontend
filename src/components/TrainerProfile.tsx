
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileManager from '@/components/ProfileManager';
import ProfileViewer from '@/components/ProfileViewer';
import { toast } from '@/hooks/use-toast';

const TrainerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock profile data - in a real app this would come from an API
  const [profile, setProfile] = useState({
    id: '1',
    userType: 'trainer' as const,
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      address: {
        street: '123 Main St',
        city: 'Columbus',
        state: 'OH',
        zipCode: '43215'
      }
    },
    professionalInfo: {
      title: 'Dr. Sarah Johnson',
      bio: 'Certified healthcare instructor with over 10 years of experience in emergency medicine and training. Specialized in CPR, First Aid, and medication administration.',
      experience: '10+ years',
      certifications: ['AHA CPR Instructor', 'First Aid Certified', 'ACLS Provider', 'Medication Administration'],
      skills: ['CPR Training', 'First Aid', 'Medical Education', 'Emergency Response']
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
    },
    stats: {
      rating: 4.8,
      shiftsCompleted: 156,
      yearsActive: 10,
      clientsServed: 156
    }
  });

  const handleSaveProfile = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully"
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <ProfileManager
        userType="trainer"
        existingProfile={profile}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
        isEditing={true}
      />
    );
  }

  return (
    <ProfileViewer
      profile={profile}
      onEdit={handleEditProfile}
      canEdit={true}
      isOwnProfile={true}
    />
  );
};

export default TrainerProfile;
