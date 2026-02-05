import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock react-router-dom before importing the component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: vi.fn(({ children, to, ...props }) => <a href={to} {...props}>{children}</a>)
  };
});

import CourseCard from '../../components/courses/CourseCard.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CourseCard Component', () => {
  const mockCourse = {
    _id: '123',
    title: 'Test Course Title',
    description: 'This is a test course description that should be displayed properly',
    thumbnail: 'https://example.com/image.jpg',
    level: 'Beginner',
    category: 'Programming',
    totalLessons: 10,
    duration: 120
  };

  it('renders course information correctly', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    
    expect(screen.getByText('Test Course Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test course description that should be displayed properly')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('10 Lessons')).toBeInTheDocument();
  });

  it('displays correct image with alt text', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Course Title');
  });

  it('uses default image when no thumbnail provided', () => {
    const courseWithoutImage = { ...mockCourse, thumbnail: undefined };
    
    renderWithRouter(<CourseCard course={courseWithoutImage} />);
    
    const image = screen.getByRole('img');
    expect(image.src).toContain('unsplash.com');
  });

  it('renders correct link for course navigation', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/courses/123');
  });

  it('displays Initialize Module button', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    
    expect(screen.getByText('Initialize Module')).toBeInTheDocument();
  });

  it('handles course with zero lessons', () => {
    const courseWithZeroLessons = { ...mockCourse, totalLessons: 0 };
    
    renderWithRouter(<CourseCard course={courseWithZeroLessons} />);
    
    expect(screen.getByText('0 Lessons')).toBeInTheDocument();
  });

  it('handles missing totalLessons property', () => {
    const courseWithoutLessons = { ...mockCourse };
    delete courseWithoutLessons.totalLessons;
    
    renderWithRouter(<CourseCard course={courseWithoutLessons} />);
    
    expect(screen.getByText('0 Lessons')).toBeInTheDocument();
  });

  it('applies hover classes correctly', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    
    const card = screen.getByText('Test Course Title').closest('.group');
    expect(card).toHaveClass('group');
  });

  it('renders with course.id as fallback when _id is missing', () => {
    const courseWithId = { ...mockCourse };
    delete courseWithId._id;
    courseWithId.id = 'course-456';
    
    renderWithRouter(<CourseCard course={courseWithId} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/courses/course-456');
  });

  it('truncates long title correctly', () => {
    const longTitle = 'This is a very long course title that should be truncated to fit within the card layout constraints';
    const courseWithLongTitle = { ...mockCourse, title: longTitle };
    
    renderWithRouter(<CourseCard course={courseWithLongTitle} />);
    
    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toHaveClass('line-clamp-2');
  });

  it('truncates long description correctly', () => {
    const longDescription = 'This is a very long course description that extends beyond the normal length and should be properly truncated to maintain the card layout integrity and visual consistency across all course cards in the grid layout.';
    const courseWithLongDescription = { ...mockCourse, description: longDescription };
    
    renderWithRouter(<CourseCard course={courseWithLongDescription} />);
    
    const descriptionElement = screen.getByText(longDescription);
    expect(descriptionElement).toHaveClass('line-clamp-2');
  });

  it('shows level badge with correct styling', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    
    const levelBadge = screen.getByText('Beginner');
    expect(levelBadge).toHaveClass('bg-white/90', 'backdrop-blur-md', 'rounded-lg', 'text-[10px]');
  });

  it('shows category badge with correct styling', () => {
    renderWithRouter(<CourseCard course={mockCourse} />);
    
    const categoryBadge = screen.getByText('Programming');
    expect(categoryBadge).toHaveClass('bg-accent', 'rounded-lg', 'text-[10px]', 'text-white');
  });
});