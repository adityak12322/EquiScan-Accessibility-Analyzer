import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Ref to auto-scroll messages
    const messagesEndRef = useRef(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo ? userInfo.token : null;
    
    // Auto-scroll to the latest message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    const sendMessage = async () => {
        // Token check added: Chatbot Protected Route hai
        if (!input.trim() || loading || !token) {
            if (!token) alert("Please log in to use the AI service.");
            return;
        }

        const userMessage = { sender: 'user', text: input };
        const newMessages = [...messages, userMessage];
        
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const config = { 
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                } 
            };

            // API Call to Node.js Backend
            const response = await axios.post(
                'http://localhost:5000/api/chatbot/ask',
                { message: userMessage.text },
                config
            );

            const aiMessage = { sender: 'ai', text: response.data.answer };
            setMessages([...newMessages, aiMessage]);

        } catch (error) {
            console.error("Chatbot failed:", error);
            const errorMessage = { sender: 'ai', text: "Sorry, I lost connection to the AI service." };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };
    
    // Message rendering component
    const ChatMessage = ({ message }) => (
        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-xl text-sm shadow-lg 
                ${message.sender === 'user' 
                    // User message: Primary blue and white
                    ? 'bg-secondary-blue text-white rounded-br-none font-medium' 
                    // ✅ AI message: Light background, visible text (FINAL FIX)
                    : 'bg-gray-200 text-gray-900 rounded-tl-none border border-gray-400'}`} 
            >
                {message.text}
            </div>
        </div>
    );


    return (
        // Floating Button
        <>
            <button
                // Floating button ko high-contrast blue kiya
                className="fixed bottom-8 right-8 w-16 h-16 bg-secondary-blue rounded-full text-white text-3xl shadow-2xl transition duration-300 hover:bg-primary-blue transform hover:scale-110 z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '✖' : '🤖'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-28 right-8 w-80 md:w-96 h-96 
                    // Background ko high contrast/slightly transparent kiya
                    bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl 
                    flex flex-col z-50 animate-fadeIn border border-secondary-blue"> 
                    
                    {/* Header */}
                    <div className="p-3 bg-primary-blue/90 text-white font-bold rounded-t-lg flex justify-between items-center border-b border-primary-blue">
                        EquiScan AI Assistant
                        <span className="text-xs text-gray-200">Online</span>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow p-3 overflow-y-auto space-y-2 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 text-sm mt-10">
                                Hi, I'm Equiscan. Ask me about WCAG, ATS, or our MERN stack!
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg} />
                        ))}
                        {loading && (
                            <div className="text-left text-gray-500 text-sm animate-pulse">AI is typing...</div>
                        )}
                        {/* Auto-scroll reference */}
                        <div ref={messagesEndRef} /> 
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-gray-700 flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask me anything..."
                            className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white text-sm focus:outline-none"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-secondary-blue text-white p-2 rounded-r-lg hover:bg-primary-blue transition duration-150"
                            disabled={loading}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;