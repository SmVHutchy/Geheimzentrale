import React, { useState, useEffect, useRef } from 'react';
import { Heart, Check, RotateCw, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import episodesData from '../data/episodes.json';
import FilterBar from './FilterBar';

type Episode = {
  nummer: number;
  titel: string;
  autor: string;
  beschreibung: string;
  veröffentlichungsdatum: string;
  kapitel: { titel: string; start: number; end: number }[];
  sprechrollen: { rolle: string; sprecher: string; pseudonym?: string }[];
  links: { cover: string; spotify?: string };
  isFavorite?: boolean;
  listened?: boolean;
};

const EpisodeCards: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [filterCharacter, setFilterCharacter] = useState('Alle');
  const [filterMood, setFilterMood] = useState('Alle');
  const [filterListened, setFilterListened] = useState('Alle');
  const [filterFavorite, setFilterFavorite] = useState(false);

  useEffect(() => {
    const initializedEpisodes = episodesData.serie.map(episode => ({
      ...episode,
      isFavorite: false,
      listened: false
    }));
    setEpisodes(initializedEpisodes);
  }, []);

  const filteredEpisodes = episodes.filter(episode => {
    if (filterListened === 'Gehört' && !episode.listened) return false;
    if (filterListened === 'Nicht gehört' && episode.listened) return false;
    if (filterFavorite && !episode.isFavorite) return false;
    if (filterCharacter !== 'Alle') {
      const hasCharacter = episode.sprechrollen.some(
        role => role.rolle.includes(filterCharacter)
      );
      if (!hasCharacter) return false;
    }
    return true;
  });

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setOffsetX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (offsetX < -50 && currentIndex < filteredEpisodes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (offsetX > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    
    setOffsetX(0);
  };

  const toggleFavorite = (index: number) => {
    const episodeIndex = episodes.findIndex(ep => 
      ep.nummer === filteredEpisodes[index].nummer
    );
    
    if (episodeIndex !== -1) {
      const updatedEpisodes = [...episodes];
      updatedEpisodes[episodeIndex].isFavorite = !updatedEpisodes[episodeIndex].isFavorite;
      setEpisodes(updatedEpisodes);
    }
  };

  const toggleListened = (index: number) => {
    const episodeIndex = episodes.findIndex(ep => 
      ep.nummer === filteredEpisodes[index].nummer
    );
    
    if (episodeIndex !== -1) {
      const updatedEpisodes = [...episodes];
      updatedEpisodes[episodeIndex].listened = !updatedEpisodes[episodeIndex].listened;
      setEpisodes(updatedEpisodes);
    }
  };

  const pickRandomEpisode = () => {
    if (filteredEpisodes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredEpisodes.length);
      setCurrentIndex(randomIndex);
      
      if (cardsRef.current) {
        cardsRef.current.classList.add('animate-spin-once');
        setTimeout(() => {
          if (cardsRef.current) {
            cardsRef.current.classList.remove('animate-spin-once');
          }
        }, 600);
      }
    }
  };

  if (filteredEpisodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400">Keine Episoden gefunden.</p>
        <button 
          onClick={() => {
            setFilterCharacter('Alle');
            setFilterMood('Alle');
            setFilterListened('Alle');
            setFilterFavorite(false);
          }}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Filter zurücksetzen
        </button>
      </div>
    );
  }

  const currentEpisode = filteredEpisodes[currentIndex];

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col">
      <FilterBar 
        filterCharacter={filterCharacter}
        setFilterCharacter={setFilterCharacter}
        filterMood={filterMood}
        setFilterMood={setFilterMood}
        filterListened={filterListened}
        setFilterListened={setFilterListened}
        filterFavorite={filterFavorite}
        setFilterFavorite={setFilterFavorite}
        onRandom={pickRandomEpisode}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center mt-8">
        {/* Progress Indicators */}
        <div className="flex space-x-1 mb-6">
          {filteredEpisodes.map((_, index) => (
            <button
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-indigo-500' 
                  : 'w-1 bg-gray-700'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        
        {/* Card Container */}
        <div 
          ref={cardsRef}
          className="w-full max-w-md aspect-[3/4] relative"
          style={{ perspective: '1000px' }}
        >
          {/* Main Card */}
          <div
            className={`absolute inset-0 bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-[0_0_15px_rgba(255,255,255,0.1)] overflow-hidden transform transition-transform ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: isDragging 
                ? `translateX(${offsetX}px) rotateY(${offsetX * 0.05}deg)` 
                : 'translateX(0) rotateY(0deg)',
              transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {/* Card Content */}
            <div className="h-full flex flex-col">
              {/* Cover Image */}
              <div className="relative h-1/3">
                <img 
                  src={currentEpisode.links.cover} 
                  alt={`Cover für ${currentEpisode.titel}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h2 className="text-4xl font-bold text-white shadow-text">
                    #{currentEpisode.nummer}
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleFavorite(currentIndex)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        currentEpisode.isFavorite 
                          ? 'bg-red-500/80 text-white' 
                          : 'bg-gray-800/50 text-gray-400'
                      }`}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => toggleListened(currentIndex)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        currentEpisode.listened 
                          ? 'bg-green-500/80 text-white' 
                          : 'bg-gray-800/50 text-gray-400'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Die drei ??? {currentEpisode.titel}
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  von {currentEpisode.autor} • {new Date(currentEpisode.veröffentlichungsdatum).getFullYear()}
                </p>
                
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                  {currentEpisode.beschreibung}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-white">Kapitel</h4>
                    <ul className="space-y-1">
                      {currentEpisode.kapitel.slice(0, 4).map((chapter, index) => (
                        <li key={index} className="text-sm text-gray-400">
                          {chapter.titel}
                        </li>
                      ))}
                      {currentEpisode.kapitel.length > 4 && (
                        <li className="text-sm text-gray-500">
                          + {currentEpisode.kapitel.length - 4} weitere Kapitel
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2 text-white">Sprecher</h4>
                    <ul className="space-y-1">
                      {currentEpisode.sprechrollen.slice(0, 3).map((role, index) => (
                        <li key={index} className="text-sm text-gray-400">
                          <span className="text-gray-300">{role.rolle}</span>: {role.sprecher}
                        </li>
                      ))}
                      {currentEpisode.sprechrollen.length > 3 && (
                        <li className="text-sm text-gray-500">
                          + {currentEpisode.sprechrollen.length - 3} weitere Sprecher
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              {currentEpisode.links.spotify && (
                <div className="p-6 pt-0">
                  <a 
                    href={currentEpisode.links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-indigo-600/90 backdrop-blur-sm hover:bg-indigo-500/90 text-white py-3 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Auf Spotify hören
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
              currentIndex === 0 
                ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed' 
                : 'bg-gray-800/50 text-white hover:bg-gray-700/50'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={pickRandomEpisode}
            className="p-3 rounded-full bg-indigo-600/90 backdrop-blur-sm text-white hover:bg-indigo-500/90 transition-colors"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentIndex(Math.min(filteredEpisodes.length - 1, currentIndex + 1))}
            disabled={currentIndex === filteredEpisodes.length - 1}
            className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
              currentIndex === filteredEpisodes.length - 1 
                ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed' 
                : 'bg-gray-800/50 text-white hover:bg-gray-700/50'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCards;