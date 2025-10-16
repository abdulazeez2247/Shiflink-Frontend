
// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import ProfileManager from '@/components/ProfileManager';
// import ProfileViewer from '@/components/ProfileViewer';
// import { toast } from '@/hooks/use-toast';

// const TrainerProfile = () => {
//   const [isEditing, setIsEditing] = useState(false);
  
//   // Mock profile data - in a real app this would come from an API
//   const [profile, setProfile] = useState({
//     id: '1',
//     userType: 'trainer' as const,
//     personalInfo: {
//       firstName: 'Sarah',
//       lastName: 'Johnson',
//       email: 'sarah.johnson@email.com',
//       phone: '(555) 123-4567',
//       address: {
//         street: '123 Main St',
//         city: 'Columbus',
//         state: 'OH',
//         zipCode: '43215'
//       }
//     },
//     professionalInfo: {
//       title: 'Dr. Sarah Johnson',
//       bio: 'Certified healthcare instructor with over 10 years of experience in emergency medicine and training. Specialized in CPR, First Aid, and medication administration.',
//       experience: '10+ years',
//       certifications: ['AHA CPR Instructor', 'First Aid Certified', 'ACLS Provider', 'Medication Administration'],
//       skills: ['CPR Training', 'First Aid', 'Medical Education', 'Emergency Response']
//     },
//     preferences: {
//       notifications: {
//         email: true,
//         sms: false,
//         push: true
//       },
//       privacy: {
//         profileVisible: true,
//         contactVisible: false
//       }
//     },
//     stats: {
//       rating: 4.8,
//       shiftsCompleted: 156,
//       yearsActive: 10,
//       clientsServed: 156
//     }
//   });

//   const handleSaveProfile = (updatedProfile: typeof profile) => {
//     setProfile(updatedProfile);
//     setIsEditing(false);
//     toast({
//       title: "Success",
//       description: "Profile updated successfully"
//     });
//   };

//   const handleEditProfile = () => {
//     setIsEditing(true);
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//   };

//   if (isEditing) {
//     return (
//       <ProfileManager
//         userType="trainer"
//         existingProfile={profile}
//         onSave={handleSaveProfile}
//         onCancel={handleCancelEdit}
//         isEditing={true}
//       />
//     );
//   }

//   return (
//     <ProfileViewer
//       profile={profile}
//       onEdit={handleEditProfile}
//       canEdit={true}
//       isOwnProfile={true}
//     />
//   );
// };

// export default TrainerProfile;
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const TrainerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
    },
    professionalInfo: {
      title: 'Dr. Sarah Johnson',
      bio: 'Certified healthcare instructor with over 10 years of experience in emergency medicine and training.',
      experience: '10+ years',
      certifications: ['AHA CPR Instructor', 'First Aid Certified', 'ACLS Provider'],
      skills: ['CPR Training', 'First Aid', 'Medical Education']
    }
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully"
    });
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your trainer profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input 
                className="w-full p-2 border rounded"
                value={profile.personalInfo.firstName}
                onChange={(e) => setProfile({
                  ...profile,
                  personalInfo: {...profile.personalInfo, firstName: e.target.value}
                })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input 
                className="w-full p-2 border rounded"
                value={profile.personalInfo.lastName}
                onChange={(e) => setProfile({
                  ...profile,
                  personalInfo: {...profile.personalInfo, lastName: e.target.value}
                })}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Professional Title</label>
            <input 
              className="w-full p-2 border rounded"
              value={profile.professionalInfo.title}
              onChange={(e) => setProfile({
                ...profile,
                professionalInfo: {...profile.professionalInfo, title: e.target.value}
              })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea 
              className="w-full p-2 border rounded"
              rows={4}
              value={profile.professionalInfo.bio}
              onChange={(e) => setProfile({
                ...profile,
                professionalInfo: {...profile.professionalInfo, bio: e.target.value}
              })}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Trainer Profile</CardTitle>
            <CardDescription>Your professional information and credentials</CardDescription>
          </div>
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p>{profile.personalInfo.firstName} {profile.personalInfo.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p>{profile.personalInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p>{profile.personalInfo.phone}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Professional Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Professional Title</p>
              <p>{profile.professionalInfo.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bio</p>
              <p>{profile.professionalInfo.bio}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Experience</p>
              <p>{profile.professionalInfo.experience}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Certifications</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.professionalInfo.certifications.map((cert, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainerProfile;