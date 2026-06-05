import { useState, useEffect, useCallback } from 'react'
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
      background: var(--success);
      border-radius: 50%;
      margin-left: 8px;
      vertical-align: middle;
      box-shadow: 0 0 8px var(--success);
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
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: '52px',
        zIndex: 50,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        height: '48px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '48px' }}>
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            style={{
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
            }}
          >
            ReGainer
          </a>

          {/* Desktop Links */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '4px 0',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--text-primary)'
                  e.target.style.borderBottomColor = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--text-secondary)'
                  e.target.style.borderBottomColor = 'transparent'
                }}
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
              color: 'var(--text-secondary)',
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
              gap: '0.5rem',
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)',
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
        background: 'var(--bg-primary)',
        paddingTop: '120px',
        paddingBottom: '80px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        {/* Context Badge */}
        <div style={{ marginBottom: '24px' }}>
          <span
            className="animate-ready animate-label"
            style={{
              display: 'inline-block',
              background: 'var(--bg-accent-light)',
              color: 'var(--accent)',
              border: '1px solid rgba(var(--accent-rgb), 0.2)',
              borderRadius: '4px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            CASE STUDY — E-COMMERCE CHURN ANALYSIS
          </span>
        </div>

        {/* Main Heading */}
        <h1
          className="animate-ready animate-heading"
          style={{
            fontSize: '56px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: '8px',
            letterSpacing: '-0.03em',
          }}
        >
          Predicting Customer{' '}
          <span style={{ color: 'var(--accent)' }}>Churn</span>
        </h1>

        {/* Subheading */}
        <h2
          className="animate-ready animate-heading"
          style={{
            fontSize: '56px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            marginBottom: '24px',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          Before They Leave
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto 36px auto',
          }}
        >
          An end-to-end ML system that identifies at-risk e-commerce customers
          and enables proactive retention strategies
        </p>

        {/* Buttons Row */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '64px',
          }}
        >
          <button
            onClick={() => handleScroll('#predictor')}
            style={{
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '11px 24px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)'
            }}
          >
            Try Live Predictor
          </button>
          <a
            href="https://github.com/aakashamy777/Churn-Data-analysis-"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '11px 24px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-surface-2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-surface)'
            }}
          >
            View on GitHub
          </a>
        </div>

        {/* Stat Cards Row */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            width: '100%',
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="animate-ready animate-card"
              style={{
                textAlign: 'center',
                padding: '0 32px',
                borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div
                className="animate-ready animate-stat"
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
        className="animate-ready animate-heading"
        style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
        }}
      >
        Built With
      </h2>
      <p
        style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem',
          fontSize: '0.95rem',
        }}
      >
        © 2024 ReGainer · Data Science Portfolio Project · Built with ❤️ using React + Gemini AI deployment
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
            className="animate-ready animate-card"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.1rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '9999px',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'default',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.background = 'var(--bg-accent-light)'
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'var(--bg-surface)'
              e.currentTarget.style.color = 'var(--text-secondary)'
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
    <hr style={{
      border: 'none',
      borderTop: '1px solid var(--border)',
      margin: '0'
    }} />
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
          background: 'var(--bg-surface-2)',
          borderRadius: '1rem',
          borderLeft: '4px solid var(--accent)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🎯</span>
          <h2
            className="animate-ready animate-heading"
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
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
            <div key={col.title} className="animate-ready animate-card">
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
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
                  color: 'var(--text-secondary)',
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
            color: 'var(--text-muted)',
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
  const [isDark, setIsDark] = useState(
    () => (localStorage.getItem('regainer-theme') || 'light') === 'dark'
  )

  useEffect(() => {
    const saved = localStorage.getItem('regainer-theme') || 'light'
    document.documentElement.setAttribute('data-theme', saved)
    setIsDark(saved === 'dark')
  }, [])

  const toggleDark = useCallback(() => {
    const html = document.documentElement
    const current = html.getAttribute('data-theme')
    const next = current === 'dark' ? 'light' : 'dark'
    html.setAttribute('data-theme', next)
    localStorage.setItem('regainer-theme', next)
    setIsDark(next === 'dark')
  }, [])

  const activeBtn = {
    background: 'var(--accent)',
    color: 'white',
    borderRadius: '4px',
    padding: '5px 18px',
    fontSize: '13px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
  const inactiveBtn = {
    background: 'transparent',
    color: 'var(--text-secondary)',
    borderRadius: '4px',
    padding: '5px 18px',
    fontSize: '13px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 1000,
      height: '52px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 40px',
    }}>
      {/* LEFT — Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/regainer-logo.jpg"
          alt="ReGainer"
          style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* CENTER — Mode Toggle */}
      <div style={{
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '3px',
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

      {/* RIGHT — GitHub + Dark Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a
          href="https://github.com/aakashamy777/Churn-Data-analysis-"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            background: 'transparent',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.borderColor = 'var(--border-strong)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          GitHub
        </a>
        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--bg-surface-2)',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s ease',
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  )
}

// ─── CTABanner ────────────────────────────────────────────────────────────────

function CTABanner({ setMode }) {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '4rem auto',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '32px 40px',
      textAlign: 'center',
      boxShadow: 'var(--shadow-md)',
    }}>
      <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>
        Want insights on your own data?
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        This case study was built on a fixed dataset. Try the Business Analyzer
        to upload your own customer data and get AI-powered insights.
      </p>
      <button
        onClick={() => setMode('analyzer')}
        style={{
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 28px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.background = 'var(--accent-hover)'}
        onMouseLeave={(e) => e.target.style.background = 'var(--accent)'}
      >
        Try Business Analyzer →
      </button>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState(
    localStorage.getItem('regainer-mode') || 'casestudy'
  )

  const switchMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('regainer-mode', newMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    document.title = mode === 'casestudy'
      ? 'ReGainer — Churn Prediction Case Study'
      : 'ReGainer — Business Data Analyzer';
  }, [mode])

  useEffect(() => {
    // Helper to format numbers dynamically
    const formatNumber = (value, originalStr) => {
      const hasCommas = originalStr.includes(',');
      const isDecimal = originalStr.includes('.');
      const hasRupee = originalStr.includes('₹');
      const hasPercent = originalStr.includes('%');
      
      let formatted = '';
      if (isDecimal) {
        formatted = value.toFixed(1);
      } else {
        formatted = Math.round(value).toString();
      }
      
      if (hasCommas) {
        const parts = formatted.split('.');
        if (originalStr.includes('1,60,800')) {
          let lastThree = parts[0].substring(parts[0].length - 3);
          const otherBits = parts[0].substring(0, parts[0].length - 3);
          if (otherBits !== '') {
            lastThree = ',' + lastThree;
          }
          const res = otherBits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
          formatted = res + (parts[1] ? '.' + parts[1] : '');
        } else {
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          formatted = parts.join('.');
        }
      }
      
      if (hasRupee) formatted = '₹' + formatted;
      if (hasPercent) formatted = formatted + '%';
      return formatted;
    }

    // Helper to run counter animation
    const animateCounter = (el) => {
      const originalText = el.getAttribute('data-original-text') || el.innerText;
      if (!el.getAttribute('data-original-text')) {
        el.setAttribute('data-original-text', originalText);
      }
      
      const cleanNum = parseFloat(originalText.replace(/[^0-9.]/g, ''));
      if (isNaN(cleanNum)) return;
      
      const duration = 1200; // 1.2s
      const startTime = performance.now();
      
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const t = Math.min(elapsed / duration, 1);
        const progress = 1 - Math.pow(1 - t, 4); // easeOutQuart
        
        const currentValue = progress * cleanNum;
        el.innerText = formatNumber(currentValue, originalText);
        
        if (t < 1) {
          requestAnimationFrame(update);
        } else {
          el.innerText = originalText;
        }
      }
      
      requestAnimationFrame(update);
    }

    // Single IntersectionObserver with threshold: 0.15
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('animate-in');
          
          if (el.classList.contains('animate-card')) {
            const parent = el.parentNode;
            if (parent) {
              const cards = Array.from(parent.querySelectorAll('.animate-card'));
              const idx = cards.indexOf(el);
              if (idx !== -1) {
                el.style.transitionDelay = `${idx * 0.1}s`;
              }
            }
          }
          
          if (el.classList.contains('animate-stat')) {
            animateCounter(el);
          }
          
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    const observedElements = new Set();
    const observeNewTargets = () => {
      const targets = document.querySelectorAll('.animate-ready');
      targets.forEach((target) => {
        if (!observedElements.has(target) && !target.classList.contains('animate-in')) {
          observedElements.add(target);
          observer.observe(target);
        }
      });
    };

    // Initial check
    observeNewTargets();

    // Set a short timeout to ensure components are mounted
    const timer = setTimeout(observeNewTargets, 150);

    // MutationObserver to capture dynamically rendered step cards and wizard steps
    const mutationObserver = new MutationObserver(() => {
      observeNewTargets();
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    }
  }, [mode]);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', fontFamily: 'var(--font-sans)', paddingTop: '52px' }}>
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
              color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '6px 14px', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg-surface-2)' }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'var(--bg-surface)' }}
          >
            ← Back to Case Study
          </button>

          {/* Standalone Header */}
          <div style={{ textAlign: 'center', padding: '60px 20px 20px 20px' }}>
            <div
              className="animate-ready animate-label"
              style={{
                display: 'inline-block', background: 'var(--bg-accent-light)',
                border: '1px solid rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)',
                borderRadius: '20px', padding: '4px 16px', fontSize: '12px',
                marginBottom: '16px', letterSpacing: '1px'
              }}
            >
              AI-POWERED BUSINESS TOOL
            </div>

            <p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>ReGainer</p>
            <h1
              className="animate-ready animate-heading"
              style={{ fontSize: '36px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 12px 0' }}
            >
              Business Data Analyzer
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '520px', margin: '0 auto 8px auto' }}>
              Upload any customer CSV dataset and get instant AI-powered churn predictions,
              sales insights, and actionable business recommendations.
            </p>

            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              🔒 Your data never leaves your browser. Only 50 rows sent to AI for analysis.
            </p>
          </div>

          <BusinessAnalyzer />
        </div>
      )}
    </div>
  )
}
