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
                background: 'var(--bg-surface)',
                borderRadius: 'var(--card-radius)',
                padding: 'var(--card-padding)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                border: '1px solid var(--border)',
                transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.borderColor = 'var(--border-strong)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.borderColor = 'var(--border)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
            </div>
            <div style={{ height: '200px', width: '100%' }}>{children}</div>
            <p
                style={{
                    margin: 0,
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
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
    const COLORS = ['var(--accent)', 'var(--danger)']
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
                    <Pie data={churnDistData} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={CustomLabel} stroke="var(--border)">
                        {churnDistData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        formatter={(v, n) => [`${v}%`, n]}
                    />
                    <Legend
                        formatter={(value) => <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{value}</span>}
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} domain={[0, 0.18]} tickFormatter={(v) => v.toFixed(2)} />
                    <YAxis type="category" dataKey="feature" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} width={80} />
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        formatter={(v) => [v.toFixed(3), 'Importance']}
                    />
                    <Bar dataKey="importance" fill="var(--accent)" radius={[0, 4, 4, 0]} />
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="model" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                    <YAxis domain={[0.6, 1.0]} tickFormatter={(v) => v.toFixed(1)} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        formatter={(v, n) => [v.toFixed(3), n.toUpperCase()]}
                    />
                    <Legend formatter={(v) => <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{v.toUpperCase()}</span>} />
                    <Bar dataKey="auc" fill="var(--accent)" radius={[4, 4, 0, 0]} name="AUC" />
                    <Bar dataKey="f1" fill="var(--success)" radius={[4, 4, 0, 0]} name="F1" />
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="segment" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 40]} />
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        formatter={(v, _, props) => [`${v}% churn`, props.payload.label]}
                    />
                    <Bar dataKey="churn" radius={[4, 4, 0, 0]}>
                        {segmentData.map((entry) => (
                            <Cell key={entry.segment} fill={entry.segment === 'Seg 1' ? 'var(--danger)' : 'var(--accent)'} />
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="t" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} tickFormatter={(v) => v.toFixed(1)} label={{ value: 'Threshold', position: 'insideBottom', offset: -2, fill: 'var(--text-muted)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 1.1]} />
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        labelFormatter={(v) => `Threshold: ${v}`}
                    />
                    <Legend formatter={(v) => <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'capitalize' }}>{v}</span>} />
                    <ReferenceLine x={0.4} stroke="var(--warning)" strokeDasharray="4 4" strokeWidth={2} label={{ value: '0.40 ★', position: 'top', fill: 'var(--warning)', fontSize: 11 }} />
                    <Line type="monotone" dataKey="precision" stroke="var(--accent)" strokeWidth={2} dot={false} name="Precision" />
                    <Line type="monotone" dataKey="recall" stroke="var(--danger)" strokeWidth={2} dot={false} name="Recall" />
                    <Line type="monotone" dataKey="f1" stroke="var(--success)" strokeWidth={2} dot={false} name="F1" />
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="fold" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                    <YAxis domain={[0.99, 1.0]} tickFormatter={(v) => v.toFixed(3)} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        formatter={(v) => [v.toFixed(4), 'AUC']}
                    />
                    <ReferenceLine y={mean} stroke="var(--danger)" strokeDasharray="5 3" strokeWidth={2} label={{ value: `Mean: ${mean}`, position: 'insideTopRight', fill: 'var(--danger)', fontSize: 10 }} />
                    <Bar dataKey="auc" fill="var(--accent)" radius={[4, 4, 0, 0]} />
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
            style={{ background: 'var(--bg-surface-2)' }}
        >
            <div style={{ 
              maxWidth: 'var(--max-width)', 
              margin: '0 auto', 
              padding: 'var(--section-padding)'
            }}>
                <div style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: '12px'
                }}>
                    Exploratory Data Analysis
                </div>
                
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                }}>
                    What the Data Revealed
                </h2>
                
                <p style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    maxWidth: '480px',
                    marginBottom: '48px'
                }}>
                    Key patterns discovered through Exploratory Data Analysis
                </p>

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
