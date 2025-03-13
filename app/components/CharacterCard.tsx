'use client';

import { useState } from 'react';
import { Character, EmotionType } from '../types';

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onSelect?: (character: Character) => void;
}

export default function CharacterCard({ 
  character, 
  isSelected = false, 
  onSelect 
}: CharacterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleSelect = () => {
    if (onSelect) {
      onSelect(character);
    }
  };
  
  // Function to get color for emotion
  const getEmotionColor = (emotion: string): string => {
    const emotionColors: Record<string, string> = {
      anger: 'bg-red-500',
      joy: 'bg-yellow-400',
      fear: 'bg-purple-500',
      sadness: 'bg-blue-500',
      surprise: 'bg-orange-500',
      disgust: 'bg-green-500',
      neutral: 'bg-gray-400',
    };
    
    return emotionColors[emotion?.toLowerCase()] || 'bg-gray-400';
  };
  
  // Determine border color based on selection
  const borderColor = isSelected 
    ? 'border-blue-500 ring-2 ring-blue-200' 
    : 'border-gray-200 hover:border-gray-300';
  
  // Create defaults for missing profile data
  const defaultProfile = {
    personality: ["Determined", "Resourceful", "Curious"],
    motivations: ["Seeking truth", "Personal growth"],
    background: "Details about this character's background are not available.",
    biases: ["Values experience", "Cautious of the unknown"],
    emotionalBaseline: {
      primary: "neutral" as EmotionType,
      secondary: undefined as EmotionType | undefined,
      intensity: 5
    },
    relationships: {}
  };
  
  // Use character profile or default
  const profile = character.profile || defaultProfile;
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border ${borderColor} p-3 transition-all duration-200 cursor-pointer h-full flex flex-col`}
      onClick={handleSelect}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{character.name || 'Unnamed Character'}</h3>
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          character.role === 'major' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {character.role ? (character.role.charAt(0).toUpperCase() + character.role.slice(1)) : 'Unknown'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-3 text-xs line-clamp-2">{character.summary || 'No summary available'}</p>
      
      <div className="flex justify-between items-center mt-auto">
        <button 
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-md flex items-center transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          {isExpanded ? 'Hide details' : 'Show details'}
          <svg 
            className={`w-3 h-3 ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="flex items-center gap-1">
          <div 
            className={`w-3 h-3 rounded-full ${getEmotionColor(profile.emotionalBaseline?.primary || 'neutral')}`}
            title={`Baseline emotion: ${profile.emotionalBaseline?.primary || 'neutral'}`}
          ></div>
          {profile.emotionalBaseline?.secondary && (
            <div 
              className={`w-3 h-3 rounded-full ${getEmotionColor(profile.emotionalBaseline.secondary)}`}
              title={`Secondary emotion: ${profile.emotionalBaseline.secondary}`}
            ></div>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
          {/* Personality traits */}
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1 text-gray-700">Personality</h4>
            <div className="flex flex-wrap gap-1">
              {profile.personality?.length > 0 ? (
                profile.personality.map((trait, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-0.5 rounded-md text-xs">
                    {trait}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No personality traits available</span>
              )}
            </div>
          </div>
          
          {/* Motivations */}
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1 text-gray-700">Motivations</h4>
            <div className="flex flex-wrap gap-1">
              {profile.motivations?.length > 0 ? (
                profile.motivations.map((motivation, index) => (
                  <span key={index} className="bg-blue-50 px-2 py-0.5 rounded-md text-xs text-blue-800">
                    {motivation}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No motivations available</span>
              )}
            </div>
          </div>
          
          {/* Background */}
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1 text-gray-700">Background</h4>
            <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded-md">{profile.background || 'No background information'}</p>
          </div>
          
          {/* Biases */}
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1 text-gray-700">Biases & Worldview</h4>
            <div className="flex flex-wrap gap-1">
              {profile.biases?.length > 0 ? (
                profile.biases.map((bias, index) => (
                  <span key={index} className="bg-orange-50 px-2 py-0.5 rounded-md text-xs text-orange-800">
                    {bias}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic">No biases available</span>
              )}
            </div>
          </div>
          
          {/* Emotional Baseline */}
          <div className="mb-2">
            <h4 className="font-medium text-xs mb-1 text-gray-700">Emotional Baseline</h4>
            <div className="flex items-center gap-1 bg-gray-50 p-2 rounded-md">
              <div className={`w-3 h-3 rounded-full ${getEmotionColor(profile.emotionalBaseline?.primary || 'neutral')}`}></div>
              <span className="text-xs capitalize">{profile.emotionalBaseline?.primary || 'neutral'}</span>
              {profile.emotionalBaseline?.secondary && (
                <>
                  <span className="text-xs mx-1">+</span>
                  <div className={`w-3 h-3 rounded-full ${getEmotionColor(profile.emotionalBaseline.secondary)}`}></div>
                  <span className="text-xs capitalize">{profile.emotionalBaseline.secondary}</span>
                </>
              )}
              <span className="text-xs ml-auto">
                Intensity: {profile.emotionalBaseline?.intensity || 'N/A'}/10
              </span>
            </div>
          </div>
          
          {/* Relationships - show only if available */}
          {profile.relationships && Object.keys(profile.relationships).length > 0 && (
            <div>
              <h4 className="font-medium text-xs mb-1 text-gray-700">Key Relationships</h4>
              <div className="space-y-1">
                {Object.entries(profile.relationships).map(([name, relation]) => (
                  <div key={name} className="flex justify-between items-center p-1 rounded-md hover:bg-gray-50 text-xs">
                    <div>
                      <span className="font-medium">{name}</span>
                      <p className="text-xs text-gray-600">{relation.type}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(Math.min(5, Math.ceil(relation.strength / 2)))].map((_, i) => (
                        <div key={i} className="w-1 h-3 bg-blue-400 rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 