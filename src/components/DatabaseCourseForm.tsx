// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Switch } from '@/components/ui/switch';
// import { toast } from '@/hooks/use-toast';

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   startDate: string;
//   endDate: string;
//   location: string;
//   participants: any[];
//   is_active: boolean;
//   duration_hours?: number;
//   max_students?: number;
//   category?: string;
//   requirements?: string;
// }

// interface DatabaseCourseFormProps {
//   course?: Course | null;
//   onSuccess: (courseData?: any) => void; // Updated to accept optional parameter
//   onCancel: () => void;
// }

// const DatabaseCourseForm = ({ course, onSuccess, onCancel }: DatabaseCourseFormProps) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: 0,
//     startDate: '',
//     endDate: '',
//     location: '',
//     duration_hours: 1,
//     category: '',
//     requirements: '',
//     max_students: 20,
//     is_active: true
//   });
//   const [loading, setLoading] = useState(false);

//   const categories = [
//     'CPR/First Aid',
//     'Medication Administration',
//     'Mental Health',
//     'Safety Training',
//     'Specialized Care',
//     'Professional Development'
//   ];

//   useEffect(() => {
//     if (course) {
//       setFormData({
//         title: course.title || '',
//         description: course.description || '',
//         price: course.price || 0,
//         startDate: course.startDate ? course.startDate.split('T')[0] : '',
//         endDate: course.endDate ? course.endDate.split('T')[0] : '',
//         location: course.location || '',
//         duration_hours: course.duration_hours || 1,
//         category: course.category || '',
//         requirements: course.requirements || '',
//         max_students: course.max_students || 20,
//         is_active: course.is_active ?? true
//       });
//     }
//   }, [course]);

//   const getToken = () => localStorage.getItem('token');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.title || !formData.description) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields",
//         variant: "destructive"
//       });
//       return;
//     }

//     setLoading(true);
    
//     try {
//       const token = getToken();
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const courseData = {
//         title: formData.title,
//         description: formData.description,
//         price: formData.price,
//         startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
//         endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
//         location: formData.location,
//         duration_hours: formData.duration_hours,
//         category: formData.category,
//         requirements: formData.requirements,
//         max_students: formData.max_students,
//         is_active: formData.is_active
//       };

//       // Call onSuccess with the course data - the parent component will handle the API call
//       onSuccess(courseData);
      
//     } catch (error: any) {
//       console.error('Error preparing course data:', error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to prepare course data",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string | number | boolean) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Course Title *</Label>
//               <Input
//                 id="title"
//                 value={formData.title}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 placeholder="Enter course title"
//                 required
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="category">Category</Label>
//               <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map(category => (
//                     <SelectItem key={category} value={category}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description *</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//               placeholder="Enter course description"
//               rows={3}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="requirements">Requirements</Label>
//             <Textarea
//               id="requirements"
//               value={formData.requirements}
//               onChange={(e) => handleInputChange('requirements', e.target.value)}
//               placeholder="Enter any prerequisites or requirements"
//               rows={2}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="location">Location</Label>
//               <Input
//                 id="location"
//                 value={formData.location}
//                 onChange={(e) => handleInputChange('location', e.target.value)}
//                 placeholder="Enter course location"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="price">Price ($) *</Label>
//               <Input
//                 id="price"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={formData.price}
//                 onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
//                 placeholder="0.00"
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="startDate">Start Date</Label>
//               <Input
//                 id="startDate"
//                 type="date"
//                 value={formData.startDate}
//                 onChange={(e) => handleInputChange('startDate', e.target.value)}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="endDate">End Date</Label>
//               <Input
//                 id="endDate"
//                 type="date"
//                 value={formData.endDate}
//                 onChange={(e) => handleInputChange('endDate', e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="duration_hours">Duration (hours)</Label>
//               <Input
//                 id="duration_hours"
//                 type="number"
//                 min="1"
//                 value={formData.duration_hours}
//                 onChange={(e) => handleInputChange('duration_hours', parseInt(e.target.value) || 1)}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="max_students">Max Students</Label>
//               <Input
//                 id="max_students"
//                 type="number"
//                 min="1"
//                 value={formData.max_students}
//                 onChange={(e) => handleInputChange('max_students', parseInt(e.target.value) || 20)}
//               />
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Switch
//               id="is_active"
//               checked={formData.is_active}
//               onCheckedChange={(checked) => handleInputChange('is_active', checked)}
//             />
//             <Label htmlFor="is_active">Course is active and visible to students</Label>
//           </div>

//           <div className="flex justify-end space-x-2 pt-4">
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
//               {loading ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default DatabaseCourseForm;
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  location: string;
  participants: any[];
  is_active: boolean;
  duration_hours?: number;
  max_students?: number;
  category?: string;
  requirements?: string;
}

interface DatabaseCourseFormProps {
  course?: Course | null;
  onSuccess: (courseData?: any) => void;
  onCancel: () => void;
}

const DatabaseCourseForm = ({ course, onSuccess, onCancel }: DatabaseCourseFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    startDate: '',
    endDate: '',
    location: '',
    duration_hours: 1,
    category: '',
    requirements: '',
    max_students: 20,
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'CPR/First Aid',
    'Medication Administration',
    'Mental Health',
    'Safety Training',
    'Specialized Care',
    'Professional Development'
  ];

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        price: course.price || 0,
        startDate: course.startDate ? course.startDate.split('T')[0] : '',
        endDate: course.endDate ? course.endDate.split('T')[0] : '',
        location: course.location || '',
        duration_hours: course.duration_hours || 1,
        category: course.category || '',
        requirements: course.requirements || '',
        max_students: course.max_students || 20,
        is_active: course.is_active ?? true
      });
    }
  }, [course]);

  const getToken = () => localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        location: formData.location,
        duration_hours: formData.duration_hours,
        category: formData.category,
        requirements: formData.requirements,
        max_students: formData.max_students,
        is_active: formData.is_active
      };

      onSuccess(courseData);
      
    } catch (error: any) {
      console.error('Error preparing course data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to prepare course data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    // Remove Card wrapper and use div with proper spacing
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"> {/* Added scrolling and reduced height */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter course title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter course description"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => handleInputChange('requirements', e.target.value)}
            placeholder="Enter any prerequisites or requirements"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter course location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration_hours">Duration (hours)</Label>
            <Input
              id="duration_hours"
              type="number"
              min="1"
              value={formData.duration_hours}
              onChange={(e) => handleInputChange('duration_hours', parseInt(e.target.value) || 1)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max_students">Max Students</Label>
            <Input
              id="max_students"
              type="number"
              min="1"
              value={formData.max_students}
              onChange={(e) => handleInputChange('max_students', parseInt(e.target.value) || 20)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
          />
          <Label htmlFor="is_active">Course is active and visible to students</Label>
        </div>

        {/* Fixed position buttons that stay visible */}
        <div className="flex justify-end space-x-2 pt-6 pb-2 border-t sticky bottom-0 bg-white">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DatabaseCourseForm;