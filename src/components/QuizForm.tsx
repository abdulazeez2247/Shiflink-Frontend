
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  explanation: string;
  order_index: number;
}

interface QuizFormProps {
  lessonId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const QuizForm = ({ lessonId, onSuccess, onCancel }: QuizFormProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    order_index: 0
  });

  const questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True/False' },
    { value: 'short_answer', label: 'Short Answer' }
  ];

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');

      if (error) throw error;

      setQuestions(data || []);
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

  const resetForm = () => {
    setFormData({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      order_index: questions.length
    });
    setEditingQuestion(null);
  };

  const handleEdit = (question: QuizQuestion) => {
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type,
      options: question.question_type === 'multiple_choice' 
        ? (question.options as string[]) || ['', '', '', '']
        : ['', '', '', ''],
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
      order_index: question.order_index
    });
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question_text.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.correct_answer.trim()) {
      toast({
        title: "Error",
        description: "Correct answer is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const questionData = {
        lesson_id: lessonId,
        question_text: formData.question_text,
        question_type: formData.question_type,
        options: formData.question_type === 'multiple_choice' 
          ? formData.options.filter(opt => opt.trim()) 
          : null,
        correct_answer: formData.correct_answer,
        explanation: formData.explanation || null,
        order_index: formData.order_index
      };

      if (editingQuestion) {
        // Update existing question
        const { error } = await supabase
          .from('quiz_questions')
          .update(questionData)
          .eq('id', editingQuestion.id);

        if (error) throw error;
      } else {
        // Create new question
        const { error } = await supabase
          .from('quiz_questions')
          .insert([questionData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: editingQuestion ? "Question updated successfully" : "Question created successfully"
      });
      
      fetchQuestions();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        title: "Error",
        description: "Failed to save question. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question deleted successfully"
      });
      
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading quiz questions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Quiz Questions</h3>
          <p className="text-gray-600">Create and manage quiz questions for this lesson</p>
        </div>
        <Button onClick={() => {
          resetForm();
          setShowForm(true);
        }} className="bg-medical-blue hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Question Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question_text">Question Text *</Label>
                <Textarea
                  id="question_text"
                  value={formData.question_text}
                  onChange={(e) => handleInputChange('question_text', e.target.value)}
                  placeholder="Enter your question"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question_type">Question Type</Label>
                <Select value={formData.question_type} onValueChange={(value) => handleInputChange('question_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.question_type === 'multiple_choice' && (
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  {formData.options.map((option, index) => (
                    <Input
                      key={index}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="correct_answer">Correct Answer *</Label>
                {formData.question_type === 'multiple_choice' ? (
                  <Select value={formData.correct_answer} onValueChange={(value) => handleInputChange('correct_answer', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.options.filter(opt => opt.trim()).map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : formData.question_type === 'true_false' ? (
                  <Select value={formData.correct_answer} onValueChange={(value) => handleInputChange('correct_answer', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="correct_answer"
                    value={formData.correct_answer}
                    onChange={(e) => handleInputChange('correct_answer', e.target.value)}
                    placeholder="Enter correct answer"
                    required
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation (optional)</Label>
                <Textarea
                  id="explanation"
                  value={formData.explanation}
                  onChange={(e) => handleInputChange('explanation', e.target.value)}
                  placeholder="Explain why this is the correct answer"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-medical-blue hover:bg-blue-800">
                  <Save className="w-4 h-4 mr-2" />
                  {editingQuestion ? 'Update Question' : 'Create Question'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium">Q{index + 1}:</span>
                    <Badge variant="outline">{questionTypes.find(t => t.value === question.question_type)?.label}</Badge>
                  </div>
                  <p className="text-sm mb-2">{question.question_text}</p>
                  
                  {question.question_type === 'multiple_choice' && question.options && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Options:</p>
                      <ul className="text-xs space-y-1">
                        {(question.options as string[]).map((option, optIndex) => (
                          <li key={optIndex} className={`pl-2 ${option === question.correct_answer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {option === question.correct_answer && ' ✓'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Correct: </span>
                    {question.correct_answer}
                  </div>
                  
                  {question.explanation && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Explanation: </span>
                      {question.explanation}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(question)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(question.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {questions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-600 mb-4">Create your first quiz question to get started.</p>
              <Button onClick={() => {
                resetForm();
                setShowForm(true);
              }} className="bg-medical-blue hover:bg-blue-800">
                Create First Question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
        <Button onClick={onSuccess} className="bg-medical-blue hover:bg-blue-800">
          Done
        </Button>
      </div>
    </div>
  );
};

export default QuizForm;
