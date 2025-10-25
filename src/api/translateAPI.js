// Available languages
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
        // Call the Netlify serverless function instead of OpenAI directly
        const response = await fetch('/.netlify/functions/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                targetLanguageCode,
                sourceLanguageCode
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Translation request failed');
        }

        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error("Translation API error:", error);
        return {
            success: false,
            message: error.message || "Translation API error. Please try again."
        };
    }

}

export const getAvailableLanguages = () => {
    return languages;
}