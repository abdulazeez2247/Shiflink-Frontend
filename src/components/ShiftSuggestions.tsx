import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Award, 
  Calendar,
  Filter,
  RefreshCw,
  Zap
} from 'lucide-react';
import { calculateShiftMatches, getTopMatches } from '@/utils/matchingAlgorithm';
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, this would come from your backend
const mockDSPProfile = {
  id: '1',
  personalInfo: {
    address: {
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95816'
    }
  },
  professionalInfo: {
    certifications: ['CPR Certification', 'First Aid', 'Medication Administration'],
    skills: ['Personal Care', 'Behavioral Support', 'Communication'],
    experience: '3 years',
    availability: {
      fullTime: true,
      partTime: true,
      weekends: true,
      evenings: false
    }
  },
  preferences: {
    maxDistance: 25,
    preferredRates: {
      min: 20,
      max: 35
    },
    preferredShiftTypes: ['Personal Care', 'Companionship', 'Behavioral Support'],
    preferredSchedule: ['Morning', 'Afternoon']
  },
  stats: {
    rating: 4.8,
    completionRate: 96
  }
};

const mockShifts = [
  {
    id: '1',
    title: 'Personal Care for Senior Client',
    clientName: 'Mrs. Johnson',
    date: '2024-06-25',
    startTime: '08:00',
    endTime: '16:00',
    location: 'Sacramento',
    address: '123 Oak Street, Sacramento, CA 95816',
    hourlyRate: 24,
    shiftType: 'Personal Care',
    requiredCredentials: ['CPR Certification', 'First Aid'],
    description: 'Assistance with daily living activities for elderly client',
    specialRequirements: 'Experience with mobility assistance preferred',
    urgency: 'medium' as const
  },
  {
    id: '2',
    title: 'Behavioral Support - Urgent',
    clientName: 'David M.',
    date: '2024-06-24',
    startTime: '14:00',
    endTime: '22:00',
    location: 'Sacramento',
    address: '456 Pine Avenue, Sacramento, CA 95817',
    hourlyRate: 28,
    shiftType: 'Behavioral Support',
    requiredCredentials: ['Behavioral Intervention', 'CPR Certification'],
    description: 'Behavioral support for young adult with developmental disabilities',
    specialRequirements: 'Crisis intervention training required',
    urgency: 'high' as const
  },
  {
    id: '3',
    title: 'Companionship Services',
    clientName: 'Mr. Thompson',
    date: '2024-06-26',
    startTime: '10:00',
    endTime: '14:00',
    location: 'Sacramento',
    address: '789 Maple Drive, Sacramento, CA 95818',
    hourlyRate: 22,
    shiftType: 'Companionship',
    requiredCredentials: ['Background Check'],
    description: 'Social companionship and light assistance',
    specialRequirements: 'Must have reliable transport',
    urgency: 'low' as const
  }
];

const ShiftSuggestions = () => {
  const [matches, setMatches] = useState<ReturnType<typeof calculateShiftMatches>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    minScore: 60,
    shiftType: 'all',
    urgency: 'all'
  });
  const { toast } = useToast();

  const calculateMatches = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const allMatches = calculateShiftMatches(mockDSPProfile, mockShifts);
      setMatches(allMatches);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    calculateMatches();
  }, []);

  const filteredMatches = getTopMatches(matches, selectedFilters.minScore, 10).filter(match => {
    if (selectedFilters.shiftType !== 'all' && match.shift.shiftType !== selectedFilters.shiftType) {
      return false;
    }
    if (selectedFilters.urgency !== 'all' && match.shift.urgency !== selectedFilters.urgency) {
      return false;
    }
    return true;
  });

  const handleApplyShift = (shift: typeof mockShifts[0]) => {
    toast({
      title: "Application Submitted",
      description: `Your application for "${shift.title}" has been submitted successfully.`,
    });
  };

  const handleUpdateProfilePreferences = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile preferences have been updated successfully.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUrgencyBadge = (urgency: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[urgency as keyof typeof colors] || colors.low;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shift Suggestions</h2>
          <p className="text-gray-600">AI-powered matches based on your profile and preferences</p>
        </div>
        <Button onClick={calculateMatches} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Calculating...' : 'Refresh Matches'}
        </Button>
      </div>

      <Tabs defaultValue="suggestions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggestions">Top Matches</TabsTrigger>
          <TabsTrigger value="filters">Filters & Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          {filteredMatches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  {isLoading ? (
                    <div className="flex flex-col items-center space-y-2">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                      <p>Finding your perfect matches...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Filter className="w-8 h-8 mx-auto" />
                      <p>No shifts match your current criteria</p>
                      <p className="text-sm">Try adjusting your filters or preferences</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredMatches.map((match) => (
                <Card key={match.shiftId} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{match.shift.title}</CardTitle>
                        <CardDescription>Client: {match.shift.clientName}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getUrgencyBadge(match.shift.urgency)}>
                          {match.shift.urgency === 'high' && <Zap className="w-3 h-3 mr-1" />}
                          {match.shift.urgency}
                        </Badge>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getScoreColor(match.score)}`}>
                            {match.score.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">match</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={match.score} className="h-2" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(match.shift.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{match.shift.startTime} - {match.shift.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-green-600">${match.shift.hourlyRate}/hr</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{match.shift.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span>+{match.shift.requiredCredentials.length} credentials</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Why this matches you:</h4>
                      <div className="text-xs space-y-1">
                        {match.reasons.slice(0, 3).map((reason, index) => (
                          <div key={index} className="text-gray-600">{reason}</div>
                        ))}
                        {match.reasons.length > 3 && (
                          <div className="text-gray-500">+{match.reasons.length - 3} more reasons</div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-medical-blue hover:bg-blue-800"
                        onClick={() => handleApplyShift(match.shift)}
                      >
                        Apply for Shift
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matching Preferences</CardTitle>
              <CardDescription>Adjust your preferences to get better matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Match Score</label>
                  <select 
                    value={selectedFilters.minScore} 
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, minScore: Number(e.target.value) }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={40}>40% - Show all matches</option>
                    <option value={60}>60% - Good matches</option>
                    <option value={80}>80% - Great matches only</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shift Type</label>
                  <select 
                    value={selectedFilters.shiftType} 
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, shiftType: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Types</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Companionship">Companionship</option>
                    <option value="Behavioral Support">Behavioral Support</option>
                    <option value="Respite Care">Respite Care</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Urgency</label>
                  <select 
                    value={selectedFilters.urgency} 
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Urgency Levels</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Current Profile Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Max Distance:</strong> {mockDSPProfile.preferences.maxDistance} miles
                  </div>
                  <div>
                    <strong>Rate Range:</strong> ${mockDSPProfile.preferences.preferredRates.min}-${mockDSPProfile.preferences.preferredRates.max}/hr
                  </div>
                  <div>
                    <strong>Certifications:</strong> {mockDSPProfile.professionalInfo.certifications.length} active
                  </div>
                  <div>
                    <strong>Rating:</strong> {mockDSPProfile.stats.rating}/5.0 ⭐
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-3"
                  onClick={handleUpdateProfilePreferences}
                >
                  Update Profile Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShiftSuggestions;
