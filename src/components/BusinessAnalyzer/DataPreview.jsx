import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function DataPreview({ file, onDataReady, onAnalyze, onBack }) {
    const [parsedData, setParsedData] = useState(null);
    const [error, setError] = useState(null);
    const [isParsing, setIsParsing] = useState(true);

    function detectColumns(columns, rows) {
        const col = (c) => c.toLowerCase();
        return {
            possibleId: columns.filter(c => col(c).includes('id') || col(c).includes('customer')),
            possibleTarget: columns.filter(c => 
                col(c).includes('churn') || col(c).includes('status') ||
                col(c).includes('cancel') || col(c).includes('active') ||
                col(c).includes('retain') || col(c).includes('leave')),
            possibleRevenue: columns.filter(c => 
                col(c).includes('revenue') || col(c).includes('sales') ||
                col(c).includes('amount') || col(c).includes('spend') ||
                col(c).includes('price') || col(c).includes('value') ||
                col(c).includes('order') || col(c).includes('purchase')),
            possibleDate: columns.filter(c => 
                col(c).includes('date') || col(c).includes('time') ||
                col(c).includes('month') || col(c).includes('year') ||
                col(c).includes('day')),
            possibleCategory: columns.filter(c => 
                !col(c).includes('id') && !col(c).includes('customer') &&
                rows[0] && isNaN(rows[0][c]) && String(rows[0][c]).length < 20),
            possibleNumeric: columns.filter(c => 
                rows[0] && !isNaN(rows[0][c]) && rows[0][c] !== ''),
            allColumns: columns,
            totalRows: rows.length,
            rawSample: rows.slice(0, 10)
        };
    }

    useEffect(() => {
        if (!file) {
            setError("No file provided");
            setIsParsing(false);
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            preview: 30,
            complete: (results) => {
                if (results.errors.length > 0 && results.data.length === 0) {
                    setError(results.errors[0].message);
                } else if (results.data.length < 1) {
                    setError('NO_ROWS');
                } else {
                    const columns = results.meta.fields || [];
                    const rows = results.data;
                    const detection = detectColumns(columns, rows);
                    setParsedData(detection);
                    if (onDataReady) {
                        onDataReady({ columns: detection, sample: rows, stats: { totalRows: rows.length } });
                    }
                }
                setIsParsing(false);
            },
            error: (err) => {
                setError(err.message);
                setIsParsing(false);
            }
        });
    }, [file, onDataReady]);

    if (isParsing) {
        return (
            <div style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--card-radius)', padding: '40px', maxWidth: '700px', margin: '0 auto', textAlign: 'center', color: 'var(--text-primary)'
            }}>
                Parsing file...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--card-radius)', padding: '40px', maxWidth: '700px', margin: '0 auto', textAlign: 'center'
            }}>
                <div style={{
                    background: 'var(--danger-bg)', border: '1px solid var(--danger)',
                    borderRadius: '8px', padding: '20px', color: 'var(--danger)', marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>❌ Could not read this file</div>
                    {error !== 'NO_ROWS' && (
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Error: {error}</p>
                    )}
                    <ul style={{ textAlign: 'left', fontSize: '13px', margin: '0 auto', display: 'inline-block', lineHeight: '1.8' }}>
                        <li>Header row at top</li>
                        <li>Comma-separated values</li>
                        <li>At least 5 rows of data</li>
                        <li>Columns should have clear names</li>
                    </ul>
                </div>
                <button onClick={onBack} style={{
                    background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)',
                    borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px'
                }}>
                    Try Another File
                </button>
            </div>
        );
    }

    if (!parsedData) return null;

    const { possibleTarget, possibleRevenue, possibleDate, possibleNumeric, allColumns, rawSample, totalRows } = parsedData;

    const getPillStyle = (colName) => {
        const baseStyle = { borderRadius: '4px', padding: '3px 10px', fontSize: '11px', margin: '4px', display: 'inline-block', fontWeight: 500, border: '1px solid transparent' };
        if (possibleRevenue.includes(colName)) return { ...baseStyle, background: 'var(--warning-bg)', color: 'var(--warning)' };
        if (possibleTarget.includes(colName)) return { ...baseStyle, background: 'var(--danger-bg)', color: 'var(--danger)' };
        if (possibleDate.includes(colName)) return { ...baseStyle, background: '#EEE8F5', color: '#7C5CBF' };
        if (possibleNumeric.includes(colName)) return { ...baseStyle, background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' };
        return { ...baseStyle, background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' };
    };

    return (
        <div style={{
            background: 'var(--bg-primary)', border: '1px solid var(--border)',
            borderRadius: 'var(--card-radius)', padding: '40px', maxWidth: '700px', margin: '0 auto'
        }}>
            {/* 1. SUCCESS BAR */}
            <div className="animate-ready animate-card" style={{
                background: 'var(--success-bg)', border: '1px solid var(--success)',
                borderRadius: '8px', padding: '12px 20px', color: 'var(--success)', fontWeight: '600', marginBottom: '24px', fontSize: '15px'
            }}>
                ✅ {totalRows} rows × {allColumns.length} columns detected (showing preview)
            </div>

            {/* 2. COLUMN PILLS */}
            <div style={{ marginBottom: '24px' }}>
                <div className="animate-ready animate-heading" style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Detected Columns:</div>
                <div className="animate-ready animate-card" style={{ display: 'flex', flexWrap: 'wrap', margin: '-4px' }}>
                    {allColumns.map(col => (
                        <span key={col} style={getPillStyle(col)}>{col}</span>
                    ))}
                </div>
            </div>

            {/* 3. PREVIEW TABLE */}
            <div style={{ marginBottom: '24px' }}>
                <div className="animate-ready animate-heading" style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Data Preview (first 5 rows):</div>
                <div className="animate-ready animate-card" style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-surface-2)' }}>
                                {allColumns.map(col => (
                                    <th key={col} style={{ color: 'var(--text-primary)', padding: '10px', fontSize: '12px', textAlign: 'left', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rawSample.slice(0, 5).map((row, i) => (
                                <tr key={i} style={{ background: i % 2 !== 0 ? 'var(--bg-surface)' : 'var(--bg-surface-2)', borderBottom: '1px solid var(--border)' }}>
                                    {allColumns.map(col => (
                                        <td key={`${i}-${col}`} style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {row[col] !== null && row[col] !== undefined ? String(row[col]) : ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. DETECTION NOTICE */}
            <div className="animate-ready animate-card" style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '16px', marginBottom: '32px'
            }}>
                <div style={{ color: 'var(--text-primary)', fontSize: '14px', margin: '4px 0' }}>🎯 <span style={{ color: 'var(--text-secondary)' }}>Dataset Type:</span> Customer behavioral data</div>
                <div style={{ color: 'var(--text-primary)', fontSize: '14px', margin: '4px 0' }}>📊 <span style={{ color: 'var(--text-secondary)' }}>Target column found:</span> {possibleTarget.length > 0 ? possibleTarget.join(', ') : 'not detected'}</div>
                <div style={{ color: 'var(--text-primary)', fontSize: '14px', margin: '4px 0' }}>💰 <span style={{ color: 'var(--text-secondary)' }}>Revenue columns:</span> {possibleRevenue.length > 0 ? possibleRevenue.join(', ') : 'not found'}</div>
            </div>

            {/* 5. TWO BUTTONS */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button className="animate-ready animate-card" onClick={onBack} style={{
                    background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--card-radius)', padding: '12px 24px', cursor: 'pointer', fontSize: '15px', flex: '0 1 auto',
                    transition: 'background 0.2s ease', fontWeight: 500
                }} onMouseEnter={(e) => e.target.style.background = 'var(--bg-surface-2)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                    ← Back
                </button>
                <button className="animate-ready animate-card" onClick={onAnalyze} style={{
                    background: 'var(--accent)', color: 'white', border: 'none',
                    borderRadius: 'var(--card-radius)', padding: '12px 32px', cursor: 'pointer', fontSize: '15px', flex: '0 1 auto',
                    fontWeight: '600', transition: 'background 0.2s ease'
                }} onMouseEnter={(e) => e.target.style.background = 'var(--accent-hover)'} onMouseLeave={(e) => e.target.style.background = 'var(--accent)'}>
                    Generate AI Insights →
                </button>
            </div>
        </div>
    );
}
