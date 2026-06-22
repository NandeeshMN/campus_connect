import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Send, Image as ImageIcon, Smile, Phone, Video, MoreVertical, CheckCheck, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import PostCard from '../../components/posts/PostCard';
import toast from 'react-hot-toast';

const MessagesPage = () => {
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [loading, setLoading] = useState(true);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/messages/conversations');
      if (data.success) {
        setContacts(data.conversations.map(c => ({
          id: c.id,
          other_user_id: c.other_user_id,
          name: c.full_name,
          username: c.username,
          avatar: c.profile_image,
          lastMsg: c.last_msg_type === 'shared_post' ? 'Shared a post' : c.last_msg,
          time: c.last_msg_time ? new Date(c.last_msg_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          unread: 0,
          online: false
        })));
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeChat) return;
    fetchMessages(activeChat.id);
  }, [activeChat]);

  const fetchMessages = async (convId) => {
    try {
      const { data } = await api.get(`/messages/${convId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!msgText.trim() || !activeChat) return;
    const text = msgText;
    setMsgText('');
    
    // optimistic
    const tempMsg = {
      id: Date.now(),
      sender_id: 'me', // handled by isMe check below
      message_text: text,
      message_type: 'text',
      created_at: new Date(),
      isOptimistic: true
    };
    setMessages(p => [...p, tempMsg]);

    try {
      const { data } = await api.post(`/messages/${activeChat.id}`, { message_text: text });
      if (data.success) {
        setMessages(p => p.map(m => m.id === tempMsg.id ? data.message : m));
        fetchConversations(); // update last_msg
      }
    } catch (err) {
      toast.error('Failed to send message');
      setMessages(p => p.filter(m => m.id !== tempMsg.id));
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col md:flex-row bg-white dark:bg-slate-900 border-x border-slate-100 dark:border-slate-800">
        
        {/* Contacts Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full shrink-0 bg-white dark:bg-slate-900 z-10">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-brand-400 transition-colors text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {contacts.map(contact => (
              <div 
                key={contact.id} 
                onClick={() => setActiveChat(contact)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800/50 ${activeChat?.id === contact.id ? 'bg-brand-50 dark:bg-brand-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <div className="relative shrink-0">
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {contact.isGroup ? 'G' : contact.name.charAt(0)}
                    </div>
                  )}
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{contact.name}</h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{contact.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${contact.unread > 0 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {contact.lastMsg}
                    </p>
                    {contact.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white ml-2 shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between shrink-0">
              <Link to={`/profile/${activeChat.other_user_id}`} className="flex items-center gap-3 hover:opacity-85 transition-opacity">
                {activeChat.avatar ? (
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                    {activeChat.isGroup ? 'G' : activeChat.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{activeChat.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {activeChat.online ? 'Online now' : 'Offline'}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-4 text-slate-400">
                <button className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Phone size={18} /></button>
                <button className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Video size={18} /></button>
                <button className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map(msg => {
                // Determine if sender is me. The current user id should technically be checked.
                // For now, if we don't have full_name on the message, it's optimistic 'me', or we can check sender_id !== activeChat.other_user_id
                // Since our query joins sender info, if it's the current user, we can know by ID. But simpler:
                // Active chat represents the OTHER user. If sender_name matches other user, it's them.
                const isMe = msg.isOptimistic || (msg.full_name !== activeChat.name);
                
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[70%] md:max-w-[60%] lg:max-w-[50%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isMe && (
                        <Link to={`/profile/${activeChat.other_user_id}`}>
                          <img src={activeChat.avatar || 'https://via.placeholder.com/40'} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 hover:opacity-85 transition-opacity" />
                        </Link>
                      )}
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full`}>
                        {msg.message_type === 'shared_post' && msg.shared_post_data ? (
                          <div className="w-full text-left">
                            <PostCard post={msg.shared_post_data} currentUserId="ignored" />
                          </div>
                        ) : msg.message_type === 'text' ? (
                          <div 
                            className={`px-4 py-2.5 rounded-2xl ${
                              isMe 
                                ? 'bg-brand-600 text-white rounded-tr-sm' 
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm'
                            }`}
                          >
                            <p className="text-sm">{msg.message_text}</p>
                          </div>
                        ) : (
                          <div className="text-sm text-slate-500">[Unsupported message type]</div>
                        )}
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                          <span>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}</span>
                          {isMe && <CheckCheck size={12} className="text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/20 transition-all">
                <button className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0">
                  <ImageIcon size={20} />
                </button>
                <input 
                  type="text" 
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200"
                />
                <button className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0">
                  <Smile size={20} />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!msgText.trim()}
                  className="p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-slate-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
