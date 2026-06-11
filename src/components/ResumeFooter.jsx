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
    { label: 'Python' },
    { label: 'Scikit-learn' },
    { label: 'XGBoost' },
    { label: 'Pandas' },
    { label: 'React' },
    { label: 'Recharts' },
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
                background: 'var(--bg-surface)',
                borderRadius: 'var(--card-radius)',
                padding: 'var(--card-padding)',
                border: '1px solid var(--border)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
            }}
        >
            {/* Number */}
            <div
                style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'var(--bg-primary)', border: '1px solid var(--border)',
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
                        background: 'var(--bg-primary)', border: '1px solid var(--border)',
                        borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent)',
                        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem',
                    }}
                >
                    {bullet.tag}
                </span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {bullet.text}
                </p>
            </div>

            {/* Copy button */}
            <button
                onClick={handleCopy}
                title="Copy to clipboard"
                style={{
                    flexShrink: 0,
                    background: copied ? 'var(--bg-surface-2)' : 'var(--bg-primary)',
                    border: `1px solid ${copied ? 'var(--success)' : 'var(--border)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.4rem 0.7rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: copied ? 'var(--success)' : 'var(--text-primary)',
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
                id="resume"
                ref={sectionRef}
                style={{
                    background: 'var(--bg-primary)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'opacity 0.7s ease, transform 0.7s ease',
                }}
            >
                <div style={{ 
                    maxWidth: '900px', 
                    margin: '0 auto', 
                    padding: 'var(--section-padding)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{
                            display: 'inline-block',
                            fontSize: '11px',
                            fontWeight: '600',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            color: 'var(--accent)',
                            marginBottom: '12px'
                        }}>
                            📄 For Your Resume
                        </div>
                        <h2 style={{
                            fontSize: '36px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            color: 'var(--text-primary)',
                            marginBottom: '8px'
                        }}>
                            Project Highlights
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', margin: 0 }}>
                            Click any card to copy the resume bullet point
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {BULLETS.map((b) => <BulletCard key={b.id} bullet={b} />)}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer
                style={{
                    background: 'var(--bg-surface-2)',
                    borderTop: '1px solid var(--border)',
                }}
            >
                <div style={{
                    padding: '48px 40px',
                    maxWidth: 'var(--max-width)',
                    margin: '0 auto'
                }}>
                    <div
                        className="footer-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 1fr',
                            alignItems: 'center',
                            gap: '24px',
                        }}
                    >
                        {/* Left */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <img
                                    src="/regainer-logo.jpg"
                                    alt="ReGainer"
                                    style={{ height: '20px', width: 'auto', objectFit: 'contain' }}
                                />
                                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>ReGainer</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Customer Retention Analytics</p>
                        </div>

                        {/* Center — tech badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                            {TECH_BADGES.map((b) => (
                                <span
                                    key={b.label}
                                    style={{
                                        border: '1px solid var(--border)',
                                        background: 'var(--bg-surface)',
                                        color: 'var(--text-secondary)',
                                        fontSize: '11px',
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                        fontWeight: 500
                                    }}
                                >
                                    {b.label}
                                </span>
                            ))}
                        </div>

                        {/* Right */}
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                            <a
                                href="https://github.com/aakashamy777/Churn-Data-analysis-"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '6px 12px',
                                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                    borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)',
                                    textDecoration: 'none', transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-2)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-surface)' }}
                            >
                                GitHub
                            </a>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                                Built by Aakash Mehta
                            </p>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div style={{ 
                        textAlign: 'center', 
                        marginTop: '32px', 
                        paddingTop: '20px', 
                        borderTop: '1px solid var(--border)',
                        fontSize: '12px',
                        color: 'var(--text-muted)'
                    }}>
                        ReGainer — E-Commerce Churn Prediction System
                    </div>
                </div>

                <style>{`
          @media (max-width: 768px) {
            .footer-grid { grid-template-columns: 1fr !important; text-align: center !important; }
            .footer-grid > div { align-items: center !important; justify-content: center !important; }
            .footer-grid > div > div { justify-content: center !important; }
          }
        `}</style>
            </footer>
        </>
    )
}
