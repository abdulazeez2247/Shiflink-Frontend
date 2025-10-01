
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, DollarSign, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TrainerStatsData {
  totalCourses: number;
  activeStudents: number;
  monthlyRevenue: number;
  certificatesIssued: number;
}

const TrainerStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TrainerStatsData>({
    totalCourses: 0,
    activeStudents: 0,
    monthlyRevenue: 0,
    certificatesIssued: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTrainerStats();
    }
  }, [user]);

  const fetchTrainerStats = async () => {
    try {
      console.log('Fetching trainer stats for user:', user?.id);

      // Get total courses count
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .eq('trainer_id', user?.id);

      if (coursesError) throw coursesError;

      // Get active students count (students with active enrollments)
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('student_id')
        .eq('payment_status', 'completed')
        .in('course_id', courses?.map(c => c.id) || []);

      if (enrollmentsError) throw enrollmentsError;

      // Get unique student count
      const uniqueStudents = new Set(enrollments?.map(e => e.student_id) || []);

      // Get monthly revenue (current month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: payments, error: paymentsError } = await supabase
        .from('course_enrollments')
        .select('amount_paid')
        .eq('payment_status', 'completed')
        .in('course_id', courses?.map(c => c.id) || [])
        .gte('enrolled_at', startOfMonth.toISOString());

      if (paymentsError) throw paymentsError;

      const monthlyRevenue = payments?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;

      // Get certificates issued
      const { data: certificates, error: certificatesError } = await supabase
        .from('certificates')
        .select('id')
        .eq('trainer_id', user?.id)
        .eq('is_valid', true);

      if (certificatesError) throw certificatesError;

      setStats({
        totalCourses: courses?.length || 0,
        activeStudents: uniqueStudents.size,
        monthlyRevenue: Number(monthlyRevenue),
        certificatesIssued: certificates?.length || 0
      });

      console.log('Trainer stats loaded:', {
        totalCourses: courses?.length || 0,
        activeStudents: uniqueStudents.size,
        monthlyRevenue: Number(monthlyRevenue),
        certificatesIssued: certificates?.length || 0
      });

    } catch (error) {
      console.error('Error fetching trainer stats:', error);
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
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCourses}</div>
          <p className="text-xs text-muted-foreground">Active courses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeStudents}</div>
          <p className="text-xs text-muted-foreground">Enrolled students</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Current month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.certificatesIssued}</div>
          <p className="text-xs text-muted-foreground">Valid certificates</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerStats;
