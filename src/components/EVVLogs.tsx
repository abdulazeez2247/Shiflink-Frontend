
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, MapPin, Clock, User, FileText } from 'lucide-react';
import { useEVVShifts } from '@/hooks/useEVVShifts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EVVLog {
  id: string;
  shift_id: string;
  dsp_id: string;
  event_type: string;
  event_timestamp: string;
  gps_latitude: number;
  gps_longitude: number;
  location_address?: string;
  verification_status: string;
  created_at: string;
}

const EVVLogs = () => {
  const { user } = useAuth();
  const { shifts, clients } = useEVVShifts();
  const [logs, setLogs] = useState<EVVLog[]>([]);
  const [dateRange, setDateRange] = useState('7');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

      const { data, error } = await supabase
        .from('evv_logs')
        .select('*')
        .eq('dsp_id', user.id)
        .gte('created_at', daysAgo.toISOString())
        .order('event_timestamp', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching EVV logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user, dateRange]);

  const filteredLogs = logs.filter(log => {
    if (filterStatus === 'all') return true;
    return log.verification_status === filterStatus;
  });

  const getShiftInfo = (shiftId: string) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return { clientName: 'Unknown', facility: 'Unknown', medicaidId: 'Unknown' };
    
    const client = clients.find(c => c.id === shift.client_id);
    return {
      clientName: client?.name || 'Unknown',
      facility: shift.facility_name,
      medicaidId: shift.medicaid_id
    };
  };

  const exportToCSV = () => {
    const headers = ['Event Type', 'Client', 'Facility', 'Timestamp', 'GPS Location', 'Address', 'Status', 'Medicaid ID'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => {
        const shiftInfo = getShiftInfo(log.shift_id);
        return [
          log.event_type,
          shiftInfo.clientName,
          shiftInfo.facility,
          new Date(log.event_timestamp).toLocaleString(),
          `${log.gps_latitude}, ${log.gps_longitude}`,
          log.location_address || '',
          log.verification_status,
          shiftInfo.medicaidId
        ].map(field => `"${field}"`).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evv-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'clock_in': return 'bg-blue-100 text-blue-800';
      case 'clock_out': return 'bg-purple-100 text-purple-800';
      case 'break_start': return 'bg-orange-100 text-orange-800';
      case 'break_end': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div>Loading EVV logs...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export EVV Logs
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{filteredLogs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredLogs.filter(log => log.verification_status === 'verified').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredLogs.filter(log => log.verification_status === 'pending').length}
                </p>
              </div>
              <User className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EVV Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Electronic Visit Verification Logs</CardTitle>
          <CardDescription>
            Medicaid-compliant visit verification with GPS tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No EVV logs found for the selected period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>GPS Location</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Medicaid ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const shiftInfo = getShiftInfo(log.shift_id);
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge className={getEventTypeColor(log.event_type)}>
                            {log.event_type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{shiftInfo.clientName}</TableCell>
                        <TableCell>{shiftInfo.facility}</TableCell>
                        <TableCell>{new Date(log.event_timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="text-sm">
                              {log.gps_latitude.toFixed(6)}, {log.gps_longitude.toFixed(6)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.location_address || 'Address not available'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(log.verification_status)}>
                            {log.verification_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{shiftInfo.medicaidId}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EVVLogs;
