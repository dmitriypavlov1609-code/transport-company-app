import { useState, useRef } from 'react';
import { geocode } from '../utils/routing';

export default function AddressInput({ label, value, onChange, color = '#1A73E8' }) {
  const [query, setQuery] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  const handleInput = (val) => {
    setQuery(val);
    if (val.length < 3) { setSuggestions([]); return; }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await geocode(val);
      setSuggestions(results);
      setShowDropdown(true);
      setLoading(false);
    }, 400);
  };

  const selectSuggestion = (s) => {
    onChange({ lat: s.lat, lng: s.lng, name: s.short });
    setQuery(s.short);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {label && <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{label}</label>}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: color }} />
        <input
          type="text"
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="input-field pl-8 pr-10"
          placeholder="Введите адрес..."
        />
        {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
        {!loading && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
      </div>
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button key={i} onMouseDown={() => selectSuggestion(s)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors">
              <span className="text-gray-900 dark:text-gray-100">{s.short}</span>
              <span className="text-gray-400 text-xs block mt-0.5">{s.display.split(',').slice(2, 5).join(',')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
