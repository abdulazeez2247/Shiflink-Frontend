import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, BookOpen, Video, FileText, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ModuleForm from './ModuleForm';
import LessonForm from './LessonForm';
import QuizForm from './QuizForm';

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
  lesson_count?: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string;
  lesson_type: string;
  duration_minutes: number;
  order_index: number;
  is_published: boolean;
  video_url: string;
  attachment_urls: string[];
  quiz_count?: number;
}

interface CourseContentManagerProps {
  course: Course;
}

const CourseContentManager = ({ course }: CourseContentManagerProps) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchModules();
  }, [course.id]);

  useEffect(() => {
    if (selectedModule) {
      fetchLessons(selectedModule.id);
    }
  }, [selectedModule]);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_lessons(count)
        `)
        .eq('course_id', course.id)
        .order('order_index');

      if (error) throw error;

      const modulesWithCounts = data?.map(module => ({
        ...module,
        lesson_count: module.course_lessons?.[0]?.count || 0
      })) || [];

      setModules(modulesWithCounts);
      if (modulesWithCounts.length > 0 && !selectedModule) {
        setSelectedModule(modulesWithCounts[0]);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: "Error",
        description: "Failed to load course modules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (moduleId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .select(`
          *,
          quiz_questions(count)
        `)
        .eq('module_id', moduleId)
        .order('order_index');

      if (error) throw error;

      const lessonsWithCounts = data?.map(lesson => ({
        ...lesson,
        quiz_count: lesson.quiz_questions?.[0]?.count || 0
      })) || [];

      setLessons(lessonsWithCounts);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast({
        title: "Error",
        description: "Failed to load lessons",
        variant: "destructive"
      });
    }
  };

  const handleModuleUpdate = () => {
    fetchModules();
    setEditingModule(null);
    setShowModuleForm(false);
  };

  const handleLessonUpdate = () => {
    if (selectedModule) {
      fetchLessons(selectedModule.id);
    }
    setEditingLesson(null);
    setShowLessonForm(false);
  };

  const handleQuizUpdate = () => {
    if (selectedModule) {
      fetchLessons(selectedModule.id);
    }
    setSelectedLesson(null);
    setShowQuizForm(false);
  };

  const toggleModulePublished = async (module: Module) => {
    try {
      const { error } = await supabase
        .from('course_modules')
        .update({ is_published: !module.is_published })
        .eq('id', module.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Module ${!module.is_published ? 'published' : 'unpublished'} successfully`
      });

      fetchModules();
    } catch (error) {
      console.error('Error updating module:', error);
      toast({
        title: "Error",
        description: "Failed to update module",
        variant: "destructive"
      });
    }
  };

  const toggleLessonPublished = async (lesson: Lesson) => {
    try {
      const { error } = await supabase
        .from('course_lessons')
        .update({ is_published: !lesson.is_published })
        .eq('id', lesson.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Lesson ${!lesson.is_published ? 'published' : 'unpublished'} successfully`
      });

      if (selectedModule) {
        fetchLessons(selectedModule.id);
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast({
        title: "Error",
        description: "Failed to update lesson",
        variant: "destructive"
      });
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!window.confirm('Are you sure? This will delete all lessons and quizzes in this module.')) return;

    try {
      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module deleted successfully"
      });

      fetchModules();
      if (selectedModule?.id === moduleId) {
        setSelectedModule(null);
        setLessons([]);
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({
        title: "Error",
        description: "Failed to delete module",
        variant: "destructive"
      });
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!window.confirm('Are you sure? This will delete all quizzes in this lesson.')) return;

    try {
      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lesson deleted successfully"
      });

      if (selectedModule) {
        fetchLessons(selectedModule.id);
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Error",
        description: "Failed to delete lesson",
        variant: "destructive"
      });
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading course content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Course Content: {course.title}</h3>
          <p className="text-gray-600">Create and manage your course modules, lessons, and assessments</p>
        </div>
        <Button onClick={() => setShowModuleForm(true)} className="bg-medical-blue hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Course Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedModule?.id === module.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedModule(module)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{module.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModulePublished(module);
                      }}
                    >
                      {module.is_published ? (
                        <Eye className="w-3 h-3 text-green-600" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingModule(module);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteModule(module.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{module.lesson_count} lessons</span>
                  <Badge variant={module.is_published ? "default" : "secondary"} className="text-xs">
                    {module.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            ))}
            {modules.length === 0 && (
              <p className="text-gray-500 text-center py-4">No modules yet</p>
            )}
          </CardContent>
        </Card>

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">
                {selectedModule ? `${selectedModule.title} - Lessons` : 'Select a Module'}
              </CardTitle>
              {selectedModule && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLessonForm(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Lesson
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedModule ? (
              lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        {getLessonIcon(lesson.lesson_type)}
                        <h4 className="font-medium text-sm">{lesson.title}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLessonPublished(lesson)}
                        >
                          {lesson.is_published ? (
                            <Eye className="w-3 h-3 text-green-600" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingLesson(lesson)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        {lesson.lesson_type === 'quiz' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setShowQuizForm(true);
                            }}
                          >
                            <HelpCircle className="w-3 h-3 text-blue-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLesson(lesson.id)}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{lesson.duration_minutes} min</span>
                        {lesson.lesson_type === 'quiz' && (
                          <span>{lesson.quiz_count} questions</span>
                        )}
                      </div>
                      <Badge variant={lesson.is_published ? "default" : "secondary"} className="text-xs">
                        {lesson.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No lessons yet</p>
              )
            ) : (
              <p className="text-gray-500 text-center py-4">Select a module to view lessons</p>
            )}
          </CardContent>
        </Card>

        {/* Content Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Content Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedModule ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{selectedModule.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{selectedModule.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Order: {selectedModule.order_index + 1}</span>
                    <Badge variant={selectedModule.is_published ? "default" : "secondary"}>
                      {selectedModule.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                
                {lessons.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Lessons Overview</h5>
                    <div className="space-y-2">
                      {lessons.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            {getLessonIcon(lesson.lesson_type)}
                            <span>{index + 1}. {lesson.title}</span>
                          </div>
                          <span className="text-gray-500">{lesson.duration_minutes}min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Select content to preview</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Module Form Dialog */}
      <Dialog open={showModuleForm || !!editingModule} onOpenChange={() => {
        setShowModuleForm(false);
        setEditingModule(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit Module' : 'Create New Module'}</DialogTitle>
          </DialogHeader>
          <ModuleForm
            courseId={course.id}
            module={editingModule}
            onSuccess={handleModuleUpdate}
            onCancel={() => {
              setShowModuleForm(false);
              setEditingModule(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Lesson Form Dialog */}
      <Dialog open={showLessonForm || !!editingLesson} onOpenChange={() => {
        setShowLessonForm(false);
        setEditingLesson(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
          </DialogHeader>
          {selectedModule && (
            <LessonForm
              moduleId={selectedModule.id}
              lesson={editingLesson}
              onSuccess={handleLessonUpdate}
              onCancel={() => {
                setShowLessonForm(false);
                setEditingLesson(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz Form Dialog */}
      <Dialog open={showQuizForm} onOpenChange={() => {
        setShowQuizForm(false);
        setSelectedLesson(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Quiz Questions</DialogTitle>
          </DialogHeader>
          {selectedLesson && (
            <QuizForm
              lessonId={selectedLesson.id}
              onSuccess={handleQuizUpdate}
              onCancel={() => {
                setShowQuizForm(false);
                setSelectedLesson(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseContentManager;
