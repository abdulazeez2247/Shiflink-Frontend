
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Lesson {
  id: string;
  title: string;
  content: string;
  lesson_type: string;
  duration_minutes: number;
  order_index: number;
  is_published: boolean;
  video_url: string;
  attachment_urls: string[];
}

interface LessonFormProps {
  moduleId: string;
  lesson?: Lesson;
  onSuccess: () => void;
  onCancel: () => void;
}

const LessonForm = ({ moduleId, lesson, onSuccess, onCancel }: LessonFormProps) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    content: lesson?.content || '',
    lesson_type: lesson?.lesson_type || 'text',
    duration_minutes: lesson?.duration_minutes || 0,
    order_index: lesson?.order_index || 0,
    is_published: lesson?.is_published || false,
    video_url: lesson?.video_url || '',
    attachment_urls: lesson?.attachment_urls?.join('\n') || ''
  });
  const [loading, setLoading] = useState(false);

  const lessonTypes = [
    { value: 'text', label: 'Text Content' },
    { value: 'video', label: 'Video Lesson' },
    { value: 'quiz', label: 'Quiz/Assessment' },
    { value: 'assignment', label: 'Assignment' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Lesson title is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const lessonData = {
        title: formData.title,
        content: formData.content,
        lesson_type: formData.lesson_type,
        duration_minutes: formData.duration_minutes,
        order_index: formData.order_index,
        is_published: formData.is_published,
        video_url: formData.video_url || null,
        attachment_urls: formData.attachment_urls 
          ? formData.attachment_urls.split('\n').filter(url => url.trim()) 
          : [],
        module_id: moduleId,
        updated_at: new Date().toISOString(),
      };

      if (lesson) {
        // Update existing lesson
        const { error } = await supabase
          .from('course_lessons')
          .update(lessonData)
          .eq('id', lesson.id);

        if (error) throw error;
      } else {
        // Create new lesson
        const { error } = await supabase
          .from('course_lessons')
          .insert([lessonData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: lesson ? "Lesson updated successfully" : "Lesson created successfully"
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast({
        title: "Error",
        description: "Failed to save lesson. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter lesson title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lesson_type">Lesson Type</Label>
              <Select value={formData.lesson_type} onValueChange={(value) => handleInputChange('lesson_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lesson type" />
                </SelectTrigger>
                <SelectContent>
                  {lessonTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Enter lesson content"
              rows={6}
            />
          </div>

          {formData.lesson_type === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => handleInputChange('video_url', e.target.value)}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="attachment_urls">Attachment URLs (one per line)</Label>
            <Textarea
              id="attachment_urls"
              value={formData.attachment_urls}
              onChange={(e) => handleInputChange('attachment_urls', e.target.value)}
              placeholder="Enter attachment URLs, one per line"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                min="0"
                value={formData.duration_minutes}
                onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order_index">Order Index</Label>
              <Input
                id="order_index"
                type="number"
                min="0"
                value={formData.order_index}
                onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => handleInputChange('is_published', checked)}
            />
            <Label htmlFor="is_published">Published (visible to students)</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-medical-blue hover:bg-blue-800" disabled={loading}>
              {loading ? 'Saving...' : (lesson ? 'Update Lesson' : 'Create Lesson')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LessonForm;
