
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar as CalendarIcon, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const CountyReportGenerator = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'dsp_compliance',
      name: 'DSP Compliance Report',
      description: 'Comprehensive compliance status of all DSPs',
      icon: Users
    },
    {
      id: 'shift_analytics',
      name: 'Shift Analytics Report',
      description: 'Detailed shift coverage and performance metrics',
      icon: TrendingUp
    },
    {
      id: 'credential_audit',
      name: 'Credential Audit Report',
      description: 'Certification and credential tracking report',
      icon: FileText
    },
    {
      id: 'incident_summary',
      name: 'Incident Summary Report',
      description: 'Safety incidents and compliance issues',
      icon: AlertTriangle
    }
  ];

  const generateReport = async () => {
    if (!reportType) {
      toast({
        title: "Report Type Required",
        description: "Please select a report type to generate.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedReport = reportTypes.find(r => r.id === reportType);
      const reportData = generateReportData(reportType);

      // Convert to CSV
      const csvContent = convertToCSV(reportData);
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Report Generated Successfully",
        description: `${selectedReport?.name} has been downloaded to your device.`,
      });

    } catch (error) {
      toast({
        title: "Error Generating Report",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportData = (type: string) => {
    switch (type) {
      case 'dsp_compliance':
        return [
          { 'DSP Name': 'John Smith', 'Facility': 'Sunrise Care', 'Status': 'Compliant', 'Last Review': '2024-06-15', 'Certifications': 'Current' },
          { 'DSP Name': 'Sarah Johnson', 'Facility': 'Valley View', 'Status': 'Non-Compliant', 'Last Review': '2024-06-10', 'Certifications': 'Expired' },
          { 'DSP Name': 'Mike Wilson', 'Facility': 'Maple Heights', 'Status': 'Pending Review', 'Last Review': '2024-06-12', 'Certifications': 'Current' }
        ];
      case 'shift_analytics':
        return [
          { 'Date': '2024-06-15', 'Facility': 'Sunrise Care', 'Total Shifts': 24, 'Covered': 22, 'Coverage Rate': '91.7%' },
          { 'Date': '2024-06-15', 'Facility': 'Valley View', 'Total Shifts': 18, 'Covered': 16, 'Coverage Rate': '88.9%' },
          { 'Date': '2024-06-15', 'Facility': 'Maple Heights', 'Total Shifts': 20, 'Covered': 19, 'Coverage Rate': '95.0%' }
        ];
      case 'credential_audit':
        return [
          { 'DSP Name': 'John Smith', 'Certificate Type': 'CPR/First Aid', 'Issue Date': '2024-01-15', 'Expiry Date': '2024-07-15', 'Status': 'Valid' },
          { 'DSP Name': 'Sarah Johnson', 'Certificate Type': 'Medication Admin', 'Issue Date': '2023-11-20', 'Expiry Date': '2024-05-20', 'Status': 'Expired' },
          { 'DSP Name': 'Mike Wilson', 'Certificate Type': 'Crisis Intervention', 'Issue Date': '2024-02-01', 'Expiry Date': '2025-02-01', 'Status': 'Valid' }
        ];
      default:
        return [
          { 'Report Type': type, 'Generated': new Date().toISOString(), 'Status': 'Complete' }
        ];
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>County Board Report Generator</CardTitle>
          <CardDescription>Generate comprehensive reports for county board review and compliance tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Report Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <div
                    key={report.id}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
                      reportType === report.id && "border-blue-500 bg-blue-50"
                    )}
                    onClick={() => setReportType(report.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range (Optional)</label>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-60 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-60 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <Button 
              onClick={generateReport}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'DSP Compliance Report', date: '2024-06-15', status: 'Complete', type: 'Compliance' },
              { name: 'Shift Analytics Report', date: '2024-06-14', status: 'Complete', type: 'Analytics' },
              { name: 'Credential Audit Report', date: '2024-06-13', status: 'Complete', type: 'Audit' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">Generated on {report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{report.type}</Badge>
                  <Badge className="bg-green-500">Complete</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountyReportGenerator;
