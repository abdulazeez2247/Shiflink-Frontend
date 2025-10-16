
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { CheckCircle, Circle, BookOpen, Users, Clock, DollarSign } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from '@/hooks/useAuth';

// interface CourseCreationWizardProps {
//   onCourseCreated: (courseId: string) => void;
//   onCancel: () => void;
// }

// const CourseCreationWizard = ({ onCourseCreated, onCancel }: CourseCreationWizardProps) => {
//   const { user } = useAuth();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(false);
  
//   const [courseData, setCourseData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     price: 0,
//     duration_hours: 0,
//     max_students: 20,
//     requirements: '',
//     learning_objectives: [] as string[]
//   });

//   const [newObjective, setNewObjective] = useState('');

//   const steps = [
//     { id: 'basic', title: 'Basic Information', icon: BookOpen },
//     { id: 'details', title: 'Course Details', icon: Clock },
//     { id: 'pricing', title: 'Pricing & Limits', icon: DollarSign },
//     { id: 'objectives', title: 'Learning Objectives', icon: Users }
//   ];

//   const categories = [
//     'Healthcare',
//     'Technology',
//     'Business',
//     'Safety',
//     'Professional Development',
//     'Compliance',
//     'Other'
//   ];

//   const handleInputChange = (field: string, value: any) => {
//     setCourseData(prev => ({ ...prev, [field]: value }));
//   };

//   const addLearningObjective = () => {
//     if (newObjective.trim()) {
//       setCourseData(prev => ({
//         ...prev,
//         learning_objectives: [...prev.learning_objectives, newObjective.trim()]
//       }));
//       setNewObjective('');
//     }
//   };

//   const removeLearningObjective = (index: number) => {
//     setCourseData(prev => ({
//       ...prev,
//       learning_objectives: prev.learning_objectives.filter((_, i) => i !== index)
//     }));
//   };

//   const validateStep = (step: number) => {
//     switch (step) {
//       case 0:
//         return courseData.title.trim() && courseData.description.trim();
//       case 1:
//         return courseData.category && courseData.duration_hours > 0;
//       case 2:
//         return courseData.price >= 0 && courseData.max_students > 0;
//       case 3:
//         return courseData.learning_objectives.length > 0;
//       default:
//         return true;
//     }
//   };

//   const handleNext = () => {
//     if (validateStep(currentStep)) {
//       setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
//     } else {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 0));
//   };

//   const handleSubmit = async () => {
//     if (!validateStep(currentStep)) {
//       toast({
//         title: "Validation Error",
//         description: "Please complete all required fields",
//         variant: "destructive"
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('courses')
//         .insert([{
//           ...courseData,
//           trainer_id: user?.id,
//           is_active: true
//         }])
//         .select()
//         .single();

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Course created successfully! You can now add modules and lessons."
//       });

//       onCourseCreated(data.id);
//     } catch (error) {
//       console.error('Error creating course:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create course. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const StepIcon = ({ step, index }: { step: any, index: number }) => {
//     const Icon = step.icon;
//     const isCompleted = index < currentStep;
//     const isCurrent = index === currentStep;

//     return (
//       <div className={`flex items-center space-x-2 ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
//         {isCompleted ? (
//           <CheckCircle className="w-5 h-5" />
//         ) : (
//           <Circle className="w-5 h-5" />
//         )}
//         <Icon className="w-4 h-4" />
//         <span className="text-sm font-medium">{step.title}</span>
//       </div>
//     );
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle>Create New Course</CardTitle>
//         <div className="flex justify-between items-center mt-4">
//           {steps.map((step, index) => (
//             <StepIcon key={step.id} step={step} index={index} />
//           ))}
//         </div>
//       </CardHeader>
//       <CardContent>
//         {currentStep === 0 && (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Course Title *</Label>
//               <Input
//                 id="title"
//                 value={courseData.title}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 placeholder="Enter course title"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="description">Course Description *</Label>
//               <Textarea
//                 id="description"
//                 value={courseData.description}
//                 onChange={(e) => handleInputChange('description', e.target.value)}
//                 placeholder="Describe what students will learn in this course"
//                 rows={4}
//                 required
//               />
//             </div>
//           </div>
//         )}

//         {currentStep === 1 && (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="category">Category *</Label>
//               <Select value={courseData.category} onValueChange={(value) => handleInputChange('category', value)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select course category" />
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
//             <div className="space-y-2">
//               <Label htmlFor="duration">Duration (hours) *</Label>
//               <Input
//                 id="duration"
//                 type="number"
//                 min="1"
//                 value={courseData.duration_hours}
//                 onChange={(e) => handleInputChange('duration_hours', parseInt(e.target.value) || 0)}
//                 placeholder="Estimated course duration"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="requirements">Prerequisites/Requirements</Label>
//               <Textarea
//                 id="requirements"
//                 value={courseData.requirements}
//                 onChange={(e) => handleInputChange('requirements', e.target.value)}
//                 placeholder="List any prerequisites or requirements for this course"
//                 rows={3}
//               />
//             </div>
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="price">Course Price ($) *</Label>
//               <Input
//                 id="price"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={courseData.price}
//                 onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
//                 placeholder="0.00"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="max_students">Maximum Students *</Label>
//               <Input
//                 id="max_students"
//                 type="number"
//                 min="1"
//                 value={courseData.max_students}
//                 onChange={(e) => handleInputChange('max_students', parseInt(e.target.value) || 20)}
//                 placeholder="20"
//                 required
//               />
//             </div>
//             <div className="p-4 bg-blue-50 rounded-lg">
//               <h4 className="font-medium text-blue-900 mb-2">Pricing Tips</h4>
//               <ul className="text-sm text-blue-700 space-y-1">
//                 <li>• Consider your course content depth and duration</li>
//                 <li>• Research competitor pricing for similar courses</li>
//                 <li>• You can always adjust pricing later</li>
//               </ul>
//             </div>
//           </div>
//         )}

//         {currentStep === 3 && (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Learning Objectives *</Label>
//               <div className="flex space-x-2">
//                 <Input
//                   value={newObjective}
//                   onChange={(e) => setNewObjective(e.target.value)}
//                   placeholder="Add a learning objective"
//                   onKeyPress={(e) => e.key === 'Enter' && addLearningObjective()}
//                 />
//                 <Button type="button" onClick={addLearningObjective}>
//                   Add
//                 </Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Current Objectives ({courseData.learning_objectives.length})</Label>
//               <div className="space-y-2 max-h-48 overflow-y-auto">
//                 {courseData.learning_objectives.map((objective, index) => (
//                   <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                     <span className="text-sm">{objective}</span>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeLearningObjective(index)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//               {courseData.learning_objectives.length === 0 && (
//                 <p className="text-gray-500 text-sm">No learning objectives added yet</p>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="flex justify-between mt-6 pt-4 border-t">
//           <Button
//             variant="outline"
//             onClick={currentStep === 0 ? onCancel : handleBack}
//           >
//             {currentStep === 0 ? 'Cancel' : 'Back'}
//           </Button>
          
//           {currentStep < steps.length - 1 ? (
//             <Button onClick={handleNext} className="bg-medical-blue hover:bg-blue-800">
//               Next
//             </Button>
//           ) : (
//             <Button onClick={handleSubmit} disabled={loading} className="bg-medical-blue hover:bg-blue-800">
//               {loading ? 'Creating Course...' : 'Create Course'}
//             </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default CourseCreationWizard;
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, BookOpen, Users, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseCreationWizardProps {
  onCourseCreated: (courseData: any) => void;
  onCancel: () => void;
}

const CourseCreationWizard = ({ onCourseCreated, onCancel }: CourseCreationWizardProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    duration_hours: 0,
    max_students: 20,
    requirements: '',
    learning_objectives: [] as string[],
    location: '',
    startDate: '',
    endDate: ''
  });

  const [newObjective, setNewObjective] = useState('');

  const steps = [
    { id: 'basic', title: 'Basic Information', icon: BookOpen },
    { id: 'details', title: 'Course Details', icon: Clock },
    { id: 'pricing', title: 'Pricing & Limits', icon: DollarSign },
    { id: 'objectives', title: 'Learning Objectives', icon: Users }
  ];

  const categories = [
    'Healthcare',
    'Technology',
    'Business',
    'Safety',
    'Professional Development',
    'Compliance',
    'Other'
  ];

  const handleInputChange = (field: string, value: any) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const addLearningObjective = () => {
    if (newObjective.trim()) {
      setCourseData(prev => ({
        ...prev,
        learning_objectives: [...prev.learning_objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeLearningObjective = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return courseData.title.trim() && courseData.description.trim();
      case 1:
        return courseData.category && courseData.duration_hours > 0;
      case 2:
        return courseData.price >= 0 && courseData.max_students > 0;
      case 3:
        return courseData.learning_objectives.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Call the parent handler with course data
      onCourseCreated(courseData);
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const StepIcon = ({ step, index }: { step: any, index: number }) => {
    const Icon = step.icon;
    const isCompleted = index < currentStep;
    const isCurrent = index === currentStep;

    return (
      <div className={`flex items-center space-x-2 ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
        {isCompleted ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{step.title}</span>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <div className="flex justify-between items-center mt-4">
          {steps.map((step, index) => (
            <StepIcon key={step.id} step={step} index={index} />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={courseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter course title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Course Description *</Label>
              <Textarea
                id="description"
                value={courseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what students will learn in this course"
                rows={4}
                required
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={courseData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course category" />
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
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={courseData.duration_hours}
                onChange={(e) => handleInputChange('duration_hours', parseInt(e.target.value) || 0)}
                placeholder="Estimated course duration"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">Prerequisites/Requirements</Label>
              <Textarea
                id="requirements"
                value={courseData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="List any prerequisites or requirements for this course"
                rows={3}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Course Price ($) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={courseData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_students">Maximum Students *</Label>
              <Input
                id="max_students"
                type="number"
                min="1"
                value={courseData.max_students}
                onChange={(e) => handleInputChange('max_students', parseInt(e.target.value) || 20)}
                placeholder="20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={courseData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Course location or 'Online'"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Learning Objectives *</Label>
              <div className="flex space-x-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Add a learning objective"
                  onKeyPress={(e) => e.key === 'Enter' && addLearningObjective()}
                />
                <Button type="button" onClick={addLearningObjective}>
                  Add
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current Objectives ({courseData.learning_objectives.length})</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {courseData.learning_objectives.map((objective, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{objective}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLearningObjective(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              {courseData.learning_objectives.length === 0 && (
                <p className="text-gray-500 text-sm">No learning objectives added yet</p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onCancel : handleBack}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Creating Course...' : 'Create Course'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCreationWizard;