'use client';

export default function Header() {
    return (
        <header>
            <div className="header-logos" style={{ position: 'absolute', right: '20px' }}>
                <img src="/logo-app.jpeg" alt="Logo" className="logo" />
            </div>
            <h1 style={{ width: '100%', textAlign: 'center' }}>LearnMate</h1>
            <div className="header-badge" style={{ position: 'absolute', left: '20px' }}>
                <img src="/جامعة بورسعيد.png" alt="University Logo" className="logo" style={{ animation: 'none', border: 'none', boxShadow: 'none' }} />
            </div>
        </header>
    );
}

