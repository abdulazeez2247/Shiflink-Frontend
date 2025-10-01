import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar,
  Filter,
  Search,
  Zap,
  Star,
  Users
} from 'lucide-react';
import ShiftSuggestions from '@/components/ShiftSuggestions';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, this would come from your backend
const mockShifts = [
  {
    id: '1',
    title: 'Personal Care Assistant',
    clientName: 'Mrs. Johnson',
    date: '2024-06-25',
    startTime: '08:00',
    endTime: '16:00',
    location: 'Sacramento, CA',
    address: '123 Oak Street, Sacramento, CA 95816',
    hourlyRate: 24,
    shiftType: 'Personal Care',
    description: 'Assistance with daily living activities for elderly client',
    urgency: 'medium' as const,
    distance: '2.5 miles',
    facilityRating: 4.8
  },
  {
    id: '2',
    title: 'Behavioral Support Specialist - Urgent',
    clientName: 'David M.',
    date: '2024-06-24',
    startTime: '14:00',
    endTime: '22:00',
    location: 'Sacramento, CA',
    address: '456 Pine Avenue, Sacramento, CA 95817',
    hourlyRate: 28,
    shiftType: 'Behavioral Support',
    description: 'Behavioral support for young adult with developmental disabilities',
    urgency: 'high' as const,
    distance: '4.1 miles',
    facilityRating: 4.5
  },
  {
    id: '3',
    title: 'Companionship Services',
    clientName: 'Mr. Thompson',
    date: '2024-06-26',
    startTime: '10:00',
    endTime: '14:00',
    location: 'Sacramento, CA',
    address: '789 Maple Drive, Sacramento, CA 95818',
    hourlyRate: 22,
    shiftType: 'Companionship',
    description: 'Social companionship and light assistance',
    urgency: 'low' as const,
    distance: '1.8 miles',
    facilityRating: 4.9
  },
  {
    id: '4',
    title: 'Respite Care Provider',
    clientName: 'Miller Family',
    date: '2024-06-27',
    startTime: '18:00',
    endTime: '23:00',
    location: 'Sacramento, CA',
    address: '321 Cedar Lane, Sacramento, CA 95819',
    hourlyRate: 26,
    shiftType: 'Respite Care',
    description: 'Evening respite care for family with special needs child',
    urgency: 'medium' as const,
    distance: '6.2 miles',
    facilityRating: 4.6
  }
];

const ShiftBrowser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    shiftType: 'all',
    urgency: 'all',
    minRate: 0,
    maxDistance: 50
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShift, setSelectedShift] = useState<typeof mockShifts[0] | null>(null);
  const shiftsPerPage = 6;
  const { toast } = useToast();

  const filteredShifts = mockShifts.filter(shift => {
    const matchesSearch = shift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.shiftType === 'all' || shift.shiftType === filters.shiftType;
    const matchesUrgency = filters.urgency === 'all' || shift.urgency === filters.urgency;
    const matchesRate = shift.hourlyRate >= filters.minRate;
    const matchesDistance = parseFloat(shift.distance) <= filters.maxDistance;

    return matchesSearch && matchesType && matchesUrgency && matchesRate && matchesDistance;
  });

  const totalPages = Math.ceil(filteredShifts.length / shiftsPerPage);
  const startIndex = (currentPage - 1) * shiftsPerPage;
  const paginatedShifts = filteredShifts.slice(startIndex, startIndex + shiftsPerPage);

  const getUrgencyBadge = (urgency: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[urgency as keyof typeof colors] || colors.low;
  };

  const handleApplyShift = (shift: typeof mockShifts[0]) => {
    toast({
      title: "Application Submitted",
      description: `Your application for "${shift.title}" has been submitted successfully.`,
    });
  };

  const handleViewDetails = (shift: typeof mockShifts[0]) => {
    setSelectedShift(shift);
  };

  const handleViewTeam = (shift: typeof mockShifts[0]) => {
    toast({
      title: "Team Information",
      description: `Viewing team details for "${shift.title}" shift.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Shifts</h1>
              <p className="text-gray-600 mt-1">Find the perfect shifts that match your skills and schedule</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{filteredShifts.length} shifts available</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">All Shifts</TabsTrigger>
            <TabsTrigger value="recommended">AI Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search shifts by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shift Type</label>
                    <select 
                      value={filters.shiftType}
                      onChange={(e) => setFilters(prev => ({ ...prev, shiftType: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Types</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Companionship">Companionship</option>
                      <option value="Behavioral Support">Behavioral Support</option>
                      <option value="Respite Care">Respite Care</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                    <select 
                      value={filters.urgency}
                      onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Levels</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min. Rate ($/hr)</label>
                    <input
                      type="number"
                      value={filters.minRate}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRate: Number(e.target.value) }))}
                      className="w-full p-2 border rounded-md"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance (miles)</label>
                    <input
                      type="number"
                      value={filters.maxDistance}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
                      className="w-full p-2 border rounded-md"
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shifts Grid */}
            <div className="grid gap-6">
              {paginatedShifts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or filters</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {paginatedShifts.map((shift) => (
                    <Card key={shift.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl">{shift.title}</CardTitle>
                            <CardDescription>Client: {shift.clientName}</CardDescription>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{shift.facilityRating} facility rating</span>
                            </div>
                          </div>
                          <Badge className={getUrgencyBadge(shift.urgency)}>
                            {shift.urgency === 'high' && <Zap className="w-3 h-3 mr-1" />}
                            {shift.urgency}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700">{shift.description}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{new Date(shift.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{shift.startTime} - {shift.endTime}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-600">${shift.hourlyRate}/hr</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{shift.distance} away</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1 bg-medical-blue hover:bg-blue-800"
                            onClick={() => handleApplyShift(shift)}
                          >
                            Apply for Shift
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleViewDetails(shift)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleViewTeam(shift)}
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recommended">
            <ShiftSuggestions />
          </TabsContent>
        </Tabs>
      </div>

      {/* Shift Details Dialog */}
      <AlertDialog open={!!selectedShift} onOpenChange={() => setSelectedShift(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedShift?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              Detailed information about this shift
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedShift && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Client</h4>
                  <p className="text-gray-600">{selectedShift.clientName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Shift Type</h4>
                  <p className="text-gray-600">{selectedShift.shiftType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Date & Time</h4>
                  <p className="text-gray-600">
                    {new Date(selectedShift.date).toLocaleDateString()} <br />
                    {selectedShift.startTime} - {selectedShift.endTime}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Pay Rate</h4>
                  <p className="text-green-600 font-medium">${selectedShift.hourlyRate}/hour</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <p className="text-gray-600">{selectedShift.address}</p>
                <p className="text-sm text-gray-500">{selectedShift.distance} from your location</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedShift.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">
                  {selectedShift.facilityRating} facility rating
                </span>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedShift && handleApplyShift(selectedShift)}>
              Apply for This Shift
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShiftBrowser;
