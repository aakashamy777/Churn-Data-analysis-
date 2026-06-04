import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DataPreview from './DataPreview';
import InsightsDashboard from './InsightsDashboard';

const STEPS = ['Upload', 'Preview', 'Analyzing', 'Results'];

function StepIndicator({ currentStep }) {
    const stepIndex = { upload: 0, preview: 1, analyzing: 2, results: 3 };
    const active = stepIndex[currentStep] ?? 0;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0', marginBottom: '40px' }}>
            {STEPS.map((label, i) => {
                const isCompleted = i < active;
                const isActive = i === active;

                const circleStyle = {
                    width: '32px', height: '32px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700', flexShrink: 0,
                    background: isCompleted ? '#22c55e' : isActive ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    color: isCompleted || isActive ? 'white' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.3s ease'
                };

                const connectorStyle = {
                    width: '60px', height: '2px', flexShrink: 0,
                    background: isCompleted ? '#22c55e' : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.3s ease'
                };

                return (
                    <React.Fragment key={label}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={circleStyle}>{isCompleted ? '✓' : i + 1}</div>
                            <span style={{ fontSize: '11px', color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                                {label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{ ...connectorStyle, marginBottom: '16px' }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default function BusinessAnalyzer() {
    const [step, setStep] = useState('upload');
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [result, setResult] = useState(null);

    const handleStartOver = () => {
        setStep('upload');
        setFile(null);
        setParsedData(null);
        setResult(null);
    };

    return (
        <section id="analyzer" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', minHeight: '40px' }}>
                {step !== 'upload' && (
                    <button
                        onClick={handleStartOver}
                        style={{
                            position: 'absolute', top: '0', right: '0',
                            background: 'transparent', color: 'rgba(255,255,255,0.7)',
                            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                            padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.05)';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'rgba(255,255,255,0.7)';
                        }}
                    >
                        ← Start Over
                    </button>
                )}
            </div>

            {/* Step Indicator */}
            <StepIndicator currentStep={step} />

            {/* Step Renders */}
            {step === 'upload' && (
                <FileUpload onFileSelect={(f) => {
                    setFile(f);
                    setStep('preview');
                }} />
            )}

            {step === 'preview' && (
                <DataPreview
                    file={file}
                    onDataReady={(d) => setParsedData(d)}
                    onAnalyze={() => setStep('analyzing')}
                    onBack={() => setStep('upload')}
                />
            )}

            {step === 'analyzing' && (
                <InsightsDashboard
                    dataObject={parsedData}
                    onComplete={(r) => {
                        setResult(r);
                        setStep('results');
                    }}
                />
            )}

            {step === 'results' && (
                <InsightsDashboard
                    dataObject={parsedData}
                    preloadedResult={result}
                />
            )}
        </section>
    );
}
