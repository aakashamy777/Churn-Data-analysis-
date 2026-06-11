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
    LabelList,
    AreaChart,
    Area
} from 'recharts'

// ─── SentimentAnalysis ────────────────────────────────────────────────────────
// Stage B: Populated with interactive Recharts.

// ─── Data ─────────────────────────────────────────────────────────────────────

const sentimentData = {
    distribution: [
        { label: 'Positive', count: 3127, churnRate: 8.2, color: 'var(--success)' },
        { label: 'Neutral', count: 1406, churnRate: 16.1, color: 'var(--warning)' },
        { label: 'Negative', count: 1097, churnRate: 31.4, color: 'var(--danger)' },
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
        accentColor: 'var(--accent)',
    },
    {
        icon: '🔍',
        title: 'Sentiment Scoring',
        body: 'TextBlob polarity analysis assigns score −1.0 to +1.0 for each customer review',
        accentColor: 'var(--success)',
    },
    {
        icon: '📊',
        title: 'Churn Correlation',
        body: 'Sentiment score added as ML feature — negative sentiment customers churn 3.8× more',
        accentColor: 'var(--danger)',
    },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function PipelineCard({ step, index }) {
    return (
        <div
            className="animate-ready animate-card"
            style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--card-radius)',
                padding: 'var(--card-padding)',
                border: '1px solid var(--border)',
                borderTop: `3px solid ${step.accentColor}`,
                flex: '1 1 260px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                cursor: 'default',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.borderColor = 'var(--border-strong)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.borderColor = 'var(--border)'
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
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
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
                    color: 'var(--text-primary)',
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
                    color: 'var(--text-secondary)',
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
            style={{ background: 'var(--bg-surface-2)' }}
        >
            <div style={{ 
              maxWidth: 'var(--max-width)', 
              margin: '0 auto', 
              padding: 'var(--section-padding)'
            }}>
                {/* ── Section header ───────────────────────────────────────────────── */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    {/* Eyebrow badge */}
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
                        NLP Feature Engineering
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
                        Customer Sentiment Analysis
                    </h2>
                    
                    <p style={{
                        fontSize: '16px',
                        color: 'var(--text-secondary)',
                        maxWidth: '560px',
                        margin: '0 auto',
                        lineHeight: 1.65,
                    }}>
                        Synthetic review generation + TextBlob polarity analysis on 5,630 customers
                    </p>
                </div>

            {/* ── Key finding banner ───────────────────────────────────────────── */}
            <div
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--card-radius)',
                    padding: 'var(--card-padding)',
                    marginBottom: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    flexWrap: 'wrap',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🔑</span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.55 }}>
                    <strong style={{ color: 'var(--danger)' }}>Key Finding: </strong>
                    {sentimentData.keyFinding}
                </p>
            </div>

            {/* ── How it works: pipeline cards ─────────────────────────────────── */}
            <div style={{ marginBottom: '1rem' }}>
                <p
                    style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
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
                <div className="animate-ready animate-card dark-chart-card">
                    <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Sentiment Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart layout="vertical" data={sentimentData.distribution} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis type="category" dataKey="label" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} width={70} />
                            <Tooltip
                                contentStyle={{
                                    background: '#1E1E2E',
                                    border: '1px solid rgba(108,99,255,0.3)',
                                    borderRadius: '6px',
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    color: '#FFFFFF',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    maxWidth: '160px'
                                }}
                                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                wrapperStyle={{ zIndex: 10, outline: 'none' }}
                                formatter={(val) => [val.toLocaleString(), 'Customers']}
                            />
                            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24} activeBar={{ fillOpacity: 0.8 }}>
                                {sentimentData.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* CHART 2: Churn Rate by Sentiment */}
                <div className="animate-ready animate-card dark-chart-card">
                    <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Churn Rate by Sentiment
                    </h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={sentimentData.distribution} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                            <Tooltip
                                contentStyle={{
                                    background: '#1E1E2E',
                                    border: '1px solid rgba(108,99,255,0.3)',
                                    borderRadius: '6px',
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    color: '#FFFFFF',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    maxWidth: '160px'
                                }}
                                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                wrapperStyle={{ zIndex: 10, outline: 'none' }}
                                formatter={(val) => [`${val}%`, 'Churn Rate']}
                            />
                            <ReferenceLine y={16.8} stroke="var(--text-muted)" strokeDasharray="4 4" label={{ value: 'Avg 16.8%', position: 'top', fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600 }} />
                            <Bar dataKey="churnRate" radius={[6, 6, 0, 0]} barSize={40} activeBar={{ fillOpacity: 0.8 }}>
                                {sentimentData.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* CHART 3: Sentiment vs Satisfaction */}
                <div className="animate-ready animate-card dark-chart-card">
                    <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Sentiment vs Satisfaction
                    </h4>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={sentimentData.avgScoreBySatisfaction} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                            <defs>
                                <linearGradient id="sentimentSatGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="score"
                                label={{ value: 'Satisfaction Score (1-5)', position: 'bottom', fill: 'rgba(255,255,255,0.4)', fontSize: 10, offset: 10 }}
                                stroke="rgba(255,255,255,0.4)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                label={{ value: 'Avg Polarity', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                                stroke="rgba(255,255,255,0.4)"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#1E1E2E',
                                    border: '1px solid rgba(108,99,255,0.3)',
                                    borderRadius: '6px',
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    color: '#FFFFFF',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    maxWidth: '160px'
                                }}
                                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                wrapperStyle={{ zIndex: 10, outline: 'none' }}
                            />
                            <ReferenceLine y={0} stroke="var(--text-muted)" strokeDasharray="4 4" />
                            <Area
                                type="monotone"
                                dataKey="sentiment"
                                stroke="var(--accent)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#sentimentSatGrad)"
                                dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4, stroke: 'var(--bg-surface)' }}
                                activeDot={{ r: 6 }}
                                name="Average Polarity"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Key Finding Callout ─────────────────────────────────────────── */}
            <div
                style={{
                    marginTop: '3rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--card-radius)',
                    padding: 'var(--card-padding)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                <span style={{ fontSize: '1.5rem' }}>💡</span>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--accent)' }}>Key Finding: </strong> {sentimentData.keyFinding}
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
                            background: 'var(--bg-primary)',
                            padding: '0.6rem 1rem',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid var(--accent)',
                            border: '1px solid var(--border)',
                            borderLeftWidth: '4px',
                            color: 'var(--text-primary)',
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
                className="animate-ready animate-card"
                style={{
                    marginTop: '4rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--card-radius)',
                    border: '1px solid var(--border)',
                    borderTop: '5px solid var(--accent)',
                    padding: 'var(--card-padding)',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                <h3
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
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
                                color: 'var(--accent)',
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
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    <span style={{ color: 'var(--accent)', marginTop: '2px' }}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Production */}
                    <div>
                        <h4
                            style={{
                                color: 'var(--success)',
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
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    <span style={{ color: 'var(--success)', marginTop: '2px' }}>⚡</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        </section>
    )
}
