import React, { useState } from 'react';
import { Search, Send, Image, Smile, Phone, Video, MoreVertical, CheckCheck, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

const contacts = [
  { id: 1, name: 'Sarah Mitchell', username: 'sarah_m', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80', lastMsg: 'Are we still on for the study group?', time: '10:42 AM', unread: 2, online: true },
  { id: 2, name: 'Marcus Chen', username: 'marcus_cs', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=80&h=80', lastMsg: 'Thanks for the referral!', time: 'Yesterday', unread: 0, online: false },
  { id: 3, name: 'Project Group (CS301)', username: 'cs301_group', avatar: null, isGroup: true, lastMsg: 'Leo: I pushed the new commit.', time: 'Tuesday', unread: 0, online: false },
];

const messages = [
  { id: 1, sender: 'Sarah Mitchell', text: 'Hey! Are we still on for the study group tonight?', time: '10:30 AM', isMe: false },
  { id: 2, sender: 'Me', text: 'Yes! Let\'s meet at the library around 6 PM.', time: '10:35 AM', isMe: true },
  { id: 3, sender: 'Sarah Mitchell', text: 'Sounds good. I\'ll bring the notes from last week.', time: '10:40 AM', isMe: false },
  { id: 4, sender: 'Sarah Mitchell', text: 'See you then!', time: '10:42 AM', isMe: false },
];

const MessagesPage = () => {
  const [activeChat, setActiveChat] = useState(contacts[0]);
  const [msgText, setMsgText] = useState('');

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
              <div className="flex items-center gap-3">
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
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <button className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Phone size={18} /></button>
                <button className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><Video size={18} /></button>
                <button className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!msg.isMe && (
                      <img src={activeChat.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" />
                    )}
                    <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      <div 
                        className={`px-4 py-2.5 rounded-2xl ${
                          msg.isMe 
                            ? 'bg-brand-600 text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                        <span>{msg.time}</span>
                        {msg.isMe && <CheckCheck size={12} className="text-blue-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/20 transition-all">
                <button className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0">
                  <Image size={20} />
                </button>
                <input 
                  type="text" 
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200"
                />
                <button className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0">
                  <Smile size={20} />
                </button>
                <button 
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
