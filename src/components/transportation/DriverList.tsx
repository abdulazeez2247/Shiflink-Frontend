
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, MapPin, Star, Search, Filter, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  rating: number;
  totalRides: number;
  status: 'available' | 'busy' | 'offline';
  location: string;
  backgroundCheck: 'approved' | 'pending' | 'rejected';
}

const DriverList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [drivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@email.com',
      phone: '(555) 123-4567',
      vehicle: '2022 Honda Civic',
      rating: 4.8,
      totalRides: 156,
      status: 'available',
      location: 'Downtown Columbus',
      backgroundCheck: 'approved'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '(555) 234-5678',
      vehicle: '2021 Toyota Camry',
      rating: 4.9,
      totalRides: 203,
      status: 'busy',
      location: 'Westerville',
      backgroundCheck: 'approved'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@email.com',
      phone: '(555) 345-6789',
      vehicle: '2020 Ford Fusion',
      rating: 4.6,
      totalRides: 89,
      status: 'offline',
      location: 'Dublin',
      backgroundCheck: 'pending'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'busy':
        return <Badge className="bg-orange-500">Busy</Badge>;
      case 'offline':
        return <Badge variant="outline">Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getBackgroundCheckBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && driver.status === statusFilter;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Management</CardTitle>
        <CardDescription>Monitor and manage transportation drivers in your network</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search drivers by name, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Background</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-gray-500">{driver.totalRides} rides</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{driver.email}</div>
                      <div className="text-sm text-gray-500">{driver.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{driver.vehicle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{driver.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(driver.status)}</TableCell>
                  <TableCell>{getBackgroundCheckBadge(driver.backgroundCheck)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{driver.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedDriver(driver)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Driver Details</DialogTitle>
                          <DialogDescription>
                            Detailed information for {selectedDriver?.name}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedDriver && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <p className="text-sm text-gray-600">{selectedDriver.name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <p className="text-sm text-gray-600">{selectedDriver.email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Phone</label>
                                <p className="text-sm text-gray-600">{selectedDriver.phone}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Vehicle</label>
                                <p className="text-sm text-gray-600">{selectedDriver.vehicle}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Rating</label>
                                <p className="text-sm text-gray-600">{selectedDriver.rating}/5.0</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Total Rides</label>
                                <p className="text-sm text-gray-600">{selectedDriver.totalRides}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Current Status</label>
                              <div className="mt-1">
                                {getStatusBadge(selectedDriver.status)}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Background Check</label>
                              <div className="mt-1">
                                {getBackgroundCheckBadge(selectedDriver.backgroundCheck)}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverList;
