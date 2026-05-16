'use client';
import { useState } from 'react';

export default function StudySection() {
    const techData = [
        {
            id: 'cs-teacher',
            title: 'شعبة معلم حاسب آلي',
            icon: '💻',
            theoretical: ['أساسيات البرمجة', 'نظم التشغيل', 'قواعد البيانات', 'هياكل البيانات', 'شبكات الحاسب'],
            practical: ['معمل برمجة (Python)', 'تطبيقات قواعد البيانات', 'صيانة الحاسب', 'تصميم مواقع الويب']
        },
        {
            id: 'edu-tech',
            title: 'شعبة تكنولوجيا التعليم',
            icon: '🖥️',
            theoretical: ['نظريات التعلم', 'التصميم التعليمي', 'الوسائط المتعددة', 'التعليم الإلكتروني', 'تطوير المناهج'],
            practical: ['إنتاج الفيديو التعليمي', 'تصميم الجرافيك', 'تطوير المنصات التعليمية', 'صيانة الأجهزة التعليمية']
        }
    ];

    return (
        <section className="section active">
            <div className="card" style={{ borderRight: '6px solid #ef4444', marginBottom: '32px' }}>
                <p style={{ fontSize: '15px', color: '#475569', fontWeight: '600' }}>
                    📌 هذا القسم يحتوي على المواد الدراسية الخاصة بشعبة تكنولوجيا التعليم ومعلم الحاسب الآلي، مقسمة إلى نظري وعملي، لمساعدتك على متابعة مقرراتك بسهولة.
                </p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.6rem', color: '#4f46e5', fontWeight: '800' }}>قسم تكنولوجيا التعليم و معلم حاسب آلي الفرقة الاولي</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {techData.map((item) => (
                    <div key={item.id} className="card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '6px', 
                            height: '100%', 
                            background: '#4f46e5' 
                        }}></div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <span style={{ fontSize: '24px' }}>{item.icon}</span>
                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{item.title}</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* Theoretical Subjects */}
                            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#3b82f6' }}>
                                    <span>📘</span>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>المواد النظرية</h4>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {item.theoretical.map((sub, i) => (
                                        <li key={i} style={{ 
                                            padding: '10px 14px', 
                                            background: 'white', 
                                            marginBottom: '8px', 
                                            borderRadius: '12px', 
                                            fontSize: '14px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                        }}>
                                            {sub}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Practical Subjects */}
                            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#10b981' }}>
                                    <span>🛠️</span>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>المواد العملية</h4>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {item.practical.map((sub, i) => (
                                        <li key={i} style={{ 
                                            padding: '10px 14px', 
                                            background: 'white', 
                                            marginBottom: '8px', 
                                            borderRadius: '12px', 
                                            fontSize: '14px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                        }}>
                                            {sub}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
