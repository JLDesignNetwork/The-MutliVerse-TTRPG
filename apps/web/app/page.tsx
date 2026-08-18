'use client';

import React, { useState } from 'react';
import ImportWizard from '../components/ImportWizard';
import ReviewEditor from '../components/ReviewEditor';
import type { MultiverseCharacter } from '../types/character';

export default function Home() {
  const [parsedCharacter, setParsedCharacter] = useState<MultiverseCharacter | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUploadStart = () => {
    setIsProcessing(true);
    setErrorMsg(null);
  };

  const handleUploadSuccess = (data: MultiverseCharacter) => {
    setIsProcessing(false);
    setParsedCharacter(data);
  };

  const handleUploadError = (msg: string) => {
    setIsProcessing(false);
    setErrorMsg(msg);
  };

  const handleComplete = () => {
    setParsedCharacter(null);
  };

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>Multiverse Converter</h1>
        <p>Port any character into the Multiverse TTRPG</p>
      </header>
      
      {errorMsg && (
        <div className="error-banner">
          {errorMsg}
        </div>
      )}

      {!parsedCharacter ? (
        <div className="upload-view">
          <ImportWizard 
            onUploadStart={handleUploadStart} 
            onUploadSuccess={handleUploadSuccess} 
            onUploadError={handleUploadError} 
          />
          {isProcessing && <div className="processing-loader">Processing via Gemini AI...</div>}
        </div>
      ) : (
        <ReviewEditor 
          initialData={parsedCharacter} 
          onCancel={() => setParsedCharacter(null)} 
          onComplete={handleComplete} 
        />
      )}
    </main>
  );
}
