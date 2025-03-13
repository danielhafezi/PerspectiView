# PerspectiView

![Project Overview](project_overview.gif)

PerspectiView is a web application that transforms third-person narratives into multiple first-person perspectives, helping users understand how different characters experience the same events in stories. Using Google's Gemini 2.0 Flash model for analysis, the application automatically identifies characters, generates perspective-based retellings, and creates visual timelines showing emotional and perceptual variations across characters.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or later)
- npm (v8 or later)

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/DanielHafezi/perspectiview.git
cd perspectiview
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory and add your Google Gemini API key:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- Text input for pasting short stories
- Automatic character identification
- Generation of character profiles
- Transformation of narratives into character perspectives
- Timeline visualization of story events
- Emotional analysis of character reactions
- Comparative analysis of different character perspectives

## Project Structure

- `/app`: Next.js application directory
  - `/api`: API routes for Gemini integration
  - `/components`: Reusable React components
  - `/lib`: Utility functions and types
  - `/styles`: Global styles and Tailwind configuration
  - `/types`: TypeScript type definitions

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Chart.js
- Google Gemini 2.0 Flash API 