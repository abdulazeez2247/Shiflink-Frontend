
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Clock, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface StudentProgress {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  timeSpent: number;
  lastAccessed: string;
  averageScore: number;
}

interface ProgressChartData {
  name: string;
  progress: number;
  timeSpent: number;
  completed: number;
}

const StudentProgressCharts = () => {
  const [progressData, setProgressData] = useState<StudentProgress[]>([]);
  const [courses, setCourses] = useState<{id: string, title: string}[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCoursesAndProgress();
    }
  }, [user]);

  const fetchCoursesAndProgress = async () => {
    try {
      // Get trainer's courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('trainer_id', user?.id);

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Get enrollments for these courses
      const courseIds = coursesData?.map(c => c.id) || [];
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('student_id, course_id')
        .in('course_id', courseIds)
        .eq('payment_status', 'completed');

      if (enrollmentsError) throw enrollmentsError;

      // Get progress data
      const { data: progressData, error: progressError } = await supabase
        .from('student_lesson_progress')
        .select(`
          student_id,
          course_id,
          progress_percentage,
          time_spent_minutes,
          completed_at,
          last_accessed_at,
          best_quiz_score
        `)
        .in('course_id', courseIds);

      if (progressError) throw progressError;

      // Get student profiles
      const studentIds = [...new Set(enrollments?.map(e => e.student_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', studentIds);

      if (profilesError) throw profilesError;

      // Get lesson counts per course
      const { data: lessonCounts, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('module_id')
        .in('module_id', 
          await supabase
            .from('course_modules')
            .select('id')
            .in('course_id', courseIds)
            .then(res => res.data?.map(m => m.id) || [])
        );

      // Combine data
      const combinedData: StudentProgress[] = enrollments?.map(enrollment => {
        const student = profiles?.find(p => p.id === enrollment.student_id);
        const course = coursesData?.find(c => c.id === enrollment.course_id);
        const studentProgress = progressData?.filter(p => 
          p.student_id === enrollment.student_id && 
          p.course_id === enrollment.course_id
        ) || [];

        const completedLessons = studentProgress.filter(p => p.completed_at).length;
        const totalTimeSpent = studentProgress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0);
        const avgProgress = studentProgress.length > 0 
          ? studentProgress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / studentProgress.length 
          : 0;
        const avgScore = studentProgress.filter(p => p.best_quiz_score).length > 0
          ? studentProgress.reduce((sum, p) => sum + (p.best_quiz_score || 0), 0) / studentProgress.filter(p => p.best_quiz_score).length
          : 0;

        return {
          studentId: enrollment.student_id,
          studentName: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
          courseId: enrollment.course_id,
          courseName: course?.title || 'Unknown Course',
          totalLessons: 10, // This would need to be calculated from course modules/lessons
          completedLessons,
          progressPercentage: Math.round(avgProgress),
          timeSpent: totalTimeSpent,
          lastAccessed: studentProgress.length > 0 
            ? studentProgress.sort((a, b) => new Date(b.last_accessed_at || '').getTime() - new Date(a.last_accessed_at || '').getTime())[0].last_accessed_at || ''
            : '',
          averageScore: Math.round(avgScore)
        };
      }) || [];

      setProgressData(combinedData);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = selectedCourse === 'all' 
    ? progressData 
    : progressData.filter(p => p.courseId === selectedCourse);

  const chartData: ProgressChartData[] = filteredData.map(student => ({
    name: student.studentName.split(' ').map(n => n[0]).join(''), // Initials for chart
    progress: student.progressPercentage,
    timeSpent: student.timeSpent,
    completed: student.completedLessons
  }));

  const completionStats = {
    completed: filteredData.filter(s => s.progressPercentage >= 100).length,
    inProgress: filteredData.filter(s => s.progressPercentage > 0 && s.progressPercentage < 100).length,
    notStarted: filteredData.filter(s => s.progressPercentage === 0).length
  };

  const pieData = [
    { name: 'Completed', value: completionStats.completed, color: '#10b981' },
    { name: 'In Progress', value: completionStats.inProgress, color: '#f59e0b' },
    { name: 'Not Started', value: completionStats.notStarted, color: '#ef4444' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Student Progress Analytics</h3>
          <p className="text-gray-600">Track student engagement and learning progress</p>
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{filteredData.length}</p>
                <p className="text-gray-600">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Award className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completionStats.completed}</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{completionStats.inProgress}</p>
                <p className="text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(filteredData.reduce((sum, s) => sum + s.timeSpent, 0) / filteredData.length || 0)}m
                </p>
                <p className="text-gray-600">Avg Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progress Distribution</CardTitle>
            <CardDescription>Student completion status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Progress Levels</CardTitle>
            <CardDescription>Individual student completion percentages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Student Progress</CardTitle>
          <CardDescription>Detailed view of each student's learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No student data available</p>
            ) : (
              filteredData.map((student) => (
                <div key={`${student.studentId}-${student.courseId}`} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{student.studentName}</h4>
                      <p className="text-sm text-gray-600">{student.courseName}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={student.progressPercentage >= 100 ? "default" : "secondary"}>
                        {student.progressPercentage}% Complete
                      </Badge>
                      {student.averageScore > 0 && (
                        <Badge variant="outline">
                          Score: {student.averageScore}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{student.completedLessons}/{student.totalLessons} lessons</span>
                    </div>
                    <Progress value={student.progressPercentage} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600 mt-3">
                    <span>Time spent: {student.timeSpent}m</span>
                    <span>
                      Last active: {student.lastAccessed 
                        ? new Date(student.lastAccessed).toLocaleDateString() 
                        : 'Never'
                      }
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgressCharts;
