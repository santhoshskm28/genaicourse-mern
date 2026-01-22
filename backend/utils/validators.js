import { z } from 'zod';

// AI output schema (what we expect from Gemini)
const aiLessonSchema = z.object({
    lessonTitle: z.string().min(1),
    content: z.string().min(1),
    keyPoints: z.array(z.string()).optional()
});

const aiModuleSchema = z.object({
    moduleTitle: z.string().min(1),
    lessons: z.array(aiLessonSchema).min(1)
});

const quizQuestionSchema = z.object({
    question: z.string().min(1),
    options: z.array(z.string()).min(2),
    correctAnswerIndex: z.number().int().min(0),
    explanation: z.string().optional()
});

export const aiCourseOutputSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    category: z.string(),
    level: z.string(),
    modules: z.array(aiModuleSchema).min(1),
    quiz: z.array(quizQuestionSchema).optional()
});

// Final DB schema (what we save to Mongoose)
const dbLessonSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    keyPoints: z.array(z.string()).optional()
});

const dbModuleSchema = z.object({
    title: z.string().min(1),
    lessons: z.array(dbLessonSchema).min(1)
});

export const courseDatabaseSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    category: z.string(),
    level: z.string(),
    modules: z.array(dbModuleSchema).min(1),
    quizzes: z.array(z.any()).optional() // Mapping quiz -> quizzes
});
