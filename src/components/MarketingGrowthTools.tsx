
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, FileText, Copy, Percent, Eye } from 'lucide-react';
import CourseTemplateManager from './CourseTemplateManager';
import CourseDuplicator from './CourseDuplicator';
import PromotionalTools from './PromotionalTools';
import CoursePreviewMode from './CoursePreviewMode';

interface MarketingGrowthToolsProps {
  courses: any[];
  onCourseCreated: () => void;
}

const MarketingGrowthTools = ({ courses, onCourseCreated }: MarketingGrowthToolsProps) => {
  const [activeTab, setActiveTab] = useState('templates');

  const handleCreateFromTemplate = (template: any) => {
    // Handle template-based course creation
    console.log('Creating course from template:', template);
    onCourseCreated();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Rocket className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Marketing & Growth Tools</h2>
          <p className="text-gray-600">Boost enrollment with templates, promotions, and preview features</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="duplication" className="flex items-center space-x-2">
            <Copy className="w-4 h-4" />
            <span>Duplication</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="flex items-center space-x-2">
            <Percent className="w-4 h-4" />
            <span>Promotions</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <CourseTemplateManager onCreateFromTemplate={handleCreateFromTemplate} />
        </TabsContent>

        <TabsContent value="duplication" className="mt-6">
          <CourseDuplicator courses={courses} onCourseCreated={onCourseCreated} />
        </TabsContent>

        <TabsContent value="promotions" className="mt-6">
          <PromotionalTools />
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <CoursePreviewMode courses={courses} />
        </TabsContent>
      </Tabs>

      {/* Phase 3 Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="w-5 h-5" />
            <span>Phase 3: Marketing & Growth Tools Complete!</span>
          </CardTitle>
          <CardDescription>Comprehensive marketing tools to boost course enrollment and student engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-900 mb-2">🎯 Marketing Features:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Course templates for rapid creation</li>
                <li>• One-click course duplication</li>
                <li>• Promotional discount codes</li>
                <li>• Early bird pricing strategies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-900 mb-2">🚀 Growth Tools:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Bulk enrollment discounts</li>
                <li>• Course preview mode for leads</li>
                <li>• Shareable preview links</li>
                <li>• Template reuse tracking</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📈 Business Impact:</h4>
            <p className="text-sm text-blue-800">
              These marketing and growth tools are designed to help you scale your training business efficiently. 
              Use templates to standardize successful course structures, promotional tools to drive enrollment, 
              and preview mode to convert more prospects into paying students.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingGrowthTools;
