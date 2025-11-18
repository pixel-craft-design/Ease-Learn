
import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import type { QuizQuestion, ChatMessage, StudyContextData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const ttsModel = 'gemini-2.5-flash-preview-tts';

const buildContextPrompt = (context: Partial<StudyContextData>): string => {
    const contextParts: string[] = [];
    if (context.subject) contextParts.push(`Subject: ${context.subject}`);
    if (context.chapter) contextParts.push(`Topic/Chapter: ${context.chapter}`);
    if (context.author) contextParts.push(`Author: ${context.author}`);
    if (context.className) contextParts.push(`Class/Grade: ${context.className}`);
    if (context.board) contextParts.push(`Board/University: ${context.board}`);
    if (context.language) contextParts.push(`Language: ${context.language}`);

    if (contextParts.length === 0) return "";
    return `The following context has been provided:\n${contextParts.join('\n')}\n\n---\n\n`;
};


export const summarizeText = async (context: Partial<StudyContextData>): Promise<string> => {
    try {
        const contextPrompt = buildContextPrompt(context);
        const languageInstruction = context.language ? `\n\nPlease generate the entire response in the ${context.language} language.` : '';
        const response = await ai.models.generateContent({
            model: textModel,
            contents: `${contextPrompt}Generate a detailed summary based on the provided context. Focus on the essential ideas, key points, and definitions related to the topic. Present the summary in a concise, easy-to-understand format using markdown (headings, bold text, and bullet points).${languageInstruction}`,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing text:", error);
        throw new Error("Failed to generate summary. Please try again.");
    }
};

export const generateQuiz = async (context: Partial<StudyContextData>): Promise<QuizQuestion[]> => {
    const quizSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING, description: "The question text." },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 4 possible answers." },
                correctAnswer: { type: Type.STRING, description: "The correct answer from the options." },
                explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct." },
            },
            required: ["question", "options", "correctAnswer", "explanation"],
        },
    };

    try {
        const contextPrompt = buildContextPrompt(context);
        const questionCount = context.questionCount || 5;
        const difficulty = context.difficulty || 'medium';
        const questionType = context.questionType || '1M';
        const questionTypeText = `${questionType.replace('M', '')} Mark style question`;
        const languageInstruction = context.language ? `\n\nPlease generate all parts of the quiz (questions, options, correct answer, and explanation) in the ${context.language} language.` : '';


        const response = await ai.models.generateContent({
            model: textModel,
            contents: `${contextPrompt}Based on the provided context, generate ${questionCount} practice questions of ${difficulty} difficulty. Each question should be a ${questionTypeText}. Each question must have exactly 4 options.${languageInstruction}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as QuizQuestion[];
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. The provided context might be insufficient. Please provide more details.");
    }
};


export const generateEssayOutline = async (context: Partial<StudyContextData>): Promise<string> => {
    try {
        const contextPrompt = buildContextPrompt(context);
        const languageInstruction = context.language ? `\n\nPlease generate the entire response in the ${context.language} language.` : '';
        const response = await ai.models.generateContent({
            model: textModel,
            contents: `${contextPrompt}Generate a structured and detailed essay outline for the topic specified in the context. Include a thesis statement, main points with supporting details, and a conclusion. Format the output using markdown.${languageInstruction}`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating essay outline:", error);
        throw new Error("Failed to generate outline. Please try again.");
    }
};

export const createTutorChat = (context: Partial<StudyContextData>): Chat => {
    const contextPrompt = buildContextPrompt(context);
    const languageInstruction = context.language ? `\n\nPlease conduct the entire conversation in the ${context.language} language.` : '';
    return ai.chats.create({
        model: textModel,
        config: {
            systemInstruction: `You are a friendly and encouraging AI Tutor. ${contextPrompt}Your goal is to help students understand complex topics. Answer questions clearly, provide examples, and adapt your language to be easily understood. If a student seems stuck, offer hints or ask guiding questions. Keep your responses concise and focused on the student's query.${languageInstruction}`,
        }
    });
};


export const generateAudioSummary = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: ttsModel,
            contents: [{ parts: [{ text: `Here is the summary: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data returned from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating audio summary:", error);
        throw new Error("Failed to generate audio. Please try again.");
    }
};
