import React from 'react';
import type { ViewType } from '../types';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';


interface DashboardProps {
  setCurrentView: (view: ViewType) => void;
  summariesCount: number;
  quizzesCount: number;
  outlinesCount: number;
  tutorConversationsCount: number;
}

const StatCard: React.FC<{
    icon: React.ReactElement;
    title: string;
    count: number;
    description: string;
    onClick: () => void;
}> = ({ icon, title, count, description, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left w-full"
        >
            <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                    {/* FIX: Changed the 'icon' prop type to React.ReactElement and removed the type assertion. This allows TypeScript to correctly infer the props for React.cloneElement. */}
                    {React.cloneElement(icon, { className: "w-8 h-8 text-green-700" })}
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-800">{title}</p>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            <p className="text-5xl font-bold text-gray-800 mt-4">{count}</p>
        </button>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ 
    setCurrentView, 
    summariesCount, 
    quizzesCount, 
    outlinesCount, 
    tutorConversationsCount 
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome back!</h1>
        <p className="text-gray-500 mt-1">Here's a summary of your activity. Click a card to view your history.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
            icon={<DocumentTextIcon />}
            title="Summaries Created"
            count={summariesCount}
            description="View generated summaries"
            onClick={() => setCurrentView('summarizer')}
        />
        <StatCard 
            icon={<BookOpenIcon />}
            title="Quizzes Taken"
            count={quizzesCount}
            description="Review past quizzes"
            onClick={() => setCurrentView('quiz')}
        />
        <StatCard 
            icon={<PencilSquareIcon />}
            title="Outlines Drafted"
            count={outlinesCount}
            description="See your essay outlines"
            onClick={() => setCurrentView('outliner')}
        />
        <StatCard 
            icon={<ChatBubbleLeftRightIcon />}
            title="Tutor Sessions"
            count={tutorConversationsCount}
            description="Start a new chat"
            onClick={() => setCurrentView('tutor')}
        />
      </div>
    </div>
  );
};

export default Dashboard;
