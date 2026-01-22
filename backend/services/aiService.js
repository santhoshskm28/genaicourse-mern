import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service for converting raw text to structured course JSON
 */
export const convertTextToCourseJSON = async (rawText) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Role: Senior MERN Stack Architect
        Objective: Fix the 'Failed to parse PDF file' error shown in the UI and ensure seamless PDF-to-Course conversion.
        
        Task: Create a professional educational Course JSON output from the following text:
        ---
        ${rawText.substring(0, 35000)}
        ---

        JSON Structure Requirements:
        {
            "title": "Clear and Engaging Course Title",
            "description": "2-3 sentence teaser for the course",
            "category": "AI/ML" | "Web Development" | "Data Science" | "Cloud Computing" | "Other",
            "level": "Beginner" | "Intermediate" | "Advanced",
            "modules": [
                {
                    "moduleTitle": "Module Header",
                    "lessons": [
                        {
                            "lessonTitle": "Lesson Title",
                            "content": "Comprehensive educational material (500+ words)",
                            "keyPoints": ["3-5 actionable takeaways"]
                        }
                    ]
                }
            ],
            "quiz": [
                {
                    "question": "Assessment question",
                    "options": ["A", "B", "C", "D"],
                    "correctAnswerIndex": 0,
                    "explanation": "Context for the correct answer"
                }
            ]
        }

        Processing Constraints:
        - Identify 10 high-quality multiple choice questions.
        - Use Course Architect logic to organize raw text into logical modules.
        - Ensure lesson content is rich and structured.
        - Return ONLY raw JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Handle potential markdown formatting from LLM
        const cleanJsonText = text.replace(/```json|```/g, '').trim();
        const courseData = JSON.parse(cleanJsonText);

        // Validation Check
        if (!courseData.modules || courseData.modules.length === 0 ||
            !courseData.modules[0].lessons || courseData.modules[0].lessons.length === 0) {
            throw new Error('Parsing Error: Course must have at least one module and one lesson.');
        }

        return courseData;
    } catch (error) {
        console.error('AI Conversion Error:', error);
        throw new Error('Failed to convert content using AI: ' + error.message);
    }
};
