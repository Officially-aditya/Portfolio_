import React from 'react';

const Dock = ({ onAppClick }) => {
    const apps = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '📁' },
    { id: 'projects', label: 'Projects', icon: '🛠️' },
    { id: 'skills', label: 'Skills', icon: '🧠' },
    { id: 'contact', label: 'Mini Ada', icon: '💬' }
    ];

    return (
        <div className="dock">
            {apps.map(app => (
                <button
                key = {app.id}
                className = "dock-icon"
                onClick={() => onAppClick(app.id)}
                title = {app.label}
                >
                    <span className='emoji-icon'>{app.icon}</span>
                </button>
            ))}
        </div>
    );
};

export default Dock;