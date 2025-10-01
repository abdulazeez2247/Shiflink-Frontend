
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Video, HelpCircle, MessageCircle, Trophy } from 'lucide-react';
import InteractiveContentBuilder from './InteractiveContentBuilder';
import AdvancedQuizBuilder from './AdvancedQuizBuilder';
import CourseDiscussionForum from './CourseDiscussionForum';
import ProgressGamification from './ProgressGamification';

const EnhancedLearningExperience = () => {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <GraduationCap className="w-6 h-6 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">Enhanced Learning Experience</h2>
          <p className="text-gray-600">Create engaging, interactive learning environments with gamification</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>Interactive Content</span>
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4" />
            <span>Quiz Builder</span>
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Discussions</span>
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Gamification</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <InteractiveContentBuilder />
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          <AdvancedQuizBuilder />
        </TabsContent>

        <TabsContent value="discussions" className="mt-6">
          <CourseDiscussionForum />
        </TabsContent>

        <TabsContent value="gamification" className="mt-6">
          <ProgressGamification />
        </TabsContent>
      </Tabs>

      {/* Phase 4 Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Phase 4: Enhanced Learning Experience Complete!</span>
          </CardTitle>
          <CardDescription>Comprehensive interactive learning tools with engagement features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-purple-900 mb-2">🎓 Learning Features:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Interactive video lessons with controls</li>
                <li>• Downloadable resources and documents</li>
                <li>• Assignment submission system</li>
                <li>• Multiple content type support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-900 mb-2">🧠 Assessment Tools:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Advanced quiz builder with multiple question types</li>
                <li>• Immediate feedback and explanations</li>
                <li>• Timed assessments with passing scores</li>
                <li>• Question banks and randomization</li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="font-medium text-purple-900 mb-2">💬 Community Features:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Course-specific discussion forums</li>
                <li>• Student-to-student interactions</li>
                <li>• Threaded conversations and replies</li>
                <li>• Instructor moderation tools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-900 mb-2">🏆 Gamification System:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Achievement badges and trophies</li>
                <li>• Learning streaks and daily goals</li>
                <li>• Student leaderboards and rankings</li>
                <li>• Progress tracking with levels</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🚀 Student Engagement Impact:</h4>
            <p className="text-sm text-blue-800">
              Phase 4 transforms your courses into engaging, interactive experiences that keep students motivated 
              and actively participating. The combination of multimedia content, assessment tools, community features, 
              and gamification creates a comprehensive learning environment that drives completion rates and student satisfaction.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedLearningExperience;
