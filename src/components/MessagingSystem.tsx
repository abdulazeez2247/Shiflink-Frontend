
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'dsp' | 'agency';
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  shiftTitle: string;
  agencyName: string;
  dspName: string;
  status: 'active' | 'completed';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const MessagingSystem = ({ userRole = 'dsp' }: { userRole?: 'dsp' | 'agency' }) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      shiftTitle: 'Personal Care - Mrs. Johnson',
      agencyName: 'Sunrise Healthcare',
      dspName: 'John Doe',
      status: 'active',
      lastMessage: 'Thank you for confirming. See you tomorrow at 8 AM.',
      lastMessageTime: '2 hours ago',
      unreadCount: 1
    },
    {
      id: '2',
      shiftTitle: 'Companionship - Mr. Smith',
      agencyName: 'Compassionate Care',
      dspName: 'Jane Smith',
      status: 'completed',
      lastMessage: 'Great job today! The family was very pleased.',
      lastMessageTime: '1 day ago',
      unreadCount: 0
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: 'agency1',
      senderName: 'Sunrise Healthcare',
      senderRole: 'agency',
      content: 'Hi John, thank you for accepting the shift. Please arrive 10 minutes early for handoff.',
      timestamp: '10:30 AM',
      read: true
    },
    {
      id: '2',
      senderId: 'dsp1',
      senderName: 'John Doe',
      senderRole: 'dsp',
      content: 'Will do! Should I bring anything specific for Mrs. Johnson?',
      timestamp: '10:45 AM',
      read: true
    },
    {
      id: '3',
      senderId: 'agency1',
      senderName: 'Sunrise Healthcare',
      senderRole: 'agency',
      content: 'Just your usual supplies. Her care plan is in the folder by the door. Thank you!',
      timestamp: '11:00 AM',
      read: false
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-medical-blue' : ''
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm truncate">{conv.shiftTitle}</h4>
                  {conv.unreadCount > 0 && (
                    <Badge variant="default" className="bg-medical-blue text-xs">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {userRole === 'dsp' ? conv.agencyName : conv.dspName}
                </p>
                <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{conv.lastMessageTime}</span>
                  <Badge variant={conv.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {conv.status}
                  </Badge>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Thread */}
      <Card className="lg:col-span-2">
        {selectedConv ? (
          <>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">{selectedConv.shiftTitle}</CardTitle>
              <p className="text-sm text-gray-600">
                with {userRole === 'dsp' ? selectedConv.agencyName : selectedConv.dspName}
              </p>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[500px]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        (userRole === 'dsp' && message.senderRole === 'dsp') ||
                        (userRole === 'agency' && message.senderRole === 'agency')
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          (userRole === 'dsp' && message.senderRole === 'dsp') ||
                          (userRole === 'agency' && message.senderRole === 'agency')
                            ? 'bg-medical-blue text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-75">{message.timestamp}</span>
                          {message.read && (
                            <CheckCircle className="w-3 h-3 opacity-75" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-medical-blue hover:bg-blue-800"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Messages are only available for confirmed shifts
                </p>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a shift to view messages</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default MessagingSystem;
