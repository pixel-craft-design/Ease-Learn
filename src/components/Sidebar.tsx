import React from 'react';
import type { ViewType } from '../types';
import { DashboardIcon } from './icons/ChartBarIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { StudyVerseLogoIcon } from './icons/EaseLearnLogoIcon';
import { UserIcon } from './icons/UserIcon';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-green-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isSidebarOpen, setIsSidebarOpen }) => {
  const handleNavigation = (view: ViewType) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };
    
  const navItems = [
    { id: 'dashboard', icon: <DashboardIcon className="w-6 h-6" />, label: 'Dashboard' },
    { id: 'profile', icon: <UserIcon className="w-6 h-6" />, label: 'My Profile' },
    { id: 'summarizer', icon: <DocumentTextIcon className="w-6 h-6" />, label: 'Summarizer' },
    { id: 'quiz', icon: <BookOpenIcon className="w-6 h-6" />, label: 'Practice Quiz' },
    { id: 'outliner', icon: <PencilSquareIcon className="w-6 h-6" />, label: 'Essay Outliner' },
    { id: 'tutor', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, label: 'AI Tutor' },
  ] as const;

  return (
    <>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
        <aside className={`absolute lg:relative z-40 w-64 h-full bg-white text-gray-700 flex flex-col transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-gray-200 shadow-xl lg:shadow-none`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 text-green-700">
            <StudyVerseLogoIcon className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Study Verse</h1>
          </div>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-full">
               <XMarkIcon className="w-6 h-6" />
           </button>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map(item => (
                <NavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentView === item.id}
                    onClick={() => handleNavigation(item.id)}
                />
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Study Verse Inc.
                <br/>
                Your personal AI learning assistant.
            </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;