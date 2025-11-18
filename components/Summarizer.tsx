import React, { useState } from 'react';
import { summarizeText, generateAudioSummary } from '../services/geminiService';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import type { StudyContextData, SummaryHistoryItem } from '../types';
import StudyContextForm from './StudyContextForm';

interface SummarizerProps {
    onSummarize: (item: SummaryHistoryItem) => void;
    history: SummaryHistoryItem[];
}

// Helper functions for audio decoding
const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
};


const Summarizer: React.FC<SummarizerProps> = ({ onSummarize, history }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [error, setError] = useState('');
    const [context, setContext] = useState<Partial<StudyContextData>>({});
    
    const outputAudioContext = new (window.AudioContext)({sampleRate: 24000});

    const handleSummarize = async () => {
        if (!context.subject || !context.chapter) {
            setError('Please enter at least a subject and a chapter/topic.');
            return;
        }
        setError('');
        setIsLoading(true);
        setSummary('');

        try {
            const result = await summarizeText(context);
            setSummary(result);
            onSummarize({ context, summary: result });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleListen = async () => {
        if (!summary) return;
        setIsAudioLoading(true);
        try {
            const base64Audio = await generateAudioSummary(summary);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start();
        } catch(err: any) {
            setError('Failed to play audio. ' + err.message);
        } finally {
            setIsAudioLoading(false);
        }
    }

    const handleSample = () => {
        setContext({
            subject: 'History',
            className: '12th Grade',
            chapter: 'The American Revolution',
            author: 'John Doe',
            board: 'AP',
            language: 'English',
        });
        setError('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Content Summarizer</h2>
                <p className="text-gray-500 mt-1">Provide some context and I'll generate a summary for you.</p>
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
                    onClick={handleSummarize}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors duration-200"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Summarizing...</span>
                        </>
                    ) : (
                       <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Generate Summary</span>
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
                                        onClick={() => setSummary(item.summary)}
                                        className="w-full text-left text-sm text-green-600 hover:underline p-2 rounded-md hover:bg-gray-50"
                                    >
                                        Summary for: {item.context.chapter} ({item.context.subject})
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {summary && (
                <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold">Summary</h3>
                         <button
                            onClick={handleListen}
                            disabled={isAudioLoading}
                            className="flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                        >
                            {isAudioLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <SpeakerWaveIcon className="w-5 h-5" />
                                    <span>Listen</span>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
                </div>
            )}
        </div>
    );
};

export default Summarizer;