
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Download, FileText, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportOptions {
  format: 'pdf' | 'excel';
  reportType: 'revenue' | 'course-performance' | 'student-progress' | 'retention' | 'comprehensive';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  includeCharts: boolean;
  courseIds: string[];
}

const ExportReports = () => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    reportType: 'comprehensive',
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1), // 3 months ago
      end: new Date()
    },
    includeCharts: true,
    courseIds: []
  });
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const reportTypes = [
    { value: 'revenue', label: 'Revenue Analytics', description: 'Financial performance and trends' },
    { value: 'course-performance', label: 'Course Performance', description: 'Course metrics and comparisons' },
    { value: 'student-progress', label: 'Student Progress', description: 'Learning analytics and completion rates' },
    { value: 'retention', label: 'Student Retention', description: 'Engagement and retention metrics' },
    { value: 'comprehensive', label: 'Comprehensive Report', description: 'All analytics combined' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call an API endpoint or generate the report
      const fileName = `${exportOptions.reportType}-report-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      
      toast({
        title: "Export Successful",
        description: `Your ${exportOptions.format.toUpperCase()} report has been generated: ${fileName}`,
      });

      // Simulate file download
      console.log('Exporting report with options:', exportOptions);
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const updateDateRange = (field: 'start' | 'end', date: Date | null) => {
    setExportOptions(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: date
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Export Reports</h3>
        <p className="text-gray-600">Generate comprehensive reports for business analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Report Configuration</span>
            </CardTitle>
            <CardDescription>Configure your export settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select 
                value={exportOptions.reportType} 
                onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, reportType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={exportOptions.format === 'pdf' ? 'default' : 'outline'}
                  onClick={() => setExportOptions(prev => ({ ...prev, format: 'pdf' }))}
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </Button>
                <Button
                  variant={exportOptions.format === 'excel' ? 'default' : 'outline'}
                  onClick={() => setExportOptions(prev => ({ ...prev, format: 'excel' }))}
                  className="flex items-center space-x-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Excel</span>
                </Button>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Date Range</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                  <DatePicker
                    date={exportOptions.dateRange.start}
                    onSelect={(date) => updateDateRange('start', date)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                  <DatePicker
                    date={exportOptions.dateRange.end}
                    onSelect={(date) => updateDateRange('end', date)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Additional Options</label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-charts"
                  checked={exportOptions.includeCharts}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeCharts: checked as boolean }))
                  }
                />
                <label htmlFor="include-charts" className="text-sm">
                  Include charts and graphs
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview & Export */}
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>Preview of your selected report configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Report Type:</span>
                <span className="text-sm">
                  {reportTypes.find(t => t.value === exportOptions.reportType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Format:</span>
                <span className="text-sm uppercase">{exportOptions.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Date Range:</span>
                <span className="text-sm">
                  {exportOptions.dateRange.start?.toLocaleDateString()} - {exportOptions.dateRange.end?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Include Charts:</span>
                <span className="text-sm">{exportOptions.includeCharts ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Report will include:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                {exportOptions.reportType === 'comprehensive' && (
                  <>
                    <li>• Revenue analytics and trends</li>
                    <li>• Course performance metrics</li>
                    <li>• Student progress analytics</li>
                    <li>• Retention and engagement data</li>
                    <li>• Executive summary</li>
                  </>
                )}
                {exportOptions.reportType === 'revenue' && (
                  <>
                    <li>• Monthly/quarterly revenue breakdown</li>
                    <li>• Growth trends and forecasting</li>
                    <li>• Revenue by course analysis</li>
                    <li>• Payment and enrollment metrics</li>
                  </>
                )}
                {exportOptions.reportType === 'course-performance' && (
                  <>
                    <li>• Course completion rates</li>
                    <li>• Student enrollment trends</li>
                    <li>• Course rating and feedback</li>
                    <li>• Performance comparisons</li>
                  </>
                )}
                {exportOptions.reportType === 'student-progress' && (
                  <>
                    <li>• Individual student analytics</li>
                    <li>• Learning progress tracking</li>
                    <li>• Time spent and engagement</li>
                    <li>• Certificate completion rates</li>
                  </>
                )}
                {exportOptions.reportType === 'retention' && (
                  <>
                    <li>• Student retention rates</li>
                    <li>• Churn analysis</li>
                    <li>• Risk assessment</li>
                    <li>• Engagement metrics</li>
                  </>
                )}
              </ul>
            </div>

            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Generating Report...' : 'Generate & Download Report'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Export Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export Templates</CardTitle>
          <CardDescription>Pre-configured reports for common business needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setExportOptions({
                    format: 'pdf',
                    reportType: 'revenue',
                    dateRange: { 
                      start: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1), 
                      end: new Date() 
                    },
                    includeCharts: true,
                    courseIds: []
                  })}>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Quarterly Revenue</h4>
                <p className="text-xs text-gray-600">Last 3 months financial summary</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setExportOptions({
                    format: 'excel',
                    reportType: 'student-progress',
                    dateRange: { 
                      start: new Date(new Date().getFullYear(), 0, 1), 
                      end: new Date() 
                    },
                    includeCharts: false,
                    courseIds: []
                  })}>
              <CardContent className="p-4 text-center">
                <FileSpreadsheet className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Student Analytics</h4>
                <p className="text-xs text-gray-600">Year-to-date progress data</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setExportOptions({
                    format: 'pdf',
                    reportType: 'comprehensive',
                    dateRange: { 
                      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), 
                      end: new Date() 
                    },
                    includeCharts: true,
                    courseIds: []
                  })}>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Monthly Report</h4>
                <p className="text-xs text-gray-600">Complete monthly overview</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportReports;
