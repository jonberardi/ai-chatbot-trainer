'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ChatInterface = ({ persona, onSendMessage, messages = [], isEvaluating = false }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '' || isTyping || isEvaluating) return;
    
    onSendMessage(message);
    setMessage('');
    setIsTyping(true);
    
    // Simulate typing indicator for persona response
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {persona?.name?.charAt(0) || 'A'}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold">{persona?.name || 'AI Persona'}</h3>
            <p className="text-sm text-gray-500">{persona?.expertise || 'Expert'}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.sender_type === 'student' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-3/4 p-3 rounded-lg ${
                msg.sender_type === 'student' 
                  ? 'bg-indigo-100 text-gray-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{msg.content}</p>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-3/4 p-3 rounded-lg bg-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isEvaluating}
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isTyping || isEvaluating}
            className={`px-4 py-2 rounded-r-lg ${
              isTyping || isEvaluating
                ? 'bg-gray-300 text-gray-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            } transition-colors`}
          >
            {isEvaluating ? 'Evaluating...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
