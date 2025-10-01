
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RevenueData {
  period: string;
  revenue: number;
  enrollments: number;
  avgCoursePrice: number;
}

interface RevenueMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  totalEnrollments: number;
  avgOrderValue: number;
}

const RevenueAnalytics = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalEnrollments: 0,
    avgOrderValue: 0
  });
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly'>('monthly');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRevenueData();
    }
  }, [user, timeframe]);

  const fetchRevenueData = async () => {
    try {
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .eq('trainer_id', user?.id);

      if (coursesError) throw coursesError;

      const courseIds = courses?.map(c => c.id) || [];

      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('enrolled_at, amount_paid')
        .in('course_id', courseIds)
        .eq('payment_status', 'completed')
        .order('enrolled_at', { ascending: true });

      if (enrollmentsError) throw enrollmentsError;

      // Process data based on timeframe
      const processedData = processRevenueData(enrollments || [], timeframe);
      setRevenueData(processedData);

      // Calculate metrics
      const totalRevenue = enrollments?.reduce((sum, e) => sum + (e.amount_paid || 0), 0) || 0;
      const totalEnrollments = enrollments?.length || 0;
      const avgOrderValue = totalEnrollments > 0 ? totalRevenue / totalEnrollments : 0;

      // Calculate growth (compare last two periods)
      const monthlyGrowth = calculateGrowthRate(processedData);

      setMetrics({
        totalRevenue: Number(totalRevenue),
        monthlyGrowth,
        totalEnrollments,
        avgOrderValue: Number(avgOrderValue)
      });

    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (enrollments: any[], timeframe: 'monthly' | 'quarterly'): RevenueData[] => {
    const groupedData: { [key: string]: { revenue: number; enrollments: number } } = {};

    enrollments.forEach(enrollment => {
      const date = new Date(enrollment.enrolled_at);
      const key = timeframe === 'monthly' 
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        : `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;

      if (!groupedData[key]) {
        groupedData[key] = { revenue: 0, enrollments: 0 };
      }

      groupedData[key].revenue += enrollment.amount_paid || 0;
      groupedData[key].enrollments += 1;
    });

    return Object.entries(groupedData).map(([period, data]) => ({
      period,
      revenue: Number(data.revenue),
      enrollments: data.enrollments,
      avgCoursePrice: data.enrollments > 0 ? Number(data.revenue) / data.enrollments : 0
    })).sort((a, b) => a.period.localeCompare(b.period));
  };

  const calculateGrowthRate = (data: RevenueData[]): number => {
    if (data.length < 2) return 0;
    const lastTwo = data.slice(-2);
    const [previous, current] = lastTwo;
    if (previous.revenue === 0) return current.revenue > 0 ? 100 : 0;
    return ((current.revenue - previous.revenue) / previous.revenue) * 100;
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
    revenue: {
      label: "Revenue",
      color: "#3b82f6",
    },
    enrollments: {
      label: "Enrollments",
      color: "#10b981",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Revenue Analytics</h3>
          <p className="text-gray-600">Track your financial performance and growth trends</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeframe} onValueChange={(value: 'monthly' | 'quarterly') => setTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</p>
                <p className="text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {metrics.monthlyGrowth > 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(1)}%
                </p>
                <p className="text-gray-600">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalEnrollments}</p>
                <p className="text-gray-600">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <DollarSign className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">${metrics.avgOrderValue.toFixed(2)}</p>
                <p className="text-gray-600">Avg Order Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Track your revenue growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-revenue)" 
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
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Number of enrollments per period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="enrollments" fill="var(--color-enrollments)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>Projected revenue based on current trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📈 Revenue Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <strong>Current Trend:</strong>
                <p className="mt-1">
                  {metrics.monthlyGrowth > 0 
                    ? `Revenue is growing at ${metrics.monthlyGrowth.toFixed(1)}% ${timeframe === 'monthly' ? 'month-over-month' : 'quarter-over-quarter'}`
                    : metrics.monthlyGrowth < 0
                    ? `Revenue has declined by ${Math.abs(metrics.monthlyGrowth).toFixed(1)}% ${timeframe === 'monthly' ? 'month-over-month' : 'quarter-over-quarter'}`
                    : 'Revenue has remained stable'
                  }
                </p>
              </div>
              <div>
                <strong>Projected Next Period:</strong>
                <p className="mt-1">
                  Based on current trends: ${(revenueData.length > 0 
                    ? revenueData[revenueData.length - 1].revenue * (1 + metrics.monthlyGrowth / 100)
                    : 0
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueAnalytics;
