
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Copy, BookOpen, Users, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration_hours: number;
  max_students: number;
  category: string;
  is_active: boolean;
}

interface CourseDuplicatorProps {
  courses: Course[];
  onCourseCreated: () => void;
}

const CourseDuplicator = ({ courses, onCourseCreated }: CourseDuplicatorProps) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [duplicateData, setDuplicateData] = useState({
    title: '',
    price: 0
  });
  const [isCloning, setIsCloning] = useState(false);
  const { user } = useAuth();

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setDuplicateData({
      title: `${course.title} (Copy)`,
      price: course.price
    });
  };

  const duplicateCourse = async () => {
    if (!selectedCourse || !duplicateData.title) {
      toast({
        title: "Error",
        description: "Please provide a title for the duplicated course",
        variant: "destructive"
      });
      return;
    }

    setIsCloning(true);
    try {
      // 1. Create the new course
      const { data: newCourse, error: courseError } = await supabase
        .from('courses')
        .insert([{
          ...selectedCourse,
          id: undefined, // Let database generate new ID
          title: duplicateData.title,
          price: duplicateData.price,
          trainer_id: user?.id,
          created_at: undefined,
          updated_at: undefined
        }])
        .select()
        .single();

      if (courseError) throw courseError;

      // 2. Get original course modules
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', selectedCourse.id)
        .order('order_index');

      if (modulesError) throw modulesError;

      // 3. Duplicate modules
      if (modules && modules.length > 0) {
        const newModules = modules.map(module => ({
          ...module,
          id: undefined,
          course_id: newCourse.id,
          created_at: undefined,
          updated_at: undefined
        }));

        const { data: createdModules, error: createModulesError } = await supabase
          .from('course_modules')
          .insert(newModules)
          .select();

        if (createModulesError) throw createModulesError;

        // 4. Get and duplicate lessons for each module
        for (let i = 0; i < modules.length; i++) {
          const originalModule = modules[i];
          const newModule = createdModules[i];

          const { data: lessons, error: lessonsError } = await supabase
            .from('course_lessons')
            .select('*')
            .eq('module_id', originalModule.id)
            .order('order_index');

          if (lessonsError) throw lessonsError;

          if (lessons && lessons.length > 0) {
            const newLessons = lessons.map(lesson => ({
              ...lesson,
              id: undefined,
              module_id: newModule.id,
              created_at: undefined,
              updated_at: undefined
            }));

            const { error: createLessonsError } = await supabase
              .from('course_lessons')
              .insert(newLessons);

            if (createLessonsError) throw createLessonsError;
          }
        }
      }

      toast({
        title: "Success",
        description: `Course "${duplicateData.title}" has been created successfully with all content`
      });

      setSelectedCourse(null);
      setDuplicateData({ title: '', price: 0 });
      onCourseCreated();

    } catch (error) {
      console.error('Error duplicating course:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate course. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Course Duplication</h3>
        <p className="text-gray-600">Clone existing courses with all content and structure</p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Copy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses to duplicate</h3>
            <p className="text-gray-500">Create your first course to enable duplication</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </div>
                  <Badge variant={course.is_active ? "default" : "secondary"}>
                    {course.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>${course.price}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{course.max_students} max</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span>Duration: {course.duration_hours}h</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-medical-blue hover:bg-blue-800"
                    onClick={() => handleSelectCourse(course)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Course</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Original Course</h4>
                <p className="text-blue-800">{selectedCourse.title}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">New Course Title</Label>
                <Input
                  id="title"
                  value={duplicateData.title}
                  onChange={(e) => setDuplicateData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter new course title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={duplicateData.price}
                  onChange={(e) => setDuplicateData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">What will be duplicated:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Course details and settings</li>
                  <li>• All course modules</li>
                  <li>• All lessons and content</li>
                  <li>• Learning objectives</li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={duplicateCourse} 
                  disabled={isCloning}
                  className="bg-medical-blue hover:bg-blue-800"
                >
                  {isCloning ? 'Duplicating...' : 'Duplicate Course'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDuplicator;
