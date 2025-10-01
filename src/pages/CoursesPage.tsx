
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Play, BookOpen } from 'lucide-react';
import DatabaseCourseMarketplace from '@/components/DatabaseCourseMarketplace';
import DatabaseCourseManager from '@/components/DatabaseCourseManager';
import PaymentSuccess from '@/components/PaymentSuccess';

const CoursesPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('marketplace');

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  // Check if user is a trainer
  const isTrainer = user?.user_metadata?.role === 'trainer';

  // Show payment success page if success parameter is present
  if (success === 'true') {
    return <PaymentSuccess />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Courses</h1>
              <p className="text-gray-600">
                {isTrainer ? 
                  "Manage your courses and browse the marketplace for professional development" :
                  "Browse and enroll in professional healthcare training courses"
                }
              </p>
            </div>
            
            {/* Quick access to learning interface for students */}
            {!isTrainer && user && (
              <div className="flex space-x-3">
                <Button 
                  onClick={() => window.location.href = '/learning'}
                  className="bg-medical-blue hover:bg-blue-800 flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Continue Learning</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Payment status alerts */}
        {canceled === 'true' && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <XCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Payment was canceled. You can try enrolling again anytime.
            </AlertDescription>
          </Alert>
        )}

        {isTrainer ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="marketplace">Course Marketplace</TabsTrigger>
              <TabsTrigger value="manage">Manage My Courses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="marketplace" className="mt-6">
              <DatabaseCourseMarketplace />
            </TabsContent>
            
            <TabsContent value="manage" className="mt-6">
              <DatabaseCourseManager />
            </TabsContent>
          </Tabs>
        ) : (
          <DatabaseCourseMarketplace />
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
