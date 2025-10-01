
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, UserMinus, UserCheck, TrendingDown, Clock, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RetentionData {
  period: string;
  activeStudents: number;
  newStudents: number;
  droppedStudents: number;
  retentionRate: number;
}

interface RetentionMetrics {
  overallRetentionRate: number;
  avgEngagementTime: number;
  studentChurnRate: number;
  activeStudentsCount: number;
}

interface StudentEngagement {
  studentId: string;
  studentName: string;
  courseTitle: string;
  lastAccessed: string;
  totalTimeSpent: number;
  progressPercentage: number;
  daysInactive: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const StudentRetentionMetrics = () => {
  const [retentionData, setRetentionData] = useState<RetentionData[]>([]);
  const [metrics, setMetrics] = useState<RetentionMetrics>({
    overallRetentionRate: 0,
    avgEngagementTime: 0,
    studentChurnRate: 0,
    activeStudentsCount: 0
  });
  const [engagementData, setEngagementData] = useState<StudentEngagement[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [courses, setCourses] = useState<{id: string, title: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRetentionData();
    }
  }, [user, selectedCourse]);

  const fetchRetentionData = async () => {
    try {
      // Get trainer's courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('trainer_id', user?.id);

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      const courseIds = selectedCourse === 'all' 
        ? coursesData?.map(c => c.id) || []
        : [selectedCourse];

      // Get enrollments and progress data
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('student_id, course_id, enrolled_at')
        .in('course_id', courseIds)
        .eq('payment_status', 'completed');

      if (enrollmentsError) throw enrollmentsError;

      // Get progress data
      const { data: progressData, error: progressError } = await supabase
        .from('student_lesson_progress')
        .select(`
          student_id,
          course_id,
          last_accessed_at,
          time_spent_minutes,
          progress_percentage
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

      // Process retention data
      const retentionAnalysis = calculateRetentionMetrics(enrollments || [], progressData || []);
      setRetentionData(retentionAnalysis.timeSeriesData);
      setMetrics(retentionAnalysis.metrics);

      // Process student engagement data
      const engagementAnalysis = calculateStudentEngagement(
        enrollments || [], 
        progressData || [], 
        profiles || [], 
        coursesData || []
      );
      setEngagementData(engagementAnalysis);

    } catch (error) {
      console.error('Error fetching retention data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRetentionMetrics = (enrollments: any[], progressData: any[]) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Calculate monthly retention data for the past 6 months
    const timeSeriesData: RetentionData[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const periodKey = `${periodStart.getFullYear()}-${String(periodStart.getMonth() + 1).padStart(2, '0')}`;

      const periodEnrollments = enrollments.filter(e => {
        const enrollDate = new Date(e.enrolled_at);
        return enrollDate >= periodStart && enrollDate <= periodEnd;
      });

      const periodProgress = progressData.filter(p => {
        const lastAccessed = new Date(p.last_accessed_at);
        return lastAccessed >= periodStart && lastAccessed <= periodEnd;
      });

      const activeStudents = new Set(periodProgress.map(p => p.student_id)).size;
      const newStudents = periodEnrollments.length;
      
      // Estimate dropped students (those who haven't accessed in this period but were active before)
      const previousPeriodStart = new Date(periodStart.getTime() - 30 * 24 * 60 * 60 * 1000);
      const previousProgress = progressData.filter(p => {
        const lastAccessed = new Date(p.last_accessed_at);
        return lastAccessed >= previousPeriodStart && lastAccessed < periodStart;
      });
      
      const previousActiveStudents = new Set(previousProgress.map(p => p.student_id));
      const currentActiveStudents = new Set(periodProgress.map(p => p.student_id));
      
      const droppedStudents = [...previousActiveStudents].filter(id => !currentActiveStudents.has(id)).length;
      const retentionRate = previousActiveStudents.size > 0 
        ? ((previousActiveStudents.size - droppedStudents) / previousActiveStudents.size) * 100 
        : 100;

      timeSeriesData.push({
        period: periodKey,
        activeStudents,
        newStudents,
        droppedStudents,
        retentionRate
      });
    }

    // Calculate overall metrics
    const totalActiveStudents = new Set(
      progressData
        .filter(p => new Date(p.last_accessed_at) >= thirtyDaysAgo)
        .map(p => p.student_id)
    ).size;

    const avgEngagementTime = progressData.length > 0
      ? progressData.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) / progressData.length
      : 0;

    const recentlyInactiveStudents = progressData.filter(p => {
      const lastAccessed = new Date(p.last_accessed_at);
      return lastAccessed < thirtyDaysAgo && lastAccessed >= sixtyDaysAgo;
    });

    const churnRate = enrollments.length > 0 
      ? (recentlyInactiveStudents.length / enrollments.length) * 100 
      : 0;

    const overallRetentionRate = timeSeriesData.length > 0
      ? timeSeriesData.reduce((sum, d) => sum + d.retentionRate, 0) / timeSeriesData.length
      : 0;

    return {
      timeSeriesData,
      metrics: {
        overallRetentionRate,
        avgEngagementTime: Math.round(avgEngagementTime),
        studentChurnRate: churnRate,
        activeStudentsCount: totalActiveStudents
      }
    };
  };

  const calculateStudentEngagement = (
    enrollments: any[], 
    progressData: any[], 
    profiles: any[], 
    courses: any[]
  ): StudentEngagement[] => {
    const now = new Date();
    
    return enrollments.map(enrollment => {
      const student = profiles.find(p => p.id === enrollment.student_id);
      const course = courses.find(c => c.id === enrollment.course_id);
      const studentProgress = progressData.filter(p => 
        p.student_id === enrollment.student_id && p.course_id === enrollment.course_id
      );

      const lastAccessed = studentProgress.length > 0
        ? studentProgress.reduce((latest, current) => 
            new Date(current.last_accessed_at) > new Date(latest.last_accessed_at) ? current : latest
          ).last_accessed_at
        : enrollment.enrolled_at;

      const totalTimeSpent = studentProgress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0);
      const avgProgress = studentProgress.length > 0
        ? studentProgress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / studentProgress.length
        : 0;

      const daysInactive = Math.floor((now.getTime() - new Date(lastAccessed).getTime()) / (1000 * 60 * 60 * 24));
      
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (daysInactive > 14 && avgProgress < 50) riskLevel = 'high';
      else if (daysInactive > 7 || avgProgress < 25) riskLevel = 'medium';

      return {
        studentId: enrollment.student_id,
        studentName: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
        courseTitle: course?.title || 'Unknown Course',
        lastAccessed,
        totalTimeSpent,
        progressPercentage: Math.round(avgProgress),
        daysInactive,
        riskLevel
      };
    }).sort((a, b) => b.daysInactive - a.daysInactive);
  };

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

  const chartConfig = {
    activeStudents: {
      label: "Active Students",
      color: "#3b82f6",
    },
    retentionRate: {
      label: "Retention Rate",
      color: "#10b981",
    },
  };

  const riskCounts = {
    high: engagementData.filter(s => s.riskLevel === 'high').length,
    medium: engagementData.filter(s => s.riskLevel === 'medium').length,
    low: engagementData.filter(s => s.riskLevel === 'low').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Student Retention Metrics</h3>
          <p className="text-gray-600">Track student engagement and retention over time</p>
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-48">
            <SelectValue />
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

      {/* Retention Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.activeStudentsCount}</p>
                <p className="text-gray-600">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.overallRetentionRate.toFixed(1)}%</p>
                <p className="text-gray-600">Retention Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.avgEngagementTime}m</p>
                <p className="text-gray-600">Avg Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <UserMinus className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.studentChurnRate.toFixed(1)}%</p>
                <p className="text-gray-600">Churn Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retention Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Retention Rate Trend</CardTitle>
            <CardDescription>Monthly student retention percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="retentionRate" 
                    stroke="var(--color-retentionRate)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Students Trend</CardTitle>
            <CardDescription>Number of active students per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={retentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="activeStudents" 
                    stroke="var(--color-activeStudents)" 
                    fill="var(--color-activeStudents)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Student Risk Analysis</CardTitle>
          <CardDescription>Identify students at risk of dropping out</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{riskCounts.high}</div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Activity className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{riskCounts.medium}</div>
              <div className="text-sm text-gray-600">Medium Risk</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{riskCounts.low}</div>
              <div className="text-sm text-gray-600">Low Risk</div>
            </div>
          </div>

          <div className="space-y-3">
            {engagementData.slice(0, 10).map((student) => (
              <div key={`${student.studentId}-${student.courseTitle}`} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{student.studentName}</h4>
                    <p className="text-sm text-gray-600">{student.courseTitle}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                      student.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {student.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{student.progressPercentage}%</span>
                  </div>
                  <Progress value={student.progressPercentage} className="h-2" />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 mt-3">
                  <span>Time spent: {student.totalTimeSpent}m</span>
                  <span>
                    Last active: {student.daysInactive === 0 ? 'Today' : `${student.daysInactive} days ago`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRetentionMetrics;
