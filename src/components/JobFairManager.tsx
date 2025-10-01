
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, MapPin, Users, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface JobFair {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
  maxAttendees: number;
  currentAttendees: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  organizer: string;
  contactEmail: string;
  contactPhone: string;
  targetRoles: string[];
}

const JobFairManager = () => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedJobFair, setSelectedJobFair] = useState<JobFair | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const [jobFairs, setJobFairs] = useState<JobFair[]>([
    {
      id: 1,
      title: 'DSP Career Fair - Columbus',
      date: '2024-07-15',
      time: '10:00 AM - 4:00 PM',
      location: 'Columbus Community Center',
      address: '1234 Main St, Columbus, OH 43215',
      description: 'Join us for a comprehensive career fair focused on Direct Support Professional opportunities. Meet with local agencies, learn about benefits, and find your next career opportunity.',
      maxAttendees: 150,
      currentAttendees: 87,
      status: 'upcoming',
      organizer: 'Franklin County Board',
      contactEmail: 'careers@franklinboard.gov',
      contactPhone: '(614) 555-0123',
      targetRoles: ['DSP', 'Support Coordinator', 'Program Manager']
    },
    {
      id: 2,
      title: 'Healthcare Support Jobs Fair',
      date: '2024-07-22',
      time: '9:00 AM - 3:00 PM',
      location: 'Dublin Convention Center',
      address: '5678 Corporate Blvd, Dublin, OH 43017',
      description: 'Explore opportunities in healthcare support services including residential care, day programs, and community integration services.',
      maxAttendees: 200,
      currentAttendees: 124,
      status: 'upcoming',
      organizer: 'Ohio DODD',
      contactEmail: 'jobfair@dodd.ohio.gov',
      contactPhone: '(614) 555-0456',
      targetRoles: ['DSP', 'Nurse', 'Therapist', 'Case Manager']
    },
    {
      id: 3,
      title: 'Westerville Area Care Fair',
      date: '2024-06-10',
      time: '11:00 AM - 5:00 PM',
      location: 'Westerville Recreation Center',
      address: '350 N Cleveland Ave, Westerville, OH 43082',
      description: 'Local job fair featuring opportunities with residential care providers in the Westerville area.',
      maxAttendees: 100,
      currentAttendees: 100,
      status: 'completed',
      organizer: 'Delaware County Services',
      contactEmail: 'hr@delawareservices.org',
      contactPhone: '(740) 555-0789',
      targetRoles: ['DSP', 'Program Assistant']
    }
  ]);

  const [newJobFair, setNewJobFair] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    address: '',
    description: '',
    maxAttendees: 100,
    organizer: '',
    contactEmail: '',
    contactPhone: '',
    targetRoles: [] as string[]
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleCreateJobFair = () => {
    if (!newJobFair.title || !newJobFair.date || !newJobFair.location) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in title, date, and location.",
        variant: "destructive"
      });
      return;
    }

    const jobFair: JobFair = {
      id: Math.max(...jobFairs.map(j => j.id)) + 1,
      ...newJobFair,
      currentAttendees: 0,
      status: 'upcoming' as const
    };

    setJobFairs([...jobFairs, jobFair]);
    setNewJobFair({
      title: '',
      date: '',
      time: '',
      location: '',
      address: '',
      description: '',
      maxAttendees: 100,
      organizer: '',
      contactEmail: '',
      contactPhone: '',
      targetRoles: []
    });
    setShowCreateDialog(false);

    toast({
      title: "Job Fair Created",
      description: `${jobFair.title} has been scheduled successfully.`,
    });
  };

  const handleDeleteJobFair = (id: number) => {
    setJobFairs(jobFairs.filter(j => j.id !== id));
    toast({
      title: "Job Fair Deleted",
      description: "The job fair has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Job Fair Management</h2>
          <p className="text-gray-600">Schedule and manage DSP recruitment events</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Job Fair
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Job Fair</DialogTitle>
              <DialogDescription>Create a new DSP recruitment event</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label htmlFor="title">Job Fair Title</Label>
                <Input
                  id="title"
                  value={newJobFair.title}
                  onChange={(e) => setNewJobFair(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="DSP Career Fair - Location"
                />
              </div>
              
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setNewJobFair(prev => ({ 
                          ...prev, 
                          date: date ? format(date, 'yyyy-MM-dd') : '' 
                        }));
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={newJobFair.time}
                  onChange={(e) => setNewJobFair(prev => ({ ...prev, time: e.target.value }))}
                  placeholder="10:00 AM - 4:00 PM"
                />
              </div>

              <div>
                <Label htmlFor="location">Location Name</Label>
                <Input
                  id="location"
                  value={newJobFair.location}
                  onChange={(e) => setNewJobFair(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Community Center"
                />
              </div>

              <div>
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={newJobFair.maxAttendees}
                  onChange={(e) => setNewJobFair(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 100 }))}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={newJobFair.address}
                  onChange={(e) => setNewJobFair(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="1234 Main St, City, OH 43215"
                />
              </div>

              <div>
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  value={newJobFair.organizer}
                  onChange={(e) => setNewJobFair(prev => ({ ...prev, organizer: e.target.value }))}
                  placeholder="County Board / Organization"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={newJobFair.contactEmail}
                  onChange={(e) => setNewJobFair(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="contact@organization.gov"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newJobFair.description}
                  onChange={(e) => setNewJobFair(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the job fair, target audience, and what attendees can expect..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJobFair}>
                Schedule Job Fair
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Job Fairs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Job Fairs</CardTitle>
          <CardDescription>Manage upcoming and past DSP recruitment events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobFairs.map((jobFair) => (
                  <TableRow key={jobFair.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{jobFair.title}</p>
                        <p className="text-sm text-gray-500">{jobFair.targetRoles.join(', ')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{format(new Date(jobFair.date), 'MMM dd, yyyy')}</p>
                        <p className="text-sm text-gray-500">{jobFair.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{jobFair.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {jobFair.currentAttendees}/{jobFair.maxAttendees}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(jobFair.currentAttendees / jobFair.maxAttendees) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(jobFair.status)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{jobFair.organizer}</p>
                        <p className="text-xs text-gray-500">{jobFair.contactEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedJobFair(jobFair)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{selectedJobFair?.title}</DialogTitle>
                              <DialogDescription>Job fair details and information</DialogDescription>
                            </DialogHeader>
                            {selectedJobFair && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Date & Time</Label>
                                    <p className="text-sm text-gray-600">
                                      {format(new Date(selectedJobFair.date), 'MMMM dd, yyyy')} at {selectedJobFair.time}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedJobFair.status)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Location</Label>
                                    <p className="text-sm text-gray-600">{selectedJobFair.location}</p>
                                    <p className="text-xs text-gray-500">{selectedJobFair.address}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Attendance</Label>
                                    <p className="text-sm text-gray-600">
                                      {selectedJobFair.currentAttendees} of {selectedJobFair.maxAttendees} registered
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Target Roles</Label>
                                  <div className="flex gap-2 mt-1">
                                    {selectedJobFair.targetRoles.map((role, index) => (
                                      <Badge key={index} variant="outline">{role}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Description</Label>
                                  <p className="text-sm text-gray-600 mt-1">{selectedJobFair.description}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Contact Information</Label>
                                  <div className="text-sm text-gray-600 mt-1">
                                    <p>Organizer: {selectedJobFair.organizer}</p>
                                    <p>Email: {selectedJobFair.contactEmail}</p>
                                    <p>Phone: {selectedJobFair.contactPhone}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteJobFair(jobFair.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Job Fairs</p>
                <p className="text-2xl font-bold">{jobFairs.length}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-blue-600">
                  {jobFairs.filter(j => j.status === 'upcoming').length}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobFairs.reduce((sum, j) => sum + j.currentAttendees, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(jobFairs.reduce((sum, j) => sum + (j.currentAttendees / j.maxAttendees * 100), 0) / jobFairs.length)}%
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobFairManager;
