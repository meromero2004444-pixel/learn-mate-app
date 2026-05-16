'use client';
import { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import AboutSection from '../components/AboutSection';
import StudySection from '../components/StudySection';
import SkillsSection from '../components/SkillsSection';
import ChatSection from '../components/ChatSection';
import AISection from '../components/AISection';

export default function Home() {
    const [activeTab, setActiveTab] = useState('about');

    return (
        <main>
            <Header />
            <div className="container">
                {activeTab === 'about' && <AboutSection />}
                {activeTab === 'study' && <StudySection />}
                {activeTab === 'skills' && <SkillsSection />}
                {activeTab === 'chat' && <ChatSection />}
                {activeTab === 'ai' && <AISection />}
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </main>
    );
}
