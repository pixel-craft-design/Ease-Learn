import React, { useState, useEffect, useRef } from 'react';
import type { ViewType, SummaryHistoryItem, QuizHistoryItem, OutlineHistoryItem, ChatMessage } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Summarizer from './components/Summarizer';
import QuizGenerator from './components/QuizGenerator';
import EssayOutliner from './components/EssayOutliner';
import AITutor from './components/AITutor';
import Profile from './components/Profile';
import { StudyVerseLogoIcon } from './components/icons/EaseLearnLogoIcon';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';

type TutorHistoryItem = ChatMessage[];

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [summariesHistory, setSummariesHistory] = useState<SummaryHistoryItem[]>([]);
  const [quizzesHistory, setQuizzesHistory] = useState<QuizHistoryItem[]>([]);
  const [outlinesHistory, setOutlinesHistory] = useState<OutlineHistoryItem[]>([]);
  const [tutorHistory, setTutorHistory] = useState<TutorHistoryItem[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setUserMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!user) {
      return <Login />;
  }

  const addSummaryToHistory = (item: SummaryHistoryItem) => {
    setSummariesHistory(prev => [item, ...prev.slice(0, 9)]); // Keep last 10
  };

  const addQuizToHistory = (item: QuizHistoryItem) => {
    setQuizzesHistory(prev => [item, ...prev.slice(0, 9)]);
  };

  const addOutlineToHistory = (item: OutlineHistoryItem) => {
    setOutlinesHistory(prev => [item, ...prev.slice(0, 9)]);
  };

  const saveTutorConversation = (conversation: ChatMessage[]) => {
    if (conversation.length > 0) {
        setTutorHistory(prev => [conversation, ...prev.slice(0, 9)]);
    }
  };


  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
            setCurrentView={setCurrentView}
            summariesCount={summariesHistory.length}
            quizzesCount={quizzesHistory.length}
            outlinesCount={outlinesHistory.length}
            tutorConversationsCount={tutorHistory.length}
        />;
      case 'profile':
        return <Profile />;
      case 'summarizer':
        return <Summarizer onSummarize={addSummaryToHistory} history={summariesHistory} />;
      case 'quiz':
        return <QuizGenerator onQuizGenerated={addQuizToHistory} history={quizzesHistory} />;
      case 'outliner':
        return <EssayOutliner onOutlineGenerated={addOutlineToHistory} history={outlinesHistory} />;
      case 'tutor':
        return <AITutor onSaveHistory={saveTutorConversation} />;
      default:
        return <Dashboard 
            setCurrentView={setCurrentView}
            summariesCount={summariesHistory.length}
            quizzesCount={quizzesHistory.length}
            outlinesCount={outlinesHistory.length}
            tutorConversationsCount={tutorHistory.length}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-hidden">
         <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div className="flex items-center gap-4 ml-auto">
                <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="flex items-center gap-2 text-green-700 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors hover:bg-gray-100"
                    aria-label="Go to dashboard"
                >
                    <StudyVerseLogoIcon className="w-7 h-7"/>
                    <span className="font-semibold text-lg hidden md:block">Study Verse</span>
                </button>
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center overflow-hidden text-green-700 font-bold">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'A'}</span>
                            )}
                        </div>
                    </button>
                    {userMenuOpen && (
                        <div 
                            className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                        >
                          <div className="py-1">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                <p className="font-medium">Signed in as</p>
                                <p className="truncate font-bold">{user.displayName || user.email}</p>
                            </div>
                            <button onClick={() => { setCurrentView('profile'); setUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                My Profile
                            </button>
                            <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Logout
                            </button>
                          </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;