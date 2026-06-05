import { useState, useEffect, useRef } from 'react'
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    LineChart, Line, ReferenceLine, Legend, AreaChart, Area
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

// ─── Reusable InView Hook ────────────────────────────────────────────────────

function useInView() {
    const [inView, setInView] = useState(false)
    const ref = useRef(null)
    
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true)
                observer.disconnect()
            }
        }, { threshold: 0.15 })
        
        if (ref.current) {
            observer.observe(ref.current)
        }
        return () => observer.disconnect()
    }, [])
    
    return [ref, inView]
}

// ─── Shared Card Shell ────────────────────────────────────────────────────────

function InsightCard({ title, takeaway, children, cardRef }) {
    return (
        <div
            ref={cardRef}
            className="animate-ready animate-card eda-chart-card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 className="eda-chart-title">{title}</h3>
            </div>
            <div style={{ height: '200px', width: '100%' }}>{children}</div>
            <p className="eda-chart-takeaway">
                💡 {takeaway}
            </p>
        </div>
    )
}

// ─── Card 1: Churn Distribution ───────────────────────────────────────────────

function ChurnDistCard() {
    const [ref, inView] = useInView()
    const [percent, setPercent] = useState(0)
    
    useEffect(() => {
        if (inView) {
            let start = 0
            const end = 16.8
            const duration = 1200
            const startTime = performance.now()
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)
                const easeProgress = 1 - Math.pow(1 - progress, 4) // easeOutQuart
                setPercent(easeProgress * end)
                
                if (progress < 1) {
                    requestAnimationFrame(animate)
                } else {
                    setPercent(end)
                }
            }
            requestAnimationFrame(animate)
        }
    }, [inView])

    const COLORS = ['rgba(255, 255, 255, 0.15)', '#6C63FF']

    return (
        <InsightCard cardRef={ref} title="Churn Distribution" takeaway="Only 16.8% churned — severe class imbalance handled with SMOTE">
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>{percent.toFixed(1)}%</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', marginTop: '2px' }}>CHURNED</div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            <clipPath id="donutClip">
                                <circle 
                                    cx="50%" 
                                    cy="50%" 
                                    r={65} 
                                    stroke="#fff" 
                                    strokeWidth={25} 
                                    fill="none" 
                                    strokeDasharray={408} 
                                    strokeDashoffset={408} 
                                    className="donut-clip-circle"
                                />
                            </clipPath>
                        </defs>
                        <Pie 
                            data={churnDistData} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={55}
                            outerRadius={75} 
                            paddingAngle={4}
                            dataKey="value" 
                            labelLine={false} 
                            stroke="#16161F"
                            strokeWidth={2}
                            isAnimationActive={false}
                            className="donut-pie-slices"
                        >
                            {churnDistData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i]} style={{ outline: 'none', cursor: 'pointer' }} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ background: '#1E1E2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '8px', boxShadow: 'none' }}
                            labelStyle={{ color: '#fff', fontWeight: 600 }}
                            itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
                            formatter={(v, n) => [`${v}%`, n]}
                        />
                        <Legend
                            formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 500 }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </InsightCard>
    )
}

// ─── Card 2: Feature Importance ───────────────────────────────────────────────

function FeatureImportanceCard() {
    const [ref, inView] = useInView()
    const [hoveredBar, setHoveredBar] = useState(null)

    return (
        <InsightCard cardRef={ref} title="Top Churn Drivers" takeaway="Tenure and complaint behavior are the strongest churn signals">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={featureImportanceData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                    <defs>
                        <linearGradient id="importanceGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#6C63FF" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} domain={[0, 0.18]} tickFormatter={(v) => v.toFixed(2)} />
                    <YAxis type="category" dataKey="feature" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickLine={false} axisLine={false} width={80} />
                    <Tooltip
                        contentStyle={{ background: '#1E1E2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '8px', boxShadow: 'none' }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
                        formatter={(v) => [v.toFixed(3), 'Importance']}
                    />
                    <Bar 
                        dataKey="importance" 
                        fill="url(#importanceGrad)" 
                        radius={[0, 6, 6, 0]} 
                        isAnimationActive={inView}
                        animationDuration={1000}
                        onMouseEnter={(_, index) => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                    >
                        {featureImportanceData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`}
                                fill="url(#importanceGrad)"
                                opacity={hoveredBar === null || hoveredBar === index ? 1 : 0.4}
                                style={{ transition: 'opacity 0.2s ease' }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── Card 3: Model Comparison ─────────────────────────────────────────────────

function ModelComparisonCard() {
    const [ref, inView] = useInView()
    const [hoveredBar, setHoveredBar] = useState(null)

    return (
        <InsightCard cardRef={ref} title="Model Comparison" takeaway="Random Forest and XGBoost both achieved 99.6% AUC">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelComparisonData} margin={{ left: 0, right: 10, top: 10, bottom: 20 }}>
                    <defs>
                        <linearGradient id="aucGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6C63FF" stopOpacity={1} />
                            <stop offset="100%" stopColor="#6C63FF" stopOpacity={0.4} />
                        </linearGradient>
                        <linearGradient id="f1Grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#A78BFA" stopOpacity={1} />
                            <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="model" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
                    <YAxis domain={[0.6, 1.0]} tickFormatter={(v) => v.toFixed(1)} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ background: '#1E1E2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '8px', boxShadow: 'none' }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
                        formatter={(v, n) => [v.toFixed(3), n.toUpperCase()]}
                    />
                    <Legend formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 500 }}>{v.toUpperCase()}</span>} />
                    <Bar 
                        dataKey="auc" 
                        radius={[4, 4, 0, 0]} 
                        name="AUC" 
                        isAnimationActive={inView}
                        animationDuration={1000}
                        onMouseEnter={(_, index) => setHoveredBar(`${index}-auc`)}
                        onMouseLeave={() => setHoveredBar(null)}
                    >
                        {modelComparisonData.map((entry, index) => (
                            <Cell 
                                key={`cell-auc-${index}`}
                                fill="url(#aucGrad)"
                                opacity={hoveredBar === null || hoveredBar === `${index}-auc` ? 1 : 0.4}
                                style={{ transition: 'opacity 0.2s ease' }}
                            />
                        ))}
                    </Bar>
                    <Bar 
                        dataKey="f1" 
                        radius={[4, 4, 0, 0]} 
                        name="F1" 
                        isAnimationActive={inView}
                        animationDuration={1000}
                        onMouseEnter={(_, index) => setHoveredBar(`${index}-f1`)}
                        onMouseLeave={() => setHoveredBar(null)}
                    >
                        {modelComparisonData.map((entry, index) => (
                            <Cell 
                                key={`cell-f1-${index}`}
                                fill="url(#f1Grad)"
                                opacity={hoveredBar === null || hoveredBar === `${index}-f1` ? 1 : 0.4}
                                style={{ transition: 'opacity 0.2s ease' }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── Card 4: Segment Churn Rate ───────────────────────────────────────────────

function SegmentChurnCard() {
    const [ref, inView] = useInView()
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const COLORS = ['#F5A623', '#FF6B6B', '#A78BFA', '#6C63FF'] // Accent, Danger, Secondary, Primary

    return (
        <InsightCard cardRef={ref} title="Customer Segments Churn Rate" takeaway="Segment 1 churns at 34% — newest and least engaged customers">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentData} margin={{ left: 0, right: 10, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="segment" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 40]} />
                    <Tooltip
                        contentStyle={{ background: '#1E1E2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '8px', boxShadow: 'none' }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
                        formatter={(v, _, props) => [`${v}% churn`, props.payload.label]}
                    />
                    <Bar 
                        dataKey="churn" 
                        radius={[6, 6, 0, 0]} 
                        isAnimationActive={inView}
                        animationDuration={1000}
                        onMouseEnter={(_, index) => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {segmentData.map((entry, index) => (
                            <Cell 
                                key={entry.segment} 
                                fill={COLORS[index]} 
                                opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                                style={{ transition: 'opacity 0.2s ease' }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── Card 5: Threshold Optimization ──────────────────────────────────────────

function ThresholdCard() {
    const [ref, inView] = useInView()
    return (
        <InsightCard cardRef={ref} title="Threshold Optimization" takeaway="Threshold set to 0.40 to minimize missed churners (costly false negatives)">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={thresholdData} margin={{ left: 0, right: 10, top: 10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="precisionGradArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F5A623" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="recallGradArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="f1GradArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="t" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} tickFormatter={(v) => v.toFixed(1)} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 1.1]} />
                    <Tooltip
                        contentStyle={{ background: '#1E1E2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '8px', boxShadow: 'none' }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
                        labelFormatter={(v) => `Threshold: ${v}`}
                    />
                    <Legend formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', textTransform: 'capitalize', fontWeight: 500 }}>{v}</span>} />
                    <ReferenceLine x={0.4} stroke="#F5A623" strokeDasharray="4 4" strokeWidth={2} label={{ value: '0.40 ★', position: 'top', fill: '#F5A623', fontSize: 11, fontWeight: 700 }} />
                    <Area type="monotone" dataKey="precision" stroke="#F5A623" strokeWidth={2} fillOpacity={1} fill="url(#precisionGradArea)" name="precision" dot={false} isAnimationActive={false} />
                    <Area type="monotone" dataKey="recall" stroke="#FF6B6B" strokeWidth={2} fillOpacity={1} fill="url(#recallGradArea)" name="recall" dot={false} isAnimationActive={false} />
                    <Area type="monotone" dataKey="f1" stroke="#6C63FF" strokeWidth={2} fillOpacity={1} fill="url(#f1GradArea)" name="f1" dot={false} isAnimationActive={false} />
                </AreaChart>
            </ResponsiveContainer>
        </InsightCard>
    )
}

// ─── Card 6: Cross Validation ─────────────────────────────────────────────────

function CrossValidationCard() {
    const [ref, inView] = useInView()
    const mean = 0.996
    return (
        <InsightCard cardRef={ref} title="Cross Validation Stability (5-Fold)" takeaway="Std deviation < 0.002 — model is highly stable across all folds">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cvFoldData} margin={{ left: 0, right: 10, top: 15, bottom: 5 }}>
                    <defs>
                        <linearGradient id="cvGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="fold" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
                    <YAxis domain={[0.99, 1.0]} tickFormatter={(v) => v.toFixed(3)} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ background: '#1E1E2E', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '8px', boxShadow: 'none' }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
                        formatter={(v) => [v.toFixed(4), 'AUC']}
                    />
                    <ReferenceLine y={mean} stroke="#FF6B6B" strokeDasharray="5 3" strokeWidth={2} label={{ value: `Mean: ${mean}`, position: 'insideTopRight', fill: '#FF6B6B', fontSize: 10, fontWeight: 600 }} />
                    <Area type="monotone" dataKey="auc" stroke="#6C63FF" strokeWidth={2.5} fillOpacity={1} fill="url(#cvGrad)" dot={{ fill: '#6C63FF', r: 4, strokeWidth: 1, stroke: '#16161F' }} activeDot={{ r: 6 }} isAnimationActive={false} />
                </AreaChart>
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
                    Exploratory Data Analysis
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
