import { Paper, Typography, Box, Button } from '@mui/material'
import React, { useRef } from 'react'

export const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = React.useState(false);
    const [transcript, setTranscript] = React.useState("");
    const recognitionRef = useRef(null);

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
        recognitionRef.current.lang = 'en-US';

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



    return (
        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center', marginTop: '0px' }}>
            <Typography variant="h6">
                Input Voice
            </Typography>

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

                    <Button variant="outlined" color="secondary" style={{ marginTop: '10px' }}
                        onClick={() => setTranscript("")}>
                        Clear Transcript
                    </Button>
                </Box>
            )}

        </Paper>
    )
}
