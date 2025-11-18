import React, { useState } from 'react';
import { generateEssayOutline } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import type { StudyContextData, OutlineHistoryItem } from '../types';
import StudyContextForm from './StudyContextForm';

interface EssayOutlinerProps {
    onOutlineGenerated: (item: OutlineHistoryItem) => void;
    history: OutlineHistoryItem[];
}

const EssayOutliner: React.FC<EssayOutlinerProps> = ({ onOutlineGenerated, history }) => {
    const [outline, setOutline] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [context, setContext] = useState<Partial<StudyContextData>>({});

    const handleGenerate = async () => {
        if (!context.chapter) {
            setError('Please enter a topic in the "Chapter Name / Topic" field.');
            return;
        }
        setError('');
        setIsLoading(true);
        setOutline('');

        try {
            const result = await generateEssayOutline(context);
            setOutline(result);
            onOutlineGenerated({ context, outline: result });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSample = () => {
        setContext({
            subject: 'Environmental Science',
            className: 'University',
            chapter: 'The Impact of Climate Change on Biodiversity',
            board: 'College',
            language: 'English',
        });
        setError('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Essay Writing Assistant</h2>
                <p className="text-gray-500 mt-1">Plan and organize your writing effectively with an AI-generated outline.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Provide Context</h3>
                        <button onClick={handleSample} className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                            Try a Sample
                        </button>
                    </div>
                    <StudyContextForm context={context} setContext={setContext} />
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors duration-200"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating Outline...</span>
                        </>
                    ) : (
                       <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Generate Outline</span>
                       </>
                    )}
                </button>
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                
                {history.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <h4 className="font-semibold text-gray-700 mb-2">History</h4>
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {history.map((item, index) => (
                                <li key={index}>
                                    <button 
                                        onClick={() => setOutline(item.outline)}
                                        className="w-full text-left text-sm text-green-600 hover:underline p-2 rounded-md hover:bg-gray-50"
                                    >
                                        Outline for: {item.context.chapter}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {outline && (
                <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
                    <h3 className="text-2xl font-semibold mb-4">Generated Outline</h3>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: outline.replace(/\n/g, '<br />') }} />
                </div>
            )}
        </div>
    );
};

export default EssayOutliner;