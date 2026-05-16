'use client';
import { useState } from 'react';
import { FACULTY_KB } from '../data/kb';

export default function AboutSection() {
    const { college } = FACULTY_KB;
    const [openDept, setOpenDept] = useState(null);

    return (
        <section className="section active">
            <div className="card hero-card" style={{ height: '400px' }}>
                <img src="/471049439_1018159016785327_9036701770525706640_n.jpg" alt="كلية التربية النوعية" className="hero-img" style={{ filter: 'brightness(0.8)' }} onError={(e) => {
                    e.target.src = "/كلية تربية نوعية.png"; 
                }} />
                <div className="hero-overlay">
                    <span style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        backdropFilter: 'blur(10px)',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        width: 'fit-content',
                        marginBottom: '10px',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}>تأسست عام {college.establishment.match(/\d{4}/)?.[0] || '1989'}</span>
                    <h2>{college.name}</h2>
                    <p style={{ opacity: 0.9 }}>{college.university} - صرح علمي متميز</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <div className="card" style={{ borderRight: '6px solid #4f46e5' }}>
                    <h3>🏛️ نظرة عامة</h3>
                    <p>{college.description}</p>
                    <div style={{ 
                        marginTop: '20px', 
                        padding: '16px', 
                        background: '#f8fafc', 
                        borderRadius: '16px', 
                        fontSize: '14px',
                        color: '#475569',
                        lineHeight: '1.8',
                        fontStyle: 'italic'
                    }}>
                        " {college.mission} "
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="card">
                        <h3>👁️ الرؤية</h3>
                        <p style={{ fontSize: '14px' }}>{college.vision}</p>
                    </div>
                    <div className="card">
                        <h3>🎯 الأهداف</h3>
                        <p style={{ fontSize: '14px' }}>{college.goal}</p>
                    </div>
                </div>

                {/* Departments moved from Study Section */}
                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>🏰 الأقسام بالكلية</h3>
                    <div className="departments-box">
                        {FACULTY_KB.departments.map((dept) => (
                            <div key={dept.id} className="dept">
                                <div 
                                    className="dept-title" 
                                    onClick={() => setOpenDept(openDept === dept.id ? null : dept.id)}
                                    style={{ 
                                        background: openDept === dept.id ? 'linear-gradient(135deg, #4f46e5, #3b82f6)' : '#f8faff',
                                        color: openDept === dept.id ? 'white' : '#1e293b'
                                    }}
                                >
                                    <span>{dept.name}</span>
                                    <span style={{ fontSize: '12px' }}>{openDept === dept.id ? '▲' : '▼'}</span>
                                </div>
                                <div className={`dept-content ${openDept === dept.id ? 'show' : ''}`} style={{ padding: '24px', background: 'white' }}>
                                    <p style={{ marginBottom: '12px' }}><strong>الهدف:</strong> {dept.goal}</p>
                                    <p style={{ marginBottom: '12px' }}><strong>رئيس القسم:</strong> {dept.head.name} ({dept.head.title})</p>
                                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                                        <strong style={{ color: '#4f46e5' }}>المواد الدراسية:</strong> {dept.subjects.join('، ')}
                                    </div>
                                    <div style={{ marginBottom: '16px', fontSize: '14px' }}>
                                        <strong style={{ color: '#4f46e5' }}>مجالات العمل:</strong> {dept.careers.join('، ')}
                                    </div>
                                    <a href={dept.url} target="_blank" rel="noopener noreferrer" style={{ 
                                        display: 'block', 
                                        textAlign: 'center', 
                                        padding: '12px', 
                                        background: '#f1f5f9', 
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        color: '#475569',
                                        fontWeight: '700',
                                        fontSize: '14px'
                                    }}>
                                        الموقع الرسمي للقسم
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>📞 تواصل معنا</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                            <span>📍</span> {college.address}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                            <span>📧</span> {college.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                            <span>📮</span> {college.postalCode}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
