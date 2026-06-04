import { useState, useEffect } from 'react'
import ChurnPredictor from './components/ChurnPredictor'
import EDAInsights from './components/EDAInsights'
import ModelDashboard from './components/ModelDashboard'
import BusinessImpact from './components/BusinessImpact'
import CustomerSegments from './components/CustomerSegments'
import SentimentAnalysis from './components/SentimentAnalysis'
import ResumeFooter from './components/ResumeFooter'
import BusinessAnalyzer from './components/BusinessAnalyzer'

// ─── Global Styles ───────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    .mode-content {
      animation: modeFadeIn 0.4s ease-out forwards;
    }
    @keyframes modeFadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%   { opacity: 1; transform: scale(1); }
      50%  { opacity: 0.4; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
    .analyzer-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #22c55e;
      border-radius: 50%;
      margin-left: 8px;
      vertical-align: middle;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
      animation: pulse 2s infinite ease-in-out;
    }
  `}</style>
)

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Problem', href: '#problem' },
  { label: 'Insights', href: '#insights' },
  { label: 'Models', href: '#models' },
  { label: 'Segments', href: '#segments' },
  { label: 'Impact', href: '#impact' },
  { label: 'Analyzer', href: '#analyzer' },
  { label: 'Predictor', href: '#predictor' },
  { label: 'Sentiment', href: '#sentiment' },
  { label: 'Resume', href: '#resume' },
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
        marginTop: '48px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
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
      id="hero"
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
              background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.4)',
              color: '#3b82f6',
              borderRadius: '20px',
              padding: '4px 16px',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '1px',
            }}
          >
            📋 Case Study — E-Commerce Churn Analysis
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
        padding: '16px 12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          fontSize: '22px',
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
          fontSize: '10px',
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

// ─── Problem Statement ───────────────────────────────────────────────────────

function ProblemStatement() {
  const columns = [
    {
      title: 'The Challenge',
      text: 'E-commerce platforms lose 15–20% of customers every month to churn. Each lost customer = lost lifetime revenue. Most businesses only realise a customer has churned after they\'ve already left.',
    },
    {
      title: 'The Approach',
      text: 'Analyze behavioral patterns of 5,630 customers. Identify signals that appear before churn happens. Build a model that flags at-risk customers 30 days before they leave.',
    },
    {
      title: 'The Outcome',
      text: '99.63% prediction accuracy. 348% ROI on retention campaigns. 4 customer segments each with targeted retention strategies.',
    },
  ]

  return (
    <section
      id="problem"
      style={{
        padding: '5rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          width: '100%',
          background: '#1e293b',
          borderRadius: '1rem',
          borderLeft: '4px solid #3b82f6',
          padding: '2.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🎯</span>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#f1f5f9',
              marginTop: '0.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            The Business Problem
          </h2>
        </div>

        {/* 3 Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {columns.map((col) => (
            <div key={col.title}>
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#60a5fa',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {col.title}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {col.text}
              </p>
            </div>
          ))}
        </div>

        {/* Tech line */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#64748b',
            margin: 0,
            letterSpacing: '0.02em',
          }}
        >
          Built using Python · Scikit-learn · XGBoost · Random Forest · SHAP · KMeans · TextBlob
        </p>
      </div>
    </section>
  )
}

// ─── ModeSwitcher ──────────────────────────────────────────────────────────────

function ModeSwitcher({ mode, setMode }) {
  const btnBase = {
    borderRadius: '20px',
    padding: '6px 20px',
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
  const activeBtn = { ...btnBase, background: '#3b82f6', color: 'white', fontWeight: 600 }
  const inactiveBtn = { ...btnBase, background: 'transparent', color: 'rgba(255,255,255,0.5)' }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 1000,
      height: '48px',
      background: 'rgba(15,15,26,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 32px',
    }}>
      {/* LEFT — Logo */}
      <span style={{ fontSize: '18px', fontWeight: 700, color: 'white', letterSpacing: '1px' }}>
        ChurnIQ
      </span>

      {/* CENTER — Mode Toggle */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '4px',
        display: 'flex',
        gap: '2px',
      }}>
        <button
          style={mode === 'casestudy' ? activeBtn : inactiveBtn}
          onClick={() => setMode('casestudy')}
        >
          📊 Case Study
        </button>
        <button
          style={mode === 'analyzer' ? activeBtn : inactiveBtn}
          onClick={() => setMode('analyzer')}
        >
          🔬 Business Analyzer
          {mode === 'analyzer' && <span className="analyzer-dot" />}
        </button>
      </div>

      {/* RIGHT — GitHub */}
      <a
        href="https://github.com/aakashamy777/Churn-Data-analysis-"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.6)',
          borderRadius: '8px',
          padding: '6px 16px',
          fontSize: '12px',
          background: 'transparent',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
      >
        ⭐ GitHub
      </a>
    </div>
  )
}

// ─── CTABanner ────────────────────────────────────────────────────────────────

function CTABanner({ setMode }) {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '4rem auto',
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      padding: '32px 40px',
      textAlign: 'center',
    }}>
      <h3 style={{ fontSize: '20px', color: 'white', marginBottom: '8px' }}>
        Want insights on your own data?
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '24px' }}>
        This case study was built on a fixed dataset. Try the Business Analyzer
        to upload your own customer data and get AI-powered insights.
      </p>
      <button
        onClick={() => setMode('analyzer')}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 28px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.background = '#2563eb'}
        onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
      >
        Try Business Analyzer →
      </button>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState(
    localStorage.getItem('churniq-mode') || 'casestudy'
  )

  const switchMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('churniq-mode', newMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    document.title = mode === 'casestudy'
      ? 'ChurnIQ — Churn Prediction Case Study'
      : 'ChurnIQ — Business Data Analyzer';
  }, [mode])

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', fontFamily: 'Inter, sans-serif', paddingTop: '48px' }}>
      <GlobalStyles />
      <ModeSwitcher mode={mode} setMode={switchMode} />

      {/* CASE STUDY MODE */}
      {mode === 'casestudy' && (
        <div id="casestudy-content" className="mode-content">
          <Navbar />
          <Hero />
          <SectionDivider />
          <ProblemStatement />
          <SectionDivider />
          <EDAInsights />
          <SectionDivider />
          <ModelDashboard />
          <SectionDivider />
          <CustomerSegments />
          <SectionDivider />
          <BusinessImpact />
          <SectionDivider />
          <ChurnPredictor />
          <SectionDivider />
          <SentimentAnalysis />
          <SectionDivider />
          <ResumeFooter />
          <CTABanner setMode={switchMode} />
        </div>
      )}

      {/* ANALYZER MODE */}
      {mode === 'analyzer' && (
        <div id="analyzer-content" className="mode-content" style={{ position: 'relative' }}>
          {/* Back escape link */}
          <button
            onClick={() => switchMode('casestudy')}
            style={{
              position: 'fixed', top: '60px', right: '24px', zIndex: 999,
              color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '6px 14px', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.4)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
          >
            ← Back to Case Study
          </button>

          {/* Standalone Header */}
          <div style={{ textAlign: 'center', padding: '60px 20px 20px 20px' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.4)', color: '#3b82f6',
              borderRadius: '20px', padding: '4px 16px', fontSize: '12px',
              marginBottom: '16px', letterSpacing: '1px'
            }}>
              🔬 AI-POWERED BUSINESS TOOL
            </div>

            <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'white', margin: '0 0 12px 0' }}>
              Business Data Analyzer
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', maxWidth: '520px', margin: '0 auto 8px auto' }}>
              Upload any customer CSV dataset and get instant AI-powered churn predictions,
              sales insights, and actionable business recommendations.
            </p>

            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
              🔒 Your data never leaves your browser. Only 50 rows sent to AI for analysis.
            </p>
          </div>

          <BusinessAnalyzer />
        </div>
      )}
    </div>
  )
}
