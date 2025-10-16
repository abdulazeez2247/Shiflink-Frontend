import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTrainerCourses, updateCourse, deleteCourse } from '@/service/data';
import DatabaseCourseForm from './DatabaseCourseForm';

const DatabaseCourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const getToken = () => localStorage.getItem('token');

  const fetchCourses = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const coursesData = await getTrainerCourses(token);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (editingCourse) {
        await updateCourse(token, editingCourse._id, courseData);
        toast({
          title: "Success",
          description: "Course updated successfully"
        });
      }

      setShowForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save course",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setDeletingCourse(courseId);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await deleteCourse(token, courseId);

      toast({
        title: "Success",
        description: "Course deleted successfully"
      });

      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive"
      });
    } finally {
      setDeletingCourse(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>Manage your training courses</CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first course to start teaching!
            </p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {courses.map((course) => (
              <div key={course._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <Badge variant={course.is_active ? "default" : "secondary"}>
                        {course.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>${course.price}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>{course.participants?.length || 0} students</span>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Start: {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Location: {course.location || 'Online'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCourse(course)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCourse(course._id)}
                      disabled={deletingCourse === course._id}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={showForm || !!editingCourse} onOpenChange={() => {
          setShowForm(false);
          setEditingCourse(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            </DialogHeader>
            <DatabaseCourseForm
              course={editingCourse}
              onSuccess={handleSaveCourse}
              onCancel={() => {
                setShowForm(false);
                setEditingCourse(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DatabaseCourseManager;