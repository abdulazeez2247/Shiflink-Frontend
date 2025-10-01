// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Plus, Edit, Trash2, Users, DollarSign, Settings, Eye, BarChart3 } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from '@/hooks/useAuth';
// import DatabaseCourseForm from './DatabaseCourseForm';
// import CourseFilters from './CourseFilters';
// import BulkCourseOperations from './BulkCourseOperations';
// import CourseAnalyticsDashboard from './CourseAnalyticsDashboard';

// interface Course {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   duration_hours: number;
//   max_students: number;
//   category: string;
//   requirements: string;
//   is_active: boolean;
//   created_at: string;
//   enrolled_count?: number;
// }

// interface FilterOptions {
//   search: string;
//   category: string;
//   status: string;
//   enrollmentRange: string;
//   priceRange: string;
// }

// interface DatabaseCourseManagerProps {
//   onManageCourse?: (course: { id: string; title: string }) => void;
// }

// const DatabaseCourseManager = ({ onManageCourse }: DatabaseCourseManagerProps) => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingCourse, setEditingCourse] = useState<Course | null>(null);
//   const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState('courses');
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchCourses();
//   }, [user]);

//   useEffect(() => {
//     setFilteredCourses(courses);
//   }, [courses]);

//   const fetchCourses = async () => {
//     try {
//       console.log('Fetching courses for trainer:', user?.id);

//       const { data, error } = await supabase
//         .from('courses')
//         .select(`
//           *,
//           course_enrollments(count)
//         `)
//         .eq('trainer_id', user?.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const coursesWithEnrollments = data?.map(course => ({
//         ...course,
//         enrolled_count: course.course_enrollments?.[0]?.count || 0
//       })) || [];

//       setCourses(coursesWithEnrollments);
//       console.log('Courses loaded:', coursesWithEnrollments);

//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load courses",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFiltersChange = (filters: FilterOptions) => {
//     let filtered = [...courses];

//     // Search filter
//     if (filters.search) {
//       const searchTerm = filters.search.toLowerCase();
//       filtered = filtered.filter(course => 
//         course.title.toLowerCase().includes(searchTerm) ||
//         course.description?.toLowerCase().includes(searchTerm) ||
//         course.category?.toLowerCase().includes(searchTerm)
//       );
//     }

//     // Category filter
//     if (filters.category) {
//       filtered = filtered.filter(course => course.category === filters.category);
//     }

//     // Status filter
//     if (filters.status) {
//       const isActive = filters.status === 'active';
//       filtered = filtered.filter(course => course.is_active === isActive);
//     }

//     // Enrollment range filter
//     if (filters.enrollmentRange) {
//       filtered = filtered.filter(course => {
//         const enrolled = course.enrolled_count || 0;
//         switch (filters.enrollmentRange) {
//           case '0': return enrolled === 0;
//           case '1-10': return enrolled >= 1 && enrolled <= 10;
//           case '11-50': return enrolled >= 11 && enrolled <= 50;
//           case '51+': return enrolled >= 51;
//           default: return true;
//         }
//       });
//     }

//     // Price range filter
//     if (filters.priceRange) {
//       filtered = filtered.filter(course => {
//         const price = course.price;
//         switch (filters.priceRange) {
//           case '0-50': return price >= 0 && price <= 50;
//           case '51-100': return price >= 51 && price <= 100;
//           case '101-200': return price >= 101 && price <= 200;
//           case '201+': return price >= 201;
//           default: return true;
//         }
//       });
//     }

//     setFilteredCourses(filtered);
//   };

//   const handleSaveCourse = async () => {
//     toast({
//       title: "Success",
//       description: editingCourse ? "Course updated successfully" : "Course created successfully"
//     });

//     setShowForm(false);
//     setEditingCourse(null);
//     fetchCourses();
//   };

//   const handleDeleteCourse = async (courseId: string) => {
//     if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
//       return;
//     }

//     setDeletingCourse(courseId);
//     try {
//       const { error } = await supabase
//         .from('courses')
//         .delete()
//         .eq('id', courseId);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Course deleted successfully"
//       });

//       fetchCourses();
//     } catch (error) {
//       console.error('Error deleting course:', error);
//       toast({
//         title: "Error",
//         description: "Failed to delete course",
//         variant: "destructive"
//       });
//     } finally {
//       setDeletingCourse(null);
//     }
//   };

//   const toggleCourseStatus = async (courseId: string, isActive: boolean) => {
//     try {
//       const { error } = await supabase
//         .from('courses')
//         .update({ is_active: !isActive })
//         .eq('id', courseId);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `Course ${!isActive ? 'activated' : 'deactivated'} successfully`
//       });

//       fetchCourses();
//     } catch (error) {
//       console.error('Error updating course status:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update course status",
//         variant: "destructive"
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="p-8">
//           <div className="flex justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <div>
//             <CardTitle>Course Management</CardTitle>
//             <CardDescription>Create and manage your training courses with advanced analytics</CardDescription>
//           </div>
//           <Button onClick={() => setShowForm(true)} className="bg-medical-blue hover:bg-blue-800">
//             <Plus className="w-4 h-4 mr-2" />
//             Add Course
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="courses">Courses</TabsTrigger>
//             <TabsTrigger value="analytics">Analytics</TabsTrigger>
//             <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
//           </TabsList>

//           <TabsContent value="courses" className="mt-6 space-y-6">
//             <CourseFilters onFiltersChange={handleFiltersChange} />
            
//             {filteredCourses.length === 0 ? (
//               <div className="text-center py-8">
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   {courses.length === 0 ? "No courses yet" : "No courses match your filters"}
//                 </h3>
//                 <p className="text-gray-500 mb-4">
//                   {courses.length === 0 
//                     ? "Create your first course to start teaching!" 
//                     : "Try adjusting your search or filter criteria"
//                   }
//                 </p>
//                 {courses.length === 0 && (
//                   <Button onClick={() => setShowForm(true)} className="bg-medical-blue hover:bg-blue-800">
//                     Create Your First Course
//                   </Button>
//                 )}
//               </div>
//             ) : (
//               <div className="grid gap-6">
//                 {filteredCourses.map((course) => (
//                   <div key={course.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-2 mb-2">
//                           <h3 className="text-lg font-semibold">{course.title}</h3>
//                           <Badge variant={course.is_active ? "default" : "secondary"}>
//                             {course.is_active ? "Active" : "Inactive"}
//                           </Badge>
//                         </div>
//                         <p className="text-gray-600 mb-3">{course.description}</p>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                           <div className="flex items-center space-x-1">
//                             <DollarSign className="w-4 h-4 text-green-600" />
//                             <span>${course.price}</span>
//                           </div>
//                           <div className="flex items-center space-x-1">
//                             <Users className="w-4 h-4 text-blue-600" />
//                             <span>{course.enrolled_count || 0}/{course.max_students} students</span>
//                           </div>
//                           <div>
//                             <span className="text-gray-500">Duration: {course.duration_hours}h</span>
//                           </div>
//                           <div>
//                             <span className="text-gray-500">Category: {course.category}</span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center space-x-2 ml-4">
//                         {onManageCourse && (
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => onManageCourse({ id: course.id, title: course.title })}
//                             className="flex items-center space-x-1"
//                           >
//                             <Settings className="w-4 h-4" />
//                             <span>Manage Content</span>
//                           </Button>
//                         )}
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => toggleCourseStatus(course.id, course.is_active)}
//                         >
//                           {course.is_active ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setEditingCourse(course)}
//                         >
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleDeleteCourse(course.id)}
//                           disabled={deletingCourse === course.id}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="analytics" className="mt-6">
//             <CourseAnalyticsDashboard />
//           </TabsContent>

//           <TabsContent value="bulk" className="mt-6">
//             <BulkCourseOperations 
//               courses={filteredCourses} 
//               onCoursesUpdate={fetchCourses}
//             />
//           </TabsContent>
//         </Tabs>

//         <Dialog open={showForm || !!editingCourse} onOpenChange={() => {
//           setShowForm(false);
//           setEditingCourse(null);
//         }}>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
//             </DialogHeader>
//             <DatabaseCourseForm
//               course={editingCourse}
//               onSuccess={handleSaveCourse}
//               onCancel={() => {
//                 setShowForm(false);
//                 setEditingCourse(null);
//               }}
//             />
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// };

// export default DatabaseCourseManager;
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Users, DollarSign, Settings, Eye, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getTrainerCourses, createCourse, updateCourse, deleteCourse } from '@/service/data';
import DatabaseCourseForm from './DatabaseCourseForm';
import CourseFilters from './CourseFilters';
import BulkCourseOperations from './BulkCourseOperations';
import CourseAnalyticsDashboard from './CourseAnalyticsDashboard';

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
  createdAt: string;
  duration_hours?: number;
  max_students?: number;
  category?: string;
  requirements?: string;
}

interface FilterOptions {
  search: string;
  category: string;
  status: string;
  enrollmentRange: string;
  priceRange: string;
}

interface DatabaseCourseManagerProps {
  onManageCourse?: (course: { id: string; title: string }) => void;
}

const DatabaseCourseManager = ({ onManageCourse }: DatabaseCourseManagerProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const getToken = () => localStorage.getItem('token');

 // Updated DatabaseCourseManager.tsx - Fix the fetchCourses function
const fetchCourses = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const coursesData = await getTrainerCourses(token);
    
    // Ensure coursesData is always an array
    const coursesArray = Array.isArray(coursesData) ? coursesData : [];
    
    // Transform the data to match our interface
    const transformedCourses = coursesArray.map((course: any) => ({
      _id: course._id || course.id, // Handle both _id and id
      title: course.title || 'Untitled Course',
      description: course.description || '',
      price: course.price || 0,
      startDate: course.startDate,
      endDate: course.endDate,
      location: course.location || '',
      participants: course.participants || [],
      is_active: true,
      createdAt: course.createdAt || course.created_at || new Date().toISOString(),
      duration_hours: course.duration_hours || 0,
      max_students: course.max_students || 0,
      category: course.category || 'General',
      requirements: course.requirements || ''
    }));

    setCourses(transformedCourses);
    console.log('Courses loaded:', transformedCourses);

  } catch (error: any) {
    console.error('Error fetching courses:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to load courses",
      variant: "destructive"
    });
    // Set empty array on error
    setCourses([]);
  } finally {
    setLoading(false);
  }
};

  const handleFiltersChange = (filters: FilterOptions) => {
    let filtered = [...courses];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description?.toLowerCase().includes(searchTerm) ||
        course.category?.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    // Status filter
    if (filters.status) {
      const isActive = filters.status === 'active';
      filtered = filtered.filter(course => course.is_active === isActive);
    }

    // Enrollment range filter
    if (filters.enrollmentRange) {
      filtered = filtered.filter(course => {
        const enrolled = course.participants?.length || 0;
        switch (filters.enrollmentRange) {
          case '0': return enrolled === 0;
          case '1-10': return enrolled >= 1 && enrolled <= 10;
          case '11-50': return enrolled >= 11 && enrolled <= 50;
          case '51+': return enrolled >= 51;
          default: return true;
        }
      });
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(course => {
        const price = course.price;
        switch (filters.priceRange) {
          case '0-50': return price >= 0 && price <= 50;
          case '51-100': return price >= 51 && price <= 100;
          case '101-200': return price >= 101 && price <= 200;
          case '201+': return price >= 201;
          default: return true;
        }
      });
    }

    setFilteredCourses(filtered);
  };

 const handleSaveCourse = async (courseData: any) => {
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
    } else {
      await createCourse(token, courseData);
      toast({
        title: "Success",
        description: "Course created successfully"
      });
    }

    setShowForm(false);
    setEditingCourse(null);
    fetchCourses();
  } catch (error: any) {
    console.error('Error saving course:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to save course",
      variant: "destructive"
    });
  }
};

  const handleDeleteCourse = async (courseId: string) => {
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
    } catch (error: any) {
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

  const toggleCourseStatus = async (courseId: string, isActive: boolean) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Since your Course model doesn't have is_active, we'll simulate it
      // You might want to add this field to your backend
      const updatedCourses = courses.map(course => 
        course._id === courseId 
          ? { ...course, is_active: !isActive }
          : course
      );
      setCourses(updatedCourses);

      toast({
        title: "Success",
        description: `Course ${!isActive ? 'activated' : 'deactivated'} successfully`
      });

    } catch (error: any) {
      console.error('Error updating course status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update course status",
        variant: "destructive"
      });
      // Revert on error
      fetchCourses();
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
            <CardDescription>Create and manage your training courses</CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6 space-y-6">
            <CourseFilters onFiltersChange={handleFiltersChange} />
            
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {courses.length === 0 ? "No courses yet" : "No courses match your filters"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {courses.length === 0 
                    ? "Create your first course to start teaching!" 
                    : "Try adjusting your search or filter criteria"
                  }
                </p>
                {courses.length === 0 && (
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    Create Your First Course
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredCourses.map((course) => (
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
                        {onManageCourse && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onManageCourse({ id: course._id, title: course.title })}
                            className="flex items-center space-x-1"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Manage Content</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleCourseStatus(course._id, course.is_active)}
                        >
                          {course.is_active ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
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
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <CourseAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="bulk" className="mt-6">
            <BulkCourseOperations 
              courses={filteredCourses} 
              onUpdate={fetchCourses}
            />
          </TabsContent>
        </Tabs>

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