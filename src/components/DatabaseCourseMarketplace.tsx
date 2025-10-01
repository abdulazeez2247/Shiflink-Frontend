
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Calendar, Users, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration_hours: number;
  category: string;
  max_students: number;
  enrollment_count: number;
  trainer_profile?: {
    first_name: string;
    last_name: string;
  };
}

const DatabaseCourseMarketplace = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const categories = [
    'all',
    'CPR/First Aid',
    'Medication Administration',
    'Mental Health',
    'Safety Training',
    'Specialized Care',
    'Professional Development'
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // First get courses with enrollment counts
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments(count)
        `)
        .eq('is_active', true);

      if (coursesError) throw coursesError;

      // Then get trainer profiles separately
      const trainerIds = coursesData?.map(course => course.trainer_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', trainerIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const coursesWithDetails = coursesData?.map(course => ({
        ...course,
        enrollment_count: course.course_enrollments?.[0]?.count || 0,
        trainer_profile: profilesData?.find(profile => profile.id === course.trainer_id)
      })) || [];

      setCourses(coursesWithDetails);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in courses",
        variant: "destructive"
      });
      return;
    }

    setEnrolling(courseId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-course-payment', {
        body: { courseId }
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to process enrollment",
        variant: "destructive"
      });
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Healthcare Training Marketplace</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find and enroll in professional healthcare training courses. Earn certifications from qualified instructors.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="secondary">{course.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription className="line-clamp-3">{course.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {course.trainer_profile ? 
                      `${course.trainer_profile.first_name} ${course.trainer_profile.last_name}` : 
                      'Instructor'
                    }
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">4.8 instructor rating</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">${course.price}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration_hours} hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course.max_students - course.enrollment_count} spots left</span>
                </div>
              </div>

              <Button 
                className="w-full bg-medical-blue hover:bg-blue-800"
                onClick={() => handleEnroll(course.id)}
                disabled={enrolling === course.id || course.enrollment_count >= course.max_students}
              >
                {enrolling === course.id ? 'Processing...' : 
                 course.enrollment_count >= course.max_students ? 'Fully Booked' : 
                 'Enroll Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all available courses.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseCourseMarketplace;
