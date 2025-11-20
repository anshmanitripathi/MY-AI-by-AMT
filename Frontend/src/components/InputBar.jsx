import React from 'react';
import { Paperclip, Send, Loader2, X, ArrowRight } from 'lucide-react';

const InputBar = ({ 
  input, 
  setInput, 
  handleKeyDown, 
  sendMessage, 
  isLoading, 
  pdfFile, 
  setPdfFile, 
  fileInputRef, 
  handleFileUpload 
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#F3E8DF] via-[#F3E8DF]/95 to-transparent z-10">
      <div className="max-w-3xl mx-auto">
        
        {/* File Chip */}
        {pdfFile && (
          <div className="mb-3 ml-2 w-fit inline-flex items-center gap-3 bg-[#452829] text-[#F3E8DF] px-4 py-2 rounded-full shadow-lg animate-in slide-in-from-bottom-2">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Context</span>
            <span className="text-xs font-medium truncate max-w-[150px]">{pdfFile.name}</span>
            <button onClick={() => setPdfFile(null)} className="text-white/70 hover:text-white transition-colors">
              <X size={12} />
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="relative flex items-end gap-2 bg-white p-2 pl-5 rounded-2xl shadow-xl shadow-[#452829]/5 border border-[#E8D1C5] transition-all hover:border-[#452829]/20 group focus-within:ring-2 focus-within:ring-[#452829]/5">
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="pb-3 text-[#BCAAA4] hover:text-[#452829] transition-colors"
            title="Add Context"
          >
            <Paperclip size={20} />
            <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          </button>

          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start a new thread..."
            className="flex-1 max-h-32 min-h-[50px] py-3 bg-transparent border-none outline-none text-[#452829] placeholder-[#BCAAA4] text-lg font-medium resize-none scrollbar-hide"
            rows={1}
          />

          <button 
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && !pdfFile)}
            className={`
              p-3 rounded-xl transition-all duration-300 mb-0.5
              ${(input.trim() || pdfFile) && !isLoading
                ? 'bg-[#452829] text-[#F3E8DF] shadow-md hover:bg-[#2D1A1B] hover:scale-105' 
                : 'bg-[#E8D1C5]/50 text-[#BCAAA4] cursor-not-allowed'}
            `}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputBar;