import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { messages } from '../services/api';
import io from 'socket.io-client';
import { Send, User as UserIcon } from 'lucide-react';

const socket = io('http://localhost:5000');

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.id) socket.emit('register', user.id);
    fetchConversations();
    return () => socket.off();
  }, [user]);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (selectedUser && (message.senderId === selectedUser.id || message.receiverId === selectedUser.id)) {
        setMessagesList(prev => [...prev, message]);
      }
      fetchConversations();
    });
    return () => socket.off('newMessage');
  }, [selectedUser]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messagesList]);

  const fetchConversations = async () => {
    try { const res = await messages.getConversations(); setConversations(res.data.data || []); } 
    catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const fetchMessages = async (userId) => {
    try { const res = await messages.getMessages(userId); setMessagesList(res.data.data || []); setSelectedUser(conversations.find(c => c.user?.id === userId)?.user); } 
    catch (error) { console.error(error); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await messages.send({ receiverId: selectedUser.id, content: newMessage });
      socket.emit('sendMessage', { ...res.data.data, senderId: user.id, receiverId: selectedUser.id });
      setMessagesList(prev => [...prev, res.data.data]);
      setNewMessage('');
      fetchConversations();
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden h-[70vh]"><div className="flex h-full"><div className="w-1/3 border-r overflow-y-auto"><div className="p-4 bg-gray-50 border-b"><h2 className="font-semibold">Conversations</h2></div>{conversations.length === 0 ? <div className="p-4 text-center text-gray-500">No conversations yet</div> : conversations.map(conv => (<div key={conv.user?.id} onClick={() => fetchMessages(conv.user.id)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedUser?.id === conv.user?.id ? 'bg-blue-50' : ''}`}><div className="flex items-center gap-3"><img src={conv.user?.profileImage || `https://ui-avatars.com/api/?name=${conv.user?.name}&background=3b82f6&color=fff`} className="w-10 h-10 rounded-full" /><div className="flex-1"><p className="font-medium">{conv.user?.name}</p><p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p></div>{conv.unreadCount > 0 && <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{conv.unreadCount}</span>}</div></div>))}</div>
      <div className="flex-1 flex flex-col">{selectedUser ? (<><div className="p-4 bg-gray-50 border-b flex items-center gap-3"><img src={selectedUser.profileImage || `https://ui-avatars.com/api/?name=${selectedUser.name}&background=3b82f6&color=fff`} className="w-10 h-10 rounded-full" /><h2 className="font-semibold">{selectedUser.name}</h2></div><div className="flex-1 overflow-y-auto p-4 space-y-4">{messagesList.map(msg => (<div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] rounded-lg p-3 ${msg.senderId === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}><p>{msg.content}</p><p className="text-xs mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</p></div></div>))}<div ref={messagesEndRef} /></div>
      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="input-field flex-1" /><button type="submit" className="btn-primary px-4"><Send className="h-5 w-5" /></button></form></>) : (<div className="flex-1 flex flex-col items-center justify-center text-gray-500"><UserIcon className="h-12 w-12 mb-2" /><p>Select a conversation to start messaging</p></div>)}</div></div></div>
  );
};

export default Messages;