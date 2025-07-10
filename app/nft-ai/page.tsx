"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundCollage from '../components/BackgroundCollage';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// Background Collage Component


// Function to parse and format text
const formatText = (text: string) => {
  // Split text into parts to handle formatting
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|```[\s\S]*?```)/);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Bold text
      return <strong key={index} className="text-yellow-300 font-bold">{part.slice(2, -2)}</strong>;
    } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      // Italic text
      return <em key={index} className="text-blue-300 italic">{part.slice(1, -1)}</em>;
    } else if (part.startsWith('```') && part.endsWith('```')) {
      // Code block
      return (
        <pre key={index} className="bg-gray-800 p-3 rounded my-2 overflow-x-auto border border-gray-600">
          <code className="text-gray-300 text-xs font-mono">{part.slice(3, -3)}</code>
        </pre>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      // Inline code
      return (
        <code key={index} className="bg-gray-800 px-2 py-1 rounded text-xs font-mono text-gray-300">
          {part.slice(1, -1)}
        </code>
      );
    } else {
      // Regular text - split by line breaks
      return part.split('\n').map((line, lineIndex) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < part.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    }
  });
};

const FormattedText = ({ content }: { content: string }) => {
  return (
    <div className="pixel-font text-sm leading-relaxed">
      {formatText(content)}
    </div>
  );
};

const NFTAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm here to help you with anything related to **NFTs**. Ask away!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    try {
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');

      const response = await fetch('/api/io-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Create assistant message from the reply
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply.content,
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-36 p-4 space-y-6">
      <BackgroundCollage />
      <Card className="bg-gradient-to-br from-purple-800/20 to-pink-700/20 backdrop-blur-lg border border-purple-600/40 shadow-2xl shadow-purple-500/30">
        <CardHeader>
          <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 pixel-font text-4xl animate-text-glow">
            NFT Assistant (powered by io.net)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-[400px] overflow-y-auto space-y-4 p-6 rounded-lg bg-black/50 border border-purple-500/30 animate-fade-in">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    message.role === "assistant"
                      ? "bg-gradient-to-r from-purple-600 to-purple-400 text-gray-100 border border-purple-500"
                      : "bg-gradient-to-r from-pink-600 to-pink-400 text-gray-100 border border-pink-500"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <FormattedText content={message.content} />
                  ) : (
                    <p className="pixel-font text-sm leading-relaxed">{message.content}</p>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="p-4 rounded-lg bg-purple-600/30 border border-purple-500/40 animate-pulse">
                  <p className="pixel-font text-sm text-gray-200">Thinking...</p>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 text-red-400 text-center text-sm pixel-font border border-red-500 rounded-lg animate-bounce">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full h-24 p-3 rounded-md bg-black/60 border border-purple-500/40 text-gray-300 pixel-font text-sm focus:outline-none focus:border-pink-500 shadow-inner shadow-black resize-none overflow-hidden"
                placeholder="Ask about NFTs..."
                disabled={isLoading}
              />

              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className={`w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg pixel-font text-white text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:from-purple-600 hover:to-pink-600 ${
                  isLoading || !input.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Watermark */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500 pixel-font opacity-60 hover:opacity-80 transition-opacity">
          by io.net
        </p>
      </div>
      
      <style jsx>{`
        
        .animate-text-glow {
          animation: textGlow 2s ease-in-out infinite alternate;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes textGlow {
          from {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          to {
            text-shadow: 0 0 30px rgba(236, 72, 153, 0.8);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NFTAssistant;