'use client';

import { useState, useRef, useEffect } from 'react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  isProcessing?: boolean;
}

// Sample story for users to try
const SAMPLE_STORY = `The ancient clock tower stood like a sentinel above the town square. Rowan, a scribe obsessed with the arcane relic beneath the clock tower, had dedicated his life to studying its mysteries. The artifact, rumored to possess untold powers, had captivated his mind for decades, driving a thirst for knowledge and pushing him to extremes.

Leira, Rowan's sister, watched his descent into obsession with growing concern. She was the first one to hear the rumors about her brother's expedition into the catacombs, primarily motivated by concern for his wellbeing. When she received a letter from him asking for help, she didn't hesitate to join the search party.

Jayar was a weary soldier seeking a way to replenish his funds. He'd been down on his luck, taking on whatever mercenary job he could find. When he heard about the lucrative treasure hunt that Rowan was organizing, he joined Rowan's party for the money and stayed because he became intrigued by the relationship developing along with Leira.

Elin, a street urchin who accidentally finds Rowan's papers, unwittingly takes a vital piece of it. Curiosity leads him to follow the expedition, and they fall into the darkness during the collapse.`;

export default function TextInput({ onSubmit, isProcessing = false }: TextInputProps) {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Calculate word count (just for information)
  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [text]);
  
  const handleSubmit = () => {
    if (!text.trim() || isProcessing) {
      return;
    }
    
    onSubmit(text);
  };
  
  const loadSampleStory = () => {
    setText(SAMPLE_STORY);
  };
  
  return (
    <div className="bg-white rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Enter your story</h2>
        <button
          className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
          onClick={loadSampleStory}
          disabled={isProcessing}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Load Sample Story
        </button>
      </div>
      
      <div className="mb-6">
        <textarea
          ref={textareaRef}
          className="w-full h-64 p-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent narrative-text shadow-inner bg-gray-50"
          placeholder="Paste your third-person narrative here (or click 'Load Sample Story' to try a demo)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className={`font-medium ${wordCount > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
            {wordCount} words
          </span>
          <span className="text-gray-400 ml-2">
            (Recommended: 100-3000 words)
          </span>
        </div>
        
        <button
          className={`px-6 py-2 rounded-md transition-colors flex items-center ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : text.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          type="button"
          onClick={handleSubmit}
          disabled={isProcessing || !text.trim()}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>Analyze Story</>
          )}
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm text-blue-800 border border-blue-100">
        <p className="font-medium">How it works:</p>
        <ol className="list-decimal ml-5 mt-2 space-y-1">
          <li>Enter or paste a third-person narrative in the text area above</li>
          <li>Click "Analyze Story" to process the text</li>
          <li>The system will identify characters and extract story events</li>
          <li>Explore different character perspectives using the timeline</li>
        </ol>
      </div>
    </div>
  );
} 