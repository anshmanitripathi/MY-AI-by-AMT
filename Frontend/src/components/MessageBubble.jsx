import React from 'react';
import { User, Sparkles } from 'lucide-react';

const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start' } mb-6 group animate-in slide-in-from-bottom-2 duration-500`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 items-end`}>
        
        {/* Avatar */}
        <div className={`
          w-8 h-8 rounded-xl flex items-center justify-center shadow-sm shrink-0 mb-1
          ${isUser 
            ? 'bg-[#452829] text-[#F3E8DF]' 
            : 'bg-white text-[#452829] border border-[#E8D1C5]'}
        `}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        {/* Bubble */}
        <div className={`
          p-5 text-base leading-relaxed shadow-sm relative
          ${isUser 
            ? 'bg-[#452829] text-[#F3E8DF] rounded-2xl rounded-br-sm' 
            : 'bg-white text-[#2D2D2D] rounded-2xl rounded-bl-sm border border-[#E8D1C5]'}
        `}>
          <div className="whitespace-pre-wrap font-medium">
            {content || "Error: No content received"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;