import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Plus, Trash2, CheckCircle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  questions: QuizQuestion[];
  passingScore: number;
}

const AdvancedQuizBuilder = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1',
      title: 'Module 1 Assessment',
      description: 'Test your understanding of basic concepts',
      timeLimit: 30,
      passingScore: 80,
      questions: [
        {
          id: '1',
          type: 'multiple_choice',
          question: 'What is the primary purpose of this training?',
          options: ['Safety', 'Compliance', 'Skill Development', 'All of the above'],
          correctAnswer: 3,
          explanation: 'Training encompasses safety, compliance, and skill development.',
          points: 5
        }
      ]
    }
  ]);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<QuizQuestion>>({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 5
  });

  const questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice', icon: '🔘' },
    { value: 'true_false', label: 'True/False', icon: '✓✗' },
    { value: 'short_answer', label: 'Short Answer', icon: '📝' },
    { value: 'essay', label: 'Essay', icon: '📄' }
  ];

  const handleAddQuestion = () => {
    if (!selectedQuiz || !newQuestion.question) {
      toast({
        title: "Error",
        description: "Please fill in the question text",
        variant: "destructive"
      });
      return;
    }

    const question: QuizQuestion = {
      id: Date.now().toString(),
      type: newQuestion.type as any,
      question: newQuestion.question,
      options: newQuestion.type === 'multiple_choice' ? newQuestion.options : undefined,
      correctAnswer: newQuestion.correctAnswer || 0,
      explanation: newQuestion.explanation,
      points: newQuestion.points || 5
    };

    const updatedQuiz = {
      ...selectedQuiz,
      questions: [...selectedQuiz.questions, question]
    };

    setQuizzes(quizzes.map(q => q.id === selectedQuiz.id ? updatedQuiz : q));
    setSelectedQuiz(updatedQuiz);
    
    // Reset form
    setNewQuestion({
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 5
    });

    toast({
      title: "Success",
      description: "Question added successfully"
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedQuiz) return;

    const updatedQuiz = {
      ...selectedQuiz,
      questions: selectedQuiz.questions.filter(q => q.id !== questionId)
    };

    setQuizzes(quizzes.map(q => q.id === selectedQuiz.id ? updatedQuiz : q));
    setSelectedQuiz(updatedQuiz);
  };

  const updateQuestionOption = (index: number, value: string) => {
    const options = [...(newQuestion.options || ['', '', '', ''])];
    options[index] = value;
    setNewQuestion(prev => ({ ...prev, options }));
  };

  if (selectedQuiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{selectedQuiz.title}</h3>
            <p className="text-gray-600">{selectedQuiz.description}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedQuiz(null)}>
            Back to Quizzes
          </Button>
        </div>

        {/* Quiz Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Time Limit (minutes)</Label>
                <Input 
                  type="number" 
                  value={selectedQuiz.timeLimit || ''} 
                  placeholder="No limit"
                />
              </div>
              <div>
                <Label>Passing Score (%)</Label>
                <Input 
                  type="number" 
                  value={selectedQuiz.passingScore} 
                  min="0" 
                  max="100"
                />
              </div>
              <div>
                <Label>Total Questions</Label>
                <Input 
                  value={selectedQuiz.questions.length} 
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Existing Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Questions ({selectedQuiz.questions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedQuiz.questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </Badge>
                      <span className="text-sm text-gray-500">{question.points} points</span>
                    </div>
                    <p className="font-medium mb-2">Q{index + 1}. {question.question}</p>
                    
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="space-y-1 ml-4">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            {optIndex === question.correctAnswer ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-300" />
                            )}
                            <span className={optIndex === question.correctAnswer ? 'text-green-700 font-medium' : ''}>
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Add New Question */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Question Type</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Points</Label>
                <Input
                  type="number"
                  value={newQuestion.points}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 5 }))}
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label>Question Text</Label>
              <Textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter your question here..."
                rows={3}
              />
            </div>

            {newQuestion.type === 'multiple_choice' && (
              <div className="space-y-2">
                <Label>Answer Options</Label>
                {(newQuestion.options || ['', '', '', '']).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correctAnswer === index}
                      onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: index }))}
                      className="text-green-500"
                    />
                    <Input
                      value={option}
                      onChange={(e) => updateQuestionOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {newQuestion.type === 'true_false' && (
              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="trueFalse"
                      checked={newQuestion.correctAnswer === 'true'}
                      onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: 'true' }))}
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="trueFalse"
                      checked={newQuestion.correctAnswer === 'false'}
                      onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: 'false' }))}
                    />
                    <span>False</span>
                  </label>
                </div>
              </div>
            )}

            <div>
              <Label>Explanation (Optional)</Label>
              <Textarea
                value={newQuestion.explanation || ''}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Provide an explanation for the correct answer..."
                rows={2}
              />
            </div>

            <Button onClick={handleAddQuestion} className="bg-medical-blue hover:bg-blue-800">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Advanced Quiz Builder</h3>
        <p className="text-gray-600">Create comprehensive assessments with immediate feedback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <span>{quiz.title}</span>
                </CardTitle>
                <Badge variant="outline">{quiz.questions.length} questions</Badge>
              </div>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Time Limit:</span>
                    <span className="ml-1 font-medium">
                      {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Passing Score:</span>
                    <span className="ml-1 font-medium">{quiz.passingScore}%</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setSelectedQuiz(quiz)}
                  className="w-full bg-medical-blue hover:bg-blue-800"
                >
                  Edit Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Quiz Card */}
        <Card className="border-dashed border-2 hover:border-blue-300 cursor-pointer">
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Create New Quiz</h3>
            <p className="text-gray-500 mb-4">Build assessments with multiple question types</p>
            <Button className="bg-medical-blue hover:bg-blue-800">
              <Plus className="w-4 h-4 mr-2" />
              New Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedQuizBuilder;
