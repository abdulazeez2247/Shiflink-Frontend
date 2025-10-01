
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle, Video, Download, Clock } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  lesson_type: string;
  duration_minutes: number;
  video_url: string;
  attachment_urls: string[];
  is_completed: boolean;
}

interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const LessonViewer = ({ 
  lesson, 
  onBack, 
  onComplete, 
  onNext, 
  onPrevious, 
  hasNext, 
  hasPrevious 
}: LessonViewerProps) => {
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const handleMarkComplete = async () => {
    setIsMarkingComplete(true);
    try {
      await onComplete();
    } finally {
      setIsMarkingComplete(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Course</span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Badge variant={lesson.lesson_type === 'video' ? 'default' : 'secondary'}>
            {lesson.lesson_type === 'video' ? 'Video' : 'Reading'}
          </Badge>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration_minutes} min</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{lesson.title}</CardTitle>
            {lesson.is_completed && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Video Content */}
          {lesson.lesson_type === 'video' && lesson.video_url && (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <video 
                controls 
                className="w-full h-full object-cover"
                src={lesson.video_url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Text Content */}
          {lesson.content && (
            <div className="prose max-w-none">
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>
          )}

          {/* Attachments */}
          {lesson.attachment_urls && lesson.attachment_urls.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-3">Attachments</h4>
              <div className="space-y-2">
                {lesson.attachment_urls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Download className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Attachment {index + 1}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => window.open(url, '_blank')}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-3">
          {!lesson.is_completed && (
            <Button 
              onClick={handleMarkComplete}
              disabled={isMarkingComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              {isMarkingComplete ? 'Marking Complete...' : 'Mark Complete'}
            </Button>
          )}
          
          <Button 
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center space-x-2 bg-medical-blue hover:bg-blue-800"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
