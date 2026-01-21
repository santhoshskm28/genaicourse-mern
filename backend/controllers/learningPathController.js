import LearningPath from '../models/LearningPath.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';

/**
 * @desc    Generate personalized learning path using AI recommendations
 * @route   POST /api/learning-paths/generate
 * @access  Private
 */
export const generateLearningPath = async (req, res, next) => {
    try {
        const { goal, category, difficulty, timeCommitment, currentSkills = [] } = req.body;
        const userId = req.user._id;

        // Get user's completed courses and skills
        const userProgress = await UserProgress.find({
            userId,
            progressPercentage: { $gte: 100 }
        }).populate({
            path: 'courseId',
            select: 'title category level tags learningObjectives'
        });

        const completedCourses = userProgress.map(p => p.courseId);
        const acquiredSkills = completedCourses.flatMap(course => 
            course.learningObjectives || []
        );

        // AI-powered course recommendations based on:
        // 1. User's stated goal and preferences
        // 2. Completed courses and current skills
        // 3. Prerequisites and learning objectives
        const recommendedCourses = await findRecommendedCourses(
            category,
            difficulty,
            currentSkills,
            acquiredSkills,
            completedCourses.map(c => c._id),
            goal
        );

        if (recommendedCourses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No suitable courses found for the specified criteria'
            });
        }

        // Calculate estimated duration
        const estimatedDuration = recommendedCourses.reduce((total, course) => 
            total + (course.estimatedDuration || 10), 0
        );

        // Generate learning path
        const learningPath = await LearningPath.create({
            userId,
            title: `${category} Learning Path: ${goal}`,
            description: `Personalized learning path for ${goal} in ${category}`,
            courses: recommendedCourses.map((course, index) => ({
                courseId: course._id,
                order: index,
                recommendedHours: course.estimatedDuration || 10
            })),
            category,
            difficulty: difficulty || 'Beginner',
            estimatedDuration,
            aiRecommendationScore: calculateRecommendationScore(
                goal,
                currentSkills,
                recommendedCourses
            ),
            recommendationReasons: generateRecommendationReasons(
                goal,
                currentSkills,
                recommendedCourses
            ),
            learningObjectives: extractLearningObjectives(recommendedCourses),
            targetSkills: generateTargetSkills(goal, category, recommendedCourses),
            targetCompletionDate: calculateTargetDate(estimatedDuration, timeCommitment)
        });

        await learningPath.populate('courses.courseId', 'title thumbnail level');

        res.status(201).json({
            success: true,
            message: 'Learning path generated successfully',
            data: learningPath
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all learning paths for a user
 * @route   GET /api/learning-paths
 * @access  Private
 */
export const getUserLearningPaths = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, isActive } = req.query;
        
        const query = { userId: req.user._id };
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const learningPaths = await LearningPath.find(query)
            .populate('courses.courseId', 'title thumbnail level category')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LearningPath.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                learningPaths,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get learning path by ID
 * @route   GET /api/learning-paths/:id
 * @access  Private
 */
export const getLearningPathById = async (req, res, next) => {
    try {
        const learningPath = await LearningPath.findById(req.params.id)
            .populate('courses.courseId', 'title thumbnail level category modules')
            .populate('userId', 'name email');

        if (!learningPath) {
            return res.status(404).json({
                success: false,
                message: 'Learning path not found'
            });
        }

        // Check if user owns the learning path
        if (learningPath.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this learning path'
            });
        }

        // Update progress based on user's course completions
        await updateLearningPathProgress(learningPath, req.user._id);

        res.status(200).json({
            success: true,
            data: learningPath
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update learning path progress
 * @route   PUT /api/learning-paths/:id/update-progress
 * @access  Private
 */
export const updateProgress = async (req, res, next) => {
    try {
        const { courseId, timeSpent, isCompleted } = req.body;
        const learningPathId = req.params.id;

        const learningPath = await LearningPath.findById(learningPathId);
        
        if (!learningPath) {
            return res.status(404).json({
                success: false,
                message: 'Learning path not found'
            });
        }

        // Find the course in the learning path
        const courseIndex = learningPath.courses.findIndex(
            c => c.courseId.toString() === courseId
        );

        if (courseIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Course not found in this learning path'
            });
        }

        // Update course progress
        learningPath.courses[courseIndex].isCompleted = isCompleted || false;
        if (timeSpent) {
            learningPath.courses[courseIndex].actualHours = timeSpent / 60; // Convert minutes to hours
        }

        if (isCompleted && !learningPath.courses[courseIndex].completionDate) {
            learningPath.courses[courseIndex].completionDate = new Date();
        }

        await learningPath.save();

        res.status(200).json({
            success: true,
            message: 'Progress updated successfully',
            data: learningPath
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get AI course recommendations
 * @route   GET /api/learning-paths/recommendations
 * @access  Private
 */
export const getCourseRecommendations = async (req, res, next) => {
    try {
        const { category, limit = 5 } = req.query;
        const userId = req.user._id;

        // Get user's completed courses
        const userProgress = await UserProgress.find({
            userId,
            progressPercentage: { $gte: 100 }
        }).populate('courseId', 'category level tags');

        const completedCourses = userProgress.map(p => p.courseId._id);
        const userCategories = [...new Set(userProgress.map(p => p.courseId.category))];

        // AI recommendation logic
        const query = {
            _id: { $nin: completedCourses },
            isPublished: true
        };

        if (category) {
            query.category = category;
        } else {
            // Recommend from categories user hasn't explored
            const allCategories = ['AI/ML', 'Web Development', 'Data Science', 'Cloud Computing'];
            const newCategories = allCategories.filter(cat => !userCategories.includes(cat));
            if (newCategories.length > 0) {
                query.category = { $in: newCategories };
            }
        }

        const recommendations = await Course.find(query)
            .sort({ enrollmentCount: -1, averageRating: -1 })
            .limit(parseInt(limit));

        // Add AI scores to recommendations
        const scoredRecommendations = recommendations.map(course => ({
            ...course.toObject(),
            aiScore: calculateAIScore(course, userProgress, completedCourses),
            recommendationReason: generateRecommendationReason(course, userProgress)
        }));

        // Sort by AI score
        scoredRecommendations.sort((a, b) => b.aiScore - a.aiScore);

        res.status(200).json({
            success: true,
            data: {
                recommendations: scoredRecommendations
            }
        });
    } catch (error) {
        next(error);
    }
};

// Helper functions for AI-powered recommendations

const findRecommendedCourses = async (category, difficulty, currentSkills, acquiredSkills, completedCourseIds, goal) => {
    const query = {
        isPublished: true,
        _id: { $nin: completedCourseIds }
    };

    if (category) query.category = category;
    if (difficulty) query.level = difficulty;

    const courses = await Course.find(query)
        .sort({ averageRating: -1, enrollmentCount: -1 })
        .limit(8);

    // Filter and rank courses based on AI scoring
    return courses
        .map(course => ({
            ...course.toObject(),
            aiScore: calculateRecommendationScore(goal, currentSkills, [course], acquiredSkills),
            estimatedDuration: course.totalDuration / 60 // Convert minutes to hours
        }))
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, 5);
};

const calculateRecommendationScore = (goal, currentSkills, courses, acquiredSkills = []) => {
    let score = 0.5; // Base score

    courses.forEach(course => {
        // Boost score if course matches goal
        if (goal && course.title.toLowerCase().includes(goal.toLowerCase())) {
            score += 0.3;
        }

        // Boost score if course builds on current skills
        if (course.learningObjectives) {
            const matchingSkills = course.learningObjectives.filter(obj =>
                currentSkills.some(skill => obj.toLowerCase().includes(skill.toLowerCase()))
            ).length;
            score += (matchingSkills / course.learningObjectives.length) * 0.2;
        }

        // Boost score if course teaches new skills
        if (acquiredSkills.length > 0) {
            const newSkills = course.learningObjectives.filter(obj =>
                !acquiredSkills.some(skill => obj.toLowerCase().includes(skill.toLowerCase()))
            ).length;
            score += (newSkills / course.learningObjectives.length) * 0.1;
        }

        // Boost score based on course quality metrics
        score += (course.averageRating / 5) * 0.1;
        score += Math.min(course.enrollmentCount / 1000, 1) * 0.1;
    });

    return Math.min(score, 1);
};

const generateRecommendationReasons = (goal, currentSkills, courses) => {
    const reasons = [];

    if (goal) {
        reasons.push(`Aligns with your goal: ${goal}`);
    }

    if (currentSkills.length > 0) {
        reasons.push('Builds on your existing skills');
    }

    if (courses.some(c => c.averageRating >= 4.5)) {
        reasons.push('Highly rated by other learners');
    }

    if (courses.some(c => c.enrollmentCount > 500)) {
        reasons.push('Popular among learners');
    }

    return reasons.length > 0 ? reasons : ['Personalized for your learning journey'];
};

const generateTargetSkills = (goal, category, courses) => {
    const allSkills = courses.flatMap(course => course.learningObjectives || []);
    return [...new Set(allSkills)];
};

const extractLearningObjectives = (courses) => {
    const allObjectives = courses.flatMap(course => course.learningObjectives || []);
    return [...new Set(allObjectives)].slice(0, 6);
};

const calculateTargetDate = (estimatedHours, timeCommitment) => {
    if (!timeCommitment) return undefined;
    
    const hoursPerWeek = timeCommitment === 'high' ? 20 : timeCommitment === 'medium' ? 10 : 5;
    const weeksNeeded = Math.ceil(estimatedHours / hoursPerWeek);
    
    return new Date(Date.now() + (weeksNeeded * 7 * 24 * 60 * 60 * 1000));
};

const updateLearningPathProgress = async (learningPath, userId) => {
    for (let i = 0; i < learningPath.courses.length; i++) {
        const course = learningPath.courses[i];
        const progress = await UserProgress.findOne({
            userId,
            courseId: course.courseId
        });

        if (progress) {
            learningPath.courses[i].isCompleted = progress.progressPercentage >= 100;
            learningPath.courses[i].actualHours = progress.totalTimeSpent / 60;
            if (progress.progressPercentage >= 100) {
                learningPath.courses[i].completionDate = progress.completedAt;
            }
        }
    }

    await learningPath.save();
};

const calculateAIScore = (course, userProgress, completedCourses) => {
    let score = 0.5;

    // Score based on user's past behavior
    const userCategories = [...new Set(userProgress.map(p => p.courseId.category))];
    if (userCategories.includes(course.category)) {
        score += 0.2;
    }

    // Score based on course quality
    score += (course.averageRating / 5) * 0.2;
    score += Math.min(course.enrollmentCount / 1000, 1) * 0.1;

    return Math.min(score, 1);
};

const generateRecommendationReason = (course, userProgress) => {
    const userCategories = [...new Set(userProgress.map(p => p.courseId.category))];
    
    if (userCategories.includes(course.category)) {
        return `Continue learning in ${course.category}`;
    } else if (course.averageRating >= 4.5) {
        return `Highly rated course`;
    } else if (course.enrollmentCount > 500) {
        return `Popular course`;
    } else {
        return `Recommended for you`;
    }
};

export default {
    generateLearningPath,
    getUserLearningPaths,
    getLearningPathById,
    updateProgress,
    getCourseRecommendations
};