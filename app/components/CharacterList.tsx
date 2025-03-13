'use client';

import { useState } from 'react';
import { Character } from '../types';
import CharacterCard from './CharacterCard';

interface CharacterListProps {
  characters: Character[];
  onSelectCharacter?: (character: Character | null) => void;
}

export default function CharacterList({ characters, onSelectCharacter }: CharacterListProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  // Sort characters by role (major first) and then by name
  const sortedCharacters = [...characters].sort((a, b) => {
    // First make sure both a and b are valid character objects
    if (!a || !b) return 0;
    
    // Then check roles
    if (a.role === 'major' && b.role === 'minor') return -1;
    if (a.role === 'minor' && b.role === 'major') return 1;
    
    // Finally compare names, with fallbacks if names are missing
    const aName = a.name || '';
    const bName = b.name || '';
    return aName.localeCompare(bName);
  });
  
  const handleSelectCharacter = (character: Character) => {
    // If already selected, deselect
    if (selectedCharacter && selectedCharacter.name === character.name) {
      setSelectedCharacter(null);
      if (onSelectCharacter) onSelectCharacter(null);
    } else {
      setSelectedCharacter(character);
      if (onSelectCharacter) onSelectCharacter(character);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Characters</h3>
        {selectedCharacter && (
          <button
            className="bg-blue-50 text-sm text-blue-600 flex items-center px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
            onClick={() => {
              setSelectedCharacter(null);
              if (onSelectCharacter) onSelectCharacter(null);
            }}
          >
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear selection
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Select a character to view their perspective on the timeline. Click on a character card to expand details.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {sortedCharacters.map(character => (
          <CharacterCard
            key={character.name}
            character={character}
            isSelected={selectedCharacter?.name === character.name}
            onSelect={handleSelectCharacter}
          />
        ))}
      </div>
      
      {characters.length === 0 && (
        <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-md">
          No characters detected
        </div>
      )}
    </div>
  );
} 