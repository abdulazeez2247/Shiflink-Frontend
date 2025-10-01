
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Copy, Edit, Trash2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CourseTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  structure: any;
  created_at: string;
  use_count: number;
}

interface CourseTemplateManagerProps {
  onCreateFromTemplate: (template: CourseTemplate) => void;
}

const CourseTemplateManager = ({ onCreateFromTemplate }: CourseTemplateManagerProps) => {
  const [templates, setTemplates] = useState<CourseTemplate[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courses, setCourses] = useState<any[]>([]);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTemplates();
    fetchCourses();
  }, []);

  const fetchTemplates = async () => {
    try {
      // For now, using local storage since we don't have templates table
      const storedTemplates = localStorage.getItem(`course-templates-${user?.id}`);
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, category, description')
        .eq('trainer_id', user?.id);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const createTemplate = async () => {
    if (!selectedCourse || !templateData.name) {
      toast({
        title: "Error",
        description: "Please select a course and provide template name",
        variant: "destructive"
      });
      return;
    }

    try {
      const course = courses.find(c => c.id === selectedCourse);
      if (!course) return;

      // Get course modules and lessons structure
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_lessons(*)
        `)
        .eq('course_id', selectedCourse)
        .order('order_index');

      if (modulesError) throw modulesError;

      const newTemplate: CourseTemplate = {
        id: crypto.randomUUID(),
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        structure: {
          course: {
            title: course.title,
            description: course.description,
            category: course.category
          },
          modules: modules || []
        },
        created_at: new Date().toISOString(),
        use_count: 0
      };

      const updatedTemplates = [...templates, newTemplate];
      setTemplates(updatedTemplates);
      localStorage.setItem(`course-templates-${user?.id}`, JSON.stringify(updatedTemplates));

      toast({
        title: "Success",
        description: "Course template created successfully"
      });

      setShowCreateDialog(false);
      setTemplateData({ name: '', description: '', category: '' });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive"
      });
    }
  };

  const deleteTemplate = (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem(`course-templates-${user?.id}`, JSON.stringify(updatedTemplates));
    
    toast({
      title: "Success",
      description: "Template deleted successfully"
    });
  };

  const useTemplate = (template: CourseTemplate) => {
    const updatedTemplates = templates.map(t => 
      t.id === template.id ? { ...t, use_count: t.use_count + 1 } : t
    );
    setTemplates(updatedTemplates);
    localStorage.setItem(`course-templates-${user?.id}`, JSON.stringify(updatedTemplates));
    onCreateFromTemplate(template);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Course Templates</h3>
          <p className="text-gray-600">Save and reuse successful course structures</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-medical-blue hover:bg-blue-800">
          <BookOpen className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
            <p className="text-gray-500 mb-4">Create your first course template to speed up course creation</p>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-medical-blue hover:bg-blue-800">
              Create Your First Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Used {template.use_count} times</span>
                    <span>{template.structure.modules?.length || 0} modules</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-medical-blue hover:bg-blue-800"
                      onClick={() => useTemplate(template)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Course Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course">Source Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course to template" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={templateData.name}
                onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter template name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={templateData.description}
                onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this template"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={templateData.category}
                onChange={(e) => setTemplateData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Template category"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createTemplate} className="bg-medical-blue hover:bg-blue-800">
                Create Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseTemplateManager;
