# Healthcare Translation Web App

A real-time medical translation web application powered by OpenAI's GPT-4o-mini, featuring voice input and text-to-speech capabilities.

## Features

- 🎤 **Voice Input**: Record speech in multiple languages
- 🌍 **Multi-Language Translation**: Support for 10 languages (English, Spanish, French, German, Chinese, Japanese, Hindi, Arabic, Russian, Portuguese)
- 🔊 **Text-to-Speech**: Listen to translations in the target language
- 🏥 **Medical Focus**: Optimized for healthcare translation with context-aware AI
- 🔒 **Secure**: API keys are kept server-side using Netlify Functions

## Tech Stack

- **Frontend**: React 19 + Vite 7
- **UI Framework**: Material-UI (MUI)
- **AI Translation**: OpenAI GPT-4o-mini
- **Deployment**: Netlify with serverless functions
- **Speech**: Web Speech API (built-in browser support)

## Setup for Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd healthcare_translation_web_app_with_genai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   ```
   
   **IMPORTANT**: Do NOT use `VITE_` prefix! This keeps the API key server-side only.

4. **Get your OpenAI API key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

## Deployment to Netlify

### Step 1: Push to GitHub
Make sure your code is pushed to a GitHub repository.

### Step 2: Connect to Netlify
1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository

### Step 3: Configure Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions` (auto-detected)

### Step 4: Add Environment Variable
⚠️ **CRITICAL**: In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add the following variable:
   - **Key**: `OPENAI_API_KEY` (NO `VITE_` prefix!)
   - **Value**: Your OpenAI API key
   - **Scopes**: Select "All scopes"

### Step 5: Deploy
Click "Deploy site" and wait for the build to complete.

## Security Notes

✅ **What we fixed**:
- Moved OpenAI API calls from client-side to serverless functions
- API key is now stored server-side only (not bundled in JavaScript)
- Netlify secrets scanning will pass

❌ **Previous issue**:
- Using `VITE_OPENAI_API_KEY` exposed the key in the browser
- This caused Netlify deployment to fail with "Secrets scanning found secrets in build"

## Project Structure

```
├── netlify/
│   └── functions/
│       └── translate.js          # Serverless function for translations
├── src/
│   ├── api/
│   │   └── translateAPI.js       # Frontend API client
│   ├── components/
│   │   ├── Translater.jsx        # Translation UI component
│   │   └── VoiceRecorder.jsx     # Voice input component
│   ├── App.jsx
│   └── main.jsx
├── netlify.toml                  # Netlify configuration
└── package.json
```

## Available Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Chinese (zh)
- Japanese (ja)
- Hindi (hi)
- Arabic (ar)
- Russian (ru)
- Portuguese (pt)

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## License

This project is for educational and healthcare purposes.
