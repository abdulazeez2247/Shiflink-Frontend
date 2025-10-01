
import StudentLearningInterface from '@/components/StudentLearningInterface';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const LearningPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <StudentLearningInterface />
      </div>
    </div>
  );
};

export default LearningPage;
