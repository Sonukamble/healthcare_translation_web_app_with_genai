import OpenAI from "openai";

// Lazy initialization - only create client when needed
let client = null;

const getClient = () => {
    if (!client) {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        
        if (!apiKey) {
            throw new Error("OpenAI API key is missing. Please create a .env file with VITE_OPENAI_API_KEY");
        }
        
        client = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true // Required for client-side usage
        });
    }
    return client;
};

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
]

export const translateText = async (text, targetLanguageCode, sourceLanguageCode = null) => {
    try {
        const targetLanguage = languages.find(lang => lang.code === targetLanguageCode);
        if (!targetLanguage) {
            throw new Error("Unsupported target language");
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

        // Translate using OpenAI
        const openaiClient = getClient();
        const response = await openaiClient.chat.completions.create({
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

        let translatedText = response.choices[0].message.content || ""

        return {
            success: true,
            translatedText: translatedText.trim(),
            targetLanguage: targetLanguage.name,
            sourceLanguage: sourceLanguage ? sourceLanguage.name : "Auto-detected",
            targetLanguageCode: targetLanguage.code
        }
    }
    catch (error) {
        console.error("Translation API error:", error);
        return {
            success: false,
            message: error.message || "Translation API error. Please check your API key and try again."
        };
    }

}

export const getAvailableLanguages = () => {
    return languages;
}