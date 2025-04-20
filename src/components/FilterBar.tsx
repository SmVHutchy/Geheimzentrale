import React from 'react';
import { Shuffle, Filter } from 'lucide-react';

interface FilterBarProps {
  filterCharacter: string;
  setFilterCharacter: (value: string) => void;
  filterMood: string;
  setFilterMood: (value: string) => void;
  filterListened: string;
  setFilterListened: (value: string) => void;
  filterFavorite: boolean;
  setFilterFavorite: (value: boolean) => void;
  onRandom: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterCharacter,
  setFilterCharacter,
  filterMood,
  setFilterMood,
  filterListened,
  setFilterListened,
  filterFavorite,
  setFilterFavorite,
  onRandom
}) => {
  const [showFilters, setShowFilters] = React.useState(false);
  
  return (
    <div className="max-w-md mx-auto w-full">
      {/* Filter Toggle + Random Button */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-lg text-gray-300 hover:bg-gray-700/80 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filter
          {(filterCharacter !== 'Alle' || filterMood !== 'Alle' || 
           filterListened !== 'Alle' || filterFavorite) && (
            <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs bg-indigo-600 text-white rounded-full">
              {(filterCharacter !== 'Alle' ? 1 : 0) + 
               (filterMood !== 'Alle' ? 1 : 0) + 
               (filterListened !== 'Alle' ? 1 : 0) + 
               (filterFavorite ? 1 : 0)}
            </span>
          )}
        </button>
        
        <button
          onClick={onRandom}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
        >
          <Shuffle className="w-4 h-4" />
          Zufallsfolge
        </button>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-800/80 backdrop-blur-md rounded-lg p-4 mb-6 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Character Filter */}
            <div>
              <label htmlFor="character-filter" className="block text-sm font-medium text-gray-400 mb-1">
                Charakter
              </label>
              <select
                id="character-filter"
                value={filterCharacter}
                onChange={(e) => setFilterCharacter(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Alle">Alle Charaktere</option>
                <option value="Justus">Justus Jonas</option>
                <option value="Peter">Peter Shaw</option>
                <option value="Bob">Bob Andrews</option>
                <option value="Hitchcock">Alfred Hitchcock</option>
              </select>
            </div>
            
            {/* Mood Filter */}
            <div>
              <label htmlFor="mood-filter" className="block text-sm font-medium text-gray-400 mb-1">
                Stimmung
              </label>
              <select
                id="mood-filter"
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Alle">Alle Stimmungen</option>
                <option value="Spannend">Spannend</option>
                <option value="Gruselig">Gruselig</option>
                <option value="Mysteriös">Mysteriös</option>
                <option value="Abenteuerlich">Abenteuerlich</option>
                <option value="Zum Einschlafen">Zum Einschlafen</option>
              </select>
            </div>
            
            {/* Listened Filter */}
            <div>
              <label htmlFor="listened-filter" className="block text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <select
                id="listened-filter"
                value={filterListened}
                onChange={(e) => setFilterListened(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Alle">Alle Folgen</option>
                <option value="Gehört">Nur gehörte</option>
                <option value="Nicht gehört">Nur nicht gehörte</option>
              </select>
            </div>
            
            {/* Favorites Filter */}
            <div className="flex items-center">
              <label htmlFor="favorites-filter" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    id="favorites-filter"
                    type="checkbox"
                    className="sr-only"
                    checked={filterFavorite}
                    onChange={(e) => setFilterFavorite(e.target.checked)}
                  />
                  <div className={`w-10 h-6 ${filterFavorite ? 'bg-indigo-600' : 'bg-gray-700'} rounded-full shadow-inner transition-colors`}></div>
                  <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${filterFavorite ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-300">Nur Favoriten</span>
              </label>
            </div>
          </div>
          
          {/* Reset Filters Button */}
          <button
            onClick={() => {
              setFilterCharacter('Alle');
              setFilterMood('Alle');
              setFilterListened('Alle');
              setFilterFavorite(false);
            }}
            className="w-full mt-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
          >
            Filter zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;