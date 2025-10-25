import { Paper, Typography, Box, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import React, { useRef } from 'react'

export const VoiceRecorder = ({ onTranslate }) => {
    const [isRecording, setIsRecording] = React.useState(false);
    const [transcript, setTranscript] = React.useState("");
    const [inputLanguage, setInputLanguage] = React.useState('en-US');
    const recognitionRef = useRef(null);

    // Supported speech recognition languages
    const speechLanguages = [
        { code: 'en-US', name: 'English (US)' },
        { code: 'es-ES', name: 'Spanish (Spain)' },
        { code: 'es-MX', name: 'Spanish (Mexico)' },
        { code: 'fr-FR', name: 'French' },
        { code: 'de-DE', name: 'German' },
        { code: 'zh-CN', name: 'Chinese (Mandarin)' },
        { code: 'ja-JP', name: 'Japanese' },
        { code: 'hi-IN', name: 'Hindi' },
        { code: 'ar-SA', name: 'Arabic' },
        { code: 'ru-RU', name: 'Russian' },
        { code: 'pt-BR', name: 'Portuguese (Brazil)' },
        { code: 'pt-PT', name: 'Portuguese (Portugal)' },
    ];

    const startRecord = () => {
        // use the web app speech recognition api to start recording
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition API is not supported in this browser.");
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = inputLanguage;

        recognitionRef.current.onresult = (event) => {
            console.log(event);
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptChunk = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    setTranscript((prev) => prev + transcriptChunk + ' ');
                } else {
                    interimTranscript += transcriptChunk;
                }
            }
            console.log("Interim Transcript: ", interimTranscript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Speech recognition error", event);
            setIsRecording(false);
        }
        recognitionRef.current.onend = () => {
            setIsRecording(false);
            console.log("Speech recognition ended");
        }

        // START THE RECOGNITION!
        recognitionRef.current.start();
        setIsRecording(true);
        console.log("Speech recognition started");
    }

    const stopRecord = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    }

    const handleTranslate = () => {
        // Pass both transcript and selected language to parent
        if (transcript && onTranslate) {
            onTranslate(transcript, inputLanguage);
        }
    }

    return (
        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center', marginTop: '0px' }}>
            <Typography variant="h6">
                Input Voice
            </Typography>

            <Box mt={2}>
                <FormControl fullWidth sx={{ marginBottom: '15px' }}>
                    <InputLabel id="input-language-label">Voice Input Language</InputLabel>
                    <Select
                        labelId="input-language-label"
                        id="input-language-select"
                        value={inputLanguage}
                        label="Voice Input Language"
                        onChange={(e) => setInputLanguage(e.target.value)}
                        disabled={isRecording}
                    >
                        {speechLanguages.map((lang) => (
                            <MenuItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box mt={2}>
                <Button variant="contained" color="primary"
                    onClick={startRecord}
                    disabled={isRecording}>
                    {isRecording ? '🎤 Recording...' : 'Start Recording'}
                </Button>

                <Button variant="outlined" color="secondary" style={{ marginLeft: '10px' }}
                    onClick={stopRecord}
                    disabled={!isRecording}>
                    Stop Recording
                </Button>
            </Box>


            {transcript && (
                <Box mt={3} sx={{
                    padding: '15px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    textAlign: 'left'
                }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Transcript:
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                        {transcript}
                    </Typography>

                    <Box mt={2}>
                        <Button variant="contained" color="success"
                            onClick={handleTranslate}
                            style={{ marginRight: '10px' }}>
                            🌐 Translate
                        </Button>

                        <Button variant="outlined" color="secondary"
                            onClick={() => setTranscript("")}>
                            Clear Transcript
                        </Button>
                    </Box>

                </Box>
            )}

        </Paper>
    )
}
