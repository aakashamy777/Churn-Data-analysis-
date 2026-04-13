import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    LineChart, Line, ReferenceLine, Legend
} from 'recharts'

// ─── Data ────────────────────────────────────────────────────────────────────

const churnDistData = [
    { name: 'Retained', value: 83.2 },
    { name: 'Churned', value: 16.8 },
]

const featureImportanceData = [
    { feature: 'Tenure', importance: 0.159 },
    { feature: 'Order Freq', importance: 0.083 },
    { feature: 'Complain×Score', importance: 0.073 },
    { feature: 'Complain', importance: 0.069 },
    { feature: 'Hours on App', importance: 0.047 },
    { feature: 'Coupons Used', importance: 0.044 },
]

const modelComparisonData = [
    { model: 'Log. Reg.', auc: 0.829, f1: 0.71 },
    { model: 'Rnd Forest', auc: 0.996, f1: 0.97 },
    { model: 'XGBoost', auc: 0.996, f1: 0.97 },
]

const segmentData = [
    { segment: 'Seg 0', churn: 17, label: 'Mid Risk' },
    { segment: 'Seg 1', churn: 34, label: 'High Risk' },
    { segment: 'Seg 2', churn: 16, label: 'Low Risk' },
    { segment: 'Seg 3', churn: 9, label: 'Loyal' },
]

const thresholdData = [
    { t: 0.1, precision: 0.28, recall: 0.99, f1: 0.44 },
    { t: 0.2, precision: 0.38, recall: 0.96, f1: 0.55 },
    { t: 0.3, precision: 0.52, recall: 0.91, f1: 0.66 },
    { t: 0.4, precision: 0.65, recall: 0.84, f1: 0.73 },
    { t: 0.5, precision: 0.74, recall: 0.74, f1: 0.74 },
    { t: 0.6, precision: 0.82, recall: 0.61, f1: 0.70 },
    { t: 0.7, precision: 0.88, recall: 0.48, f1: 0.62 },
    { t: 0.8, precision: 0.93, recall: 0.33, f1: 0.49 },
    { t: 0.9, precision: 0.96, recall: 0.18, f1: 0.31 },
]

const cvFoldData = [
    { fold: 'Fold 1', auc: 0.994 },
    { fold: 'Fold 2', auc: 0.997 },
    { fold: 'Fold 3', auc: 0.996 },
    { fold: 'Fold 4', auc: 0.995 },
    { fold: 'Fold 5', auc: 0.998 },
]

const segmentColors = { 'Seg 0': '#f59e0b', 'Seg 1': '#ef4444', 'Seg 2': '#22c55e', 'Seg 3': '#3b82f6' }

// ─── Shared Card Shell ────────────────────────────────────────────────────────

function InsightCard({ emoji, title, takeaway, children }) {
    return (
        <div
            style={{
                background: '#1e293b',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                border: '1px solid rgba(51,65,85,0.6)',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.15)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>{title}</h3>
            </div>
            <div style={{ height: '200px', width: '100%' }}>{children}</div>
            <p
                style={{
                    margin: 0,
                    fontSize: '0.78rem',
                    color: '#94a3b8',
                    background: 'rgba(59,130,246,0.07)',
                    border: '1px solid rgba(59,130,246,0.15)',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    lineHeight: 1.5,
                }}
            >
                💡 {takeaway}
            </p>
        </div>
    )
}

// ─── Card 1: Churn Distribution ───────────────────────────────────────────────

function ChurnDistCard() {
    const COLORS = ['#3b82f6', '#ef4444']
    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)
        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
                {value}%
            </text>
        )
    }
    return (
        <InsightCard emoji="🥧" title="Churn Distribution" takeaway="Only 16.8% churned — severe class imbalance handled with SMOTE">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={churnDistData} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={CustomLabel}>
                        {churnDistData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.8rem' }}
                        formatter={(v, n) => [`${v}%`, n]}
                    />
                    <Legend
                        formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── Card 2: Feature Importance ───────────────────────────────────────────────

function FeatureImportanceCard() {
    return (
        <InsightCard emoji="📊" title="Top Churn Drivers" takeaway="Tenure and complaint behavior are the strongest churn signals">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={featureImportanceData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} domain={[0, 0.18]} tickFormatter={(v) => v.toFixed(2)} />
                    <YAxis type="category" dataKey="feature" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} width={80} />
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.8rem' }}
                        formatter={(v) => [v.toFixed(3), 'Importance']}
                    />
                    <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── Card 3: Model Comparison ─────────────────────────────────────────────────

function ModelComparisonCard() {
    return (
        <InsightCard emoji="🤖" title="Model Comparison" takeaway="Random Forest and XGBoost both achieved 99.6% AUC">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelComparisonData} margin={{ left: 0, right: 10, top: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="model" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                    <YAxis domain={[0.6, 1.0]} tickFormatter={(v) => v.toFixed(1)} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.8rem' }}
                        formatter={(v, n) => [v.toFixed(3), n.toUpperCase()]}
                    />
                    <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{v.toUpperCase()}</span>} />
                    <Bar dataKey="auc" fill="#3b82f6" radius={[4, 4, 0, 0]} name="AUC" />
                    <Bar dataKey="f1" fill="#22c55e" radius={[4, 4, 0, 0]} name="F1" />
                </BarChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── Card 4: Segment Churn Rate ───────────────────────────────────────────────

function SegmentChurnCard() {
    return (
        <InsightCard emoji="👥" title="Customer Segments Churn Rate" takeaway="Segment 1 churns at 34% — newest and least engaged customers">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentData} margin={{ left: 0, right: 10, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="segment" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 40]} />
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.8rem' }}
                        formatter={(v, _, props) => [`${v}% churn`, props.payload.label]}
                    />
                    <Bar dataKey="churn" radius={[4, 4, 0, 0]}>
                        {segmentData.map((entry) => (
                            <Cell key={entry.segment} fill={segmentColors[entry.segment]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── Card 5: Threshold Optimization ──────────────────────────────────────────

function ThresholdCard() {
    return (
        <InsightCard emoji="🎯" title="Threshold Optimization" takeaway="Threshold set to 0.40 to minimize missed churners (costly false negatives)">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={thresholdData} margin={{ left: 0, right: 10, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} tickFormatter={(v) => v.toFixed(1)} label={{ value: 'Threshold', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 1.1]} />
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.8rem' }}
                        labelFormatter={(v) => `Threshold: ${v}`}
                    />
                    <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '0.78rem', textTransform: 'capitalize' }}>{v}</span>} />
                    <ReferenceLine x={0.4} stroke="#fbbf24" strokeDasharray="4 4" strokeWidth={2} label={{ value: '0.40 ★', position: 'top', fill: '#fbbf24', fontSize: 11 }} />
                    <Line type="monotone" dataKey="precision" stroke="#3b82f6" strokeWidth={2} dot={false} name="Precision" />
                    <Line type="monotone" dataKey="recall" stroke="#ef4444" strokeWidth={2} dot={false} name="Recall" />
                    <Line type="monotone" dataKey="f1" stroke="#22c55e" strokeWidth={2} dot={false} name="F1" />
                </LineChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── Card 6: Cross Validation ─────────────────────────────────────────────────

function CrossValidationCard() {
    const mean = 0.996
    return (
        <InsightCard emoji="📐" title="Cross Validation Stability (5-Fold)" takeaway="Std deviation < 0.002 — model is highly stable across all folds">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cvFoldData} margin={{ left: 0, right: 10, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="fold" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#334155' }} />
                    <YAxis domain={[0.99, 1.0]} tickFormatter={(v) => v.toFixed(3)} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.8rem' }}
                        formatter={(v) => [v.toFixed(4), 'AUC']}
                    />
                    <ReferenceLine y={mean} stroke="#ef4444" strokeDasharray="5 3" strokeWidth={2} label={{ value: `Mean: ${mean}`, position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
                    <Bar dataKey="auc" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── EDA Section ──────────────────────────────────────────────────────────────

export default function EDAInsights() {
    return (
        <section
            id="insights"
            style={{ padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span
                    style={{
                        display: 'inline-block',
                        padding: '0.35rem 1rem',
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.25)',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#60a5fa',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                    }}
                >
                    Exploratory Data Analysis
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
                    What the Data Revealed
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
                    Key patterns discovered through Exploratory Data Analysis
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.25rem',
                }}
                className="eda-grid"
            >
                <ChurnDistCard />
                <FeatureImportanceCard />
                <ModelComparisonCard />
                <SegmentChurnCard />
                <ThresholdCard />
                <CrossValidationCard />
            </div>

            <style>{`
        @media (max-width: 1024px) {
          .eda-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .eda-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    )
}
