import { useState, useEffect } from 'react'
import ChurnPredictor from './components/ChurnPredictor'
import EDAInsights from './components/EDAInsights'
import ModelDashboard from './components/ModelDashboard'
import BusinessImpact from './components/BusinessImpact'
import CustomerSegments from './components/CustomerSegments'
import ResumeFooter from './components/ResumeFooter'

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Predictor', href: '#predictor' },
  { label: 'Models', href: '#models' },
  { label: 'Impact', href: '#impact' },
  { label: 'Segments', href: '#segments' },
]

const STATS = [
  { value: '5,630', label: 'Customers Analyzed' },
  { value: '99.6%', label: 'ROC-AUC Score' },
  { value: '₹1,60,800', label: 'Net Value Generated' },
  { value: '348%', label: 'Retention ROI' },
]

const TECH_BADGES = [
  { emoji: '🐍', label: 'Python' },
  { emoji: '🐼', label: 'Pandas' },
  { emoji: '🔢', label: 'NumPy' },
  { emoji: '🤖', label: 'Scikit-learn' },
  { emoji: '⚡', label: 'XGBoost' },
  { emoji: '🔍', label: 'SHAP' },
  { emoji: '⚖️', label: 'SMOTE' },
  { emoji: '📍', label: 'KMeans' },
  { emoji: '📊', label: 'Matplotlib' },
  { emoji: '🎨', label: 'Seaborn' },
  { emoji: '☁️', label: 'Google Colab' },
  { emoji: '🏆', label: 'Kaggle' },
]

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled ? 'rgba(15,23,42,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(51,65,85,0.5)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <a
            href="#overview"
            onClick={(e) => handleNavClick(e, '#overview')}
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#3b82f6',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            ChurnIQ
          </a>

          {/* Desktop Links */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#f1f5f9')}
                onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#94a3b8',
            }}
            aria-label="Toggle menu"
          >
            <div style={{ width: '24px', height: '2px', background: 'currentColor', marginBottom: '5px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <div style={{ width: '24px', height: '2px', background: 'currentColor', marginBottom: '5px', opacity: menuOpen ? 0 : 1, transition: 'all 0.3s' }} />
            <div style={{ width: '24px', height: '2px', background: 'currentColor', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            style={{
              paddingBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const handleScroll = (href) => {
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="overview"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '6rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Animated background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            animation: 'blob 7s infinite',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            right: '15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
            animation: 'blob 7s infinite 2s',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '40%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
            animation: 'blob 7s infinite 4s',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', width: '100%' }}>
        {/* Badge */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.4rem 1rem',
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#60a5fa',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Data Science Portfolio Project
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            color: '#f1f5f9',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
            letterSpacing: '-0.03em',
          }}
        >
          Predicting Customer{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Churn
          </span>
        </h1>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 800,
            color: '#94a3b8',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Before They Leave
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#94a3b8',
            lineHeight: 1.7,
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
          }}
        >
          An end-to-end ML system that identifies at-risk e-commerce customers
          and enables proactive retention
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '4rem',
          }}
        >
          <button
            onClick={() => handleScroll('#predictor')}
            style={{
              padding: '0.875rem 2rem',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 24px rgba(59,130,246,0.35)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 0 32px rgba(59,130,246,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(59,130,246,0.35)'
            }}
          >
            ⚡ Try Live Predictor
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.875rem 2rem',
              background: 'transparent',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.color = '#60a5fa'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#334155'
              e.currentTarget.style.color = '#f1f5f9'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            ⭐ View on GitHub
          </a>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            width: '100%',
          }}
        >
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat, delay }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay + 300)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      style={{
        background: '#1e293b',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        borderTop: '3px solid #3b82f6',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 800,
          color: '#f1f5f9',
          marginBottom: '0.25rem',
          letterSpacing: '-0.02em',
        }}
      >
        {stat.value}
      </div>
      <div
        style={{
          fontSize: '0.8rem',
          color: '#94a3b8',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {stat.label}
      </div>
    </div>
  )
}

// ─── Tech Stack ───────────────────────────────────────────────────────────────

function TechStack() {
  return (
    <section
      id="tech-stack"
      style={{
        padding: '5rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: '0.75rem',
        }}
      >
        Built With
      </h2>
      <p
        style={{
          textAlign: 'center',
          color: '#94a3b8',
          marginBottom: '2.5rem',
          fontSize: '0.95rem',
        }}
      >
        A complete data science stack from preprocessing to deployment
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
        }}
      >
        {TECH_BADGES.map((badge) => (
          <span
            key={badge.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.1rem',
              background: '#1e293b',
              border: '1px solid rgba(59,130,246,0.4)',
              borderRadius: '9999px',
              color: '#cbd5e1',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'default',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.background = 'rgba(59,130,246,0.1)'
              e.currentTarget.style.color = '#f1f5f9'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'
              e.currentTarget.style.background = '#1e293b'
              e.currentTarget.style.color = '#cbd5e1'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span>{badge.emoji}</span>
            {badge.label}
          </span>
        ))}
      </div>
    </section>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #334155, transparent)' }} />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <Hero />
      <SectionDivider />
      <TechStack />
      <SectionDivider />
      <ChurnPredictor />
      <SectionDivider />
      <EDAInsights />
      <SectionDivider />
      <ModelDashboard />
      <SectionDivider />
      <BusinessImpact />
      <SectionDivider />
      <CustomerSegments />
      <ResumeFooter />
    </div>
  )
}
