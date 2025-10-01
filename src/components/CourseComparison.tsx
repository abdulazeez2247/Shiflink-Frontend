
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, DollarSign, Star, Award, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CourseComparisonData {
  id: string;
  title: string;
  totalStudents: number;
  completionRate: number;
  totalRevenue: number;
  averageRating: number;
  certificatesIssued: number;
  avgTimeSpent: number;
  enrollmentTrend: number;
  isActive: boolean;
}

const CourseComparison = () => {
  const [courses, setCourses] = useState<CourseComparisonData[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<{id: string, title: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCourseData();
    }
  }, [user]);

  const fetchCourseData = async () => {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          is_active,
          course_enrollments(
            id,
            amount_paid,
            student_id,
            payment_status,
            enrolled_at
          ),
          certificates(
            id,
            student_id
          )
        `)
        .eq('trainer_id', user?.id);

      if (coursesError) throw coursesError;

      const courseIds = coursesData?.map(c => c.id) || [];
      
      // Fetch additional data
      const { data: progressData } = await supabase
        .from('student_lesson_progress')
        .select('course_id, progress_percentage, time_spent_minutes')
        .in('course_id', courseIds);

      const { data: feedbackData } = await supabase
        .from('student_feedback')
        .select('course_id, rating')
        .in('course_id', courseIds);

      const comparisonData: CourseComparisonData[] = coursesData?.map(course => {
        const enrollments = course.course_enrollments || [];
        const certificates = course.certificates || [];
        
        const paidEnrollments = enrollments.filter(e => e.payment_status === 'completed');
        const totalStudents = paidEnrollments.length;
        const completedStudents = certificates.length;
        const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;
        const totalRevenue = paidEnrollments.reduce((sum, e) => sum + (e.amount_paid || 0), 0);

        const courseProgress = progressData?.filter(p => p.course_id === course.id) || [];
        const courseFeedback = feedbackData?.filter(f => f.course_id === course.id) || [];
        
        const avgRating = courseFeedback.length > 0 
          ? courseFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) / courseFeedback.length 
          : 0;
        
        const avgTimeSpent = courseProgress.length > 0
          ? courseProgress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) / courseProgress.length
          : 0;

        // Calculate enrollment trend (last 30 days vs previous 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const recentEnrollments = enrollments.filter(e => 
          new Date(e.enrolled_at) >= thirtyDaysAgo && e.payment_status === 'completed'
        ).length;
        
        const previousEnrollments = enrollments.filter(e => 
          new Date(e.enrolled_at) >= sixtyDaysAgo && 
          new Date(e.enrolled_at) < thirtyDaysAgo && 
          e.payment_status === 'completed'
        ).length;

        const enrollmentTrend = previousEnrollments > 0 
          ? ((recentEnrollments - previousEnrollments) / previousEnrollments) * 100 
          : recentEnrollments > 0 ? 100 : 0;

        return {
          id: course.id,
          title: course.title,
          totalStudents,
          completionRate,
          totalRevenue: Number(totalRevenue),
          averageRating: avgRating,
          certificatesIssued: certificates.length,
          avgTimeSpent: Math.round(avgTimeSpent),
          enrollmentTrend,
          isActive: course.is_active
        };
      }) || [];

      setCourses(comparisonData);
      setAvailableCourses(coursesData?.map(c => ({ id: c.id, title: c.title })) || []);
      
      // Auto-select top 2 courses by revenue for initial comparison
      const topCourses = comparisonData
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 2)
        .map(c => c.id);
      setSelectedCourses(topCourses);

    } catch (error) {
      console.error('Error fetching course comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCourseData = courses.filter(course => selectedCourses.includes(course.id));

  const getMetricComparison = (courseA: CourseComparisonData, courseB: CourseComparisonData, metric: keyof CourseComparisonData) => {
    const valueA = courseA[metric] as number;
    const valueB = courseB[metric] as number;
    
    if (valueA === valueB) return 'equal';
    return valueA > valueB ? 'higher' : 'lower';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Course Performance Comparison</h3>
        <p className="text-gray-600">Compare your courses side-by-side to identify top performers</p>
      </div>

      {/* Course Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Course A</label>
          <Select 
            value={selectedCourses[0] || ''} 
            onValueChange={(value) => setSelectedCourses([value, selectedCourses[1] || ''])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select first course" />
            </SelectTrigger>
            <SelectContent>
              {availableCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Course B</label>
          <Select 
            value={selectedCourses[1] || ''} 
            onValueChange={(value) => setSelectedCourses([selectedCourses[0] || '', value])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select second course" />
            </SelectTrigger>
            <SelectContent>
              {availableCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedCourseData.length === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedCourseData.map((course, index) => (
            <Card key={course.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <Badge variant={course.isActive ? "default" : "secondary"}>
                    {course.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{course.totalStudents}</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">${course.totalRevenue.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-medium">{course.completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>

                {/* Additional Metrics */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Rating</span>
                    </div>
                    <span className="font-medium">
                      {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Certificates</span>
                    </div>
                    <span className="font-medium">{course.certificatesIssued}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Avg Time</span>
                    </div>
                    <span className="font-medium">{course.avgTimeSpent}m</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm">30-day Trend</span>
                    </div>
                    <span className={`font-medium ${course.enrollmentTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {course.enrollmentTrend >= 0 ? '+' : ''}{course.enrollmentTrend.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedCourseData.length === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Head-to-Head Comparison</CardTitle>
            <CardDescription>Direct performance comparison between selected courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: 'totalRevenue', label: 'Revenue', format: (val: number) => `$${val.toFixed(2)}` },
                { key: 'totalStudents', label: 'Students', format: (val: number) => val.toString() },
                { key: 'completionRate', label: 'Completion Rate', format: (val: number) => `${val.toFixed(1)}%` },
                { key: 'averageRating', label: 'Average Rating', format: (val: number) => val > 0 ? val.toFixed(1) : 'N/A' },
                { key: 'avgTimeSpent', label: 'Avg Time Spent', format: (val: number) => `${val}m` },
                { key: 'enrollmentTrend', label: '30-day Growth', format: (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%` }
              ].map(metric => (
                <div key={metric.key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{metric.label}</span>
                  <div className="flex space-x-8">
                    <span className="text-blue-600 font-medium">
                      {metric.format(selectedCourseData[0][metric.key as keyof CourseComparisonData] as number)}
                    </span>
                    <span className="text-purple-600 font-medium">
                      {metric.format(selectedCourseData[1][metric.key as keyof CourseComparisonData] as number)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedCourseData.length < 2 && (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Two Courses to Compare</h3>
            <p className="text-gray-500">Choose two courses from the dropdowns above to see a detailed side-by-side comparison.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseComparison;
