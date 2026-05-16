'use client';
import { useState, useEffect } from 'react';
import { FACULTY_KB } from '../data/kb';

export default function SkillsSection() {
    const [skills, setSkills] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [openCourse, setOpenCourse] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('user_skills');
        if (saved) setSkills(JSON.parse(saved));
    }, []);

    const addSkill = (e) => {
        e.preventDefault();
        if (!title.trim() || !desc.trim()) return;

        const newSkill = {
            id: Date.now(),
            title,
            desc,
            attachment,
            date: new Date().toLocaleDateString('ar-EG')
        };

        const updated = [...skills, newSkill];
        setSkills(updated);
        localStorage.setItem('user_skills', JSON.stringify(updated));
        
        setTitle('');
        setDesc('');
        setAttachment(null);
    };

    const deleteSkill = (id) => {
        const updated = skills.filter(s => s.id !== id);
        setSkills(updated);
        localStorage.setItem('user_skills', JSON.stringify(updated));
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setAttachment({
                name: file.name,
                type: file.type,
                data: event.target.result
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <section className="section active" id="skills">
            <div className="skills-hero">
                <div className="skills-hero-badge" style={{
                    display: 'inline-flex',
                    padding: '8px 20px',
                    background: 'white',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#4f46e5',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>🚀 مجتمع المهارات</div>
                <h2 className="skills-title" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>
                    طوّر مهاراتك <span>الآن</span>
                </h2>
                <p style={{ color: '#64748b', marginTop: '8px' }}>سجل إنجازاتك وتابع تطورك الدراسي بطريقة احترافية</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '40px' }}>
                <div className="card" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '24px' }}>✨ إضافة إنجاز جديد</h3>
                    <form onSubmit={addSkill} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <input 
                                type="text" 
                                placeholder="ما هي المهارة التي تعلمتها؟" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <div className="upload-zone" onClick={() => document.getElementById('file-upload').click()}>
                                <input 
                                    id="file-upload"
                                    type="file" 
                                    onChange={handleFile} 
                                    style={{ display: 'none' }}
                                />
                                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
                                    {attachment ? `✅ ${attachment.name}` : '📁 أرفق شهادة أو صورة إنجاز'}
                                </span>
                            </div>
                        </div>
                        <textarea 
                            placeholder="صف مهاراتك أو ما حققته في هذا المشروع..." 
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            required
                            style={{ height: '100px' }}
                        ></textarea>
                        <button type="submit" style={{ width: 'fit-content', alignSelf: 'flex-end' }}>
                            حفظ المهارة في ملفي الشخصي
                        </button>
                    </form>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0 }}>🏆 مهاراتي المسجلة</h3>
                        <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '12px', fontWeight: '800', fontSize: '14px' }}>
                            {skills.length} مهارة
                        </span>
                    </div>
                    
                    <div className="skills-grid">
                        {skills.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.5)', borderRadius: '24px', border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
                                لا توجد مهارات مسجلة بعد. ابدأ بإضافة أول مهارة لك!
                            </div>
                        ) : (
                            skills.map(skill => (
                                <div key={skill.id} className="skill-card-modern">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4>{skill.title}</h4>
                                        <button className="delete-btn" onClick={() => deleteSkill(skill.id)}>حذف</button>
                                    </div>
                                    <p style={{ color: '#475569', fontSize: '14px' }}>{skill.desc}</p>
                                    {skill.attachment && (
                                        <div style={{ marginTop: '12px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                                            {skill.attachment.type.startsWith('image/') ? (
                                                <img src={skill.attachment.data} alt="Attachment" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ padding: '12px', background: '#f8fafc', fontSize: '13px' }}>📄 {skill.attachment.name}</div>
                                            )}
                                        </div>
                                    )}
                                    <div style={{ marginTop: 'auto', paddingTop: '12px', fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                                        🗓️ {skill.date}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', margin: '60px 0 30px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>🚀 كورسات مقترحة لتطوير مهاراتك</h3>
                <p style={{ color: '#64748b' }}>مجموعة مختارة من أفضل الكورسات لرفع كفاءتك المهنية</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '60px' }}>
                {[
                    {
                        id: 'creative',
                        title: 'Creative & Multimedia',
                        icon: '🎨',
                        courses: [
                            { name: 'Adobe Photoshop Mastery', link: 'https://www.youtube.com/results?search_query=photoshop+course+arabic' },
                            { name: 'Video Editing with Premiere', link: 'https://www.youtube.com/results?search_query=premiere+pro+course+arabic' },
                            { name: 'Graphic Design Foundations', link: 'https://www.coursera.org/specializations/graphic-design' }
                        ]
                    },
                    {
                        id: 'tech',
                        title: 'Tech Courses',
                        icon: '💻',
                        courses: [
                            { name: 'Python for Beginners', link: 'https://www.youtube.com/results?search_query=python+course+arabic' },
                            { name: 'Full Stack Web Development', link: 'https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044' },
                            { name: 'Cyber Security Essentials', link: 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity' }
                        ]
                    },
                    {
                        id: 'soft-skills',
                        title: 'Soft Skills & Languages',
                        icon: '🧠',
                        courses: [
                            { name: 'English for Professionals', link: 'https://www.britishcouncil.org.eg/en/english/courses-adults' },
                            { name: 'Public Speaking & Presentation', link: 'https://www.ted.com/talks' },
                            { name: 'Emotional Intelligence', link: 'https://www.linkedin.com/learning/topics/emotional-intelligence' }
                        ]
                    },
                    {
                        id: 'cs-edu',
                        title: 'مهارات معلم الحاسب الآلي',
                        icon: '🎓',
                        courses: [
                            { name: 'استراتيجيات التدريس الحديثة', link: 'https://www.edraak.org/course/course-v1:Edraak+T101+2019_T1/' },
                            { name: 'إدارة الصف الرقمي', link: 'https://www.coursera.org/learn/teach-online' },
                            { name: 'إنتاج المحتوى التعليمي الرقمي', link: 'https://www.youtube.com/results?search_query=e-learning+content+creation' }
                        ]
                    }
                ].map((cat) => (
                    <div key={cat.id} className="course-card">
                        <div 
                            className="dept-title" 
                            onClick={() => setOpenCourse(openCourse === cat.id ? null : cat.id)}
                            style={{ 
                                background: openCourse === cat.id ? 'linear-gradient(135deg, #4f46e5, #3b82f6)' : 'white', 
                                color: openCourse === cat.id ? 'white' : '#1e293b',
                                border: '1px solid rgba(0,0,0,0.05)',
                                borderRadius: '16px'
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>{cat.icon}</span> {cat.title}
                            </span>
                            <span style={{ fontSize: '10px' }}>{openCourse === cat.id ? '▲' : '▼'}</span>
                        </div>
                        <div className={`dept-content ${openCourse === cat.id ? 'show' : ''}`} style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                                {cat.courses.map((course, i) => (
                                    <a 
                                        key={i} 
                                        href={course.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            padding: '14px 18px', 
                                            background: '#f8fafc', 
                                            borderRadius: '14px', 
                                            textDecoration: 'none',
                                            color: '#1e293b',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid #f1f5f9'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = '#eef2ff';
                                            e.currentTarget.style.borderColor = '#4f46e5';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.borderColor = '#f1f5f9';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <span>{course.name}</span>
                                        <span style={{ fontSize: '12px', color: '#4f46e5' }}>🔗</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', margin: '30px 0 30px' }}>
                <h3 style={{ fontSize: '1.5rem' }}>📚 محتوى المواد الدراسية</h3>
                <p style={{ color: '#64748b' }}>موضوعات الفرقة الأولى حسب اللائحة</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {FACULTY_KB.firstYearSubjects.map((subject) => (
                    <div key={subject.code} className="course-card">
                        <div 
                            className="dept-title" 
                            onClick={() => setOpenCourse(openCourse === subject.code ? null : subject.code)}
                            style={{ 
                                background: openCourse === subject.code ? '#4f46e5' : '#f8faff', 
                                color: openCourse === subject.code ? 'white' : '#1e293b',
                                borderRadius: '16px'
                            }}
                        >
                            <span>{subject.name}</span>
                            <span style={{ fontSize: '10px' }}>{openCourse === subject.code ? '▲' : '▼'}</span>
                        </div>
                        <div className={`dept-content ${openCourse === subject.code ? 'show' : ''}`}>
                            <h5 style={{ marginBottom: '12px', color: '#4f46e5' }}>موضوعات الدراسة:</h5>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {subject.topics.map((topic, i) => (
                                    <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#4f46e5' }}>•</span> {topic}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}


