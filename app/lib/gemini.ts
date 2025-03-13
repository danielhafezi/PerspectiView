import { GoogleGenerativeAI } from '@google/generative-ai';
import { Character, StoryEvent, StoryAnalysisResult } from '../types';

// Initialize the Gemini API client
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Helper function to create and get the Gemini model
const getGeminiModel = () => {
  if (!API_KEY) {
    console.error('Gemini API key is not configured');
    throw new Error('API key is missing. Please check your .env.local file.');
  }
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  } catch (error) {
    console.error('Error initializing Gemini model:', error);
    throw new Error('Failed to initialize Gemini model. Please check your API key.');
  }
};

// Function to identify characters in a story
export async function identifyCharacters(storyText: string): Promise<Character[]> {
  try {
    const model = getGeminiModel();
    
    const prompt = `
      Analyze the following story and identify all characters. For each character, provide:
      1. Name
      2. Role (major or minor)
      3. Confidence score (0-100)
      4. Brief summary of their role in the story
      
      Format your response as a JSON array of character objects.
      
      Story:
      ${storyText}
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Character identification response:', text);
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
    if (!jsonMatch) {
      console.error('Failed to parse character data from response:', text);
      throw new Error('Failed to parse character data from Gemini response');
    }
    
    return JSON.parse(jsonMatch[0]) as Character[];
  } catch (error) {
    console.error('Error identifying characters:', error);
    throw new Error('Failed to identify characters in the story. ' + (error instanceof Error ? error.message : ''));
  }
}

// Function to generate character profiles
export async function generateCharacterProfiles(
  storyText: string, 
  characters: Character[]
): Promise<Character[]> {
  try {
    const model = getGeminiModel();
    const updatedCharacters = [...characters];
    
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      
      const prompt = `
        Analyze the character "${character.name}" in the following story. Create a detailed profile including:
        
        1. Personality traits (list of 3-5 strings)
        2. Core motivations (list of 2-4 strings)
        3. Background and history (paragraph)
        4. Biases and worldview (list of 2-4 strings)
        5. Emotional baseline (primary emotion from: anger, joy, fear, sadness, surprise, disgust, neutral; optional secondary emotion, intensity 1-10)
        
        You MUST format your response as a valid JSON object with the following structure:
        {
          "personality": ["trait1", "trait2", ...],
          "motivations": ["motivation1", "motivation2", ...],
          "background": "Character's background story...",
          "biases": ["bias1", "bias2", ...],
          "emotionalBaseline": {
            "primary": "emotion",
            "secondary": "emotion" (optional),
            "intensity": number
          },
          "relationships": {} (leave empty for now)
        }
        
        Do not include any explanations, only return the JSON object.
        
        Story:
        ${storyText}
      `;
      
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`Profile for ${character.name}:`, text);
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{.*\}/s);
        if (!jsonMatch) {
          console.error(`Failed to parse profile data for ${character.name}:`, text);
          // Create a default profile if parsing fails
          updatedCharacters[i] = {
            ...character,
            profile: {
              personality: ["Determined", "Practical", "Reserved"],
              motivations: ["Seeking answers", "Personal growth"],
              background: "Background details not available",
              biases: ["Cautious of strangers", "Values experience over theory"],
              emotionalBaseline: {
                primary: "neutral",
                intensity: 5
              },
              relationships: {}
            }
          };
          continue;
        }
        
        const profile = JSON.parse(jsonMatch[0]);
        updatedCharacters[i] = {
          ...character,
          profile
        };
      } catch (error) {
        console.error(`Error generating profile for ${character.name}:`, error);
        // Create a default profile if generation fails
        updatedCharacters[i] = {
          ...character,
          profile: {
            personality: ["Adaptable", "Resourceful", "Thoughtful"],
            motivations: ["Finding purpose", "Overcoming obstacles"],
            background: "Background information unavailable due to processing error",
            biases: ["Favors familiar paths", "Skeptical of easy solutions"],
            emotionalBaseline: {
              primary: "neutral",
              intensity: 5
            },
            relationships: {}
          }
        };
      }
    }
    
    return updatedCharacters;
  } catch (error) {
    console.error('Error generating character profiles:', error);
    throw new Error('Failed to generate character profiles. ' + (error instanceof Error ? error.message : ''));
  }
}

// Function to extract key events from a story
export async function extractStoryEvents(
  storyText: string,
  characters: Character[]
): Promise<StoryEvent[]> {
  const model = getGeminiModel();
  
  const prompt = `
    Analyze the following story and extract 5-10 key events in chronological order. For each event, provide:
    
    1. A brief title
    2. A description of what happens
    3. A relative time position (0-100, where 0 is the start and 100 is the end)
    
    Format your response as a JSON array of event objects.
    
    Story:
    ${storyText}
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
    if (!jsonMatch) {
      throw new Error('Failed to parse event data from Gemini response');
    }
    
    const events = JSON.parse(jsonMatch[0]) as Partial<StoryEvent>[];
    
    // Create complete event objects with character perspectives
    return events.map((event, index) => ({
      id: `event-${index}`,
      title: event.title || `Event ${index + 1}`,
      description: event.description || '',
      timePosition: event.timePosition || index * (100 / events.length),
      characterPerspectives: {}
    }));
  } catch (error) {
    console.error('Error extracting story events:', error);
    throw new Error('Failed to extract key events from the story');
  }
}

// Function to generate character perspectives for events
export async function generatePerspectives(
  storyText: string,
  characters: Character[],
  events: StoryEvent[]
): Promise<StoryEvent[]> {
  const model = getGeminiModel();
  const updatedEvents = [...events];
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    
    for (const character of characters) {
      const prompt = `
        Event: "${event.title}" - ${event.description}
        
        Rewrite this event from the first-person perspective of ${character.name}. Consider their personality traits, motivations, and biases.
        
        You MUST format your response as a valid JSON object with this exact structure:
        {
          "firstPersonNarrative": "Detailed first-person account...",
          "emotion": {
            "primary": "emotion", (must be one of: anger, joy, fear, sadness, surprise, disgust, neutral)
            "secondary": "emotion", (optional, must be one of: anger, joy, fear, sadness, surprise, disgust, neutral)
            "intensity": number (1-10)
          },
          "thoughtsAboutOthers": {
            "Character1": "Thoughts about Character1",
            "Character2": "Thoughts about Character2"
          },
          "perceptionAccuracy": number (0-100)
        }
        
        Do not include any explanations, only return the JSON object.
        
        Story context:
        ${storyText}
      `;
      
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{.*\}/s);
        if (!jsonMatch) {
          console.error(`Failed to parse perspective data for character ${character.name} on event ${event.title}`);
          // Create a default perspective if parsing fails
          if (!updatedEvents[i].characterPerspectives) {
            updatedEvents[i].characterPerspectives = {};
          }
          
          updatedEvents[i].characterPerspectives[character.name] = {
            firstPersonNarrative: `I witnessed the event unfold before me. ${event.description}`,
            emotion: {
              primary: "neutral",
              intensity: 5
            },
            thoughtsAboutOthers: {},
            perceptionAccuracy: 70
          };
          continue;
        }
        
        const perspective = JSON.parse(jsonMatch[0]);
        
        if (!updatedEvents[i].characterPerspectives) {
          updatedEvents[i].characterPerspectives = {};
        }
        
        updatedEvents[i].characterPerspectives[character.name] = perspective;
      } catch (error) {
        console.error(`Error generating perspective for ${character.name} on event ${event.title}:`, error);
        // Create a default perspective if generation fails
        if (!updatedEvents[i].characterPerspectives) {
          updatedEvents[i].characterPerspectives = {};
        }
        
        updatedEvents[i].characterPerspectives[character.name] = {
          firstPersonNarrative: `From my perspective, I observed the following: ${event.description}`,
          emotion: {
            primary: "neutral",
            intensity: 5
          },
          thoughtsAboutOthers: {},
          perceptionAccuracy: 65
        };
      }
    }
  }
  
  return updatedEvents;
}

// Main function to analyze a story
export async function analyzeStory(storyText: string): Promise<StoryAnalysisResult> {
  try {
    console.log('Starting story analysis...');
    
    // Step 1: Identify characters
    console.log('Step 1: Identifying characters...');
    const characters = await identifyCharacters(storyText);
    console.log('Characters identified:', characters.length);
    
    // Step 2: Generate character profiles
    console.log('Step 2: Generating character profiles...');
    const charactersWithProfiles = await generateCharacterProfiles(storyText, characters);
    console.log('Character profiles generated');
    
    // Step 3: Extract key events
    console.log('Step 3: Extracting story events...');
    const events = await extractStoryEvents(storyText, charactersWithProfiles);
    console.log('Events extracted:', events.length);
    
    // Step 4: Generate character perspectives for each event
    console.log('Step 4: Generating character perspectives...');
    const eventsWithPerspectives = await generatePerspectives(
      storyText,
      charactersWithProfiles,
      events
    );
    console.log('Perspectives generated');
    
    // Step 5: Create relationship graph
    console.log('Step 5: Creating relationship graph...');
    const relationshipGraph = {
      nodes: charactersWithProfiles,
      edges: [] as { source: string; target: string; type: string; strength: number }[]
    };
    
    // Build edges from character profiles
    for (const character of charactersWithProfiles) {
      if (character.profile?.relationships) {
        for (const [targetName, relationship] of Object.entries(character.profile.relationships)) {
          relationshipGraph.edges.push({
            source: character.name,
            target: targetName,
            type: relationship.type,
            strength: relationship.strength
          });
        }
      }
    }
    
    console.log('Analysis complete!');
    return {
      characters: charactersWithProfiles,
      events: eventsWithPerspectives,
      relationshipGraph
    };
  } catch (error) {
    console.error('Error analyzing story:', error);
    throw new Error('Failed to analyze story: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
} 