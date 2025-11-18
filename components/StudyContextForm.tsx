import React from 'react';
import type { StudyContextData } from '../types';

interface StudyContextFormProps {
  context: Partial<StudyContextData>;
  setContext: (context: Partial<StudyContextData>) => void;
  showDifficulty?: boolean;
  showQuestionCount?: boolean;
  showQuestionType?: boolean;
}

const StudyContextForm: React.FC<StudyContextFormProps> = ({
  context,
  setContext,
  showDifficulty = false,
  showQuestionCount = false,
  showQuestionType = false
}) => {
  const handleInputChange = (field: keyof StudyContextData, value: string | number | undefined) => {
    setContext({ ...context, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          id="subject"
          value={context.subject || ''}
          onChange={e => handleInputChange('subject', e.target.value)}
          placeholder="e.g., Literature, Biology"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
       <div>
        <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class / Grade</label>
        <input
          type="text"
          id="className"
          value={context.className || ''}
          onChange={e => handleInputChange('className', e.target.value)}
          placeholder="e.g., 10th Grade"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="chapter" className="block text-sm font-medium text-gray-700">Chapter Name / Topic</label>
        <input
          type="text"
          id="chapter"
          value={context.chapter || ''}
          onChange={e => handleInputChange('chapter', e.target.value)}
          placeholder="e.g., The Adventures of Don Quixote"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
       <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author Name (Optional)</label>
        <input
          type="text"
          id="author"
          value={context.author || ''}
          onChange={e => handleInputChange('author', e.target.value)}
          placeholder="e.g., Miguel de Cervantes"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="board" className="block text-sm font-medium text-gray-700">Board / University</label>
        <input
          type="text"
          id="board"
          value={context.board || ''}
          onChange={e => handleInputChange('board', e.target.value)}
          placeholder="e.g., CBSE, Cambridge"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
        <input
          type="text"
          id="language"
          value={context.language || ''}
          onChange={e => handleInputChange('language', e.target.value)}
          placeholder="e.g., English"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
      </div>
      {showDifficulty && (
         <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            id="difficulty"
            value={context.difficulty || 'medium'}
            onChange={e => handleInputChange('difficulty', e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}
      {showQuestionType && (
         <div>
          <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">Question Type</label>
          <select
            id="questionType"
            value={context.questionType || '1M'}
            onChange={e => handleInputChange('questionType', e.target.value as StudyContextData['questionType'])}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="1M">1 Mark</option>
            <option value="2M">2 Marks</option>
            <option value="3M">3 Marks</option>
            <option value="4M">4 Marks</option>
          </select>
        </div>
      )}
      {showQuestionCount && (
        <div>
          <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700">Number of Questions</label>
          <input
            type="number"
            id="questionCount"
            value={context.questionCount ?? ''}
            min="1"
            max="20"
            onChange={e => {
                const val = e.target.value;
                handleInputChange('questionCount', val === '' ? undefined : parseInt(val, 10))
            }}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default StudyContextForm;