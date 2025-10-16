import { useState, useCallback, useMemo, useEffect } from 'react';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import { getConversations, sendMessage, markMessagesAsRead } from '@/service/data';

interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    role: 'dsp' | 'agency';
  };
  text: string;
  createdAt: string;
  readBy: string[];
  conversationId: string;
}

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    role: 'dsp' | 'agency';
    agencyName?: string;
  }>;
  shift?: {
    _id: string;
    title: string;
    status: 'active' | 'completed';
  };
  lastMessage?: Message;
  updatedAt: string;
}

interface OptimizedMessagingSystemProps {
  userRole?: 'dsp' | 'agency';
}

const OptimizedMessagingSystem = ({ userRole = 'dsp' }: OptimizedMessagingSystemProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = getToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      const conversationsData = await getConversations(token);
      setConversations(conversationsData);
    } catch (error) {
      setError(error.message || 'Failed to fetch conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedConversation) return;

    try {
      setError('');
      const token = getToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      const newMessage = await sendMessage(token, selectedConversation, content);
      
      // Add the new message to the messages list
      setMessages(prev => [...prev, newMessage]);
      
      // Update the conversation's last message
      setConversations(prev => prev.map(conv => 
        conv._id === selectedConversation 
          ? {
              ...conv,
              lastMessage: newMessage,
              updatedAt: new Date().toISOString()
            }
          : conv
      ));

    } catch (error) {
      setError(error.message || 'Failed to send message');
    }
  }, [selectedConversation]);

  const handleMarkAsRead = useCallback(async (messageIds: string[]) => {
    try {
      const token = getToken();
      if (!token) return;

      await markMessagesAsRead(token, messageIds);
      
      // Update messages to mark them as read
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg._id) 
          ? { ...msg, readBy: [...msg.readBy, currentUser?._id || ''] }
          : msg
      ));
      
      // Update unread count for conversation
      if (selectedConversation) {
        setConversations(prev => prev.map(conv => 
          conv._id === selectedConversation 
            ? { ...conv, unreadCount: 0 }
            : conv
        ));
      }
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, [selectedConversation, currentUser]);

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversation(id);
    // For simplicity, we'll load messages when conversation is selected
    // In a real app, you might want to fetch messages from the API
  }, []);

  // Format conversations for the ConversationList component
  const formattedConversations = useMemo(() => {
    return conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p._id !== currentUser?._id);
      const shift = conv.shift;
      
      return {
        id: conv._id,
        shiftTitle: shift?.title || 'Direct Message',
        agencyName: currentUser?.role === 'agency' ? currentUser?.agencyName : otherParticipant?.agencyName,
        dspName: currentUser?.role === 'dsp' ? `${currentUser?.firstName} ${currentUser?.lastName}` : `${otherParticipant?.firstName} ${otherParticipant?.lastName}`,
        status: shift?.status || 'active',
        lastMessage: conv.lastMessage?.text || 'No messages yet',
        lastMessageTime: formatTimeAgo(conv.lastMessage?.createdAt || conv.updatedAt),
        unreadCount: conv.lastMessage 
          ? conv.lastMessage.readBy.includes(currentUser?._id || '') ? 0 : 1 
          : 0
      };
    });
  }, [conversations, currentUser]);

  // Format messages for the MessageThread component
  const formattedMessages = useMemo(() => {
    return messages
      .filter(msg => msg.conversationId === selectedConversation)
      .map(msg => ({
        id: msg._id,
        senderId: msg.sender._id,
        senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
        senderRole: msg.sender.role,
        content: msg.text,
        timestamp: msg.createdAt,
        read: msg.readBy.includes(currentUser?._id || ''),
        delivered: true,
        conversationId: msg.conversationId
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedConversation, currentUser]);

  const selectedConv = useMemo(() => {
    return formattedConversations.find(c => c.id === selectedConversation) || null;
  }, [formattedConversations, selectedConversation]);

  // Helper function to format time ago
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-1">
          <div className="animate-pulse bg-gray-200 rounded-lg h-full"></div>
        </div>
        <div className="lg:col-span-2">
          <div className="animate-pulse bg-gray-200 rounded-lg h-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {error && (
        <div className="col-span-full p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Conversations List */}
      <div className="lg:col-span-1">
        <ConversationList
          conversations={formattedConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          userRole={userRole}
        />
      </div>

      {/* Message Thread */}
      <div className="lg:col-span-2">
        <MessageThread
          conversation={selectedConv}
          messages={formattedMessages}
          userRole={userRole}
          onSendMessage={handleSendMessage}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
    </div>
  );
};

export default OptimizedMessagingSystem;