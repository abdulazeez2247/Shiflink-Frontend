
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Video, FileText, Download, Upload, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InteractiveContent {
  id: string;
  type: 'video' | 'document' | 'assignment';
  title: string;
  description: string;
  url?: string;
  duration?: number;
  fileSize?: string;
}

const InteractiveContentBuilder = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'documents' | 'assignments'>('videos');
  const [content, setContent] = useState<InteractiveContent[]>([
    {
      id: '1',
      type: 'video',
      title: 'Introduction to Course Material',
      description: 'Welcome video covering course objectives',
      url: '/videos/intro.mp4',
      duration: 180
    },
    {
      id: '2',
      type: 'document',
      title: 'Course Handbook PDF',
      description: 'Comprehensive guide with all materials',
      url: '/docs/handbook.pdf',
      fileSize: '2.4 MB'
    }
  ]);

  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'document' | 'assignment'
  });

  const handleAddContent = () => {
    if (!newContent.title) {
      toast({
        title: "Error",
        description: "Please provide a title for the content",
        variant: "destructive"
      });
      return;
    }

    const contentItem: InteractiveContent = {
      id: Date.now().toString(),
      ...newContent
    };

    setContent([...content, contentItem]);
    setNewContent({ title: '', description: '', type: 'video' });
    
    toast({
      title: "Success",
      description: "Interactive content added successfully"
    });
  };

  const getContentByType = (type: string) => {
    return content.filter(item => item.type === type);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'assignment': return <Upload className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Interactive Content Builder</h3>
        <p className="text-gray-600">Create engaging video lessons, documents, and assignments</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos" className="flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Assignments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getContentByType('video').map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      <span>{item.title}</span>
                    </CardTitle>
                    <Badge variant="outline">Video</Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Duration: {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : 'N/A'}</span>
                      <Button size="sm" variant="outline">
                        Edit Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getContentByType('document').map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span>{item.title}</span>
                    </CardTitle>
                    <Badge variant="outline">Document</Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 rounded-lg text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">PDF Document</p>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Size: {item.fileSize || 'N/A'}</span>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getContentByType('assignment').map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Upload className="w-5 h-5 text-purple-600" />
                      <span>{item.title}</span>
                    </CardTitle>
                    <Badge variant="outline">Assignment</Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 bg-purple-50 rounded-lg text-center">
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-purple-600">Student Upload Required</p>
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">
                        Configure Assignment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add New Content */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Interactive Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newContent.title}
                onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter content title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Content Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newContent.type}
                onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as any }))}
              >
                <option value="video">Video Lesson</option>
                <option value="document">Document/Resource</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newContent.description}
                onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the content and its purpose"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleAddContent} className="bg-medical-blue hover:bg-blue-800">
                Add Content
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveContentBuilder;
