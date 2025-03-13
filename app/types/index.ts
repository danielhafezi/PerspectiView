// Character types
export interface Character {
  name: string;
  role: 'major' | 'minor';
  confidenceScore: number;
  summary: string;
  profile?: CharacterProfile;
}

export interface CharacterProfile {
  personality: string[];
  motivations: string[];
  background: string;
  biases: string[];
  relationships: RelationshipMap;
  emotionalBaseline: EmotionData;
}

export interface RelationshipMap {
  [characterName: string]: {
    type: string;
    description: string;
    strength: number; // 1-10
  };
}

// Emotion types
export type EmotionType = 'anger' | 'joy' | 'fear' | 'sadness' | 'surprise' | 'disgust' | 'neutral';

export interface EmotionData {
  primary: EmotionType;
  secondary?: EmotionType;
  intensity: number; // 1-10
}

// Event types
export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  timePosition: number; // Position in the story timeline (0-100)
  characterPerspectives: {
    [characterName: string]: CharacterPerspective;
  };
}

export interface CharacterPerspective {
  firstPersonNarrative: string;
  emotion: EmotionData;
  thoughtsAboutOthers: {
    [characterName: string]: string;
  };
  perceptionAccuracy: number; // How accurately they perceive what's happening (0-100)
}

// Analysis result types
export interface StoryAnalysisResult {
  characters: Character[];
  events: StoryEvent[];
  relationshipGraph: {
    nodes: Character[];
    edges: {
      source: string;
      target: string;
      type: string;
      strength: number;
    }[];
  };
} 