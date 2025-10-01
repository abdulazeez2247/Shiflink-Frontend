
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'dsp' | 'agency';
  content: string;
  timestamp: string;
  read: boolean;
  delivered: boolean;
}

interface Conversation {
  id: string;
  shiftTitle: string;
  agencyName: string;
  dspName: string;
  status: 'active' | 'completed';
}

interface MessageThreadProps {
  conversation: Conversation | null;
  messages: Message[];
  userRole: 'dsp' | 'agency';
  onSendMessage: (content: string) => void;
  onMarkAsRead: (messageIds: string[]) => void;
}

const MessageThread = ({ 
  conversation, 
  messages, 
  userRole, 
  onSendMessage,
  onMarkAsRead 
}: MessageThreadProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark unread messages as read when conversation is selected
  useEffect(() => {
    if (conversation && messages.length > 0) {
      const unreadMessages = messages
        .filter(m => !m.read && m.senderRole !== userRole)
        .map(m => m.id);
      
      if (unreadMessages.length > 0) {
        onMarkAsRead(unreadMessages);
      }
    }
  }, [conversation, messages, userRole, onMarkAsRead]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation) return;

    if (conversation.status === 'completed') {
      toast({
        title: "Cannot send message",
        description: "This shift has been completed and messaging is no longer available.",
        variant: "destructive"
      });
      return;
    }
    
    onSendMessage(newMessage.trim());
    setNewMessage('');
    
    toast({
      title: "Message sent",
      description: "Your message has been delivered successfully.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (!conversation) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a shift to view messages</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{conversation.shiftTitle}</CardTitle>
            <p className="text-sm text-gray-600">
              with {userRole === 'dsp' ? conversation.agencyName : conversation.dspName}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {conversation.status === 'active' && (
              <div className="flex items-center text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Active
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[500px]">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = (userRole === 'dsp' && message.senderRole === 'dsp') ||
                                  (userRole === 'agency' && message.senderRole === 'agency');
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        isOwnMessage
                          ? 'bg-medical-blue text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </span>
                        {isOwnMessage && (
                          <div className="flex items-center ml-2">
                            {message.delivered ? (
                              message.read ? (
                                <CheckCircle className="w-3 h-3 text-blue-100" />
                              ) : (
                                <CheckCircle className="w-3 h-3 text-blue-200" />
                              )
                            ) : (
                              <Clock className="w-3 h-3 text-blue-200" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[75%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                conversation.status === 'completed' 
                  ? "This conversation is closed" 
                  : "Type your message..."
              }
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={conversation.status === 'completed'}
              maxLength={1000}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-medical-blue hover:bg-blue-800"
              size="sm"
              disabled={!newMessage.trim() || conversation.status === 'completed'}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {conversation.status === 'active' 
                ? "Messages are available for confirmed shifts"
                : "Shift completed - messaging disabled"
              }
            </p>
            {newMessage.length > 800 && (
              <p className="text-xs text-gray-500">
                {1000 - newMessage.length} characters remaining
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageThread;
