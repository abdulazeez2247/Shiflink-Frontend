
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Calendar, Clock, MapPin, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import ShiftEditForm from './ShiftEditForm';

// export interface PostedShift {
//   id: string;
//   title: string;
//   clientName: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   location: string;
//   address: string;
//   hourlyRate: string;
//   shiftType: string;
//   requiredCredentials: string[];
//   description: string;
//   specialRequirements: string;
//   status: 'active' | 'filled' | 'cancelled';
//   applicationsCount: number;
//   createdAt: string;
// }

// interface PostedShiftsListProps {
//   shifts: PostedShift[];
//   onUpdateShift?: (shift: PostedShift) => void;
//   onDeleteShift?: (shiftId: string) => void;
// }

// const PostedShiftsList = ({ shifts, onUpdateShift, onDeleteShift }: PostedShiftsListProps) => {
//   const { toast } = useToast();
//   const [editingShift, setEditingShift] = useState<PostedShift | null>(null);

//   const getStatusBadge = (status: string) => {
//     const colors = {
//       active: 'bg-green-100 text-green-800 border-green-300',
//       filled: 'bg-blue-100 text-blue-800 border-blue-300',
//       cancelled: 'bg-red-100 text-red-800 border-red-300'
//     };
//     return colors[status as keyof typeof colors] || colors.active;
//   };

//   const handleViewApplications = (shift: PostedShift) => {
//     toast({
//       title: "View Applications",
//       description: `Viewing ${shift.applicationsCount} applications for "${shift.title}"`,
//     });
//   };

//   const handleEditShift = (shift: PostedShift) => {
//     setEditingShift(shift);
//   };

//   const handleShiftUpdated = (updatedShift: PostedShift) => {
//     onUpdateShift?.(updatedShift);
//     setEditingShift(null);
//   };

//   const handleCancelEdit = () => {
//     setEditingShift(null);
//   };

//   const handleDeleteShift = (shift: PostedShift) => {
//     if (window.confirm(`Are you sure you want to delete "${shift.title}"?`)) {
//       onDeleteShift?.(shift.id);
//       toast({
//         title: "Shift Deleted",
//         description: `"${shift.title}" has been deleted successfully.`,
//       });
//     }
//   };

//   if (editingShift) {
//     return (
//       <ShiftEditForm
//         shift={editingShift}
//         onShiftUpdated={handleShiftUpdated}
//         onCancel={handleCancelEdit}
//       />
//     );
//   }

//   if (shifts.length === 0) {
//     return (
//       <Card>
//         <CardContent className="p-8 text-center">
//           <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts posted yet</h3>
//           <p className="text-gray-600">Your posted shifts will appear here</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Posted Shifts ({shifts.length})</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Shift Details</TableHead>
//               <TableHead>Date & Time</TableHead>
//               <TableHead>Location</TableHead>
//               <TableHead>Rate</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Applications</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {shifts.map((shift) => (
//               <TableRow key={shift.id}>
//                 <TableCell>
//                   <div>
//                     <div className="font-medium">{shift.title}</div>
//                     <div className="text-sm text-gray-600">Client: {shift.clientName}</div>
//                     <div className="text-sm text-gray-500">{shift.shiftType}</div>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center space-x-1 text-sm">
//                     <Calendar className="w-4 h-4 text-gray-500" />
//                     <span>{new Date(shift.date).toLocaleDateString()}</span>
//                   </div>
//                   <div className="flex items-center space-x-1 text-sm text-gray-600">
//                     <Clock className="w-4 h-4 text-gray-500" />
//                     <span>{shift.startTime} - {shift.endTime}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center space-x-1 text-sm">
//                     <MapPin className="w-4 h-4 text-gray-500" />
//                     <span>{shift.location}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
//                     <DollarSign className="w-4 h-4" />
//                     <span>{shift.hourlyRate}/hr</span>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <Badge className={getStatusBadge(shift.status)}>
//                     {shift.status}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="link"
//                     size="sm"
//                     onClick={() => handleViewApplications(shift)}
//                     className="p-0 h-auto font-medium text-blue-600"
//                   >
//                     {shift.applicationsCount} applications
//                   </Button>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex space-x-1">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleViewApplications(shift)}
//                       className="h-8 w-8"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleEditShift(shift)}
//                       className="h-8 w-8"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleDeleteShift(shift)}
//                       className="h-8 w-8 text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default PostedShiftsList;
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, MapPin, DollarSign, Eye, Edit, Trash2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ShiftEditForm from './ShiftEditForm';

export interface PostedShift {
  id: string;
  title: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  hourlyRate: string;
  shiftType: string;
  requiredCredentials: string[];
  description: string;
  specialRequirements: string;
  status: 'active' | 'filled' | 'cancelled';
  applicationsCount: number;
  createdAt: string;
  // 👇 add assignedDSPId so you know who to message
  assignedDSPId?: string;
}

interface PostedShiftsListProps {
  shifts: PostedShift[];
  onUpdateShift?: (shift: PostedShift) => void;
  onDeleteShift?: (shiftId: string) => void;
  onMessageDSP?: (shiftId: string, dspId: string) => void; // 👈 new prop
}

const PostedShiftsList = ({ shifts, onUpdateShift, onDeleteShift, onMessageDSP }: PostedShiftsListProps) => {
  const { toast } = useToast();
  const [editingShift, setEditingShift] = useState<PostedShift | null>(null);

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-300',
      filled: 'bg-blue-100 text-blue-800 border-blue-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const handleViewApplications = (shift: PostedShift) => {
    toast({
      title: "View Applications",
      description: `Viewing ${shift.applicationsCount} applications for "${shift.title}"`,
    });
  };

  const handleEditShift = (shift: PostedShift) => {
    setEditingShift(shift);
  };

  const handleShiftUpdated = (updatedShift: PostedShift) => {
    onUpdateShift?.(updatedShift);
    setEditingShift(null);
  };

  const handleCancelEdit = () => {
    setEditingShift(null);
  };

  const handleDeleteShift = (shift: PostedShift) => {
    if (window.confirm(`Are you sure you want to delete "${shift.title}"?`)) {
      onDeleteShift?.(shift.id);
      toast({
        title: "Shift Deleted",
        description: `"${shift.title}" has been deleted successfully.`,
      });
    }
  };

  if (editingShift) {
    return (
      <ShiftEditForm
        shift={editingShift}
        onShiftUpdated={handleShiftUpdated}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (shifts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts posted yet</h3>
          <p className="text-gray-600">Your posted shifts will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posted Shifts ({shifts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shift Details</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{shift.title}</div>
                    <div className="text-sm text-gray-600">Client: {shift.clientName}</div>
                    <div className="text-sm text-gray-500">{shift.shiftType}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{new Date(shift.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{shift.startTime} - {shift.endTime}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{shift.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{shift.hourlyRate}/hr</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(shift.status)}>
                    {shift.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleViewApplications(shift)}
                    className="p-0 h-auto font-medium text-blue-600"
                  >
                    {shift.applicationsCount} applications
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {/* View */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewApplications(shift)}
                      className="h-8 w-8"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditShift(shift)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteShift(shift)}
                      className="h-8 w-8 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {/* Message DSP */}
                    {shift.assignedDSPId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMessageDSP?.(shift.id, shift.assignedDSPId!)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-800"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PostedShiftsList;
