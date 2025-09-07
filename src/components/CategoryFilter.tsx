import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          selectedCategory === 'all'
            ? 'theme-filter-active'
            : 'theme-filter-inactive'
        }`}
      >
        All Services
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedCategory === category
              ? 'theme-filter-active'
              : 'theme-filter-inactive'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
