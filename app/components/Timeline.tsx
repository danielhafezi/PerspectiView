'use client';

import { useState } from 'react';
import { StoryEvent, Character, EmotionType } from '../types';

interface TimelineProps {
  events: StoryEvent[];
  characters: Character[];
  selectedCharacter?: Character | null;
}

export default function Timeline({ events, characters, selectedCharacter }: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<StoryEvent | null>(null);
  
  // Sort events by time position
  const sortedEvents = [...events].sort((a, b) => a.timePosition - b.timePosition);
  
  // Get emotion color class
  const getEmotionColor = (emotion: EmotionType): string => {
    const emotionColors: Record<EmotionType, string> = {
      anger: 'bg-red-500',
      joy: 'bg-yellow-400',
      fear: 'bg-purple-500',
      sadness: 'bg-blue-500',
      surprise: 'bg-orange-500',
      disgust: 'bg-green-500',
      neutral: 'bg-gray-400',
    };
    
    return emotionColors[emotion] || 'bg-gray-400';
  };
  
  // Get text color class for emotion
  const getEmotionTextColor = (emotion: EmotionType): string => {
    const emotionTextColors: Record<EmotionType, string> = {
      anger: 'text-red-700',
      joy: 'text-yellow-700',
      fear: 'text-purple-700',
      sadness: 'text-blue-700',
      surprise: 'text-orange-700',
      disgust: 'text-green-700',
      neutral: 'text-gray-700',
    };
    
    return emotionTextColors[emotion] || 'text-gray-700';
  };
  
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      {/* Timeline header */}
      <div className="flex items-center mb-6">
        <h3 className="text-xl font-medium">Story Timeline</h3>
        {selectedCharacter && (
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            Viewing as {selectedCharacter.name}
          </span>
        )}
      </div>
      
      {/* Timeline track - Make this much taller and clearer */}
      <div className="relative mb-16">
        {/* Timeline line */}
        <div className="absolute h-1 bg-gray-300 w-full top-6 rounded-full"></div>
        
        {/* Timeline events */}
        <div className="relative h-14 mx-4">
          {sortedEvents.map((event, idx) => {
            // Calculate position based on index if timePosition isn't working properly
            const position = event.timePosition > 0 ? event.timePosition : (idx / (sortedEvents.length - 1 || 1)) * 100;
            
            // Get the emotion for the selected character (if any)
            const characterEmotion = selectedCharacter && 
              event.characterPerspectives[selectedCharacter.name]?.emotion?.primary;
            
            const emotionClass = characterEmotion ? 
              getEmotionColor(characterEmotion) : 'bg-gray-400';
            
            return (
              <div 
                key={event.id} 
                className="absolute transform -translate-x-1/2"
                style={{ left: `${position}%` }}
              >
                <button
                  className={`w-12 h-12 rounded-full border-2 border-white shadow-md z-10 transition-all
                    ${selectedEvent?.id === event.id ? 'transform scale-125 ring-2 ring-blue-300' : ''}
                    ${emotionClass}`}
                  onClick={() => setSelectedEvent(event)}
                  title={event.title}
                />
                <div className="absolute w-28 text-center text-xs mt-2 transform -translate-x-1/4 font-medium">
                  {event.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Event labels with more context */}
      <div className="flex justify-between mb-8 text-sm text-gray-600">
        <div className="font-medium">Beginning</div>
        {sortedEvents.length > 2 && <div className="font-medium">Middle</div>}
        <div className="font-medium">End</div>
      </div>
      
      {/* Emotion legend - improved layout */}
      <div className="mb-8 border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium mb-3">Emotion Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['anger', 'joy', 'fear', 'sadness', 'surprise', 'disgust', 'neutral'].map((emotion) => (
            <div key={emotion} className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${getEmotionColor(emotion as EmotionType)}`}></div>
              <span className="text-sm capitalize">{emotion}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Selected event details */}
      {selectedEvent ? (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <h4 className="text-lg font-medium mb-2">{selectedEvent.title}</h4>
          <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
          
          {/* Character perspectives */}
          {selectedCharacter ? (
            // Show only selected character's perspective
            <div className="border-t border-gray-200 pt-4">
              <h5 className="font-medium mb-2">{selectedCharacter.name}'s Perspective</h5>
              
              {selectedEvent.characterPerspectives[selectedCharacter.name] ? (
                <div>
                  <div className="p-4 bg-gray-100 rounded-md mb-3 italic narrative-text">
                    "{selectedEvent.characterPerspectives[selectedCharacter.name].firstPersonNarrative || 'No first-person narrative available'}"
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium mr-2">Emotion:</span>
                    <div className={`w-3 h-3 rounded-full mr-1 ${
                      getEmotionColor(selectedEvent.characterPerspectives[selectedCharacter.name].emotion?.primary || 'neutral')
                    }`}></div>
                    <span className={`text-sm capitalize ${
                      getEmotionTextColor(selectedEvent.characterPerspectives[selectedCharacter.name].emotion?.primary || 'neutral')
                    }`}>
                      {selectedEvent.characterPerspectives[selectedCharacter.name].emotion?.primary || 'neutral'}
                      {' '}(Intensity: {selectedEvent.characterPerspectives[selectedCharacter.name].emotion?.intensity || 'N/A'}/10)
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Perception accuracy:</span>{' '}
                    {selectedEvent.characterPerspectives[selectedCharacter.name].perceptionAccuracy || 'N/A'}%
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No perspective available</p>
              )}
            </div>
          ) : (
            // Show all character perspectives in a grid - more columns on wider displays
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-200 pt-4">
              {characters.map(character => (
                <div key={character.name} className="border border-gray-200 rounded-md p-4 hover:border-blue-300 transition-colors">
                  <h5 className="font-medium mb-2">{character.name}</h5>
                  
                  {selectedEvent.characterPerspectives[character.name] ? (
                    <div>
                      <p className="text-sm italic mb-3 narrative-text line-clamp-3">
                        "{selectedEvent.characterPerspectives[character.name].firstPersonNarrative?.substring(0, 150) || 'No first-person narrative available'}..."
                      </p>
                      
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-1 ${
                          getEmotionColor(selectedEvent.characterPerspectives[character.name].emotion?.primary || 'neutral')
                        }`}></div>
                        <span className={`text-xs capitalize ${
                          getEmotionTextColor(selectedEvent.characterPerspectives[character.name].emotion?.primary || 'neutral')
                        }`}>
                          {selectedEvent.characterPerspectives[character.name].emotion?.primary || 'neutral'}
                          {' '}(Intensity: {selectedEvent.characterPerspectives[character.name].emotion?.intensity || 'N/A'}/10)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No perspective available</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-500">Select an event on the timeline to view details</p>
        </div>
      )}
    </div>
  );
} 