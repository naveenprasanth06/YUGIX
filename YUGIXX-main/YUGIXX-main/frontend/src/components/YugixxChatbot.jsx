import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiMessageCircle, FiUser, FiCpu } from 'react-icons/fi';
import '../styles/Chatbot.css';

const YugixxChatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', content: "Hello! I'm YUGIXX 🤖, your AI assistant. How can I help you today?", time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const now = new Date();
    setMessages(prev => [...prev, { type: 'user', content: input, time: now }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { type: 'bot', content: data.response || "Sorry, I couldn't answer that.", time: new Date() }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { type: 'bot', content: "Sorry, I encountered an error.", time: new Date() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="chatbot-fab" onClick={() => setIsOpen(true)} title="Chat with YUGIXX">
        <FiMessageCircle size={28} />
      </button>
      {isOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-header">
            <div className="chatbot-header-title">
              <FiCpu style={{ marginRight: 8 }} />
              <span>YUGIXX Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="chatbot-close-btn"><FiX /></button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg-row ${msg.type}`}>
                <div className={`chatbot-msg-bubble ${msg.type}`}>
                  <div className="chatbot-msg-content">
                    {msg.type === 'user' ? <FiUser className="chatbot-msg-icon" /> : <FiCpu className="chatbot-msg-icon" />}
                    <span>{msg.content}</span>
                  </div>
                  <div className="chatbot-msg-time">
                    {msg.time && new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-msg-row bot">
                <div className="chatbot-msg-bubble bot">
                  <div className="chatbot-msg-content">
                    <FiCpu className="chatbot-msg-icon" />
                    <span>YUGIXX is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about API, monitoring, analytics..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}><FiSend /></button>
          </form>
        </div>
      )}
    </>
  );
};

export default YugixxChatbot; 