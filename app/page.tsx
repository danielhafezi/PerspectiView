'use client';

import { useState } from 'react';
import TextInput from './components/TextInput';
import CharacterList from './components/CharacterList';
import Timeline from './components/Timeline';
import { analyzeStory } from './lib/gemini';
import { StoryAnalysisResult, Character } from './types';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<StoryAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  const handleSubmit = async (text: string) => {
    setIsProcessing(true);
    setError(null);
    setSelectedCharacter(null);
    
    try {
      console.log('Submitting text for analysis, length:', text.length);
      const result = await analyzeStory(text);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing story:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to analyze the story. ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSelectCharacter = (character: Character | null) => {
    setSelectedCharacter(character);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <header className="w-full text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-blue-800">PerspectiView</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform narratives into perspectives
        </p>
      </header>

      <section className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Input section */}
        {!analysisResult && (
          <TextInput onSubmit={handleSubmit} isProcessing={isProcessing} />
        )}
        
        {/* Analysis section */}
        {analysisResult && !isProcessing && (
          <div>
            <div className="flex flex-wrap justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">Analysis Results</h2>
              <button
                className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
                onClick={() => {
                  setAnalysisResult(null);
                  setSelectedCharacter(null);
                }}
              >
                Analyze Another Story
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {/* Timeline (full width) */}
              <div className="w-full">
                <Timeline 
                  events={analysisResult.events} 
                  characters={analysisResult.characters}
                  selectedCharacter={selectedCharacter}
                />
              </div>
              
              {/* Character list (full width) */}
              <div className="w-full mt-2">
                <CharacterList 
                  characters={analysisResult.characters} 
                  onSelectCharacter={handleSelectCharacter}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mt-4 p-6 bg-red-50 border border-red-300 text-red-700 rounded-md">
            <p className="font-medium mb-3">Error:</p>
            <p className="mb-4">{error}</p>
            <div className="text-sm bg-white p-4 rounded-md border border-red-100">
              <p className="font-medium mb-2">Troubleshooting Tips:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Make sure your API key is correctly set in the .env.local file</li>
                <li>Check if your internet connection is stable</li>
                <li>Try with a shorter text sample first</li>
                <li>Check the browser console for more detailed error information</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {isProcessing && (
          <div className="mt-4 p-8 bg-gray-50 rounded-md flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-700 mb-6"></div>
            <p className="text-gray-600 mb-2">Analyzing your story...</p>
            <p className="text-gray-400 text-sm">This may take a minute or two depending on the story length.</p>
          </div>
        )}
      </section>
      
      <footer className="text-center text-gray-500 text-sm mt-auto pt-8">
        <p>PerspectiView &copy; {new Date().getFullYear()} - Developed by <a href="https://danielhafezi.github.io/">Daniel Hafezi</a></p>
      </footer>
    </div>
  );
} 