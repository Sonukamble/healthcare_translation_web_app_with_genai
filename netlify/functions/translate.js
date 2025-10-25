import OpenAI from "openai";

// Initialize OpenAI client with server-side API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // No VITE_ prefix - this stays server-side
});

const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ru', name: 'Russian' },
    { code: 'pt', name: 'Portuguese' },
];

export const handler = async (event) => {
    // CORS headers for all responses
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        // Check if API key is available
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY environment variable is not set');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Server configuration error: API key not set. Please check Netlify environment variables.' 
                }),
            };
        }

        // Parse request body
        const { text, targetLanguageCode, sourceLanguageCode } = JSON.parse(event.body);

        // Validate inputs
        if (!text || !targetLanguageCode) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Missing required fields: text and targetLanguageCode' 
                }),
            };
        }

        const targetLanguage = languages.find(lang => lang.code === targetLanguageCode);
        if (!targetLanguage) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Unsupported target language' 
                }),
            };
        }

        // Get source language name if provided
        const sourceLanguage = sourceLanguageCode 
            ? languages.find(lang => lang.code === sourceLanguageCode)
            : null;

        // Build translation prompt
        let userPrompt;
        if (sourceLanguage) {
            userPrompt = `Translate the following text from ${sourceLanguage.name} to ${targetLanguage.name}. Provide only the translation:\n\n${text}`;
        } else {
            userPrompt = `Translate the following text to ${targetLanguage.name}. Auto-detect the source language and provide only the translation:\n\n${text}`;
        }

        console.log('Translation prompt:', userPrompt);

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            messages: [
                {
                    role: "system",
                    content: "You are a professional medical translation assistant. Translate the given text accurately to the target language while preserving its meaning and context."
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            max_tokens: 1500
        });

        const translatedText = response.choices[0].message.content || "";

        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                translatedText: translatedText.trim(),
                targetLanguage: targetLanguage.name,
                sourceLanguage: sourceLanguage ? sourceLanguage.name : "Auto-detected",
                targetLanguageCode: targetLanguage.code
            }),
        };

    } catch (error) {
        console.error('Translation API error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: error.message || 'Translation API error',
                error: error.toString()
            }),
        };
    }
};

