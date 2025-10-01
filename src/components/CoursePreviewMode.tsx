
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Eye, BookOpen, Play, Clock, Users, Star, CheckCircle, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration_hours: number;
  max_students: number;
  category: string;
  learning_objectives: string[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  lesson_type: string;
  duration_minutes: number;
  order_index: number;
  is_published: boolean;
}

interface CoursePreviewModeProps {
  courses: Course[];
}

const CoursePreviewMode = ({ courses }: CoursePreviewModeProps) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModules, setCourseModules] = useState<Module[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const openPreview = async (course: Course) => {
    setSelectedCourse(course);
    setLoading(true);
    
    try {
      // Fetch course modules and lessons
      const { data: modules, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_lessons(*)
        `)
        .eq('course_id', course.id)
        .eq('is_published', true)
        .order('order_index');

      if (error) throw error;

      const processedModules = modules?.map(module => ({
        ...module,
        lessons: (module.course_lessons || [])
          .filter((lesson: any) => lesson.is_published)
          .sort((a: any, b: any) => a.order_index - b.order_index)
      })) || [];

      setCourseModules(processedModules);
      
      // Generate preview URL (in real app, this would be a public preview link)
      const baseUrl = window.location.origin;
      setPreviewUrl(`${baseUrl}/course-preview/${course.id}`);

    } catch (error) {
      console.error('Error fetching course preview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyPreviewUrl = () => {
    navigator.clipboard.writeText(previewUrl);
    // Using console.log instead of toast to avoid dependency issues
    console.log('Preview URL copied to clipboard');
  };

  const calculatePreviewProgress = (modules: Module[]) => {
    if (modules.length === 0) return 0;
    const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
    const previewableLessons = modules.reduce((sum, module) => 
      sum + module.lessons.slice(0, Math.ceil(module.lessons.length * 0.3)).length, 0
    );
    return totalLessons > 0 ? (previewableLessons / totalLessons) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Course Preview Mode</h3>
        <p className="text-gray-600">Allow potential students to preview course content before enrollment</p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-500">Create courses to enable preview mode</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-green-600" />
                      <span>{course.max_students} max</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">${course.price}</div>
                    <div className="text-sm text-gray-500">Full Course Price</div>
                  </div>
                  
                  <Button 
                    className="w-full bg-medical-blue hover:bg-blue-800"
                    onClick={() => openPreview(course)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Preview Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Course Preview</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-6">
              {/* Course Header */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                    <p className="text-gray-700 mb-4">{selectedCourse.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedCourse.duration_hours} hours</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{courseModules.length} modules</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>4.8 (124 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">${selectedCourse.price}</div>
                    <Button className="mt-2 bg-green-600 hover:bg-green-700">
                      Enroll Now
                    </Button>
                  </div>
                </div>
                
                {/* Preview Progress */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Preview Content</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(calculatePreviewProgress(courseModules))}% available
                    </span>
                  </div>
                  <Progress value={calculatePreviewProgress(courseModules)} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    Preview includes first 30% of each module
                  </p>
                </div>
              </div>

              <Tabs defaultValue="curriculum" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
                  <TabsTrigger value="preview-link">Preview Link</TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="mt-6">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courseModules.map((module, moduleIndex) => (
                        <Card key={module.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Module {moduleIndex + 1}: {module.title}
                            </CardTitle>
                            <CardDescription>{module.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {module.lessons.map((lesson, lessonIndex) => {
                                const isPreviewable = lessonIndex < Math.ceil(module.lessons.length * 0.3);
                                return (
                                  <div 
                                    key={lesson.id} 
                                    className={`flex items-center justify-between p-3 rounded-lg border ${
                                      isPreviewable ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      {isPreviewable ? (
                                        <Play className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <Lock className="w-4 h-4 text-gray-400" />
                                      )}
                                      <div>
                                        <div className="font-medium">{lesson.title}</div>
                                        <div className="text-sm text-gray-600">
                                          {lesson.duration_minutes} minutes • {lesson.lesson_type}
                                        </div>
                                      </div>
                                    </div>
                                    {isPreviewable && (
                                      <Badge variant="outline" className="text-green-600 border-green-300">
                                        Preview
                                      </Badge>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="objectives" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>What You'll Learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCourse.learning_objectives?.map((objective, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{objective}</span>
                          </div>
                        )) || (
                          <p className="text-gray-500">No learning objectives defined</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview-link" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Share Preview Link</CardTitle>
                      <CardDescription>
                        Share this link with potential students to let them preview the course
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm break-all">
                          {previewUrl}
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={copyPreviewUrl} className="bg-medical-blue hover:bg-blue-800">
                            Copy Link
                          </Button>
                          <Button variant="outline" onClick={() => window.open(previewUrl, '_blank')}>
                            Open Preview
                          </Button>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Preview Features:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• First 30% of each module's content</li>
                            <li>• Course overview and learning objectives</li>
                            <li>• Instructor information and reviews</li>
                            <li>• Enrollment call-to-action</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursePreviewMode;
