
import React from 'react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'engagement', label: 'Engagement Analytics', icon: '📈' },
    { id: 'revenue', label: 'Revenue Analytics', icon: '💰' },
    { id: 'users', label: 'User Analytics', icon: '👥' },
    { id: 'reports', label: 'Custom Reports', icon: '🛠' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-slate-800">
        Muvi Analytics
      </div>
      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full text-left px-6 py-4 flex items-center transition-colors ${
              activePage === item.id 
                ? 'bg-blue-600 border-r-4 border-blue-400' 
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 text-xs text-slate-500 border-t border-slate-800">
        Internal Validation Prototype v1.0
      </div>
    </div>
  );
};

export default Sidebar;
