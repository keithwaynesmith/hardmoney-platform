'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  User,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';
import { Communication } from '@/types';
import { communicationService } from '@/lib/database/services';

interface ChatInterfaceProps {
  dealId: string;
  participants: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
}

interface Message extends Communication {
  senderName: string;
  senderRole: string;
  isOwn: boolean;
}

export function ChatInterface({ dealId, participants }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [dealId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const comms = await communicationService.getCommunicationsByDeal(dealId);
      
      // Transform communications into messages with sender info
      const transformedMessages: Message[] = comms.map(comm => {
        const sender = participants.find(p => p.id === comm.fromUserId);
        return {
          ...comm,
          senderName: sender?.name || 'Unknown User',
          senderRole: sender?.role || 'Unknown',
          isOwn: comm.fromUserId === user?.id,
        };
      });

      setMessages(transformedMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const messageData = {
        dealId,
        fromUserId: user.id,
        toUserId: participants.find(p => p.id !== user.id)?.id || participants[0].id,
        subject: 'Chat Message',
        message: newMessage.trim(),
        read: false,
      };

      const newComm = await communicationService.createCommunication(messageData);
      if (newComm) {
        const sender = participants.find(p => p.id === newComm.fromUserId);
        const newMessage: Message = {
          ...newComm,
          senderName: sender?.name || 'You',
          senderRole: sender?.role || 'Unknown',
          isOwn: true,
        };
        setMessages(prev => [...prev, newMessage]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading messages...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <Card className="rounded-b-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Deal Communication</CardTitle>
              <CardDescription>
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{participant.name}</p>
                    <p className="text-xs text-gray-500">{participant.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 rounded-none border-t-0">
        <CardContent className="p-0 h-full">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation below</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const showDate = index === 0 || 
                  formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);
                
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center py-2">
                        <Badge variant="outline" className="text-xs">
                          {formatDate(message.createdAt)}
                        </Badge>
                      </div>
                    )}
                    
                    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                        {!message.isOwn && (
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {message.senderName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {message.senderRole}
                            </Badge>
                          </div>
                        )}
                        
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            message.isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.isOwn ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{formatTime(message.createdAt)}</span>
                            {message.isOwn && (
                              <div className="flex items-center">
                                <CheckCheck className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="rounded-t-none">
        <CardContent className="p-4">
          <form onSubmit={sendMessage} className="flex items-center space-x-2">
            <Button type="button" variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sending}
            />
            <Button type="button" variant="ghost" size="sm">
              <Smile className="w-4 h-4" />
            </Button>
            <Button type="submit" disabled={!newMessage.trim() || sending}>
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
