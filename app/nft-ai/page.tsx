"use client";

import React, { useState } from 'react';
import { CopilotTextarea } from "@copilotkit/react-textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundCollage from '../components/BackgroundCollage';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const NFTAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm here to help you with anything related to NFTs. Ask away!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages([...newMessages, data.messages[data.messages.length - 1]]);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-36 p-4 space-y-6">
      <BackgroundCollage />
      <Card className="bg-gradient-to-br from-purple-800/20 to-pink-700/20 backdrop-blur-lg border border-purple-600/40 shadow-2xl shadow-purple-500/30">
        <CardHeader>
          <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 pixel-font text-4xl animate-text-glow">
            NFT Assistant
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
                    <pre className="pixel-font text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </pre>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <CopilotTextarea
                value={input}
                onChange={handleInputChange}
                className="w-full h-24 p-3 rounded-md bg-black/60 border border-purple-500/40 text-gray-300 pixel-font text-sm focus:outline-none focus:border-pink-500 shadow-inner shadow-black resize-none overflow-hidden"
                placeholder="Ask about NFTs..."
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg pixel-font text-white text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:from-purple-600 hover:to-pink-600 ${
                  isLoading || !input.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }}`}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTAssistant;
