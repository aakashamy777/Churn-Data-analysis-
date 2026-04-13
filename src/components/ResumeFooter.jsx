import { useState, useEffect, useRef } from 'react'

// ─── Resume bullets ───────────────────────────────────────────────────────────

const BULLETS = [
    {
        id: 1,
        icon: '🤖',
        tag: 'ML Pipeline',
        text: 'Engineered an end-to-end churn prediction pipeline using Random Forest & XGBoost achieving 99.63% ROC-AUC on 5,630 customer records, with SMOTE-based class balancing and 26-feature engineering',
    },
    {
        id: 2,
        icon: '👥',
        tag: 'Customer Analytics',
        text: 'Segmented 5,630+ customers using K-Means RFM clustering, identifying a high-risk cohort with 34% churn rate and mapped each segment to targeted retention strategies',
    },
    {
        id: 3,
        icon: '💰',
        tag: 'Business Impact',
        text: 'Optimized classification threshold to 0.40 based on business cost modeling (FN=₹500, FP=₹50), generating ₹1,60,800 net value with 348% ROI on retention campaign simulation',
    },
]

const TECH_BADGES = [
    { label: 'Python', bg: '#fbbf2415', color: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
    { label: 'Scikit-learn', bg: '#f9731615', color: '#fb923c', border: 'rgba(249,115,22,0.25)' },
    { label: 'XGBoost', bg: '#ef444415', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
    { label: 'Pandas', bg: '#3b82f615', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
    { label: 'React', bg: '#22d3ee15', color: '#22d3ee', border: 'rgba(34,211,238,0.25)' },
    { label: 'Recharts', bg: '#8b5cf615', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
]

// ─── BulletCard ───────────────────────────────────────────────────────────────

function BulletCard({ bullet }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(bullet.text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // fallback
            const el = document.createElement('textarea')
            el.value = bullet.text
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div
            style={{
                background: '#1e293b',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid #334155',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                position: 'relative',
                transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#334155')}
        >
            {/* Number */}
            <div
                style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '1rem',
                }}
            >
                {bullet.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                <span
                    style={{
                        display: 'inline-block', padding: '0.15rem 0.6rem',
                        background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                        borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 600, color: '#60a5fa',
                        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem',
                    }}
                >
                    {bullet.tag}
                </span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.7 }}>
                    {bullet.text}
                </p>
            </div>

            {/* Copy button */}
            <button
                onClick={handleCopy}
                title="Copy to clipboard"
                style={{
                    flexShrink: 0,
                    background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.1)',
                    border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.25)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.4rem 0.7rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: copied ? '#22c55e' : '#60a5fa',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                }}
            >
                {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResumeFooter() {
    const sectionRef = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
        if (sectionRef.current) obs.observe(sectionRef.current)
        return () => obs.disconnect()
    }, [])

    return (
        <>
            {/* ── Resume Section ── */}
            <section
                ref={sectionRef}
                style={{
                    padding: '5rem 1.5rem',
                    maxWidth: '900px',
                    margin: '0 auto',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'opacity 0.7s ease, transform 0.7s ease',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span
                        style={{
                            display: 'inline-block', padding: '0.35rem 1rem',
                            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                            borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, color: '#22c55e',
                            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem',
                        }}
                    >
                        📄 For Your Resume
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
                        Project Highlights
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
                        Click any card to copy the resume bullet point
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {BULLETS.map((b) => <BulletCard key={b.id} bullet={b} />)}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer
                style={{
                    background: '#080f1e',
                    borderTop: '1px solid #1e293b',
                    padding: '2.5rem 1.5rem',
                }}
            >
                <div
                    className="footer-grid"
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: '1.5rem',
                    }}
                >
                    {/* Left */}
                    <div>
                        <p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: '#3b82f6' }}>ChurnIQ</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>E-Commerce Churn Prediction System</p>
                    </div>

                    {/* Center — tech badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem' }}>
                        {TECH_BADGES.map((b) => (
                            <span
                                key={b.label}
                                style={{
                                    padding: '0.2rem 0.6rem',
                                    background: b.bg,
                                    border: `1px solid ${b.border}`,
                                    borderRadius: '9999px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    color: b.color,
                                }}
                            >
                                {b.label}
                            </span>
                        ))}
                    </div>

                    {/* Right */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.45rem 1rem',
                                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                                borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#60a5fa',
                                textDecoration: 'none', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)' }}
                        >
                            ⭐ GitHub
                        </a>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569' }}>
                            Built with Python & React
                        </p>
                    </div>
                </div>

                {/* Bottom line */}
                <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1a2744' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#334155' }}>
                        © 2024 ChurnIQ · Data Science Portfolio Project · Built with ❤️ using React + Gemini AI
                    </p>
                </div>

                <style>{`
          @media (max-width: 768px) {
            .footer-grid { grid-template-columns: 1fr !important; text-align: center !important; }
            .footer-grid > div:last-child { align-items: center !important; }
          }
        `}</style>
            </footer>
        </>
    )
}
