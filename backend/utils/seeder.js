import User from '../models/User.js';
import Course from '../models/Course.js';

/**
 * Database Seeder
 * Seeds the database with initial admin user and sample courses
 * Run with: node utils/seeder.js
 */

const seedDatabase = async () => {
    try {
        // Create admin user if doesn't exist
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@genaicourse.io';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const admin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: process.env.ADMIN_PASSWORD || 'Admin@123',
                role: 'admin'
            });
            console.log('✅ Admin user created:', admin.email);
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Sample course data
        const sampleCourses = [
            {
                title: 'Introduction to Generative AI',
                description: 'Learn the fundamentals of Generative AI, including GPT models, image generation, and practical applications.',
                category: 'AI/ML',
                level: 'Beginner',
                thumbnail: 'https://via.placeholder.com/400x250?text=Generative+AI',
                isPublished: true,
                createdBy: existingAdmin?._id || (await User.findOne({ role: 'admin' }))._id,
                modules: [
                    {
                        title: 'Module 1: Introduction to AI',
                        description: 'Understanding the basics of Artificial Intelligence',
                        order: 1,
                        lessons: [
                            {
                                title: 'What is AI?',
                                content: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.',
                                keyPoints: [
                                    'AI mimics human cognitive functions',
                                    'Machine learning is a subset of AI',
                                    'AI is transforming industries worldwide'
                                ],
                                duration: 15
                            },
                            {
                                title: 'History of AI',
                                content: 'The concept of AI dates back to ancient times, but modern AI began in the 1950s. Key milestones include the Turing Test, expert systems, and deep learning breakthroughs.',
                                keyPoints: [
                                    'AI research began in the 1950s',
                                    'Multiple AI winters and revivals',
                                    'Recent explosion due to big data and computing power'
                                ],
                                duration: 20
                            }
                        ]
                    },
                    {
                        title: 'Module 2: Generative AI Fundamentals',
                        description: 'Deep dive into generative models',
                        order: 2,
                        lessons: [
                            {
                                title: 'What is Generative AI?',
                                content: 'Generative AI refers to AI systems that can create new content, including text, images, music, and code. These systems learn patterns from existing data and generate novel outputs.',
                                keyPoints: [
                                    'Creates new content from learned patterns',
                                    'Includes GPT, DALL-E, and other models',
                                    'Applications in creative and technical fields'
                                ],
                                duration: 25
                            },
                            {
                                title: 'Types of Generative Models',
                                content: 'Main types include GANs (Generative Adversarial Networks), VAEs (Variational Autoencoders), and Transformer-based models like GPT.',
                                keyPoints: [
                                    'GANs: Two neural networks competing',
                                    'VAEs: Probabilistic approach to generation',
                                    'Transformers: Attention-based architecture'
                                ],
                                duration: 30
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Full Stack Web Development with MERN',
                description: 'Master MongoDB, Express.js, React, and Node.js to build modern web applications from scratch.',
                category: 'Web Development',
                level: 'Intermediate',
                thumbnail: 'https://via.placeholder.com/400x250?text=MERN+Stack',
                isPublished: true,
                createdBy: existingAdmin?._id || (await User.findOne({ role: 'admin' }))._id,
                modules: [
                    {
                        title: 'Module 1: Introduction to MERN Stack',
                        description: 'Overview of the MERN technology stack',
                        order: 1,
                        lessons: [
                            {
                                title: 'What is MERN Stack?',
                                content: 'MERN is a full-stack JavaScript framework consisting of MongoDB, Express.js, React, and Node.js. It enables developers to build powerful web applications using JavaScript throughout.',
                                keyPoints: [
                                    'MongoDB: NoSQL database',
                                    'Express.js: Backend framework',
                                    'React: Frontend library',
                                    'Node.js: JavaScript runtime'
                                ],
                                duration: 20
                            }
                        ]
                    }
                ]
            }
        ];

        // Check if courses already exist
        const existingCourses = await Course.countDocuments();
        if (existingCourses === 0) {
            await Course.insertMany(sampleCourses);
            console.log('✅ Sample courses created');
        } else {
            console.log('ℹ️  Courses already exist');
        }

        console.log('✅ Database seeding completed successfully');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
};

export default seedDatabase;
