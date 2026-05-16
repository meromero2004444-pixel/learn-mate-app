'use client';
import { useState, useEffect, useRef } from 'react';

export default function ChatSection() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const saved = localStorage.getItem('student_chat_v2');
        if (saved) setMessages(JSON.parse(saved));
        else {
            setMessages([
                { id: 1, sender: 'نورا', text: 'يا شباب حد عرف ميعاد امتحان تكنولوجيا التعليم؟', time: '10:30 ص', role: 'other' },
                { id: 2, sender: 'أحمد', text: 'غالباً الأسبوع الجاي يا نورا، لسة الجدول منزلش رسمي.', time: '10:32 ص', role: 'other' }
            ]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('student_chat_v2', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'أنت',
            text: input,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            role: 'user'
        };

        setMessages([...messages, newMessage]);
        setInput('');
    };

    return (
        <section className="section active">
            <div className="card chat-card">
                <div className="chat-header">
                    <div className="chat-header-info">
                        <div className="chat-header-avatar">📢</div>
                        <div className="chat-header-text">
                            <h3>شات الطلاب</h3>
                            <div className="chat-header-status">متصل الآن</div>
                        </div>
                    </div>
                </div>

                <div className="chat-messages">
                    <div className="chat-welcome">
                        <span className="chat-welcome-icon">💬</span>
                        <p>مرحباً بك في ساحة نقاش الطلاب! هنا يمكنك التواصل مع زملائك ومشاركة المعلومات.</p>
                    </div>

                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`chat-msg ${msg.role}`}>
                            {msg.role !== 'user' && <span className="msg-sender">{msg.sender}</span>}
                            <div className="msg-bubble">{msg.text}</div>
                            <div className="msg-meta">
                                <span className="msg-time">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={sendMessage}>
                    <input 
                        type="text" 
                        placeholder="اكتب رسالتك هنا..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" className="chat-send-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        إرسال
                    </button>
                </form>
            </div>
        </section>
    );
}
