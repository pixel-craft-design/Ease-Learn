import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { createTutorChat } from '../services/geminiService';
import type { Chat } from "@google/genai";

interface AITutorProps {
    onSaveHistory: (conversation: ChatMessage[]) => void;
}

const AITutor: React.FC<AITutorProps> = ({ onSaveHistory }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // This cleanup function will be called when the component unmounts
        return () => {
            if (history.length > 0) {
                onSaveHistory(history);
            }
        };
    }, [history, onSaveHistory]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        setChat(createTutorChat({}));
    }, []);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
        setHistory(prev => [...prev, userMessage]);
        setIsLoading(true);
        setUserInput('');

        try {
            const response = await chat.sendMessage({ message: userInput });
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response.text }] };
            setHistory(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSampleQuestion = () => {
        setUserInput("Can you explain photosynthesis in simple terms?");
    };

    return (
        <div className="flex flex-col h-[85vh] max-w-4xl mx-auto bg-white rounded-xl shadow-md">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800 text-center">AI Tutor Chat</h2>
                 <p className="text-sm text-gray-500 text-center">Ask me anything about your studies!</p>
            </div>
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                            <p>{msg.parts[0].text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-lg p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                             <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                             </div>
                         </div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t">
                 <div className="text-right mb-2">
                    <button
                        onClick={handleSampleQuestion}
                        className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                        disabled={isLoading}
                    >
                        Try a Sample Question
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your question here..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !userInput.trim()}
                        className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-green-300"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l16-5.333a.75.75 0 000-1.418l-16-5.333z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AITutor;