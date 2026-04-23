import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search...', className = '' }) {
  const [query, setQuery] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="input pl-10 pr-10"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-surface-100 text-surface-400"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
