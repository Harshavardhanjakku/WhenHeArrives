"use client";
import { useState } from 'react';
import { Filter, X, Calendar, Clock } from 'lucide-react';

interface FilterState {
  dayOfWeek: string;
  timeTag: string;
  from: string;
  to: string;
}

interface FilterComponentProps {
  onFilter: (filters: FilterState) => void;
  onClear: () => void;
}

export default function FilterComponent({ onFilter, onClear }: FilterComponentProps) {
  const [filters, setFilters] = useState<FilterState>({
    dayOfWeek: '',
    timeTag: '',
    from: '',
    to: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({ dayOfWeek: '', timeTag: '', from: '', to: '' });
    onClear();
  };

  const hasActiveFilters = filters.dayOfWeek || filters.timeTag || filters.from || filters.to;

  return (
    <div className="bg-black/50 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-cyan-400" />
          Filters
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Day of Week Filter */}
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">Day of Week</label>
            <select
              value={filters.dayOfWeek}
              onChange={(e) => setFilters(prev => ({ ...prev, dayOfWeek: e.target.value }))}
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 px-4 transition-all duration-300"
            >
              <option value="">All Days</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          {/* Time Tag Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Arrival Time
            </label>
            <select
              value={filters.timeTag}
              onChange={(e) => setFilters(prev => ({ ...prev, timeTag: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            >
              <option value="">All Times</option>
              <option value="fast">Fast (8pm - 10pm)</option>
              <option value="late">Late (10pm - 12am)</option>
              <option value="very_late">Very Late (After 12am)</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">From</label>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">To</label>
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleFilter}
              className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm hover:bg-black transition-colors"
            >
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500 mb-2">Active Filters:</div>
              <div className="flex flex-wrap gap-2">
                {filters.dayOfWeek && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {filters.dayOfWeek}
                  </span>
                )}
                {filters.timeTag && (
                  <span className={`px-2 py-1 rounded text-xs ${
                    filters.timeTag === 'fast' ? 'bg-green-100 text-green-700' :
                    filters.timeTag === 'late' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {filters.timeTag === 'fast' ? 'Fast' :
                     filters.timeTag === 'late' ? 'Late' : 'Very Late'}
                  </span>
                )}
                {filters.from && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    From: {filters.from}
                  </span>
                )}
                {filters.to && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    To: {filters.to}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
