import { useEffect, useRef, useState } from 'react'
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip
} from 'recharts'

// ─── Segment Data ─────────────────────────────────────────────────────────────

const SEGMENTS = [
    {
        id: 0, icon: '👁️', name: 'Mid-Value Observers',
        churn: 17, tenure: 8.15, cashback: 155, orders: 1.92,
        risk: 'MEDIUM', riskColor: '#f59e0b', riskBg: 'rgba(245,158,11,0.12)',
        strategy: 'Push notification with loyalty points offer',
        borderColor: '#f59e0b',
    },
    {
        id: 1, icon: '⚠️', name: 'At-Risk New Joiners',
        churn: 34, tenure: 8.88, cashback: 151, orders: 1.23,
        risk: 'HIGH', riskColor: '#ef4444', riskBg: 'rgba(239,68,68,0.12)',
        strategy: 'Send personalised discount coupon within 48hrs + assign support agent',
        borderColor: '#ef4444',
    },
    {
        id: 2, icon: '🛒', name: 'Active Regulars',
        churn: 16, tenure: 12.04, cashback: 199, orders: 9.09,
        risk: 'LOW', riskColor: '#22c55e', riskBg: 'rgba(34,197,94,0.12)',
        strategy: 'Monthly reward email to maintain engagement',
        borderColor: '#22c55e',
    },
    {
        id: 3, icon: '👑', name: 'Loyal High-Value',
        churn: 9, tenure: 16.01, cashback: 249, orders: 2.45,
        risk: 'VERY LOW', riskColor: '#22c55e', riskBg: 'rgba(34,197,94,0.12)',
        strategy: 'VIP program enrollment + early access to sales',
        borderColor: '#3b82f6',
    },
]

// Normalized 0-1 for radar
const RADAR_DATA = [
    { axis: 'Tenure', seg0: 8.15 / 16, seg1: 8.88 / 16, seg2: 12.04 / 16, seg3: 1.0 },
    { axis: 'Orders', seg0: 1.92 / 9, seg1: 1.23 / 9, seg2: 1.0, seg3: 2.45 / 9 },
    { axis: 'Cashback', seg0: 155 / 249, seg1: 151 / 249, seg2: 199 / 249, seg3: 1.0 },
    { axis: 'Low Churn', seg0: 1 - 17 / 34, seg1: 0, seg2: 1 - 16 / 34, seg3: 1 - 9 / 34 },
    { axis: 'Recency', seg0: 0.5, seg1: 0.4, seg2: 0.85, seg3: 0.9 },
]

const RADAR_COLORS = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6']

// ─── Segment Card ─────────────────────────────────────────────────────────────

function SegmentCard({ seg }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#1e293b',
                borderRadius: '0.75rem',
                border: `1px solid ${hovered ? seg.borderColor : '#334155'}`,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.25s ease',
                transform: hovered ? 'scale(1.02)' : 'scale(1)',
                boxShadow: hovered ? `0 0 24px ${seg.borderColor}22` : '0 4px 16px rgba(0,0,0,0.2)',
                cursor: 'default',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{seg.icon}</span>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Segment {seg.id}</p>
                        <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>{seg.name}</p>
                    </div>
                </div>
                <span
                    style={{
                        padding: '0.25rem 0.75rem',
                        background: seg.riskBg,
                        border: `1px solid ${seg.riskColor}55`,
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: seg.riskColor,
                        letterSpacing: '0.05em',
                        flexShrink: 0,
                    }}
                >
                    {seg.risk}
                </span>
            </div>

            {/* Stat pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                    { label: 'Churn Rate', value: `${seg.churn}%`, color: seg.riskColor },
                    { label: 'Tenure', value: `${seg.tenure} mo` },
                    { label: 'Avg Cashback', value: `₹${seg.cashback}` },
                    { label: 'Avg Orders', value: seg.orders },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            background: '#0f172a',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: '0.6rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: stat.color || '#f1f5f9' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Strategy */}
            <div
                style={{
                    background: 'rgba(59,130,246,0.07)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                }}
            >
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🎯 Strategy</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>{seg.strategy}</p>
            </div>
        </div>
    )
}

// ─── Customer Segments Section ────────────────────────────────────────────────

export default function CustomerSegments() {
    const sectionRef = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
        if (sectionRef.current) obs.observe(sectionRef.current)
        return () => obs.disconnect()
    }, [])

    return (
        <section
            id="segments"
            ref={sectionRef}
            style={{
                padding: '5rem 1.5rem',
                maxWidth: '1200px',
                margin: '0 auto',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
        >
            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span
                    style={{
                        display: 'inline-block', padding: '0.35rem 1rem',
                        background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
                        borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, color: '#a78bfa',
                        letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem',
                    }}
                >
                    K-Means Clustering
                </span>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
                    Customer Segmentation
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
                    K-Means clustering revealed 4 distinct customer groups
                </p>
            </div>

            {/* 2x2 Segment Cards */}
            <div
                className="segments-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '3rem' }}
            >
                {SEGMENTS.map((seg) => <SegmentCard key={seg.id} seg={seg} />)}
            </div>

            {/* Radar Chart */}
            <div style={{ background: '#1e293b', borderRadius: '0.75rem', padding: '1.75rem', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', textAlign: 'center' }}>
                    Segment Comparison — Radar Chart
                </h3>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                    Normalized attributes across all 4 segments
                </p>
                <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="axis" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        {SEGMENTS.map((seg, i) => (
                            <Radar
                                key={seg.id}
                                name={`Seg ${seg.id}: ${seg.name}`}
                                dataKey={`seg${seg.id}`}
                                stroke={RADAR_COLORS[i]}
                                fill={RADAR_COLORS[i]}
                                fillOpacity={0.08}
                                strokeWidth={2}
                            />
                        ))}
                        <Legend
                            formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{v}</span>}
                        />
                        <Tooltip
                            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.8rem' }}
                            formatter={(v) => [v.toFixed(2), '']}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <style>{`
        @media (max-width: 768px) { .segments-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </section>
    )
}
