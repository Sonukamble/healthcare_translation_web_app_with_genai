import { VoiceRecorder } from './components/VoiceRecorder';
import { Translater } from './components/Translater';
import './App.css'
import { Container, Typography } from '@mui/material';
import { useState } from 'react';

function App() {

  const [transcript, setTranscript] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");

  const handleTranslate = (text, language) => {
    setTranscript(text);
    setSourceLanguage(language);
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: '40px' }}>
      <Typography variant="h4" component="h4" gutterBottom>
        Healthcare Translation app
      </Typography>
      <VoiceRecorder onTranslate={handleTranslate} />
      {transcript && (
        <Translater inputText={transcript} sourceLanguageCode={sourceLanguage} />
      )}
    </Container>
  )
}

export default App
