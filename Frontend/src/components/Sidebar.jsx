import React from 'react';
import { Layout, Plus, Trash2, MessageSquare, Bot } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, startNewChat, chats, activeChatId, setActiveChat, deleteChat }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#452829]/20 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed md:relative z-30 h-full w-72 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        bg-[#E8D1C5] border-r border-[#452829]/10 flex flex-col
      `}>
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 pl-2">
            <div className="w-10 h-10 bg-[#452829] rounded-lg flex items-center justify-center text-[#F3E8DF] shadow-sm">
              <Bot size={18} />
            </div>
            <span className="font-bold text-2xl text-[#452829] tracking-tight">MY-AI</span>
          </div>

          <button 
            onClick={() => { startNewChat(); if(window.innerWidth < 768) toggleSidebar(); }}
            className="w-full py-3 px-4 bg-[#F3E8DF] border border-[#452829]/10 hover:border-[#452829] text-[#452829] rounded-xl font-medium transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
          >
            <span className="text-xs font-bold tracking-wide uppercase">New Chat</span>
            <Plus size={16} className="text-[#452829] group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-thin">
          <div className="text-[10px] font-bold text-[#57595B] uppercase tracking-widest mb-4 px-2 opacity-70">History</div>
          {chats.map((chat) => (
            <div 
              key={chat._id}
              onClick={() => { setActiveChat(chat); if(window.innerWidth < 768) toggleSidebar(); }}
              className={`
                group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                ${activeChatId === chat._id 
                  ? 'bg-[#F3E8DF] text-[#452829] font-semibold shadow-sm border-l-4 border-[#452829]' 
                  : 'hover:bg-[#F3E8DF]/50 text-[#57595B] border-l-4 border-transparent'}
              `}
            >
              <span className="truncate text-sm">
                {chat.title || "Untitled Chat"}
              </span>
              {activeChatId === chat._id && (
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }}
                  className="text-[#57595B] hover:text-[#452829] transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;