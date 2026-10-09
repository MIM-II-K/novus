import React, { useState, useMemo } from 'react';
import { Filter, Layers } from 'lucide-react';
import { INITIAL_SOLUTIONS } from '../config/solutionsData';
import { SolutionCategory, SolutionItem } from '../types';
import { SolutionCard } from '../components/catalog/SolutionCard';
import { SolutionSearchBar } from '../components/catalog/SolutionSearchBar';

const CATEGORIES: SolutionCategory[] = [
  'Booking & Appointments',
  'Retail & Inventory',
  'Hospitality',
  'Restaurant Management',
  'Customer Management',
  'Healthcare & Wellness',
  'Education',
  'Business Operations',
];

export const SolutionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

  // Compute counts per category for the search component
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      counts[cat] = INITIAL_SOLUTIONS.filter((s) => s.category === cat).length;
    }
    return counts;
  }, []);

  const filteredSolutions = useMemo(() => {
    let list: SolutionItem[] = [...INITIAL_SOLUTIONS];

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter((s) => s.category === selectedCategory);
    }

    // Filter by Product Name & Keywords
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.targetAudience.toLowerCase().includes(q) ||
          s.keyFeatures.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.startingPriceNPR - b.startingPriceNPR);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.startingPriceNPR - a.startingPriceNPR);
    }

    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('relevance');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <span>Storefront Catalog</span>
            <span aria-hidden="true">·</span>
            <span>{INITIAL_SOLUTIONS.length} Production Foundations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
            Software Solutions Catalog
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
            Discover modular business software systems ready for tailored implementation. Test live demos and customize branding with fixed NPR pricing.
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0 bg-white px-3 py-2 rounded-lg border border-neutral-200">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs text-neutral-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort solutions catalog"
            className="text-xs border-0 bg-transparent font-medium text-neutral-800 focus:outline-hidden cursor-pointer"
          >
            <option value="relevance">Featured & Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Reusable Search Bar Component with Product Name & Category Filtering */}
      <SolutionSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
        totalResults={filteredSolutions.length}
        totalAvailable={INITIAL_SOLUTIONS.length}
        categoryCounts={categoryCounts}
        onReset={handleResetFilters}
      />

      {/* Catalog Grid or Empty State */}
      {filteredSolutions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-neutral-200 space-y-3">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">No matching solutions found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            We couldn't find any software matching your search criteria. Try modifying your keywords or resetting filters.
          </p>
          <div className="pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
