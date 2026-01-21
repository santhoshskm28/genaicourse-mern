
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB for seeding');

        // Create Admin User
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@genaicourse.io';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

        let adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            console.log('Creating admin user...');
            adminUser = await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                profile: {
                    bio: 'System Administrator',
                    avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=random'
                }
            });
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️ Admin user already exists');
        }

        // Create Sample Course if none exist
        const courseCount = await Course.countDocuments();

        if (courseCount === 0) {
            console.log('Creating sample course...');

            await Course.create({
                title: 'Introduction to Generative AI',
                description: 'Master the fundamentals of Generative AI, including LLMs, diffusion models, and prompt engineering. This comprehensive course takes you from basics to advanced concepts.',
                thumbnail: 'https://placehold.co/600x400/7c3aed/white?text=GenAI+Course',
                category: 'AI/ML',
                level: 'Beginner',
                language: 'english',
                tags: ['ai', 'generative-ai', 'llm', 'prompt-engineering'],
                price: 0,
                isPublished: true,
                createdBy: adminUser._id,
                instructors: [{ userId: adminUser._id, role: 'lead' }],
                modules: [
                    {
                        title: 'Module 1: Foundations of GenAI',
                        description: 'Understanding the basic concepts and history of Generative AI.',
                        order: 1,
                        isPublished: true,
                        lessons: [
                            {
                                title: 'What is Generative AI?',
                                content: 'Generative AI refers to deep-learning models that can take raw data and "learn" to generate statistically probable outputs when prompted.',
                                type: 'text',
                                duration: 15,
                                order: 1,
                                resources: []
                            },
                            {
                                title: 'History of LLMs',
                                content: 'From N-grams to Transformers, learn how Language Models have evolved over the decades.',
                                type: 'text',
                                duration: 20,
                                order: 2
                            }
                        ]
                    },
                    {
                        title: 'Module 2: Prompt Engineering',
                        description: 'Learn how to effectively communicate with AI models.',
                        order: 2,
                        isPublished: true,
                        lessons: [
                            {
                                title: 'Zero-shot vs Few-shot Learning',
                                content: 'Understanding context windows and in-context learning capabilities of modern LLMs.',
                                type: 'text',
                                duration: 25,
                                order: 1
                            }
                        ]
                    }
                ],
                whatYoullLearn: [
                    'Understand how LLMs work',
                    'Master prompt engineering techniques',
                    'Build AI-powered applications',
                    'Ethical considerations in AI'
                ],
                requirements: [
                    'Basic programming knowledge',
                    'Interest in AI'
                ]
            });

            console.log('✅ Sample course created');
        } else {
            console.log('ℹ️ Courses already exist. Skipping seed.');
        }

        console.log('🎉 Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
