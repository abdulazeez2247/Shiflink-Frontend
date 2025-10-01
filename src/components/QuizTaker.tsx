import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
}

interface QuizTakerProps {
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  onBack: () => void;
  onComplete: (score: number) => void;
}

const QuizTaker = ({ lessonId, lessonTitle, courseId, onBack, onComplete }: QuizTakerProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('id');

      if (error) throw error;
      
      // Transform the data to match our Question interface with proper type conversion
      const transformedQuestions = data?.map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: Array.isArray(q.options) ? q.options.map(option => String(option)) : [],
        correct_answer: q.correct_answer
      })) || [];
      
      setQuestions(transformedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = () => {
    const correctAnswers = questions.filter(q => answers[q.id] === q.correct_answer).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    setScore(percentage);
    setShowResults(true);
  };

  const handleComplete = () => {
    onComplete(score);
    toast({
      title: "Quiz Complete",
      description: `You scored ${score}%`
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600">No quiz questions available for this lesson.</p>
          <Button onClick={onBack} className="mt-4">Back to Course</Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-4xl font-bold">
            {score >= 70 ? (
              <div className="text-green-600">
                <CheckCircle className="w-16 h-16 mx-auto mb-2" />
                {score}%
              </div>
            ) : (
              <div className="text-red-600">
                <XCircle className="w-16 h-16 mx-auto mb-2" />
                {score}%
              </div>
            )}
          </div>
          <p className="text-gray-600">
            You answered {questions.filter(q => answers[q.id] === q.correct_answer).length} out of {questions.length} questions correctly.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={onBack} variant="outline">Back to Course</Button>
            <Button onClick={handleComplete} className="bg-medical-blue hover:bg-blue-800">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Course</span>
        </Button>
        
        <Badge variant="outline">
          Question {currentQuestionIndex + 1} of {questions.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{lessonTitle} - Quiz</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.question_text}</h3>
            
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={submitQuiz}
                disabled={!answers[currentQuestion.id]}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                disabled={!answers[currentQuestion.id]}
                className="bg-medical-blue hover:bg-blue-800"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizTaker;
