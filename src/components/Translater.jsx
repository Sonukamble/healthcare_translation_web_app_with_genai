import { Button, FormControl, Typography, CircularProgress } from '@mui/material';
import React from 'react'
import { getAvailableLanguages, translateText } from '../api/translateAPI';
import { Box, Paper, InputLabel, Select, MenuItem } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopIcon from '@mui/icons-material/Stop';

export const Translater = ({ inputText, sourceLanguageCode }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [targetLanguage, setTargetLanguage] = React.useState('');
  const [TranslatedText, setTranslatedText] = React.useState('');
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Map language codes to speech synthesis language codes
  const speechLanguageMap = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'zh': 'zh-CN',
    'ja': 'ja-JP',
    'hi': 'hi-IN',
    'ar': 'ar-SA',
    'ru': 'ru-RU',
    'pt': 'pt-PT',
  };

  // Map speech recognition codes (e.g., 'en-US') to simple language codes (e.g., 'en')
  const speechToSimpleLanguageMap = {
    'en-US': 'en',
    'es-ES': 'es',
    'es-MX': 'es',
    'fr-FR': 'fr',
    'de-DE': 'de',
    'zh-CN': 'zh',
    'ja-JP': 'ja',
    'hi-IN': 'hi',
    'ar-SA': 'ar',
    'ru-RU': 'ru',
    'pt-BR': 'pt',
    'pt-PT': 'pt',
  };

  // Load voices on component mount (needed for some browsers)
  React.useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      let voices = window.speechSynthesis.getVoices();

      // Some browsers load voices asynchronously
      if (voices.length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          voices = window.speechSynthesis.getVoices();
          console.log('Voices loaded:', voices.length);
        });
      } else {
        console.log('Voices already loaded:', voices.length);
      }
    }

    // Cleanup: cancel speech on unmount
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speaking when translated text changes
  React.useEffect(() => {
    if ('speechSynthesis' in window && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [TranslatedText]);

  const handleTranslate = async () => {
    if (!inputText || !targetLanguage) return;
    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    // Get source language from the speech recognition code
    const sourceLanguage = sourceLanguageCode
      ? speechToSimpleLanguageMap[sourceLanguageCode] || sourceLanguageCode.split('-')[0]
      : null;

    console.log('Source language code:', sourceLanguageCode);
    console.log('Mapped source language:', sourceLanguage);

    const result = await translateText(inputText, targetLanguage, sourceLanguage);
    if (result.success) {
      setTranslatedText(result.translatedText);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  }

  const handleTextToSpeech = () => {
    // Check browser support
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.');
      return;
    }

    if (!TranslatedText) {
      alert('No translated text to speak.');
      return;
    }

    // Stop if already speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(TranslatedText);

    // Get target language code
    const speechLang = speechLanguageMap[targetLanguage] || 'en-US';
    utterance.lang = speechLang;

    // Configure speech parameters
    utterance.rate = 0.9; // Speed (0.1 to 10)
    utterance.pitch = 1; // Pitch (0 to 2)
    utterance.volume = 1; // Volume (0 to 1)

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices);
    console.log('Target language:', speechLang);

    // Try to find a voice that matches the target language
    const matchingVoice = voices.find(voice => voice.lang.startsWith(speechLang.split('-')[0]));

    if (matchingVoice) {
      utterance.voice = matchingVoice;
      console.log('Selected voice:', matchingVoice.name, matchingVoice.lang);
    } else {
      console.log('No matching voice found, using default');
    }

    // Event handlers
    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      setError(`Speech error: ${event.error}`);
    };

    // Speak the text
    console.log('Starting speech synthesis...');
    window.speechSynthesis.speak(utterance);
  }
  const languages = getAvailableLanguages();

  // Get source language name for display
  const getSourceLanguageName = () => {
    if (!sourceLanguageCode) return null;
    const simpleLangCode = speechToSimpleLanguageMap[sourceLanguageCode] || sourceLanguageCode.split('-')[0];
    const langName = languages.find(lang => lang.code === simpleLangCode)?.name;
    return langName || sourceLanguageCode;
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Translation
      </Typography>

      {sourceLanguageCode && (
        <Box sx={{
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          marginBottom: '15px',
          border: '1px solid #2196f3'
        }}>
          <Typography variant="body2" color="primary">
            🎤 Source Language: <strong>{getSourceLanguageName()}</strong>
          </Typography>
        </Box>
      )}

      <Box mt={2}>
        <FormControl fullWidth>
          <InputLabel id="translation-input-label">Target Language</InputLabel>
          <Select
            labelId="translation-input-label"
            id="translation-input-label"
            value={targetLanguage}
            label="Target Language"
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>


      <Box mt={2} textAlign="center">
        <Button variant="contained" color="primary"
          disabled={isLoading || !inputText || !targetLanguage}
          onClick={handleTranslate}
          fullWidth>
          {isLoading ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Translating...
            </>
          ) : (
            targetLanguage ? `Translate to ${languages.find(lang => lang.code === targetLanguage)?.name}` : 'Select Language'
          )}
        </Button>

      </Box>

      {error && (
        <Box mt={2}>
          <Typography variant="body2" color="error">
            Error: {error}
          </Typography>
        </Box>
      )}

      {TranslatedText && (
        <Box mt={3} sx={{
          padding: '15px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Translated Text:
            </Typography>
            <Button
              variant="contained"
              color={isSpeaking ? 'error' : 'success'}
              size="small"
              onClick={handleTextToSpeech}
              startIcon={isSpeaking ? <StopIcon /> : <VolumeUpIcon />}
            >
              {isSpeaking ? 'Stop' : 'Speak'}
            </Button>
          </Box>
          <Typography variant="body1" color="textPrimary">
            {TranslatedText}
          </Typography>
        </Box>
      )}
    </Paper>
  )
};