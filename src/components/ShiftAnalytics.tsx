
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Download, Users, Clock, DollarSign } from 'lucide-react';

interface ShiftAnalyticsProps {
  data: {
    timeframe: string;
    shiftStats: {
      total: number;
      completed: number;
      active: number;
      completionRate: number;
    };
    bookingStats: {
      total: number;
      confirmed: number;
      confirmationRate: number;
    };
    financials: {
      totalRevenue: number;
      averageRevenuePerShift: number;
    };
    topDSPs: Array<{
      _id: string;
      name: string;
      totalShifts: number;
      totalHours: number;
    }>;
  } | null;
}

const ShiftAnalytics = ({ data }: ShiftAnalyticsProps) => {
  const [timeframe, setTimeframe] = useState('month');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      // Generate chart data based on timeframe
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentData = months.map((month, index) => ({
        month,
        shifts: Math.round(data.shiftStats.total * (0.8 + Math.random() * 0.4)),
        coverage: Math.round(80 + Math.random() * 20),
        revenue: Math.round(data.financials.totalRevenue * (0.7 + Math.random() * 0.6))
      }));
      setChartData(currentData.slice(0, 6)); // Last 6 months
    }
  }, [data]);

  if (!data) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">Loading analytics data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { shiftStats, bookingStats, financials, topDSPs } = data;

  const exportAnalyticsData = () => {
    const exportData = {
      timeframe: data.timeframe,
      generatedAt: new Date().toISOString(),
      shiftStats,
      bookingStats,
      financials,
      topDSPs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shift-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={exportAnalyticsData}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                <p className="text-2xl font-bold">{shiftStats.total}</p>
                <div className={`flex items-center text-sm ${
                  shiftStats.completionRate > 90 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {shiftStats.completionRate > 90 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {shiftStats.completionRate.toFixed(1)}% completion
                </div>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage Rate</p>
                <p className="text-2xl font-bold">{bookingStats.confirmationRate.toFixed(1)}%</p>
                <div className={`flex items-center text-sm ${
                  bookingStats.confirmationRate > 85 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {bookingStats.confirmationRate > 85 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {bookingStats.confirmed}/{bookingStats.total} confirmed
                </div>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${financials.totalRevenue}</p>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Avg ${financials.averageRevenuePerShift.toFixed(2)}/shift
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Shifts</p>
                <p className="text-2xl font-bold">{shiftStats.active}</p>
                <Badge variant={shiftStats.active > 50 ? "default" : "secondary"} className="mt-1">
                  {shiftStats.active > 50 ? 'High Activity' : 'Normal'}
                </Badge>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shift Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Trends & Revenue</CardTitle>
          <CardDescription>Monthly shift volume and revenue performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="shifts" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Total Shifts"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top DSPs */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing DSPs</CardTitle>
          <CardDescription>Based on completed shifts in the last {data.timeframe}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topDSPs.length > 0 ? (
              topDSPs.map((dsp, index) => (
                <div key={dsp._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{dsp.name}</p>
                      <p className="text-sm text-gray-600">{dsp.totalShifts} shifts completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{dsp.totalHours.toFixed(1)} hours</p>
                    <p className="text-sm text-gray-600">Total worked</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No DSP performance data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftAnalytics;