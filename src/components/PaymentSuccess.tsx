
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EnrollmentDetails {
  course: {
    title: string;
    description: string;
    duration_hours: number;
  };
  enrolled_at: string;
  amount_paid: number;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrollmentDetails, setEnrollmentDetails] = useState<EnrollmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const success = searchParams.get('success');
  const courseId = searchParams.get('course_id');

  useEffect(() => {
    if (success === 'true' && courseId && user) {
      fetchEnrollmentDetails();
    } else if (success !== 'true') {
      setError('Payment was not completed successfully.');
      setLoading(false);
    }
  }, [success, courseId, user]);

  const fetchEnrollmentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          enrolled_at,
          amount_paid,
          courses:course_id (
            title,
            description,
            duration_hours
          )
        `)
        .eq('course_id', courseId)
        .eq('student_id', user?.id)
        .eq('payment_status', 'paid')
        .order('enrolled_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      setEnrollmentDetails({
        course: data.courses,
        enrolled_at: data.enrolled_at,
        amount_paid: data.amount_paid
      });
    } catch (error) {
      console.error('Error fetching enrollment details:', error);
      setError('Unable to fetch enrollment details. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing your enrollment...</h3>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          {error ? (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-red-600">Payment Issue</CardTitle>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-green-600">Enrollment Successful!</CardTitle>
            </>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-x-4">
                <Button onClick={() => navigate('/courses')} variant="outline">
                  Back to Courses
                </Button>
                <Button onClick={() => window.location.href = 'mailto:support@example.com'}>
                  Contact Support
                </Button>
              </div>
            </div>
          ) : enrollmentDetails ? (
            <>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Welcome to: {enrollmentDetails.course.title}
                </h3>
                <p className="text-green-700 mb-4">{enrollmentDetails.course.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-800">Duration:</span>
                    <span className="text-green-700 ml-2">{enrollmentDetails.course.duration_hours} hours</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">Amount Paid:</span>
                    <span className="text-green-700 ml-2">${enrollmentDetails.amount_paid}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li>• You will receive course materials and instructions via email</li>
                  <li>• Your instructor will contact you with scheduling information</li>
                  <li>• Upon completion, you'll receive a certificate</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate('/courses')} variant="outline">
                  Browse More Courses
                </Button>
                <Button onClick={() => navigate('/dashboard')} className="bg-medical-blue hover:bg-blue-800">
                  Go to Dashboard
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
