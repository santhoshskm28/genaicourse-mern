import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const CourseForm = ({ isEditing = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        thumbnail: '',
        price: 0,
        isPublished: false,
        whatYoullLearn: [''],
        requirements: [''],
        tags: ['']
    });

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing && id) {
            fetchCourse();
        }
    }, [isEditing, id]);

    const fetchCourse = async () => {
        try {
            const response = await adminService.getCourse(id);
            const course = response.data;
            setFormData({
                title: course.title || '',
                description: course.description || '',
                category: course.category || '',
                level: course.level || 'Beginner',
                thumbnail: course.thumbnail || '',
                price: course.price || 0,
                isPublished: course.isPublished || false,
                whatYoullLearn: course.whatYoullLearn?.length > 0 ? course.whatYoullLearn : [''],
                requirements: course.requirements?.length > 0 ? course.requirements : [''],
                tags: course.tags?.length > 0 ? course.tags : ['']
            });
        } catch (error) {
            toast.error('Failed to load course data');
            navigate('/admin/dashboard');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Clean up empty array items
            const cleanedData = {
                ...formData,
                whatYoullLearn: formData.whatYoullLearn.filter(item => item.trim()),
                requirements: formData.requirements.filter(item => item.trim()),
                tags: formData.tags.filter(item => item.trim())
            };

            if (isEditing) {
                await adminService.updateCourse(id, cleanedData);
                toast.success('Course updated successfully');
            } else {
                await adminService.createCourse(cleanedData);
                toast.success('Course created successfully');
            }

            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="section min-h-screen flex items-center justify-center">
                <div className="loading w-12 h-12" />
            </div>
        );
    }

    return (
        <div className="section min-h-screen bg-slate-900">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="btn btn-secondary flex items-center gap-2"
                        >
                            <FaArrowLeft /> Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-white">
                            {isEditing ? 'Edit Course' : 'Create New Course'}
                        </h1>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="card p-8 bg-slate-800 border-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Course Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                placeholder="Enter course title"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                placeholder="Enter course description"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="AI/ML">AI & Machine Learning</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Cloud Computing">Cloud Computing</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Difficulty Level *
                            </label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                required
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        {/* Thumbnail URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Thumbnail URL
                            </label>
                            <input
                                type="url"
                                name="thumbnail"
                                value={formData.thumbnail}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Price (USD)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                placeholder="0.00"
                            />
                        </div>

                        {/* What You'll Learn */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                What You'll Learn
                            </label>
                            {formData.whatYoullLearn.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayChange('whatYoullLearn', index, e.target.value)}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        placeholder="Learning objective"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('whatYoullLearn', index)}
                                        className="text-red-400 hover:text-red-300 px-2"
                                        disabled={formData.whatYoullLearn.length === 1}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('whatYoullLearn')}
                                className="text-primary hover:text-primary-light text-sm"
                            >
                                + Add learning objective
                            </button>
                        </div>

                        {/* Requirements */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Requirements
                            </label>
                            {formData.requirements.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        placeholder="Course requirement"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('requirements', index)}
                                        className="text-red-400 hover:text-red-300 px-2"
                                        disabled={formData.requirements.length === 1}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('requirements')}
                                className="text-primary hover:text-primary-light text-sm"
                            >
                                + Add requirement
                            </button>
                        </div>

                        {/* Tags */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tags
                            </label>
                            {formData.tags.map((tag, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tag}
                                        onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        placeholder="course-tag"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('tags', index)}
                                        className="text-red-400 hover:text-red-300 px-2"
                                        disabled={formData.tags.length === 1}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('tags')}
                                className="text-primary hover:text-primary-light text-sm"
                            >
                                + Add tag
                            </button>
                        </div>

                        {/* Published Status */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary bg-slate-900 border-slate-700 rounded focus:ring-primary focus:ring-2"
                                />
                                <span className="text-sm font-medium text-gray-300">
                                    Publish course (make it visible to students)
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <div className="loading w-4 h-4" /> : <FaSave />}
                            {isEditing ? 'Update Course' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;