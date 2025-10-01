
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Users, Clock, Pin, ThumbsUp, Reply } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorInitials: string;
  timestamp: string;
  replies: number;
  likes: number;
  isPinned: boolean;
  category: string;
}

interface Reply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorInitials: string;
  timestamp: string;
  likes: number;
}

const CourseDiscussionForum = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  
  const [posts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'Welcome to the Course Discussion Forum',
      content: 'This is a space for students to discuss course materials, ask questions, and share insights. Please be respectful and constructive in your interactions.',
      author: 'Dr. Sarah Johnson',
      authorInitials: 'SJ',
      timestamp: '2024-01-15 09:00:00',
      replies: 8,
      likes: 12,
      isPinned: true,
      category: 'announcements'
    },
    {
      id: '2',
      title: 'Question about Module 2 Assignment',
      content: 'I\'m having trouble understanding the requirements for the case study analysis. Could someone clarify what specific elements should be included?',
      author: 'Michael Chen',
      authorInitials: 'MC',
      timestamp: '2024-01-14 14:30:00',
      replies: 3,
      likes: 5,
      isPinned: false,
      category: 'questions'
    },
    {
      id: '3',
      title: 'Study Group Formation',
      content: 'Looking to form a study group for the upcoming exam. Anyone interested in meeting weekly to review materials and practice together?',
      author: 'Emma Rodriguez',
      authorInitials: 'ER',
      timestamp: '2024-01-13 16:45:00',
      replies: 7,
      likes: 9,
      isPinned: false,
      category: 'study-groups'
    }
  ]);

  const [replies] = useState<Reply[]>([
    {
      id: '1',
      postId: '2',
      content: 'For the case study analysis, make sure to include background research, problem identification, analysis framework, and recommendations with supporting evidence.',
      author: 'Dr. Sarah Johnson',
      authorInitials: 'SJ',
      timestamp: '2024-01-14 15:00:00',
      likes: 8
    },
    {
      id: '2',
      postId: '2',
      content: 'Thanks for the clarification! That really helps structure my approach.',
      author: 'Michael Chen',
      authorInitials: 'MC',
      timestamp: '2024-01-14 15:30:00',
      likes: 2
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Posts', count: posts.length },
    { id: 'announcements', name: 'Announcements', count: posts.filter(p => p.category === 'announcements').length },
    { id: 'questions', name: 'Questions', count: posts.filter(p => p.category === 'questions').length },
    { id: 'discussions', name: 'Discussions', count: posts.filter(p => p.category === 'discussions').length },
    { id: 'study-groups', name: 'Study Groups', count: posts.filter(p => p.category === 'study-groups').length }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handleNewPost = () => {
    toast({
      title: "Post Created",
      description: "Your discussion post has been published"
    });
    setShowNewPost(false);
  };

  const getPostReplies = (postId: string) => {
    return replies.filter(reply => reply.postId === postId);
  };

  if (selectedPost) {
    const postReplies = getPostReplies(selectedPost.id);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedPost(null)}>
            ← Back to Forum
          </Button>
        </div>

        {/* Original Post */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>{selectedPost.authorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{selectedPost.title}</h3>
                    {selectedPost.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{selectedPost.author}</span>
                    <span>•</span>
                    <span>{formatTimestamp(selectedPost.timestamp)}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline">{selectedPost.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{selectedPost.content}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{selectedPost.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Reply className="w-4 h-4" />
                <span>{selectedPost.replies} replies</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          <h4 className="font-semibold">Replies ({postReplies.length})</h4>
          
          {postReplies.map((reply) => (
            <Card key={reply.id} className="ml-8">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{reply.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <span className="font-medium">{reply.author}</span>
                      <span>•</span>
                      <span>{formatTimestamp(reply.timestamp)}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{reply.content}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{reply.likes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Reply Form */}
          <Card className="ml-8">
            <CardContent className="pt-6">
              <Textarea
                placeholder="Write your reply..."
                rows={3}
                className="mb-4"
              />
              <Button className="bg-medical-blue hover:bg-blue-800">
                Post Reply
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Discussion Forum</h3>
          <p className="text-gray-600">Engage with fellow students and instructors</p>
        </div>
        <Button 
          onClick={() => setShowNewPost(true)}
          className="bg-medical-blue hover:bg-blue-800"
        >
          New Post
        </Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className={activeCategory === category.id ? "bg-medical-blue hover:bg-blue-800" : ""}
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input placeholder="Post title..." />
            </div>
            <div>
              <select className="w-full p-2 border rounded-md">
                <option value="questions">Questions</option>
                <option value="discussions">General Discussion</option>
                <option value="study-groups">Study Groups</option>
              </select>
            </div>
            <div>
              <Textarea
                placeholder="Write your post content..."
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleNewPost} className="bg-medical-blue hover:bg-blue-800">
                Publish Post
              </Button>
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card 
            key={post.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar>
                    <AvatarFallback>{post.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold hover:text-blue-600">{post.title}</h4>
                      {post.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimestamp(post.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{post.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to start a discussion in this category</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseDiscussionForum;
