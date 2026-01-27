import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaClock, FaSignal } from 'react-icons/fa';

const CourseCard = ({ course }) => {
    return (
        <div className="card h-full flex flex-col overflow-hidden p-0 bg-slate-800 border-none">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.thumbnail || 'https://placehold.co/400x250?text=Course'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider">
                    {course.level}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-xs text-primary font-bold mb-2 uppercase tracking-wide">
                    {course.category}
                </div>

                <h3 className="text-xl font-bold mb-3 text-white line-clamp-2" title={course.title}>
                    {course.title}
                </h3>

                <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                    {course.description}
                </p>

                <div className="mt-auto">
                    <div className="flex items-center justify-between text-gray-500 text-sm mb-4 border-t border-slate-700 pt-4">
                        <div className="flex items-center">
                            <FaBookOpen className="mr-1.5" />
                            <span>{course.totalLessons || 0} Lessons</span>
                        </div>
                        <div className="flex items-center">
                            <FaClock className="mr-1.5" />
                            <span>{course.totalDuration || 60}m</span>
                        </div>
                    </div>

                    <Link
                        to={`/courses/${course._id}`}
                        className="w-full btn btn-primary flex items-center justify-center group"
                    >
                        View Course
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
