import { useState } from 'react'

// ─── Groq API — Real Churn Prediction ────────────────────────────────────────

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY

const analyzeChurn = async (formData) => {
    const orderFreq = (formData.orderCount /
        (formData.tenure + 1)).toFixed(3)
    const inactivityRisk = (formData.daysSinceLastOrder *
        (1 / (formData.orderCount + 1))).toFixed(3)
    const complainXsat = formData.complain ?
        formData.satisfactionScore : 0

    const systemPrompt = `You are a churn prediction system for an e-commerce platform trained on 5,630 customer records achieving 99.63% ROC-AUC.

Top churn predictors by importance:
1. Tenure - weight 0.159 (low tenure = high risk)
2. Order Frequency Score = OrderCount/(Tenure+1) - weight 0.083
3. Complain x SatisfactionScore - weight 0.073
4. Complaint raised - weight 0.069
5. Hours on App - weight 0.047
6. Coupons Used - weight 0.044
7. Days Since Last Order - weight 0.037
8. Cashback Amount - weight 0.037

Classification threshold: 0.40
Segment definitions:
- Segment 0 Mid-Value: tenure~8mo, 17% churn, cashback ₹155
- Segment 1 At-Risk: tenure~9mo, 34% churn, cashback ₹151
- Segment 2 Active Regular: tenure~12mo, 16% churn, cashback ₹199
- Segment 3 Loyal: tenure~16mo, 9% churn, cashback ₹249

Retention strategies:
- HIGH RISK: "Send personalised discount coupon within 48hrs + assign support agent"
- MEDIUM RISK: "Push notification with loyalty points offer"
- LOW RISK: "Monthly reward email to maintain engagement"
- VERY LOW RISK: "VIP program enrollment + early access to sales"

CRITICAL RULE: You must respond ONLY with a valid raw JSON object. Absolutely no markdown, no backticks, no explanation text before or after. Start your response with { and end with }.`

    const userMessage = `Analyze this customer and predict churn risk:

CUSTOMER PROFILE:
- Tenure: ${formData.tenure} months
- Gender: ${formData.gender}
- Marital Status: ${formData.maritalStatus}
- City Tier: ${formData.cityTier}
- Order Count: ${formData.orderCount} orders last month
- Days Since Last Order: ${formData.daysSinceLastOrder} days
- Hours on App: ${formData.hourSpendOnApp} hours/day
- Cashback Amount: ₹${formData.cashbackAmount}
- Coupons Used: ${formData.couponUsed}
- Satisfaction Score: ${formData.satisfactionScore}/5
- Has Complained: ${formData.complain ? 'YES' : 'NO'}
- Devices Registered: ${formData.numberOfDevices}
- Warehouse Distance: ${formData.warehouseToHome} km

PRE-CALCULATED DERIVED FEATURES:
- Order Frequency Score: ${orderFreq}
- Inactivity Risk Score: ${inactivityRisk}
- Complain x Satisfaction: ${complainXsat}

Return this exact JSON structure with no extra text:
{
  "churn_probability": <integer 0-100>,
  "churn_prediction": "<HIGH RISK or MEDIUM RISK or LOW RISK>",
  "confidence": "<High or Medium or Low>",
  "recommended_action": "<specific retention action string>",
  "key_risk_factors": ["<factor 1>", "<factor 2>", "<factor 3>"],
  "segment": "<Segment 0/1/2/3 - Name>",
  "segment_description": "<one line description of this customer>"
}`

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.1,
                max_tokens: 400,
                response_format: { type: "json_object" }
            })
        }
    )

    if (!response.ok) {
        const errData = await response.json()
        throw new Error(`Groq API Error: ${errData.error?.message || response.status}`)
    }

    const data = await response.json()
    const rawText = data.choices[0].message.content
    const cleaned = rawText.replace(/```json|```/g, "").trim()
    return JSON.parse(cleaned)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = [
    'tenure', 'orderCount', 'daysSinceLastOrder',
    'hourSpendOnApp', 'cashbackAmount', 'couponUsed',
    'numberOfDevices', 'warehouseToHome',
]

function getRiskColor(prediction) {
    if (!prediction) return 'var(--accent)'
    const p = prediction.toLowerCase()
    if (p.includes('high')) return 'var(--danger)'
    if (p.includes('medium')) return 'var(--warning)'
    return 'var(--success)'
}

function getProbabilityColor(prob) {
    if (prob > 60) return 'var(--danger)'
    if (prob >= 30) return 'var(--warning)'
    return 'var(--success)'
}

function getRiskEmoji(prediction) {
    const p = (prediction || '').toLowerCase()
    if (p.includes('high')) return '⚠️'
    if (p.includes('medium')) return '⚡'
    return '✅'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormGroup({ label, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</label>
            {children}
        </div>
    )
}

const inputStyle = (hasError) => ({
    width: '100%',
    padding: '0.6rem 0.85rem',
    background: 'var(--bg-surface-2)',
    border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius: '0.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
})

function NumberInput({ value, onChange, min, max, placeholder, hasError }) {
    return (
        <input
            type="number"
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            placeholder={placeholder}
            style={inputStyle(hasError)}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = hasError ? 'var(--danger)' : 'var(--border)')}
        />
    )
}

function SelectInput({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={onChange}
            style={{ ...inputStyle(false), cursor: 'pointer' }}
        >
            {options.map((o) => (
                <option key={o} value={o} style={{ background: 'var(--bg-surface-2)' }}>{o}</option>
            ))}
        </select>
    )
}

function StarRating({ value, onChange }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.4rem',
                        padding: '0.1rem',
                        transition: 'transform 0.15s',
                        filter: star <= value ? 'none' : 'grayscale(1) opacity(0.3)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    ⭐
                </button>
            ))}
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.25rem' }}>{value}/5</span>
        </div>
    )
}

function ToggleSwitch({ value, onChange, label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
                type="button"
                onClick={() => onChange(!value)}
                style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: value ? 'var(--danger)' : 'var(--border)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.25s',
                    flexShrink: 0,
                }}
            >
                <span
                    style={{
                        position: 'absolute',
                        top: '3px',
                        left: value ? '23px' : '3px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'var(--text-primary)',
                        transition: 'left 0.25s',
                        display: 'block',
                    }}
                />
            </button>
            <span style={{ color: value ? 'var(--danger)' : 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                {value ? 'Yes — Complaint Raised' : 'No Complaint'}
            </span>
        </div>
    )
}

function SectionLabel({ children }) {
    return (
        <div
            style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--bg-surface)',
                marginBottom: '0.25rem',
            }}
        >
            {children}
        </div>
    )
}

// ─── Default Panel ─────────────────────────────────────────────────────────────

function DefaultPanel() {
    return (
        <div
            style={{
                border: '2px dashed var(--border)',
                borderRadius: '0.75rem',
                padding: '3rem 2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                height: '100%',
                justifyContent: 'center',
                minHeight: '300px',
            }}
        >
            <div style={{ fontSize: '3rem' }}>🔮</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                Enter customer details and click <strong style={{ color: 'var(--text-primary)' }}>Analyze</strong> to get an instant churn risk assessment powered by Gemini AI
            </p>
        </div>
    )
}

// ─── Loading Panel ────────────────────────────────────────────────────────────

function LoadingPanel() {
    return (
        <div
            style={{
                border: '1px solid var(--border)',
                borderRadius: '0.75rem',
                padding: '3rem 2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
                minHeight: '300px',
                justifyContent: 'center',
                background: 'var(--bg-surface)',
            }}
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '3px solid var(--border)',
                    borderTop: '3px solid var(--accent)',
                    animation: 'spin 0.8s linear infinite',
                }}
            />
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>Analyzing customer profile...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

// ─── Result Panel ─────────────────────────────────────────────────────────────

function ResultPanel({ result }) {
    const riskColor = getRiskColor(result.churn_prediction)
    const probColor = getProbabilityColor(result.churn_probability)
    const riskEmoji = getRiskEmoji(result.churn_prediction)

    return (
        <div
            style={{
                background: 'var(--bg-surface)',
                borderRadius: '0.75rem',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                border: `1px solid ${riskColor}33`,
                animation: 'fadeInUp 0.4s ease forwards',
            }}
        >
            <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

            {/* Risk Badge */}
            <div style={{ textAlign: 'center' }}>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.5rem',
                        background: `${riskColor}22`,
                        border: `2px solid ${riskColor}`,
                        borderRadius: '9999px',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: riskColor,
                        letterSpacing: '0.04em',
                    }}
                >
                    {riskEmoji} {result.churn_prediction}
                </span>
            </div>

            {/* Probability Bar */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Churn Probability</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: probColor }}>{result.churn_probability}%</span>
                </div>
                <div style={{ height: '10px', background: 'var(--bg-surface-2)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${result.churn_probability}%`,
                            background: `linear-gradient(90deg, ${probColor}99, ${probColor})`,
                            borderRadius: '9999px',
                            transition: 'width 1s ease',
                            boxShadow: `0 0 8px ${probColor}66`,
                        }}
                    />
                </div>
            </div>

            {/* Confidence */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Confidence:</span>
                <span
                    style={{
                        padding: '0.2rem 0.7rem',
                        background: 'var(--bg-accent-light)',
                        border: '1px solid var(--accent)',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--accent)',
                    }}
                >
                    {result.confidence} Confidence
                </span>
            </div>

            {/* Recommended Action */}
            <div
                style={{
                    background: 'var(--bg-accent-light)',
                    border: '1px solid var(--accent)',
                    borderRadius: '0.6rem',
                    padding: '1rem',
                }}
            >
                <p style={{ margin: '0 0 0.35rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    🎯 Recommended Action
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {result.recommended_action}
                </p>
            </div>

            {/* Key Risk Factors */}
            <div>
                <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ⚠️ Key Risk Factors
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(result.key_risk_factors || []).map((factor, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span style={{ color: riskColor, flexShrink: 0, marginTop: '1px' }}>•</span>
                            {factor}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Segment Card */}
            <div
                style={{
                    background: 'var(--bg-surface-2)',
                    borderRadius: '0.6rem',
                    padding: '0.875rem 1rem',
                    border: '1px solid var(--border)',
                }}
            >
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    👥 Customer Segment
                </p>
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{result.segment}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{result.segment_description}</p>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChurnPredictor() {
    const [formData, setFormData] = useState({
        tenure: '', gender: 'Male', maritalStatus: 'Married',
        cityTier: '1', orderCount: '', daysSinceLastOrder: '',
        hourSpendOnApp: '', cashbackAmount: '', couponUsed: '',
        satisfactionScore: 3, complain: false,
        numberOfDevices: '', warehouseToHome: '',
    })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [touched, setTouched] = useState({})
    const [formStep, setFormStep] = useState(0)

    const setField = (key) => (e) => {
        setFormData((p) => ({ ...p, [key]: e.target.value }))
        setTouched((p) => ({ ...p, [key]: true }))
    }

    const isFieldError = (key) => touched[key] && (formData[key] === '' || formData[key] === null || formData[key] === undefined)

    const hasTabError = (stepIndex) => {
        if (stepIndex === 0) {
            return isFieldError('tenure')
        }
        if (stepIndex === 1) {
            return ['orderCount', 'daysSinceLastOrder', 'hourSpendOnApp', 'cashbackAmount', 'couponUsed'].some(isFieldError)
        }
        if (stepIndex === 2) {
            return ['numberOfDevices', 'warehouseToHome'].some(isFieldError)
        }
        return false
    }

    const handleAnalyze = async () => {
        const missing = REQUIRED_FIELDS.filter(
            (f) => formData[f] === '' || formData[f] === null || formData[f] === undefined
        )

        if (missing.length > 0) {
            setTouched(REQUIRED_FIELDS.reduce((acc, k) => ({ ...acc, [k]: true }), {}))
            setError('Please fill all fields before analyzing')
            // Auto navigate to the first step with error
            const firstMissing = missing[0]
            if (firstMissing === 'tenure') {
                setFormStep(0)
            } else if (['orderCount', 'daysSinceLastOrder', 'hourSpendOnApp', 'cashbackAmount', 'couponUsed'].includes(firstMissing)) {
                setFormStep(1)
            } else {
                setFormStep(2)
            }
            return
        }

        setError(null)
        setLoading(true)
        setResult(null)

        try {
            const prediction = await analyzeChurn({
                ...formData,
                tenure: Number(formData.tenure),
                orderCount: Number(formData.orderCount),
                daysSinceLastOrder: Number(formData.daysSinceLastOrder),
                hourSpendOnApp: Number(formData.hourSpendOnApp),
                cashbackAmount: Number(formData.cashbackAmount),
                couponUsed: Number(formData.couponUsed),
                numberOfDevices: Number(formData.numberOfDevices),
                warehouseToHome: Number(formData.warehouseToHome),
            })
            setResult(prediction)
        } catch (err) {
            console.error('Prediction error:', err)
            if (err instanceof SyntaxError) {
                setError('Could not parse prediction. Please retry.')
            } else {
                setError(`Prediction failed: ${err.message}`)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <section
            id="predictor"
            style={{ padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}
        >
            {/* Section heading */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span
                    className="animate-ready animate-label"
                    style={{
                        display: 'inline-block',
                        padding: '0.35rem 1rem',
                        background: 'var(--danger-bg)',
                        border: '1px solid var(--danger)',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--danger)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                    }}
                >
                    AI Powered
                </span>
                <h2
                    className="animate-ready animate-heading"
                    style={{
                        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        margin: '0 0 0.75rem',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Try The Live Predictor
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
                    Enter customer details to get an instant churn risk assessment
                </p>
            </div>

            {/* Two-column layout */}
            <div
                className="predictor-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}
            >
                {/* ── LEFT: Form ── */}
                <div
                    className="animate-ready animate-card"
                    style={{
                        background: 'var(--bg-surface)',
                        borderRadius: '0.75rem',
                        padding: '1.75rem',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}
                >
                    {/* Horizontal Steps Stepper */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        background: 'var(--bg-surface-2)',
                        padding: '0.35rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border)'
                    }}>
                        {[
                            { label: 'Profile', icon: '👤', id: 0 },
                            { label: 'Behavior', icon: '🛍️', id: 1 },
                            { label: 'Satisfaction', icon: '⭐', id: 2 }
                        ].map((tab) => {
                            const isActive = formStep === tab.id;
                            const hasError = hasTabError(tab.id);
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`stepper-tab ${isActive ? 'active' : ''}`}
                                    onClick={() => setFormStep(tab.id)}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.4rem',
                                        padding: '0.55rem 0.75rem',
                                        background: isActive ? 'var(--bg-surface)' : 'transparent',
                                        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                        border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                                        position: 'relative'
                                    }}
                                >
                                    <span>{tab.icon}</span>
                                    <span className="tab-label">{tab.label}</span>
                                    {hasError && (
                                        <span style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: 'var(--danger)',
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px'
                                        }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Step 0: Profile */}
                    {formStep === 0 && (
                        <div className="form-subgrid" style={{ animation: 'fadeIn 0.25s ease' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <SectionLabel>Customer Profile</SectionLabel>
                            </div>
                            <FormGroup label="Months with company">
                                <NumberInput value={formData.tenure} onChange={setField('tenure')} min={0} max={60} placeholder="e.g. 12" hasError={isFieldError('tenure')} />
                            </FormGroup>
                            <FormGroup label="Gender">
                                <SelectInput value={formData.gender} onChange={setField('gender')} options={['Male', 'Female']} />
                            </FormGroup>
                            <FormGroup label="Marital Status">
                                <SelectInput value={formData.maritalStatus} onChange={setField('maritalStatus')} options={['Married', 'Single', 'Divorced']} />
                            </FormGroup>
                            <FormGroup label="City Tier">
                                <SelectInput value={formData.cityTier} onChange={setField('cityTier')} options={['1', '2', '3']} />
                            </FormGroup>
                        </div>
                    )}

                    {/* Step 1: Behavior */}
                    {formStep === 1 && (
                        <div className="form-subgrid" style={{ animation: 'fadeIn 0.25s ease' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <SectionLabel>Shopping Behavior</SectionLabel>
                            </div>
                            <FormGroup label="Orders last month">
                                <NumberInput value={formData.orderCount} onChange={setField('orderCount')} min={0} max={20} placeholder="e.g. 3" hasError={isFieldError('orderCount')} />
                            </FormGroup>
                            <FormGroup label="Days since last order">
                                <NumberInput value={formData.daysSinceLastOrder} onChange={setField('daysSinceLastOrder')} min={0} max={60} placeholder="e.g. 7" hasError={isFieldError('daysSinceLastOrder')} />
                            </FormGroup>
                            <FormGroup label="Daily hours on app">
                                <NumberInput value={formData.hourSpendOnApp} onChange={setField('hourSpendOnApp')} min={0} max={10} placeholder="e.g. 2" hasError={isFieldError('hourSpendOnApp')} />
                            </FormGroup>
                            <FormGroup label="Avg cashback received (₹)">
                                <NumberInput value={formData.cashbackAmount} onChange={setField('cashbackAmount')} min={0} max={500} placeholder="e.g. 180" hasError={isFieldError('cashbackAmount')} />
                            </FormGroup>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <FormGroup label="Coupons used last month">
                                    <NumberInput value={formData.couponUsed} onChange={setField('couponUsed')} min={0} max={20} placeholder="e.g. 2" hasError={isFieldError('couponUsed')} />
                                </FormGroup>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Satisfaction */}
                    {formStep === 2 && (
                        <div className="form-subgrid" style={{ animation: 'fadeIn 0.25s ease' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <SectionLabel>Satisfaction & Issues</SectionLabel>
                            </div>
                            <FormGroup label="Satisfaction Score">
                                <StarRating value={formData.satisfactionScore} onChange={(v) => setFormData((p) => ({ ...p, satisfactionScore: v }))} />
                            </FormGroup>
                            <FormGroup label="Raised a complaint?">
                                <ToggleSwitch value={formData.complain} onChange={(v) => setFormData((p) => ({ ...p, complain: v }))} />
                            </FormGroup>
                            <FormGroup label="Number of devices registered">
                                <NumberInput value={formData.numberOfDevices} onChange={setField('numberOfDevices')} min={1} max={6} placeholder="e.g. 2" hasError={isFieldError('numberOfDevices')} />
                            </FormGroup>
                            <FormGroup label="Distance from warehouse (km)">
                                <NumberInput value={formData.warehouseToHome} onChange={setField('warehouseToHome')} min={1} max={100} placeholder="e.g. 15" hasError={isFieldError('warehouseToHome')} />
                            </FormGroup>
                        </div>
                    )}

                    {/* Stepper Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <button
                            type="button"
                            disabled={formStep === 0}
                            onClick={() => setFormStep((p) => p - 1)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                color: formStep === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: formStep === 0 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: formStep === 0 ? 0.4 : 1,
                            }}
                            onMouseEnter={(e) => { if (formStep !== 0) e.currentTarget.style.background = 'var(--bg-surface-2)' }}
                            onMouseLeave={(e) => { if (formStep !== 0) e.currentTarget.style.background = 'transparent' }}
                        >
                            ← Back
                        </button>
                        
                        {formStep < 2 ? (
                            <button
                                type="button"
                                onClick={() => setFormStep((p) => p + 1)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    background: 'var(--bg-surface-2)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '0.5rem',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                Next Step →
                            </button>
                        ) : (
                            <span style={{ fontSize: '0.82rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                                Ready to analyze! ✨
                            </span>
                        )}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            style={{
                                background: 'var(--danger-bg)',
                                border: '1px solid var(--danger)',
                                borderRadius: '0.5rem',
                                padding: '0.75rem 1rem',
                                fontSize: '0.85rem',
                                color: 'var(--danger)',
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.9rem',
                            background: loading ? 'var(--bg-surface-2)' : 'var(--accent)',
                            color: 'var(--text-primary)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            boxShadow: loading ? 'none' : 'var(--shadow-md)',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)' }}
                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
                    >
                        {loading ? (
                            <>
                                <span
                                    style={{
                                        width: '16px', height: '16px', borderRadius: '50%',
                                        border: '2px solid var(--bg-surface-2)', borderTop: '2px solid var(--text-primary)',
                                        animation: 'spin 0.7s linear infinite', display: 'inline-block',
                                    }}
                                />
                                Analyzing...
                            </>
                        ) : (
                            'Analyze Churn Risk →'
                        )}
                    </button>
                </div>

                {/* ── RIGHT: Result Panel ── */}
                <div className="animate-ready animate-card">
                    {loading && <LoadingPanel />}
                    {!loading && !result && <DefaultPanel />}
                    {!loading && result && <ResultPanel result={result} />}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .predictor-grid { grid-template-columns: 1fr !important; }
        }
        .form-subgrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
        }
        @media (max-width: 560px) {
          .form-subgrid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .tab-label {
            display: none;
          }
        }
        .stepper-tab {
          transition: all 0.2s;
        }
        .stepper-tab:not(.active):hover {
          color: var(--text-primary) !important;
          background: rgba(0, 0, 0, 0.04) !important;
        }
        [data-theme="dark"] .stepper-tab:not(.active):hover {
          background: rgba(255, 255, 255, 0.04) !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    )
}
