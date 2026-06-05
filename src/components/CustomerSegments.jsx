import { useEffect, useRef, useState } from 'react'
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine
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

// Bar chart data
const segmentChurnData = [
    { segment: 'At-Risk',   churnRate: 34, fill: 'var(--danger)' },
    { segment: 'Mid-Value', churnRate: 17, fill: 'var(--accent)' },
    { segment: 'Active',    churnRate: 16, fill: 'var(--accent)' },
    { segment: 'Loyal',     churnRate: 9,  fill: 'var(--success)' }
]

// ─── Segment Card ─────────────────────────────────────────────────────────────

function SegmentCard({ seg }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--card-radius)',
                border: `1px solid ${hovered ? seg.borderColor : 'var(--border)'}`,
                padding: 'var(--card-padding)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.25s ease',
                transform: hovered ? 'scale(1.02)' : 'scale(1)',
                boxShadow: hovered ? `0 0 24px ${seg.borderColor}22` : 'var(--shadow-sm)',
                cursor: 'default',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Segment {seg.id}</p>
                        <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{seg.name}</p>
                    </div>
                </div>
                <span
                    style={{
                        padding: '0.25rem 0.75rem',
                        background: 'transparent',
                        border: `1px solid ${seg.borderColor}`,
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: seg.borderColor,
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
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: stat.color === '#ef4444' ? 'var(--danger)' : stat.color === '#22c55e' ? 'var(--success)' : stat.color === '#f59e0b' ? 'var(--warning)' : 'var(--text-primary)' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Strategy */}
            <div
                style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                }}
            >
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🎯 Strategy</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{seg.strategy}</p>
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
                background: 'var(--bg-surface-2)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
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
                    K-Means Clustering
                </div>
                
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                }}>
                    Customer Segmentation
                </h2>
                
                <p style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    maxWidth: '480px',
                    marginBottom: '48px'
                }}>
                    K-Means clustering revealed 4 distinct customer groups
                </p>

            {/* 2x2 Segment Cards */}
            <div
                className="segments-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '3rem' }}
            >
                {SEGMENTS.map((seg) => <SegmentCard key={seg.id} seg={seg} />)}
            </div>

            {/* Churn Rate Chart */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--card-radius)', padding: 'var(--card-padding)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>
                    Churn Rate by Segment
                </p>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={segmentChurnData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                            dataKey="segment"
                            axisLine={{ stroke: 'var(--border)' }}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                            tickFormatter={(v) => `${v}%`}
                            label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 11, dy: 50 }}
                        />
                        <Tooltip
                            contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                            cursor={{ fill: 'var(--bg-primary)' }}
                            formatter={(value) => [`${value}%`, 'Churn Rate']}
                        />
                        <ReferenceLine
                            y={16.8}
                            strokeDasharray="4 4"
                            stroke="var(--text-muted)"
                            label={{ value: 'Avg 16.8%', fill: 'var(--text-muted)', fontSize: 11 }}
                        />
                        <Bar dataKey="churnRate" radius={[4, 4, 0, 0]} barSize={40}>
                            {segmentChurnData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

            <style>{`
        @media (max-width: 768px) { .segments-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </section>
    )
}
