import React from 'react';
import { Search, X, Filter, Sparkles } from 'lucide-react';
import { SolutionCategory } from '../../types';

export interface SolutionSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: SolutionCategory[];
  totalResults: number;
  totalAvailable?: number;
  categoryCounts?: Record<string, number>;
  placeholder?: string;
  onReset?: () => void;
  className?: string;
}

export const SolutionSearchBar: React.FC<SolutionSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalResults,
  totalAvailable,
  categoryCounts = {},
  placeholder = 'Search solutions by product name, features, or keywords...',
  onReset,
  className = '',
}) => {
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All';

  return (
    <div className={`bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4 ${className}`}>
      {/* Primary Input Strip */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input with icons */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            aria-label="Search solutions"
            className="w-full pl-10 pr-9 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-800 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Quick Select Dropdown for compact views */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 text-neutral-500 absolute left-3 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              aria-label="Filter by solution category"
              className="pl-8 pr-8 py-2.5 text-xs font-medium border border-neutral-200 rounded-lg bg-neutral-50 hover:bg-white text-neutral-800 focus:outline-hidden focus:border-neutral-900 cursor-pointer transition-colors"
            >
              <option value="All">All Categories {totalAvailable ? `(${totalAvailable})` : ''}</option>
              {categories.map((cat) => {
                const count = categoryCounts[cat];
                return (
                  <option key={cat} value={cat}>
                    {cat} {count !== undefined ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Reset Filters action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset || (() => {
                onSearchChange('');
                onCategoryChange('All');
              })}
              className="px-3 py-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Interactive Category Filter Buttons */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => onCategoryChange('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            All {totalAvailable ? `(${totalAvailable})` : ''}
          </button>
          {categories.map((cat) => {
            const count = categoryCounts[cat];
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {cat} {count !== undefined ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Results Counter (Zero-Pill Typography) */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-500 whitespace-nowrap shrink-0">
          <span className="font-semibold text-neutral-900 font-mono">{totalResults}</span>
          <span>{totalResults === 1 ? 'solution' : 'solutions'} found</span>
        </div>
      </div>

      {/* Active Filter Chips with 1-click removal */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-xs text-neutral-600">
          <span className="text-[11px] font-medium text-neutral-400">Active filters:</span>
          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200">
              <span>Keyword: "{searchQuery}"</span>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="hover:text-neutral-950 p-0.5"
                title="Remove keyword filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200">
              <span>Category: {selectedCategory}</span>
              <button
                type="button"
                onClick={() => onCategoryChange('All')}
                className="hover:text-neutral-950 p-0.5"
                title="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
