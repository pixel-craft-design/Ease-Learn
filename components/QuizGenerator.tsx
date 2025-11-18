import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import type { QuizQuestion, StudyContextData, QuizHistoryItem } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import StudyContextForm from './StudyContextForm';

type QuizState = 'config' | 'loading' | 'active' | 'results';

interface QuizGeneratorProps {
    onQuizGenerated: (item: QuizHistoryItem) => void;
    history: QuizHistoryItem[];
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onQuizGenerated, history }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [quizState, setQuizState] = useState<QuizState>('config');
    const [error, setError] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [context, setContext] = useState<Partial<StudyContextData>>({
        difficulty: 'medium',
        questionCount: 5,
        questionType: '1M',
    });

    const startQuiz = (questionsToStart: QuizQuestion[]) => {
        setQuestions(questionsToStart);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setIsAnswered(false);
        setSelectedOption(null);
        setQuizState('active');
    };

    const handleGenerateQuiz = async () => {
        if (!context.subject || !context.chapter) {
            setError('Please provide at least a subject and chapter/topic to generate a quiz from.');
            return;
        }
        setError('');
        setQuizState('loading');
        try {
            const generatedQuestions = await generateQuiz(context);
            if (generatedQuestions.length === 0) {
                setError("Couldn't generate a quiz. The provided context might be insufficient.");
                setQuizState('config');
                return;
            }
            onQuizGenerated({ context, questions: generatedQuestions });
            startQuiz(generatedQuestions);
        } catch (err: any) {
            setError(err.message);
            setQuizState('config');
        }
    };
    
    const handleAnswerSubmit = () => {
        if (!selectedOption) return;
        setUserAnswers([...userAnswers, selectedOption]);
        setIsAnswered(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setQuizState('results');
        }
    };
    
    const resetQuiz = () => {
        setQuizState('config');
        setQuestions([]);
    }

    const handleSample = () => {
        setContext({
            subject: 'Science',
            className: '8th Grade',
            chapter: 'Photosynthesis',
            board: 'State Board',
            language: 'English',
            difficulty: 'easy',
            questionCount: 3,
            questionType: '1M',
        });
        setError('');
    };

    const currentQuestion = questions[currentQuestionIndex];
    const score = userAnswers.reduce((acc, answer, index) => {
        return questions[index] && questions[index].correctAnswer === answer ? acc + 1 : acc;
    }, 0);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Adaptive Practice Quiz</h2>
                <p className="text-gray-500 mt-1">Test your knowledge with AI-generated questions based on your study topic.</p>
            </div>

            {quizState === 'config' && (
                <div className="bg-white p-6 rounded-xl shadow-md space-y-4 animate-fade-in">
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Provide Context</h3>
                            <button onClick={handleSample} className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                                Try a Sample
                            </button>
                        </div>
                        <StudyContextForm 
                            context={context} 
                            setContext={setContext} 
                            showDifficulty={true} 
                            showQuestionCount={true} 
                            showQuestionType={true}
                        />
                    </div>
                    <button
                        onClick={handleGenerateQuiz}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition"
                    >
                         <SparklesIcon className="w-5 h-5"/>
                         <span>Generate Quiz</span>
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    {history.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                            <h4 className="font-semibold text-gray-700 mb-2">History</h4>
                            <ul className="space-y-2 max-h-40 overflow-y-auto">
                                {history.map((item, index) => (
                                    <li key={index}>
                                        <button 
                                            onClick={() => startQuiz(item.questions)}
                                            className="w-full text-left text-sm text-green-600 hover:underline p-2 rounded-md hover:bg-gray-50"
                                        >
                                            Quiz on: {item.context.chapter} ({item.questions.length} questions)
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {quizState === 'loading' && (
                 <div className="text-center p-10 bg-white rounded-xl shadow-md">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-semibold">Generating your personalized quiz...</p>
                </div>
            )}

            {quizState === 'active' && currentQuestion && (
                <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
                    <p className="text-sm font-semibold text-green-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <h3 className="text-xl font-semibold my-2">{currentQuestion.question}</h3>
                    <div className="space-y-3 mt-4">
                        {currentQuestion.options.map((option, index) => {
                             const isCorrect = option === currentQuestion.correctAnswer;
                             const isSelected = option === selectedOption;
                             let optionClass = 'border-gray-300 hover:border-green-500 hover:bg-green-50';
                             if (isAnswered) {
                                if (isCorrect) {
                                    optionClass = 'bg-green-100 border-green-500 text-green-800 font-semibold';
                                } else if (isSelected && !isCorrect) {
                                    optionClass = 'bg-red-100 border-red-500 text-red-800';
                                }
                             } else if (isSelected) {
                                optionClass = 'bg-green-100 border-green-500';
                             }

                            return (
                                <button
                                    key={index}
                                    onClick={() => !isAnswered && setSelectedOption(option)}
                                    className={`w-full text-left p-4 border-2 rounded-lg transition ${optionClass}`}
                                    disabled={isAnswered}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                     {isAnswered && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                           <p className="font-semibold">Explanation:</p>
                           <p className="text-gray-600">{currentQuestion.explanation}</p>
                        </div>
                    )}
                    <div className="mt-6">
                        {isAnswered ? (
                            <button onClick={handleNextQuestion} className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700">
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Show Results'}
                            </button>
                        ) : (
                            <button onClick={handleAnswerSubmit} disabled={!selectedOption} className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300">
                                Submit Answer
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            {quizState === 'results' && (
                <div className="bg-white p-8 rounded-xl shadow-md text-center animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-800">Quiz Complete!</h2>
                    <p className="text-5xl font-bold text-green-600 my-4">
                        {score} / {questions.length}
                    </p>
                    <p className="text-gray-600">You scored {((score / questions.length) * 100).toFixed(0)}%.</p>
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <button 
                            onClick={resetQuiz} 
                            className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Create New Quiz
                        </button>
                        <button 
                            onClick={resetQuiz} 
                            className="bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizGenerator;