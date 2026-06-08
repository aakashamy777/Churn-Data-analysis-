import { useEffect, useRef, useState } from 'react'
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine
} from 'recharts'

// ─── Segment Data ─────────────────────────────────────────────────────────────

const SEGMENTS = [
    {
        id: 0, icon: '👁️', name: 'Mid-Value Observers',
        churn: 17, tenure: 8.15, cashback: 155, orders: 1.92,
        risk: 'MEDIUM', riskColor: 'var(--warning)', riskBg: 'var(--warning-bg)',
        strategy: 'Push notification with loyalty points offer',
        borderColor: 'var(--warning)',
    },
    {
        id: 1, icon: '⚠️', name: 'At-Risk New Joiners',
        churn: 34, tenure: 8.88, cashback: 151, orders: 1.23,
        risk: 'HIGH', riskColor: 'var(--danger)', riskBg: 'var(--danger-bg)',
        strategy: 'Send personalised discount coupon within 48hrs + assign support agent',
        borderColor: 'var(--danger)',
    },
    {
        id: 2, icon: '🛒', name: 'Active Regulars',
        churn: 16, tenure: 12.04, cashback: 199, orders: 9.09,
        risk: 'LOW', riskColor: 'var(--success)', riskBg: 'var(--success-bg)',
        strategy: 'Monthly reward email to maintain engagement',
        borderColor: 'var(--success)',
    },
    {
        id: 3, icon: '👑', name: 'Loyal High-Value',
        churn: 9, tenure: 16.01, cashback: 249, orders: 2.45,
        risk: 'VERY LOW', riskColor: 'var(--success)', riskBg: 'var(--success-bg)',
        strategy: 'VIP program enrollment + early access to sales',
        borderColor: 'var(--accent)',
    },
]

// Bar chart data
const segmentChurnData = [
    { segment: 'At-Risk',   churnRate: 34, fill: 'var(--danger)' },
    { segment: 'Mid-Value', churnRate: 17, fill: 'var(--warning)' },
    { segment: 'Active',    churnRate: 16, fill: 'var(--accent)' },
    { segment: 'Loyal',     churnRate: 9,  fill: 'var(--success)' }
]

// ─── Segment Card ─────────────────────────────────────────────────────────────

function SegmentCard({ seg }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            className="animate-ready animate-card"
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
                boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
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
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
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
    return (
        <section
            id="segments"
            style={{
                background: 'var(--bg-surface-2)',
            }}
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
                    K-Means Clustering
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

            <div className="animate-ready animate-card dark-chart-card">
                <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: '#FFFFFF', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Churn Rate by Segment
                </p>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={segmentChurnData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="segment"
                            stroke="rgba(255,255,255,0.4)"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.4)"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                            tickFormatter={(v) => `${v}%`}
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
                            formatter={(value) => [`${value}%`, 'Churn Rate']}
                        />
                        <ReferenceLine
                            y={16.8}
                            strokeDasharray="4 4"
                            stroke="var(--text-muted)"
                            label={{ value: 'Avg 16.8%', fill: 'var(--text-secondary)', fontSize: 11, position: 'top', fontWeight: 600 }}
                        />
                        <Bar dataKey="churnRate" radius={[6, 6, 0, 0]} barSize={40} activeBar={{ fillOpacity: 0.8 }}>
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
