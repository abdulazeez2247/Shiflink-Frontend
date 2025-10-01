
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { CheckSquare, Square, Eye, EyeOff, Trash2, DollarSign, Copy } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';

// interface Course {
//   id: string;
//   title: string;
//   price: number;
//   is_active: boolean;
//   enrolled_count?: number;
// }

// interface BulkCourseOperationsProps {
//   courses: Course[];
//   onCoursesUpdate: () => void;
// }

// const BulkCourseOperations = ({ courses, onCoursesUpdate }: BulkCourseOperationsProps) => {
//   const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
//   const [showPriceDialog, setShowPriceDialog] = useState(false);
//   const [newPrice, setNewPrice] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSelectAll = () => {
//     if (selectedCourses.length === courses.length) {
//       setSelectedCourses([]);
//     } else {
//       setSelectedCourses(courses.map(c => c.id));
//     }
//   };

//   const handleSelectCourse = (courseId: string) => {
//     setSelectedCourses(prev => 
//       prev.includes(courseId) 
//         ? prev.filter(id => id !== courseId)
//         : [...prev, courseId]
//     );
//   };

//   const handleBulkActivate = async () => {
//     if (selectedCourses.length === 0) return;

//     setLoading(true);
//     try {
//       const { error } = await supabase
//         .from('courses')
//         .update({ is_active: true })
//         .in('id', selectedCourses);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `${selectedCourses.length} courses activated successfully`
//       });

//       setSelectedCourses([]);
//       onCoursesUpdate();
//     } catch (error) {
//       console.error('Error activating courses:', error);
//       toast({
//         title: "Error",
//         description: "Failed to activate courses",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkDeactivate = async () => {
//     if (selectedCourses.length === 0) return;

//     setLoading(true);
//     try {
//       const { error } = await supabase
//         .from('courses')
//         .update({ is_active: false })
//         .in('id', selectedCourses);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `${selectedCourses.length} courses deactivated successfully`
//       });

//       setSelectedCourses([]);
//       onCoursesUpdate();
//     } catch (error) {
//       console.error('Error deactivating courses:', error);
//       toast({
//         title: "Error",
//         description: "Failed to deactivate courses",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedCourses.length === 0) return;

//     if (!window.confirm(`Are you sure you want to delete ${selectedCourses.length} courses? This action cannot be undone.`)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       const { error } = await supabase
//         .from('courses')
//         .delete()
//         .in('id', selectedCourses);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `${selectedCourses.length} courses deleted successfully`
//       });

//       setSelectedCourses([]);
//       onCoursesUpdate();
//     } catch (error) {
//       console.error('Error deleting courses:', error);
//       toast({
//         title: "Error",
//         description: "Failed to delete courses",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkPriceUpdate = async () => {
//     if (selectedCourses.length === 0 || !newPrice) return;

//     const price = parseFloat(newPrice);
//     if (isNaN(price) || price < 0) {
//       toast({
//         title: "Invalid Price",
//         description: "Please enter a valid price",
//         variant: "destructive"
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const { error } = await supabase
//         .from('courses')
//         .update({ price })
//         .in('id', selectedCourses);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `Price updated for ${selectedCourses.length} courses`
//       });

//       setSelectedCourses([]);
//       setShowPriceDialog(false);
//       setNewPrice('');
//       onCoursesUpdate();
//     } catch (error) {
//       console.error('Error updating prices:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update prices",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (courses.length === 0) {
//     return null;
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between">
//           <span>Bulk Operations</span>
//           <Badge variant="outline">
//             {selectedCourses.length} of {courses.length} selected
//           </Badge>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {/* Select All */}
//         <div className="flex items-center space-x-2">
//           <Checkbox
//             checked={selectedCourses.length === courses.length && courses.length > 0}
//             onCheckedChange={handleSelectAll}
//           />
//           <label className="text-sm font-medium">
//             Select All Courses
//           </label>
//         </div>

//         {/* Course Selection List */}
//         <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
//           {courses.map((course) => (
//             <div key={course.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
//               <div className="flex items-center space-x-3">
//                 <Checkbox
//                   checked={selectedCourses.includes(course.id)}
//                   onCheckedChange={() => handleSelectCourse(course.id)}
//                 />
//                 <div>
//                   <div className="font-medium text-sm">{course.title}</div>
//                   <div className="text-xs text-gray-500">
//                     ${course.price} • {course.enrolled_count || 0} students
//                   </div>
//                 </div>
//               </div>
//               <Badge variant={course.is_active ? "default" : "secondary"}>
//                 {course.is_active ? "Active" : "Inactive"}
//               </Badge>
//             </div>
//           ))}
//         </div>

//         {/* Bulk Actions */}
//         {selectedCourses.length > 0 && (
//           <div className="flex flex-wrap gap-2 pt-4 border-t">
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={handleBulkActivate}
//               disabled={loading}
//               className="flex items-center space-x-1"
//             >
//               <Eye className="w-4 h-4" />
//               <span>Activate</span>
//             </Button>
            
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={handleBulkDeactivate}
//               disabled={loading}
//               className="flex items-center space-x-1"
//             >
//               <EyeOff className="w-4 h-4" />
//               <span>Deactivate</span>
//             </Button>
            
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => setShowPriceDialog(true)}
//               disabled={loading}
//               className="flex items-center space-x-1"
//             >
//               <DollarSign className="w-4 h-4" />
//               <span>Update Price</span>
//             </Button>
            
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={handleBulkDelete}
//               disabled={loading}
//               className="flex items-center space-x-1 text-red-600 hover:text-red-700"
//             >
//               <Trash2 className="w-4 h-4" />
//               <span>Delete</span>
//             </Button>
//           </div>
//         )}

//         {/* Price Update Dialog */}
//         <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Update Course Prices</DialogTitle>
//               <DialogDescription>
//                 Set a new price for the selected {selectedCourses.length} courses.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="newPrice">New Price ($)</Label>
//                 <Input
//                   id="newPrice"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={newPrice}
//                   onChange={(e) => setNewPrice(e.target.value)}
//                   placeholder="Enter new price"
//                 />
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowPriceDialog(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleBulkPriceUpdate}
//                   disabled={loading || !newPrice}
//                 >
//                   Update Prices
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// };

// export default BulkCourseOperations;
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Trash2, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { updateCourse, deleteCourse } from '@/service/data';

interface Course {
  _id: string;
  title: string;
  price: number;
  is_active: boolean;
  participants: any[];
}

interface BulkCourseOperationsProps {
  courses: Course[];
  onUpdate: () => void; // Changed from onCoursesUpdate to onUpdate
}

const BulkCourseOperations = ({ courses, onUpdate }: BulkCourseOperationsProps) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const handleSelectAll = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map(c => c._id));
    }
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleBulkActivate = async () => {
    if (selectedCourses.length === 0) return;

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      // Update each course individually since we don't have bulk update
      const updatePromises = selectedCourses.map(courseId => 
        updateCourse(token, courseId, { is_active: true })
      );
      
      await Promise.all(updatePromises);

      toast({
        title: "Success",
        description: `${selectedCourses.length} courses activated successfully`
      });

      setSelectedCourses([]);
      onUpdate();
    } catch (error: any) {
      console.error('Error activating courses:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to activate courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedCourses.length === 0) return;

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      // Update each course individually
      const updatePromises = selectedCourses.map(courseId => 
        updateCourse(token, courseId, { is_active: false })
      );
      
      await Promise.all(updatePromises);

      toast({
        title: "Success",
        description: `${selectedCourses.length} courses deactivated successfully`
      });

      setSelectedCourses([]);
      onUpdate();
    } catch (error: any) {
      console.error('Error deactivating courses:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedCourses.length} courses? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      // Delete each course individually
      const deletePromises = selectedCourses.map(courseId => 
        deleteCourse(token, courseId)
      );
      
      await Promise.all(deletePromises);

      toast({
        title: "Success",
        description: `${selectedCourses.length} courses deleted successfully`
      });

      setSelectedCourses([]);
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting courses:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPriceUpdate = async () => {
    if (selectedCourses.length === 0 || !newPrice) return;

    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found');

      // Update price for each course individually
      const updatePromises = selectedCourses.map(courseId => 
        updateCourse(token, courseId, { price })
      );
      
      await Promise.all(updatePromises);

      toast({
        title: "Success",
        description: `Price updated for ${selectedCourses.length} courses`
      });

      setSelectedCourses([]);
      setShowPriceDialog(false);
      setNewPrice('');
      onUpdate();
    } catch (error: any) {
      console.error('Error updating prices:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update prices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No courses available for bulk operations
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bulk Operations</span>
          <Badge variant="outline">
            {selectedCourses.length} of {courses.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Select All */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedCourses.length === courses.length && courses.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <label className="text-sm font-medium">
            Select All Courses
          </label>
        </div>

        {/* Course Selection List */}
        <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
          {courses.map((course) => (
            <div key={course._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedCourses.includes(course._id)}
                  onCheckedChange={() => handleSelectCourse(course._id)}
                />
                <div>
                  <div className="font-medium text-sm">{course.title}</div>
                  <div className="text-xs text-gray-500">
                    ${course.price} • {course.participants?.length || 0} students
                  </div>
                </div>
              </div>
              <Badge variant={course.is_active ? "default" : "secondary"}>
                {course.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedCourses.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkActivate}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>Activate</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkDeactivate}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <EyeOff className="w-4 h-4" />
              <span>Deactivate</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPriceDialog(true)}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <DollarSign className="w-4 h-4" />
              <span>Update Price</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkDelete}
              disabled={loading}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          </div>
        )}

        {/* Price Update Dialog */}
        <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Course Prices</DialogTitle>
              <DialogDescription>
                Set a new price for the selected {selectedCourses.length} courses.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPrice">New Price ($)</Label>
                <Input
                  id="newPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter new price"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPriceDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkPriceUpdate}
                  disabled={loading || !newPrice}
                >
                  Update Prices
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BulkCourseOperations;