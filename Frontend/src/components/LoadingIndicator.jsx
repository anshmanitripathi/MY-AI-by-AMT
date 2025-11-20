import React from 'react';

const LoadingIndicator = () => (
  <div className="flex items-center gap-2 p-4 rounded-2xl bg-white/50 w-fit animate-pulse border border-[#E8D1C5]">
    <div className="w-2 h-2 bg-[#452829] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-[#452829] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-[#452829] rounded-full animate-bounce"></div>
  </div>
);

export default LoadingIndicator;