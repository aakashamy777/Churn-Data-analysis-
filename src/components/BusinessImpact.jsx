import { useState, useEffect, useRef } from 'react'

// ─── Slider ────────────────────────────────────────────────────────────────────

function Slider({ label, min, max, value, onChange, format }) {
    const pct = ((value - min) / (max - min)) * 100
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9' }}>{format(value)}</span>
            </div>
            <div style={{ position: 'relative', height: '6px' }}>
                <div style={{ position: 'absolute', inset: 0, background: '#334155', borderRadius: '9999px' }} />
                <div
                    style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        width: `${pct}%`, background: '#3b82f6', borderRadius: '9999px',
                    }}
                />
                <input
                    type="range" min={min} max={max} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{
                        position: 'absolute', inset: 0, width: '100%', opacity: 0,
                        cursor: 'pointer', height: '100%',
                    }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.7rem', color: '#475569' }}>{format(min)}</span>
                <span style={{ fontSize: '0.7rem', color: '#475569' }}>{format(max)}</span>
            </div>
        </div>
    )
}

// ─── Output Card ──────────────────────────────────────────────────────────────

function OutputCard({ label, value, color, large, icon }) {
    return (
        <div
            style={{
                background: '#0f172a',
                borderRadius: '0.75rem',
                padding: large ? '1.25rem 1rem' : '1rem',
                border: `1px solid ${color}33`,
                textAlign: 'center',
                transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 20px ${color}22`)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
            <div style={{ fontSize: large ? '0.7rem' : '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem', fontWeight: 600 }}>
                {icon} {label}
            </div>
            <div style={{ fontSize: large ? 'clamp(1.3rem, 2.5vw, 1.7rem)' : 'clamp(1rem, 2vw, 1.3rem)', fontWeight: 800, color, letterSpacing: '-0.02em' }}>
                {value}
            </div>
        </div>
    )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtINR = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`
const fmtNum = (n) => Math.round(n).toLocaleString('en-IN')
const fmtPct = (n) => `${Math.round(n)}%`

// ─── Section ──────────────────────────────────────────────────────────────────

export default function BusinessImpact() {
    const [customers, setCustomers] = useState(5630)
    const [revenue, setRevenue] = useState(3000)
    const [churnRate, setChurnRate] = useState(16.8)
    const [retentionRate, setRetentionRate] = useState(30)
    const [offerCost, setOfferCost] = useState(200)

    const atRisk = customers * (churnRate / 100)
    const revenueAtRisk = atRisk * revenue
    const retained = atRisk * (retentionRate / 100)
    const revenueSaved = retained * revenue
    const campaignCost = atRisk * offerCost
    const netValue = revenueSaved - campaignCost
    const roi = campaignCost > 0 ? (netValue / campaignCost) * 100 : 0

    const sectionRef = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
        if (sectionRef.current) obs.observe(sectionRef.current)
        return () => obs.disconnect()
    }, [])

    return (
        <section
            id="impact"
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
                        background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
                        borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, color: '#fbbf24',
                        letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem',
                    }}
                >
                    💰 ROI Estimator
                </span>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
                    Business Impact Calculator
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
                    Estimate the ROI of deploying this churn prediction system
                </p>
            </div>

            {/* Calculator Grid */}
            <div
                className="calc-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}
            >
                {/* LEFT — Sliders */}
                <div style={{ background: '#1e293b', borderRadius: '0.75rem', padding: '1.75rem', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚙️ Adjust Parameters</p>
                    <Slider label="Total Customers" min={1000} max={50000} value={customers} onChange={setCustomers} format={fmtNum} />
                    <Slider label="Avg Monthly Revenue per Customer (₹)" min={500} max={10000} value={revenue} onChange={setRevenue} format={fmtINR} />
                    <Slider label="Churn Rate (%)" min={5} max={40} value={churnRate} onChange={setChurnRate} format={fmtPct} />
                    <Slider label="Retention Success Rate (%)" min={10} max={50} value={retentionRate} onChange={setRetentionRate} format={fmtPct} />
                    <Slider label="Retention Offer Cost (₹)" min={50} max={500} value={offerCost} onChange={setOfferCost} format={fmtINR} />
                </div>

                {/* RIGHT — Outputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>📊 Projected Outcomes</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <OutputCard label="Revenue at Risk" value={fmtINR(revenueAtRisk)} color="#ef4444" icon="⚠️" />
                        <OutputCard label="Customers Retained" value={fmtNum(retained)} color="#22c55e" icon="✅" />
                        <OutputCard label="Revenue Saved" value={fmtINR(revenueSaved)} color="#22c55e" icon="💚" />
                        <OutputCard label="Campaign Cost" value={fmtINR(campaignCost)} color="#fbbf24" icon="💸" />
                        <OutputCard label="Net Business Value" value={fmtINR(netValue)} color="#3b82f6" large icon="💎" />
                        <OutputCard label="Return on Investment" value={`${Math.round(roi)}%`} color="#3b82f6" large icon="📈" />
                    </div>

                    {/* Note */}
                    <div
                        style={{
                            background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)',
                            borderRadius: '0.6rem', padding: '0.875rem 1rem',
                            display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                        }}
                    >
                        <span style={{ flexShrink: 0 }}>📌</span>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                            Based on real project results: <strong style={{ color: '#f1f5f9' }}>₹1,60,800 net value</strong> generated on test set of <strong style={{ color: '#f1f5f9' }}>1,126 customers</strong>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) { .calc-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </section>
    )
}
