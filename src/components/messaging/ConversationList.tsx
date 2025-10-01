
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';

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

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  userRole: 'dsp' | 'agency';
}

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  userRole 
}: ConversationListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Messages</span>
          {conversations.filter(c => c.unreadCount > 0).length > 0 && (
            <Badge variant="default" className="bg-medical-blue text-xs">
              {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.id ? 'bg-blue-50 border-l-4 border-l-medical-blue' : ''
                }`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm truncate flex-1 mr-2">{conv.shiftTitle}</h4>
                  {conv.unreadCount > 0 && (
                    <Badge variant="default" className="bg-medical-blue text-xs">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {userRole === 'dsp' ? conv.agencyName : conv.dspName}
                </p>
                <p className="text-xs text-gray-500 truncate mb-2">{conv.lastMessage}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{conv.lastMessageTime}</span>
                  <Badge 
                    variant={conv.status === 'active' ? 'default' : 'secondary'} 
                    className={`text-xs ${conv.status === 'active' ? 'bg-green-100 text-green-800' : ''}`}
                  >
                    {conv.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
