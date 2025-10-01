
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface StudentStatsData {
  enrolledCourses: number;
  hoursCompleted: number;
  certificatesEarned: number;
  averageScore: number;
}

const StudentStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStatsData>({
    enrolledCourses: 0,
    hoursCompleted: 0,
    certificatesEarned: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentStats();
    }
  }, [user]);

  const fetchStudentStats = async () => {
    try {
      console.log('Fetching student stats for user:', user?.id);

      // Get enrolled courses count
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('student_id', user?.id);

      if (enrollmentError) throw enrollmentError;

      // Get total hours completed from student progress
      const { data: progress, error: progressError } = await supabase
        .from('student_progress')
        .select('time_spent_minutes')
        .eq('student_id', user?.id)
        .not('completed_at', 'is', null);

      if (progressError) throw progressError;

      // Get certificates count
      const { data: certificates, error: certificatesError } = await supabase
        .from('certificates')
        .select('id')
        .eq('student_id', user?.id)
        .eq('is_valid', true);

      if (certificatesError) throw certificatesError;

      // Get quiz scores for average
      const { data: quizScores, error: quizError } = await supabase
        .from('student_progress')
        .select('quiz_score')
        .eq('student_id', user?.id)
        .not('quiz_score', 'is', null);

      if (quizError) throw quizError;

      // Calculate statistics
      const totalMinutes = progress?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) || 0;
      const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

      const validScores = quizScores?.filter(s => s.quiz_score !== null).map(s => s.quiz_score!) || [];
      const averageScore = validScores.length > 0 
        ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
        : 0;

      setStats({
        enrolledCourses: enrollments?.length || 0,
        hoursCompleted: totalHours,
        certificatesEarned: certificates?.length || 0,
        averageScore
      });

      console.log('Student stats loaded:', {
        enrolledCourses: enrollments?.length || 0,
        hoursCompleted: totalHours,
        certificatesEarned: certificates?.length || 0,
        averageScore
      });

    } catch (error) {
      console.error('Error fetching student stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
          <p className="text-xs text-muted-foreground">Active enrollments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hours Completed</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hoursCompleted}</div>
          <p className="text-xs text-muted-foreground">Total learning time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
          <p className="text-xs text-muted-foreground">Valid certificates</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageScore}%</div>
          <p className="text-xs text-muted-foreground">Quiz average</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentStats;
