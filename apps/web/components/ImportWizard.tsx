'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

type ImportType = 'json' | 'pdf' | null;
type ImportMethod = 'url' | 'upload' | null;

const SUPPORTED_SYSTEMS = [
  "Dungeons & Dragons 5e",
  "Pathfinder 2e",
  "Starfinder",
  "Warhammer 40K",
  "Cyberpunk (2020 & Red)",
  "Vampire: The Masquerade",
  "Call of Cthulhu 7e",
  "Other / Generic System"
];

interface ImportWizardProps {
  onUploadSuccess: (data: any) => void;
  onUploadStart: () => void;
  onUploadError: (errorMessage: string) => void;
}

export default function ImportWizard({ onUploadSuccess, onUploadStart, onUploadError }: ImportWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [importType, setImportType] = useState<ImportType>(null);
  const [importMethod, setImportMethod] = useState<ImportMethod>(null);
  const [jsonText, setJsonText] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [requiresSystemSelection, setRequiresSystemSelection] = useState<boolean>(false);
  const [explicitSystem, setExplicitSystem] = useState<string>(SUPPORTED_SYSTEMS[0]);

  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetWizard = () => {
    setStep(1);
    setImportType(null);
    setImportMethod(null);
    setJsonText('');
    setPdfUrl('');
    setSelectedFile(null);
    setRequiresSystemSelection(false);
  };

  const submitPayload = async (currentSystemOverride?: string) => {
    onUploadStart();
    const systemToUse = currentSystemOverride || explicitSystem;

    const formData = new FormData();
    formData.append('type', importType || 'pdf');
    if (importType === 'json') {
      formData.append('method', 'json');
      formData.append('content', jsonText);
    } else {
      formData.append('method', importMethod || 'upload');
      if (importMethod === 'url') {
        formData.append('content', pdfUrl);
      } else if (selectedFile) {
        formData.append('file', selectedFile);
      }
    }

    if (requiresSystemSelection) {
      formData.append('explicitSystem', systemToUse);
    }

    try {
      const response = await fetch('/api/parse', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to parse the character sheet.');
      }
      
      const parsedData = await response.json();
      
      if (parsedData.requiresSystemSelection) {
        setRequiresSystemSelection(true);
        setStep(3); // Move to System Selection step
        onUploadError('Unknown system detected. Please explicitly select the TTRPG system.');
        return;
      }
      
      onUploadSuccess(parsedData);
    } catch (err: any) {
      onUploadError(err.message || 'An error occurred while communicating with the conversion engine.');
    }
  };

  const handleJsonSubmit = () => {
    if (!jsonText.trim()) return onUploadError('Please provide JSON payload.');
    submitPayload();
  };

  const handleUrlSubmit = () => {
    if (!pdfUrl.trim()) return onUploadError('Please provide a valid PDF URL.');
    submitPayload();
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      // Auto-submit on drop if we are ready
      submitPayload();
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      submitPayload();
    }
  };

  const renderStep1 = () => (
    <div className="wizard-step">
      <h2>Step 1: Select Import Type</h2>
      <div className="wizard-cards">
        <div className={`wizard-card ${importType === 'json' ? 'selected' : ''}`} onClick={() => setImportType('json')}>
          <h3>[ JSON ]</h3>
          <p>Raw JSON from D&D Beyond, Foundry, or Pathbuilder.</p>
        </div>
        <div className={`wizard-card ${importType === 'pdf' ? 'selected' : ''}`} onClick={() => setImportType('pdf')}>
          <h3>[ PDF ]</h3>
          <p>A standard PDF character sheet export.</p>
        </div>
      </div>
      
      {importType === 'json' && (
        <div className="json-input-container" style={{ marginTop: '20px' }}>
          <textarea 
            placeholder="Paste your raw JSON payload here..."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            style={{ width: '100%', height: '150px', background: '#222', color: '#fff', padding: '10px', border: '1px solid #444' }}
          />
          <button className="primary-btn" onClick={handleJsonSubmit} style={{ marginTop: '10px' }}>Continue</button>
        </div>
      )}

      {importType === 'pdf' && (
        <button className="primary-btn" onClick={() => setStep(2)} style={{ marginTop: '20px' }}>Continue to Method Selection</button>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="wizard-step">
      <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
      <h2>Step 2: Select Import Method</h2>
      <div className="wizard-cards">
        <div className={`wizard-card ${importMethod === 'url' ? 'selected' : ''}`} onClick={() => setImportMethod('url')}>
          <h3>[ URL ]</h3>
          <p>Provide a direct link to the PDF.</p>
        </div>
        <div className={`wizard-card ${importMethod === 'upload' ? 'selected' : ''}`} onClick={() => setImportMethod('upload')}>
          <h3>[ Upload ]</h3>
          <p>Drag & Drop a local file.</p>
        </div>
      </div>

      {importMethod === 'url' && (
        <div className="url-input-container" style={{ marginTop: '20px' }}>
          <input 
            type="url" 
            placeholder="https://example.com/character.pdf"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            style={{ width: '100%', padding: '10px', background: '#222', color: '#fff', border: '1px solid #444' }}
          />
          <button className="primary-btn" onClick={handleUrlSubmit} style={{ marginTop: '10px' }}>Continue</button>
        </div>
      )}

      {importMethod === 'upload' && (
        <div 
          className={`drop-zone ${isDragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ marginTop: '20px', padding: '40px', border: '2px dashed #666', textAlign: 'center', cursor: 'pointer' }}
        >
          <input 
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            accept=".pdf"
          />
          <p>{selectedFile ? selectedFile.name : 'Drag and drop your PDF here, or click to browse'}</p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="wizard-step">
      <h2>Step 3: System Detection Required</h2>
      <p style={{ color: '#ffb86c' }}>We could not auto-detect the TTRPG system from your payload. Please select it manually.</p>
      
      <select 
        value={explicitSystem} 
        onChange={(e) => setExplicitSystem(e.target.value)}
        style={{ width: '100%', padding: '10px', background: '#222', color: '#fff', border: '1px solid #444', marginTop: '15px' }}
      >
        {SUPPORTED_SYSTEMS.map(sys => <option key={sys} value={sys}>{sys}</option>)}
      </select>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="back-btn" onClick={resetWizard}>Cancel</button>
        <button className="primary-btn" onClick={() => submitPayload(explicitSystem)}>Retry Processing</button>
      </div>
    </div>
  );

  return (
    <div className="import-wizard-container">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
