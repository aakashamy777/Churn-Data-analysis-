// ─── Model Performance Dashboard ─────────────────────────────────────────────

const METRIC_CARDS = [
    { value: '99.63%', label: 'ROC-AUC', color: 'var(--accent)', glow: 'var(--shadow-md)', icon: '📈' },
    { value: '91.22%', label: 'F1 Score', color: 'var(--success)', glow: 'var(--shadow-md)', icon: '🎯' },
    { value: '96.80%', label: 'Accuracy', color: 'var(--accent)', glow: 'var(--shadow-md)', icon: '✅' },
    { value: '0.40', label: 'Optimal Threshold', color: 'var(--warning)', glow: 'var(--shadow-md)', icon: '⚖️' },
]

const MODEL_TABLE = [
    { model: 'Logistic Regression', auc: '82.94%', f1: '~71%', accuracy: '~85%', best: false },
    { model: 'Random Forest', auc: '99.63%', f1: '97.14%', accuracy: '99.02%', best: true },
    { model: 'XGBoost (Baseline)', auc: '99.56%', f1: '97.14%', accuracy: '99.02%', best: false },
    { model: 'XGBoost (Tuned)', auc: '99.62%', f1: '91.22%', accuracy: '96.80%', best: false },
]

function MetricCard({ card }) {
    return (
        <div
            className="animate-ready animate-card"
            style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--card-radius)',
                padding: 'var(--card-padding)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center',
                transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.borderColor = 'var(--border-strong)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.borderColor = 'var(--border)'
            }}
        >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <div
                className="animate-ready animate-stat"
                style={{
                    fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.25rem',
                }}
            >
                {card.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.label}
            </div>
        </div>
    )
}

export default function ModelDashboard() {
    return (
        <section
            id="models"
            style={{ background: 'var(--bg-primary)' }}
        >
            <div style={{ 
              maxWidth: 'var(--max-width)', 
              margin: '0 auto', 
              padding: 'var(--section-padding)'
            }}>
                <div
                    className="animate-ready animate-label"
                    style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        marginBottom: '12px'
                    }}
                >
                    Evaluation Results
                </div>
                
                <h2
                    className="animate-ready animate-heading"
                    style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        marginBottom: '8px'
                    }}
                >
                    Model Performance
                </h2>
                
                <p style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    maxWidth: '480px',
                    marginBottom: '48px'
                }}>
                    Rigorous evaluation across multiple metrics
                </p>

                {/* 2-column layout */}
                <div
                    className="models-layout"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.6fr',
                        gap: '1.5rem',
                        alignItems: 'start',
                    }}
                >
                {/* LEFT — Metric Cards 2x2 */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                    }}
                >
                    {METRIC_CARDS.map((card) => (
                        <MetricCard key={card.label} card={card} />
                    ))}
                </div>

                {/* RIGHT — Table + Callout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Table */}
                    <div
                        className="animate-ready animate-card"
                        style={{
                            background: 'var(--bg-surface)',
                            borderRadius: 'var(--card-radius)',
                            padding: '1.5rem',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: 'transparent' }}>
                                    {['Model', 'AUC', 'F1 Score', 'Accuracy'].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: '0.875rem 1rem',
                                                textAlign: h === 'Model' ? 'left' : 'center',
                                                color: 'var(--text-muted)',
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                borderBottom: '1px solid var(--border)',
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MODEL_TABLE.map((row, i) => (
                                    <tr
                                        key={row.model}
                                        style={{
                                            background: row.best ? 'var(--bg-surface-2)' : 'transparent',
                                            borderBottom: i < MODEL_TABLE.length - 1 ? '1px solid var(--border)' : 'none',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => { if (!row.best) e.currentTarget.style.background = 'var(--bg-primary)' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = row.best ? 'var(--bg-surface-2)' : 'transparent' }}
                                    >
                                        <td
                                            style={{
                                                padding: '0.875rem 1rem',
                                                color: row.best ? 'var(--accent)' : 'var(--text-primary)',
                                                fontWeight: row.best ? 700 : 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                            }}
                                        >
                                            {row.best && (
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: 'var(--accent)',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            )}
                                            {row.model}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: row.best ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: row.best ? 700 : 400 }}>
                                            {row.auc}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: row.best ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: row.best ? 700 : 400 }}>
                                            {row.f1}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: row.best ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: row.best ? 700 : 400 }}>
                                            {row.accuracy}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Why RF Won callout */}
                    <div
                        className="animate-ready animate-card"
                        style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--card-radius)',
                            padding: 'var(--card-padding)',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    >
                        <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🏆</span>
                        <div>
                            <p
                                style={{
                                    margin: '0 0 0.4rem',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    color: 'var(--accent)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Why Random Forest Won
                            </p>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Achieved highest AUC of <strong style={{ color: 'var(--text-primary)' }}>99.63%</strong> with excellent cross-validation
                                stability (<strong style={{ color: 'var(--text-primary)' }}>σ &lt; 0.002</strong>), making it the most reliable model for
                                production deployment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            <style>{`
        @media (max-width: 768px) {
          .models-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    )
}
