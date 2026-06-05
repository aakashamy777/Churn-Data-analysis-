import { useState, useEffect, useRef } from 'react'

// ─── Slider ────────────────────────────────────────────────────────────────────

function Slider({ label, min, max, value, onChange, format }) {
    const pct = ((value - min) / (max - min)) * 100
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{format(value)}</span>
            </div>
            <div style={{ position: 'relative', height: '6px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-surface-2)', borderRadius: '9999px', border: '1px solid var(--border)' }} />
                <div
                    style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        width: `${pct}%`, background: 'var(--accent)', borderRadius: '9999px',
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
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{format(min)}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{format(max)}</span>
            </div>
        </div>
    )
}

// ─── Output Card ──────────────────────────────────────────────────────────────

function OutputCard({ label, value, color, large, icon }) {
    return (
        <div
            style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--card-radius)',
                padding: large ? '1.25rem 1rem' : '1rem',
                border: '1px solid var(--border)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
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
            <div style={{ fontSize: large ? '0.7rem' : '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem', fontWeight: 600 }}>
                {label}
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
                background: 'var(--bg-primary)',
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
                    ROI Estimator
                </div>
                
                <h2 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                }}>
                    Business Impact Calculator
                </h2>
                
                <p style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    maxWidth: '480px',
                    marginBottom: '48px'
                }}>
                    Estimate the ROI of deploying this churn prediction system
                </p>

            {/* Calculator Grid */}
            <div
                className="calc-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}
            >
                {/* LEFT — Sliders */}
                <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--card-radius)', padding: 'var(--card-padding)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Adjust Parameters</p>
                    <Slider label="Total Customers" min={1000} max={50000} value={customers} onChange={setCustomers} format={fmtNum} />
                    <Slider label="Avg Monthly Revenue per Customer (₹)" min={500} max={10000} value={revenue} onChange={setRevenue} format={fmtINR} />
                    <Slider label="Churn Rate (%)" min={5} max={40} value={churnRate} onChange={setChurnRate} format={fmtPct} />
                    <Slider label="Retention Success Rate (%)" min={10} max={50} value={retentionRate} onChange={setRetentionRate} format={fmtPct} />
                    <Slider label="Retention Offer Cost (₹)" min={50} max={500} value={offerCost} onChange={setOfferCost} format={fmtINR} />
                </div>

                {/* RIGHT — Outputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Projected Outcomes</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <OutputCard label="Revenue at Risk" value={fmtINR(revenueAtRisk)} color="var(--danger)" />
                        <OutputCard label="Customers Retained" value={fmtNum(retained)} color="var(--success)" />
                        <OutputCard label="Revenue Saved" value={fmtINR(revenueSaved)} color="var(--success)" />
                        <OutputCard label="Campaign Cost" value={fmtINR(campaignCost)} color="var(--warning)" />
                        <OutputCard label="Net Business Value" value={fmtINR(netValue)} color="var(--accent)" large />
                        <OutputCard label="Return on Investment" value={`${Math.round(roi)}%`} color="var(--accent)" large />
                    </div>

                    {/* Note */}
                    <div
                        style={{
                            background: 'var(--bg-surface-2)', border: '1px solid var(--border)',
                            borderRadius: '0.6rem', padding: '0.875rem 1rem',
                            display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                        }}
                    >
                        <span style={{ flexShrink: 0 }}>📌</span>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Based on real project results: <strong style={{ color: 'var(--text-primary)' }}>₹1,60,800 net value</strong> generated on test set of <strong style={{ color: 'var(--text-primary)' }}>1,126 customers</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>

            <style>{`
        @media (max-width: 768px) { .calc-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </section>
    )
}
