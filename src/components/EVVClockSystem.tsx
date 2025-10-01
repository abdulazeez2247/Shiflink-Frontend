
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, Play, Square, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import ClockInOut from '@/components/ClockInOut';
import EVVLogs from '@/components/EVVLogs';
import ComplianceReports from '@/components/ComplianceReports';

const EVVClockSystem = () => {
  const [todayStats] = useState({
    totalShifts: 12,
    clockedInDSPs: 8,
    complianceRate: 98.5,
    pendingVerifications: 3
  });

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Shifts</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.clockedInDSPs}</p>
              </div>
              <Play className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Shifts</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.totalShifts}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">EVV Compliance</p>
                <p className="text-2xl font-bold text-purple-600">{todayStats.complianceRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-orange-600">{todayStats.pendingVerifications}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="clockin" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clockin">Clock In/Out</TabsTrigger>
          <TabsTrigger value="logs">EVV Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="clockin">
          <ClockInOut />
        </TabsContent>

        <TabsContent value="logs">
          <EVVLogs />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EVVClockSystem;
