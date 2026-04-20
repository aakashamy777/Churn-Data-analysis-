import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
    LineChart,
    Line,
    LabelList
} from 'recharts'

// ─── SentimentAnalysis ────────────────────────────────────────────────────────
// Stage B: Populated with interactive Recharts.

// ─── Data ─────────────────────────────────────────────────────────────────────

const sentimentData = {
    distribution: [
        { label: 'Positive', count: 3127, churnRate: 8.2, color: '#22c55e' },
        { label: 'Neutral', count: 1406, churnRate: 16.1, color: '#f59e0b' },
        { label: 'Negative', count: 1097, churnRate: 31.4, color: '#ef4444' },
    ],
    avgScoreByChurn: [
        { group: 'Not Churned', score: 0.28 },
        { group: 'Churned', score: -0.14 },
    ],
    avgScoreBySatisfaction: [
        { score: 1, sentiment: -0.38 },
        { score: 2, sentiment: -0.21 },
        { score: 3, sentiment: 0.04 },
        { score: 4, sentiment: 0.19 },
        { score: 5, sentiment: 0.31 },
    ],
    keyFinding:
        'Negative sentiment customers churn at 31.4% vs 8.2% for positive — 3.8x higher risk',
}

// ─── Pipeline step cards ──────────────────────────────────────────────────────

const PIPELINE_STEPS = [
    {
        icon: '📝',
        title: 'Review Generation',
        body: 'Synthetic reviews generated from Complaint + SatisfactionScore columns using template mapping',
        accentColor: '#3b82f6',
    },
    {
        icon: '🔍',
        title: 'Sentiment Scoring',
        body: 'TextBlob polarity analysis assigns score −1.0 to +1.0 for each customer review',
        accentColor: '#8b5cf6',
    },
    {
        icon: '📊',
        title: 'Churn Correlation',
        body: 'Sentiment score added as ML feature — negative sentiment customers churn 3.8× more',
        accentColor: '#22c55e',
    },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function PipelineCard({ step, index }) {
    return (
        <div
            style={{
                background: '#1e293b',
                borderRadius: '0.875rem',
                padding: '1.75rem',
                border: '1px solid #334155',
                borderTop: `3px solid ${step.accentColor}`,
                flex: '1 1 260px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'default',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${step.accentColor}44`
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            {/* Step badge + icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                    style={{
                        fontSize: '1.6rem',
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.6rem',
                        height: '2.6rem',
                        borderRadius: '0.6rem',
                        background: `${step.accentColor}18`,
                        border: `1px solid ${step.accentColor}44`,
                    }}
                >
                    {step.icon}
                </span>
                <span
                    style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: step.accentColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}
                >
                    Step {index + 1}
                </span>
            </div>

            {/* Title */}
            <h3
                style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#f1f5f9',
                    margin: 0,
                    letterSpacing: '-0.01em',
                }}
            >
                {step.title}
            </h3>

            {/* Body */}
            <p
                style={{
                    fontSize: '0.875rem',
                    color: '#94a3b8',
                    lineHeight: 1.65,
                    margin: 0,
                }}
            >
                {step.body}
            </p>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SentimentAnalysis() {
    return (
        <section
            id="sentiment"
            style={{
                padding: '5rem 1.5rem',
                maxWidth: '1200px',
                margin: '0 auto',
            }}
        >
            {/* ── Section header ───────────────────────────────────────────────── */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                {/* Eyebrow badge */}
                <span
                    style={{
                        display: 'inline-block',
                        padding: '0.35rem 1rem',
                        background: 'rgba(139,92,246,0.12)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#a78bfa',
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        marginBottom: '1.25rem',
                    }}
                >
                    NLP Feature Engineering
                </span>

                <h2
                    style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        fontWeight: 800,
                        color: '#f1f5f9',
                        margin: '0 0 0.75rem',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Customer Sentiment Analysis
                </h2>

                <p
                    style={{
                        fontSize: '1rem',
                        color: '#64748b',
                        maxWidth: '560px',
                        margin: '0 auto',
                        lineHeight: 1.65,
                    }}
                >
                    Synthetic review generation + TextBlob polarity analysis on 5,630 customers
                </p>
            </div>

            {/* ── Key finding banner ───────────────────────────────────────────── */}
            <div
                style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(139,92,246,0.08) 100%)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: '0.875rem',
                    padding: '1rem 1.5rem',
                    marginBottom: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    flexWrap: 'wrap',
                }}
            >
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🔑</span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#fca5a5', fontWeight: 500, lineHeight: 1.55 }}>
                    <strong style={{ color: '#f87171' }}>Key Finding: </strong>
                    {sentimentData.keyFinding}
                </p>
            </div>

            {/* ── How it works: pipeline cards ─────────────────────────────────── */}
            <div style={{ marginBottom: '1rem' }}>
                <p
                    style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '1.25rem',
                    }}
                >
                    How It Works
                </p>

                <div
                    style={{
                        display: 'flex',
                        gap: '1.25rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {PIPELINE_STEPS.map((step, i) => (
                        <PipelineCard key={step.title} step={step} index={i} />
                    ))}
                </div>
            </div>

            {/* ── Charts Grid (Stage B) ────────────────────────────────────────── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '4rem',
                }}
            >
                {/* CHART 1: Sentiment Distribution */}
                <div
                    style={{
                        background: '#1e293b',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        border: '1px solid #334155',
                    }}
                >
                    <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                        Sentiment Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={sentimentData.distribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#f1f5f9' }}
                            />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                {sentimentData.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                ))}
                                <LabelList
                                    dataKey="churnRate"
                                    position="top"
                                    content={({ x, y, width, value }) => (
                                        <text x={x + width / 2} y={y - 10} fill="#94a3b8" fontSize={11} fontWeight={600} textAnchor="middle">
                                            Churn: {value}%
                                        </text>
                                    )}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* CHART 2: Churn Rate by Sentiment */}
                <div
                    style={{
                        background: '#1e293b',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        border: '1px solid #334155',
                    }}
                >
                    <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                        Churn Rate by Sentiment
                    </h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={sentimentData.distribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                            <Tooltip
                                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                                formatter={(val) => [`${val}%`, 'Churn Rate']}
                            />
                            <ReferenceLine y={16.8} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Avg 16.8%', position: 'right', fill: '#94a3b8', fontSize: 10 }} />
                            <Bar dataKey="churnRate" radius={[6, 6, 0, 0]} barSize={40}>
                                {sentimentData.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* CHART 3: Sentiment vs Satisfaction */}
                <div
                    style={{
                        background: '#1e293b',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        border: '1px solid #334155',
                    }}
                >
                    <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                        Sentiment vs Satisfaction Score
                    </h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={sentimentData.avgScoreBySatisfaction} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis
                                dataKey="score"
                                label={{ value: 'Satisfaction Score 1-5', position: 'bottom', fill: '#64748b', fontSize: 10, offset: 10 }}
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                label={{ value: 'Avg Polarity', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                            />
                            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
                            <Line
                                type="monotone"
                                dataKey="sentiment"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#1e293b' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Key Finding Callout ─────────────────────────────────────────── */}
            <div
                style={{
                    marginTop: '3rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '0.75rem',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <span style={{ fontSize: '1.5rem' }}>💡</span>
                <p style={{ margin: 0, color: '#93c5fd', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
                    <strong style={{ color: '#3b82f6' }}>Key Finding: </strong> {sentimentData.keyFinding}
                </p>
            </div>

            {/* ── THING 1: Insight Stats Row ─────────────────────────────────── */}
            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginTop: '2rem',
                }}
            >
                {[
                    '5,630 Reviews Analyzed',
                    'TextBlob NLP Engine',
                    '3.8x Higher Churn Risk',
                    'Negative Sentiment',
                ].map((text) => (
                    <div
                        key={text}
                        style={{
                            background: '#334155',
                            padding: '0.6rem 1rem',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid #3b82f6',
                            color: '#f1f5f9',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            flex: '1 1 auto',
                            textAlign: 'center',
                        }}
                    >
                        {text}
                    </div>
                ))}
            </div>

            {/* ── THING 2: Real World Extension Card ─────────────────────────── */}
            <div
                style={{
                    marginTop: '4rem',
                    background: '#1e293b',
                    borderRadius: '1.25rem',
                    border: '1px solid #334155',
                    borderTop: '5px solid #3b82f6',
                    padding: '2.5rem',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
            >
                <h3
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: '#f1f5f9',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <span>🚀</span> Real World Extension
                </h3>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '3rem',
                    }}
                >
                    {/* Column 1: Synthetic */}
                    <div>
                        <h4
                            style={{
                                color: '#60a5fa',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '1.25rem',
                            }}
                        >
                            What We Did (Synthetic)
                        </h4>
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.875rem',
                            }}
                        >
                            {[
                                'Generated reviews from Complaint + SatisfactionScore',
                                'Mapped structured data to realistic text templates',
                                'Applied TextBlob polarity scoring',
                                'Added sentiment as churn prediction feature',
                            ].map((item) => (
                                <li
                                    key={item}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem',
                                        color: '#94a3b8',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    <span style={{ color: '#3b82f6', marginTop: '2px' }}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Production */}
                    <div>
                        <h4
                            style={{
                                color: '#22c55e',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '1.25rem',
                            }}
                        >
                            Production Implementation
                        </h4>
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.875rem',
                            }}
                        >
                            {[
                                'Collect real app store reviews + support chat logs',
                                'Run VADER or BERT sentiment on actual customer text',
                                'Feed live sentiment score into churn model daily',
                                'Trigger alerts when sentiment drops below threshold',
                            ].map((item) => (
                                <li
                                    key={item}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.75rem',
                                        color: '#94a3b8',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    <span style={{ color: '#22c55e', marginTop: '2px' }}>⚡</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
