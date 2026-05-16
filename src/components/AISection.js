'use client';
import { useState, useEffect, useRef } from 'react';
import { RAGEngine } from '../lib/rag';

export default function AISection() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const formatResponse = (text) => {
        // Simple markdown-to-html conversion for the demo
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        return html;
    };

    const askAI = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userQuery = input;
        setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
        setInput('');
        setIsTyping(true);

        try {
            await RAGEngine.ensureInitialized();
            const relevantChunks = RAGEngine.retrieve(userQuery);
            const context = RAGEngine.formatContext(relevantChunks);
            const systemPrompt = RAGEngine.buildSystemPrompt();

            let augmentedPrompt = systemPrompt;
            if (context) {
                augmentedPrompt += `\n\n## معلومات مسترجعة:\n${context}`;
            }

            const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || localStorage.getItem('ai_api_key') || '';
            
            if (!apiKey) {
                setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ مفتاح API غير موجود. يرجى إضافته في ملف .env.local أو في الإعدادات.', isError: true }]);
                return;
            }

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: augmentedPrompt },
                        { role: 'user', content: userQuery }
                    ],
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const reply = data?.choices?.[0]?.message?.content || 'عذراً، لم أستطع الحصول على إجابة واضحة.';
            
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: `❌ خطأ: ${error.message}`, isError: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <section className="section active">
            <div className="card">
                <div className="ai-header">
                    <h3>المساعد الأكاديمي الذكي</h3>
                    <button className="ai-clear-btn" onClick={() => setMessages([])}>مسح المحادثة</button>
                </div>

                <div className="ai-messages">
                    {messages.length === 0 && (
                        <div className="ai-welcome">
                            <span className="ai-welcome-icon">🎓</span>
                            <p>مرحباً! أنا مساعدك الأكاديمي الذكي. اسألني أي شيء عن كلية التربية النوعية.</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`ai-message ${msg.role} ${msg.isError ? 'error' : ''}`} 
                             dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }}>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="ai-typing active">
                            <div className="ai-typing-dot"></div>
                            <div className="ai-typing-dot"></div>
                            <div className="ai-typing-dot"></div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <form className="ai-input-area" onSubmit={askAI}>
                    <input 
                        type="text" 
                        placeholder="اسألني عن الأقسام، المواد، أو الكلية..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" disabled={isTyping}>إرسال</button>
                </form>
            </div>
        </section>
    );
}
