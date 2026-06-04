import { useState, useRef } from 'react';

export default function FileUpload({ onFileSelect }) {
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [fileError, setFileError] = useState(null);
    const fileInputRef = useRef(null);

    const validateFile = (f) => {
        if (f.size > 10 * 1024 * 1024) return 'File too large. Maximum size is 10MB.';
        if (!f.name.match(/\.(csv|xlsx)$/i)) return 'Please upload a CSV or Excel file.';
        return null;
    };

    const loadDemoData = () => {
        const demoCSV = `CustomerID,Age,Gender,MonthsActive,OrderCount,TotalSpend,Complain,Status
1,28,Male,14,8,4200,0,Active
2,35,Female,3,2,800,1,Churned
3,42,Male,22,15,9800,0,Active
4,24,Female,1,1,200,1,Churned
5,31,Male,18,12,6500,0,Active
6,29,Female,6,3,1200,0,Active
7,38,Male,2,1,300,1,Churned
8,45,Female,30,20,15000,0,Active
9,26,Male,4,2,600,1,Churned
10,33,Female,16,9,4800,0,Active
11,27,Male,8,5,2100,0,Active
12,41,Female,1,1,150,1,Churned
13,36,Male,24,18,11200,0,Active
14,30,Female,5,3,900,1,Churned
15,28,Male,12,7,3400,0,Active`;
        const blob = new Blob([demoCSV], { type: 'text/csv' });
        const demoFile = new File([blob], 'demo-data.csv', { type: 'text/csv' });
        setFileError(null);
        onFileSelect(demoFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const err = validateFile(droppedFile);
            if (err) { setFileError(err); setFile(null); return; }
            setFileError(null);
            setFile(droppedFile);
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const err = validateFile(selectedFile);
            if (err) { setFileError(err); setFile(null); return; }
            setFileError(null);
            setFile(selectedFile);
        }
    };

    const handleAnalyze = () => {
        if (file && onFileSelect) {
            onFileSelect(file);
        }
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    let borderStyle = '2px dashed rgba(255,255,255,0.2)';
    let bgStyle = 'transparent';

    if (file) {
        borderStyle = '2px solid #22c55e';
        bgStyle = 'rgba(34,197,94,0.05)';
    } else if (isDragOver) {
        borderStyle = '2px solid #3b82f6';
        bgStyle = 'rgba(59,130,246,0.1)';
    } else if (isHovered) {
        borderStyle = '2px dashed #3b82f6';
        bgStyle = 'rgba(59,130,246,0.05)';
    }

    return (
        <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '700px',
            margin: '0 auto',
            textAlign: 'center'
        }}>
            {/* TOP BADGE */}
            <div style={{ marginBottom: '16px' }}>
                <span style={{
                    background: 'rgba(59,130,246,0.2)',
                    border: '1px solid #3b82f6',
                    color: '#3b82f6',
                    borderRadius: '20px',
                    padding: '4px 16px',
                    fontSize: '12px',
                    display: 'inline-block'
                }}>
                    🆕 Business Analyzer
                </span>
            </div>

            {/* HEADING */}
            <h2 style={{
                fontSize: '28px',
                color: 'white',
                fontWeight: '700',
                margin: '0 0 12px 0'
            }}>
                Analyze Your Business Data
            </h2>

            {/* SUBHEADING */}
            <p style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                margin: '0 auto 32px auto',
                lineHeight: '1.5'
            }}>
                Upload your customer dataset and get AI-powered insights, churn predictions, and sales recommendations instantly
            </p>

            {/* UPLOAD ZONE */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                style={{
                    height: '200px',
                    width: '100%',
                    border: borderStyle,
                    backgroundColor: bgStyle,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '16px'
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                    accept=".csv,.xlsx"
                />
                {!file ? (
                    <>
                        <div style={{ fontSize: '40px' }}>📂</div>
                        <div style={{ color: 'white', fontSize: '16px' }}>Drop your CSV file here</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>or click to browse</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>.csv files up to 10MB</div>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: '40px' }}>✅</div>
                        <div style={{ color: 'white', fontSize: '16px', wordBreak: 'break-all', padding: '0 16px' }}>
                            {file.name}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                            {formatSize(file.size)}
                        </div>
                    </>
                )}
            </div>

            {/* VALIDATION ERROR PILL */}
            {fileError && (
                <div style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    color: '#f87171', borderRadius: '20px', padding: '6px 16px',
                    fontSize: '13px', marginBottom: '12px', display: 'inline-block'
                }}>
                    ❌ {fileError}
                </div>
            )}

            {/* DEMO DATA LINK */}
            {!file && (
                <div style={{ marginBottom: '16px' }}>
                    <span
                        onClick={loadDemoData}
                        style={{ color: '#3b82f6', cursor: 'pointer', fontSize: '13px' }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        Don't have a dataset? Try with sample data →
                    </span>
                </div>
            )}

            {/* AFTER FILE SELECTED */}
            {file && (
                <button
                    onClick={handleAnalyze}
                    style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 32px',
                        fontSize: '15px',
                        cursor: 'pointer',
                        marginTop: '16px',
                        marginBottom: '24px',
                        transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                    onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                >
                    Analyze This Data →
                </button>
            )}

            {/* BOTTOM NOTE */}
            <div style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: file ? '0' : '24px'
            }}>
                <div>✅ CSV  ✅ Excel (.xlsx)  ⚠️ PDF (limited)</div>
                <div>🔒 Only 50 rows sent to AI. Data stays in browser.</div>
            </div>
        </div>
    );
}
