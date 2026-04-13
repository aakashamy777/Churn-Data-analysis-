// ─── Model Performance Dashboard ─────────────────────────────────────────────

const METRIC_CARDS = [
    { value: '99.63%', label: 'ROC-AUC', color: '#3b82f6', glow: 'rgba(59,130,246,0.2)', icon: '📈' },
    { value: '91.22%', label: 'F1 Score', color: '#22c55e', glow: 'rgba(34,197,94,0.2)', icon: '🎯' },
    { value: '96.80%', label: 'Accuracy', color: '#3b82f6', glow: 'rgba(59,130,246,0.2)', icon: '✅' },
    { value: '0.40', label: 'Optimal Threshold', color: '#fbbf24', glow: 'rgba(251,191,36,0.2)', icon: '⚖️' },
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
            style={{
                background: '#1e293b',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: `1px solid ${card.color}33`,
                boxShadow: `0 0 20px ${card.glow}`,
                textAlign: 'center',
                transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `0 0 30px ${card.glow}`
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = `0 0 20px ${card.glow}`
            }}
        >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <div
                style={{
                    fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                    fontWeight: 800,
                    color: card.color,
                    letterSpacing: '-0.02em',
                    marginBottom: '0.25rem',
                }}
            >
                {card.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.label}
            </div>
        </div>
    )
}

export default function ModelDashboard() {
    return (
        <section
            id="models"
            style={{
                padding: '5rem 1.5rem',
                maxWidth: '1200px',
                margin: '0 auto',
            }}
        >
            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span
                    style={{
                        display: 'inline-block',
                        padding: '0.35rem 1rem',
                        background: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#22c55e',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                    }}
                >
                    Evaluation Results
                </span>
                <h2
                    style={{
                        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                        fontWeight: 800,
                        color: '#f1f5f9',
                        margin: '0 0 0.75rem',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Model Performance
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
                    Rigorous evaluation across multiple metrics
                </p>
            </div>

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
                        style={{
                            background: '#1e293b',
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            border: '1px solid rgba(51,65,85,0.6)',
                        }}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ background: '#0f172a' }}>
                                    {['Model', 'AUC', 'F1 Score', 'Accuracy'].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: '0.875rem 1rem',
                                                textAlign: h === 'Model' ? 'left' : 'center',
                                                color: '#94a3b8',
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                borderBottom: '1px solid #334155',
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
                                            background: row.best ? 'rgba(59,130,246,0.1)' : 'transparent',
                                            borderBottom: i < MODEL_TABLE.length - 1 ? '1px solid #1e293b' : 'none',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => { if (!row.best) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = row.best ? 'rgba(59,130,246,0.1)' : 'transparent' }}
                                    >
                                        <td
                                            style={{
                                                padding: '0.875rem 1rem',
                                                color: row.best ? '#60a5fa' : '#f1f5f9',
                                                fontWeight: row.best ? 700 : 400,
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
                                                        background: '#3b82f6',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            )}
                                            {row.model}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: row.best ? '#22c55e' : '#94a3b8', fontWeight: row.best ? 700 : 400 }}>
                                            {row.auc}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: row.best ? '#22c55e' : '#94a3b8', fontWeight: row.best ? 700 : 400 }}>
                                            {row.f1}
                                        </td>
                                        <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: row.best ? '#22c55e' : '#94a3b8', fontWeight: row.best ? 700 : 400 }}>
                                            {row.accuracy}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Why RF Won callout */}
                    <div
                        style={{
                            background: 'rgba(59,130,246,0.08)',
                            border: '1px solid rgba(59,130,246,0.3)',
                            borderRadius: '0.75rem',
                            padding: '1.25rem 1.5rem',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start',
                        }}
                    >
                        <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🏆</span>
                        <div>
                            <p
                                style={{
                                    margin: '0 0 0.4rem',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    color: '#60a5fa',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Why Random Forest Won
                            </p>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                                Achieved highest AUC of <strong style={{ color: '#f1f5f9' }}>99.63%</strong> with excellent cross-validation
                                stability (<strong style={{ color: '#f1f5f9' }}>σ &lt; 0.002</strong>), making it the most reliable model for
                                production deployment.
                            </p>
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
