
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_published: boolean;
}

interface ModuleFormProps {
  courseId: string;
  module?: Module;
  onSuccess: () => void;
  onCancel: () => void;
}

const ModuleForm = ({ courseId, module, onSuccess, onCancel }: ModuleFormProps) => {
  const [formData, setFormData] = useState({
    title: module?.title || '',
    description: module?.description || '',
    order_index: module?.order_index || 0,
    is_published: module?.is_published || false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Module title is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const moduleData = {
        ...formData,
        course_id: courseId,
        updated_at: new Date().toISOString(),
      };

      if (module) {
        // Update existing module
        const { error } = await supabase
          .from('course_modules')
          .update(moduleData)
          .eq('id', module.id);

        if (error) throw error;
      } else {
        // Create new module
        const { error } = await supabase
          .from('course_modules')
          .insert([moduleData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: module ? "Module updated successfully" : "Module created successfully"
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving module:', error);
      toast({
        title: "Error",
        description: "Failed to save module. Please try again.",
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
          <div className="space-y-2">
            <Label htmlFor="title">Module Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter module title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter module description"
              rows={3}
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
              {loading ? 'Saving...' : (module ? 'Update Module' : 'Create Module')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ModuleForm;
