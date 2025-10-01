import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, DollarSign, Star, BookOpen, Award, MessageCircle, Heart } from 'lucide-react';

interface CourseAnalytics {
  id: string;
  title: string;
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
  totalRevenue: number;
  averageRating: number;
  certificatesIssued: number;
  isActive: boolean;
  totalMessages: number;
  avgTimeSpent: number;
  feedbackCount: number;
  averageProgress: number;
}

const CourseAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<CourseAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAnalytics();
  }, []);

  const getToken = () => localStorage.getItem('token');

  const fetchCourseAnalytics = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch courses from your backend API
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/trainer/courses`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const courses = await response.json();

      // Transform the data to match the analytics interface
      const analyticsData: CourseAnalytics[] = courses.map((course: any) => {
        const participants = course.participants || [];
        const totalStudents = participants.length;
        
        // Since your current backend doesn't have all these fields, we'll use placeholders
        // You'll need to add these fields to your backend or calculate them differently
        return {
          id: course._id || course.id,
          title: course.title,
          totalStudents: totalStudents,
          completedStudents: 0, // Placeholder - you'll need to track completions
          completionRate: 0, // Placeholder
          totalRevenue: course.price * totalStudents, // Simple calculation
          averageRating: 4.5, // Placeholder
          certificatesIssued: 0, // Placeholder
          isActive: true, // Placeholder
          totalMessages: 0, // Placeholder
          avgTimeSpent: 0, // Placeholder
          feedbackCount: 0, // Placeholder
          averageProgress: 50 // Placeholder
        };
      });

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching course analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
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
        <h3 className="text-lg font-semibold mb-2">Course Analytics & Engagement</h3>
        <p className="text-gray-600">Detailed performance and engagement metrics for your courses</p>
      </div>

      {analytics.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Course Data Available</h3>
            <p className="text-gray-500">Create courses and get enrollments to see analytics here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analytics.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <Badge variant={course.isActive ? "default" : "secondary"}>
                    {course.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">{course.totalStudents}</div>
                      <div className="text-gray-500">Students</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">${course.totalRevenue.toFixed(0)}</div>
                      <div className="text-gray-500">Revenue</div>
                    </div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium">{course.completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>

                {/* Average Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Progress</span>
                    <span className="font-medium">{course.averageProgress}%</span>
                  </div>
                  <Progress value={course.averageProgress} className="h-2 bg-blue-100">
                    <div 
                      className="h-full bg-blue-500 transition-all" 
                      style={{ width: `${course.averageProgress}%` }}
                    />
                  </Progress>
                </div>

                {/* Engagement Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                    <span>{course.totalMessages} msgs</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span>{course.avgTimeSpent}m avg</span>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{course.averageRating > 0 ? course.averageRating.toFixed(1) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{course.feedbackCount} reviews</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>{course.certificatesIssued} certs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseAnalyticsDashboard;