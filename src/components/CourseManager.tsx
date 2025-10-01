
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, Users, Calendar, MapPin, Star, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CourseForm from './CourseForm';
import StudentManager from './StudentManager';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  capacity: number;
  enrolled: number;
  nextDate: string;
  status: string;
  rating: number;
  reviews: number;
}

interface Student {
  id: string;
  courseId: string;
  name: string;
  email: string;
  phone: string;
  enrolledDate: string;
  status: 'enrolled' | 'completed' | 'dropped';
  progress: number;
}

interface CourseManagerProps {
  courses: Course[];
  onCoursesChange: (courses: Course[]) => void;
  students: Student[];
  onStudentsChange: (students: Student[]) => void;
}

const CourseManager = ({ courses, onCoursesChange, students, onStudentsChange }: CourseManagerProps) => {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showStudentManager, setShowStudentManager] = useState<{courseId: string, courseName: string} | null>(null);

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
  };

  const handleSaveCourse = (courseData: Omit<Course, 'id' | 'enrolled' | 'rating' | 'reviews'>) => {
    if (editingCourse) {
      const updatedCourses = courses.map(course =>
        course.id === editingCourse.id
          ? { ...course, ...courseData }
          : course
      );
      onCoursesChange(updatedCourses);
    }
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      onCoursesChange(updatedCourses);
      
      // Also remove students from deleted course
      const updatedStudents = students.filter(student => student.courseId !== courseId);
      onStudentsChange(updatedStudents);
      
      toast({
        title: "Success",
        description: "Course deleted successfully"
      });
    }
  };

  const handleViewStudents = (course: Course) => {
    setShowStudentManager({ courseId: course.id, courseName: course.title });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'full':
        return <Badge className="bg-orange-100 text-orange-800">Full</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (showStudentManager) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setShowStudentManager(null)}
          >
            ← Back to Courses
          </Button>
          <h3 className="text-lg font-semibold">Student Management</h3>
        </div>
        <StudentManager 
          courseId={showStudentManager.courseId}
          courseName={showStudentManager.courseName}
          students={students}
          onStudentsChange={onStudentsChange}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Course Management</h3>
          <p className="text-gray-600">Manage your training courses and track enrollments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => {
          const courseStudents = students.filter(s => s.courseId === course.id);
          const actualEnrolled = courseStudents.length;
          
          return (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </div>
                  {getStatusBadge(course.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Price and Rating */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xl font-bold text-green-600">${course.price}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-gray-500">({course.reviews})</span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Next: {course.nextDate} • {course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{course.location}</span>
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Enrollment</span>
                    <span className="font-medium">{actualEnrolled}/{course.capacity}</span>
                  </div>
                  <Progress value={(actualEnrolled / course.capacity) * 100} className="h-2" />
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewStudents(course)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Students ({actualEnrolled})
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Course Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <CourseForm
              course={editingCourse}
              onSave={handleSaveCourse}
              onCancel={() => setEditingCourse(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManager;
