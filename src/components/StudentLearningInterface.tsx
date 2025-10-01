
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, BookOpen, Video, FileText, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import LessonViewer from './LessonViewer';
import QuizTaker from './QuizTaker';

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  duration_hours: number;
  category: string;
  enrollment_id: string;
  progress_percentage: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  lesson_type: string;
  duration_minutes: number;
  order_index: number;
  video_url: string;
  attachment_urls: string[];
  is_completed: boolean;
  quiz_count?: number;
}

const StudentLearningInterface = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentView, setCurrentView] = useState<'courses' | 'modules' | 'lesson' | 'quiz'>('courses');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          course_id,
          courses!inner(
            id,
            title,
            description,
            duration_hours,
            category
          )
        `)
        .eq('student_id', user?.id)
        .eq('payment_status', 'paid');

      if (error) throw error;

      const coursesWithProgress = await Promise.all(
        data?.map(async (enrollment) => {
          const progressPercentage = await calculateCourseProgress(enrollment.course_id);
          return {
            id: enrollment.course_id,
            title: enrollment.courses.title,
            description: enrollment.courses.description,
            duration_hours: enrollment.courses.duration_hours,
            category: enrollment.courses.category,
            enrollment_id: enrollment.id,
            progress_percentage: progressPercentage,
          };
        }) || []
      );

      setEnrolledCourses(coursesWithProgress);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      toast({
        title: "Error",
        description: "Failed to load your courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCourseProgress = async (courseId: string): Promise<number> => {
    try {
      // Get total lessons in course
      const { data: totalLessons, error: totalError } = await supabase
        .from('course_lessons')
        .select('id')
        .eq('module_id', courseId)
        .eq('is_published', true);

      if (totalError) throw totalError;

      if (!totalLessons || totalLessons.length === 0) return 0;

      // Get completed lessons for this student
      const { data: completedLessons, error: completedError } = await supabase
        .from('student_progress')
        .select('lesson_id')
        .eq('student_id', user?.id)
        .eq('course_id', courseId)
        .not('completed_at', 'is', null);

      if (completedError) throw completedError;

      const completedCount = completedLessons?.length || 0;
      return Math.round((completedCount / totalLessons.length) * 100);
    } catch (error) {
      console.error('Error calculating progress:', error);
      return 0;
    }
  };

  const fetchCourseModules = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_lessons!inner(
            id,
            title,
            content,
            lesson_type,
            duration_minutes,
            order_index,
            video_url,
            attachment_urls,
            quiz_questions(count)
          )
        `)
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('order_index');

      if (error) throw error;

      const modulesWithProgress = await Promise.all(
        data?.map(async (module) => {
          const lessonsWithProgress = await Promise.all(
            module.course_lessons.map(async (lesson: any) => {
              const { data: progress } = await supabase
                .from('student_progress')
                .select('completed_at')
                .eq('student_id', user?.id)
                .eq('lesson_id', lesson.id)
                .single();

              return {
                ...lesson,
                is_completed: !!progress?.completed_at,
                quiz_count: lesson.quiz_questions?.[0]?.count || 0
              };
            })
          );

          return {
            ...module,
            lessons: lessonsWithProgress.sort((a, b) => a.order_index - b.order_index)
          };
        }) || []
      );

      setModules(modulesWithProgress);
      if (modulesWithProgress.length > 0) {
        setSelectedModule(modulesWithProgress[0]);
      }
    } catch (error) {
      console.error('Error fetching course modules:', error);
      toast({
        title: "Error",
        description: "Failed to load course content",
        variant: "destructive"
      });
    }
  };

  const handleCourseSelect = (course: EnrolledCourse) => {
    setSelectedCourse(course);
    setCurrentView('modules');
    fetchCourseModules(course.id);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView(lesson.lesson_type === 'quiz' ? 'quiz' : 'lesson');
  };

  const handleLessonComplete = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('student_progress')
        .upsert({
          student_id: user?.id,
          course_id: selectedCourse?.id,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
          time_spent_minutes: 0 // This could be tracked more accurately
        });

      if (error) throw error;

      // Refresh modules to update progress
      if (selectedCourse) {
        fetchCourseModules(selectedCourse.id);
      }

      toast({
        title: "Lesson Complete",
        description: "Your progress has been saved"
      });
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
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

  const getNextLesson = () => {
    if (!selectedModule || !selectedLesson) return null;
    
    const currentIndex = selectedModule.lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < selectedModule.lessons.length - 1) {
      return selectedModule.lessons[currentIndex + 1];
    }
    
    // Check next module
    const currentModuleIndex = modules.findIndex(m => m.id === selectedModule.id);
    if (currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      return nextModule.lessons[0] || null;
    }
    
    return null;
  };

  const getPreviousLesson = () => {
    if (!selectedModule || !selectedLesson) return null;
    
    const currentIndex = selectedModule.lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      return selectedModule.lessons[currentIndex - 1];
    }
    
    // Check previous module
    const currentModuleIndex = modules.findIndex(m => m.id === selectedModule.id);
    if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      return prevModule.lessons[prevModule.lessons.length - 1] || null;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'courses') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">My Learning</h3>
          <p className="text-gray-600">Continue your training journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration_hours}h</span>
                  </div>
                  <Badge variant="outline">{course.category}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress_percentage}%</span>
                  </div>
                  <Progress value={course.progress_percentage} className="h-2" />
                </div>

                <Button 
                  onClick={() => handleCourseSelect(course)}
                  className="w-full bg-medical-blue hover:bg-blue-800"
                >
                  {course.progress_percentage > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {enrolledCourses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Enrolled Courses</h3>
              <p className="text-gray-600 mb-4">Browse the course marketplace to find training that interests you.</p>
              <Button onClick={() => window.location.href = '/courses'} className="bg-medical-blue hover:bg-blue-800">
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (currentView === 'modules') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('courses')}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </Button>
          <div>
            <h3 className="text-lg font-semibold">{selectedCourse?.title}</h3>
            <p className="text-gray-600">Course Content</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
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
                    <h4 className="font-medium text-sm">{module.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{module.lessons.length} lessons</p>
                    <div className="mt-2">
                      <Progress 
                        value={(module.lessons.filter(l => l.is_completed).length / module.lessons.length) * 100} 
                        className="h-1" 
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {selectedModule ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedModule.title}</CardTitle>
                  <p className="text-gray-600">{selectedModule.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedModule.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLessonSelect(lesson)}
                      >
                        <div className="flex items-center space-x-3">
                          {lesson.is_completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          )}
                          {getLessonIcon(lesson.lesson_type)}
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{lesson.duration_minutes} min</span>
                              {lesson.lesson_type === 'quiz' && lesson.quiz_count && (
                                <span>• {lesson.quiz_count} questions</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600">Select a module to view its lessons</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'lesson' && selectedLesson) {
    return (
      <LessonViewer
        lesson={selectedLesson}
        onBack={() => setCurrentView('modules')}
        onComplete={() => handleLessonComplete(selectedLesson.id)}
        onNext={() => {
          const nextLesson = getNextLesson();
          if (nextLesson) {
            handleLessonSelect(nextLesson);
          }
        }}
        onPrevious={() => {
          const prevLesson = getPreviousLesson();
          if (prevLesson) {
            handleLessonSelect(prevLesson);
          }
        }}
        hasNext={!!getNextLesson()}
        hasPrevious={!!getPreviousLesson()}
      />
    );
  }

  if (currentView === 'quiz' && selectedLesson) {
    return (
      <QuizTaker
        lessonId={selectedLesson.id}
        lessonTitle={selectedLesson.title}
        courseId={selectedCourse?.id || ''}
        onBack={() => setCurrentView('modules')}
        onComplete={(score: number) => {
          handleLessonComplete(selectedLesson.id);
          const nextLesson = getNextLesson();
          if (nextLesson) {
            handleLessonSelect(nextLesson);
          } else {
            setCurrentView('modules');
          }
        }}
      />
    );
  }

  return null;
};

export default StudentLearningInterface;
