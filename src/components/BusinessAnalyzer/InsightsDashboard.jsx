import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const GROQ_KEY = import.meta.env.VITE_GROQ_KEY;

export default function InsightsDashboard({ dataObject, onComplete, preloadedResult }) {
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [stepsCompleted, setStepsCompleted] = useState(0);
    const [analysisResult, setAnalysisResult] = useState(preloadedResult || null);
    const [activeTab, setActiveTab] = useState('churn');
    const [explorerX, setExplorerX] = useState('');
    const [explorerY, setExplorerY] = useState('');

    useEffect(() => {
        if (dataObject?.columns) {
            setExplorerX(dataObject.columns.possibleCategory?.[0] || dataObject.columns.allColumns[0]);
            setExplorerY(dataObject.columns.possibleNumeric?.[0] || dataObject.columns.allColumns[1]);
        }
    }, [dataObject]);
    const [retryCount, setRetryCount] = useState(0);

    const buildPrompt = (dataObject) => {
        const { columns, sample, stats } = dataObject

        return `You are a senior business analyst AI.
Analyze this customer dataset completely.

DATASET INFO:
Total rows in sample: ${sample.length}
All columns: ${columns.allColumns.join(', ')}
Churn/target columns: ${columns.possibleTarget.join(', ') || 'none detected'}
Revenue columns: ${columns.possibleRevenue.join(', ') || 'none detected'}
Numeric columns: ${columns.possibleNumeric.join(', ')}
Category columns: ${columns.possibleCategory.join(', ')}

SAMPLE DATA (first 5 rows):
${JSON.stringify(sample.slice(0, 5), null, 2)}

CRITICAL INSTRUCTION:
You MUST populate EVERY field below with real data.
Do NOT leave any array empty.
Do NOT skip any section.
Do NOT vary what you return between runs.
Always return ALL of the following metrics:
churn rate, average tenure, revenue metrics,
engagement metrics, risk factors, and recommendations.
Every chart must have at least 3-5 data points.

Respond ONLY with raw JSON. No markdown. No backticks.
Start with { end with }.

REQUIRED JSON STRUCTURE — fill every field:
{
  "datasetType": "<describe the business type>",
  
  "dataQuality": {
    "score": <0-100 integer>,
    "issues": ["<at least 1 issue>", "<issue 2>"],
    "strengths": ["<at least 1 strength>", "<strength 2>"]
  },

  "keyMetrics": [
    {
      "label": "Total Customers",
      "value": "${sample.length}",
      "interpretation": "customers in uploaded sample",
      "trend": "neutral"
    },
    {
      "label": "Churn Rate",
      "value": "<calculate from data or estimate>%",
      "interpretation": "<what this means>",
      "trend": "<positive|negative|neutral>"
    },
    {
      "label": "Avg Tenure",
      "value": "<calculate from ${columns.possibleNumeric.find(c => c.toLowerCase().includes('tenure') || c.toLowerCase().includes('month') || c.toLowerCase().includes('active')) || 'most relevant numeric column'} or estimate>",
      "interpretation": "<what this means for retention>",
      "trend": "<positive|negative|neutral>"
    },
    {
      "label": "Revenue Metric",
      "value": "<calculate from ${columns.possibleRevenue[0] || 'available numeric column'}>",
      "interpretation": "<business meaning>",
      "trend": "<positive|negative|neutral>"
    },
    {
      "label": "At-Risk Customers",
      "value": "<count or estimate>",
      "interpretation": "customers showing churn signals",
      "trend": "negative"
    }
  ],

  "churnInsights": {
    "riskLevel": "<High|Medium|Low>",
    "estimatedChurnRate": "<X% based on data>",
    "topRiskFactors": [
      "<factor 1 based on actual columns>",
      "<factor 2>",
      "<factor 3>"
    ],
    "atRiskSegment": "<describe which customers are most at risk>"
  },

  "salesInsights": {
    "topPerformingSegment": "<based on data>",
    "underperformingSegment": "<based on data>",
    "revenuePattern": "<pattern found in data>",
    "growthOpportunity": "<specific opportunity>"
  },

  "churnRecommendations": [
    {
      "priority": "High",
      "action": "<specific action>",
      "detail": "<2 sentence plain English explanation>",
      "expectedImpact": "<measurable outcome>",
      "timeframe": "<realistic timeframe>"
    },
    {
      "priority": "Medium",
      "action": "<specific action>",
      "detail": "<2 sentence plain English explanation>",
      "expectedImpact": "<measurable outcome>",
      "timeframe": "<realistic timeframe>"
    },
    {
      "priority": "Low",
      "action": "<specific action>",
      "detail": "<2 sentence plain English explanation>",
      "expectedImpact": "<measurable outcome>",
      "timeframe": "<realistic timeframe>"
    }
  ],

  "salesRecommendations": [
    {
      "priority": "High",
      "action": "<specific action>",
      "detail": "<2 sentence plain English explanation>",
      "expectedImpact": "<measurable outcome>",
      "timeframe": "<realistic timeframe>"
    },
    {
      "priority": "Medium",
      "action": "<specific action>",
      "detail": "<2 sentence plain English explanation>",
      "expectedImpact": "<measurable outcome>",
      "timeframe": "<realistic timeframe>"
    },
    {
      "priority": "Low",
      "action": "<specific action>",
      "detail": "<2 sentence plain English explanation>",
      "expectedImpact": "<measurable outcome>",
      "timeframe": "<realistic timeframe>"
    }
  ],

  "chartData": {
    "barChart": {
      "title": "<meaningful title based on data>",
      "data": [
        {"label": "<value>", "value": <number>},
        {"label": "<value>", "value": <number>},
        {"label": "<value>", "value": <number>},
        {"label": "<value>", "value": <number>},
        {"label": "<value>", "value": <number>}
      ]
    },
    "pieChart": {
      "title": "<meaningful title>",
      "data": [
        {"name": "<category>", "value": <number>, "color": "#22c55e"},
        {"name": "<category>", "value": <number>, "color": "#ef4444"},
        {"name": "<category>", "value": <number>, "color": "#3b82f6"},
        {"name": "<category>", "value": <number>, "color": "#f59e0b"}
      ]
    },
    "secondBarChart": {
      "title": "<second chart title — different metric from first>",
      "data": [
        {"label": "<value>", "value": <number>},
        {"label": "<value>", "value": <number>},
        {"label": "<value>", "value": <number>},
        {"label": "<value>", "value": <number>}
      ]
    }
  },

  "plainEnglishSummary": "<3-4 sentence summary for non-technical business owner. No ML jargon.>",
  "urgentAction": "<single most important thing to do right now>"
}

Remember: populate every single field. 
No empty arrays. No missing sections.
Same structure every time regardless of dataset.`
    };

    const runAnalysis = () => {
        if (preloadedResult) return; // skip if results already loaded
        setError(null);
        setProgress(0);
        setStepsCompleted(0);
        setAnalysisResult(null);

        // Progress animation logic
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            currentProgress += 2.5; 
            if (currentProgress > 95) currentProgress = 95;
            setProgress(currentProgress);
        }, 100);

        setTimeout(() => setStepsCompleted(1), 1000);
        setTimeout(() => setStepsCompleted(2), 2000);
        setTimeout(() => setStepsCompleted(3), 3000);

        fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + GROQ_KEY
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: buildPrompt(dataObject) }],
                temperature: 0,
                max_tokens: 2000,
                response_format: { type: "json_object" }
            })
        })
        .then(async r => {
            if (!r.ok) {
                const errorData = await r.json().catch(() => ({}));
                const msg = errorData.error?.message || `API Error (${r.status})`;
                throw new Error(msg);
            }
            return r.json();
        })
        .then(data => {
            clearInterval(progressInterval);
            let rawJson = data.choices[0].message.content;
            rawJson = rawJson.replace(/```json|```/g, "").trim();
            const resultObj = JSON.parse(rawJson);
            
            setProgress(100);
            setStepsCompleted(4);
            
            setTimeout(() => {
                setAnalysisResult(resultObj);
                if (onComplete) onComplete(resultObj);
            }, 600);
        })
        .catch(err => {
            clearInterval(progressInterval);
            setError(err.message);
        });
    };

    useEffect(() => {
        if (dataObject && !preloadedResult) {
            runAnalysis();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataObject, retryCount]);

    const renderDashboard = () => {
        const result = analysisResult;

        const handleDownload = () => {
            const content = JSON.stringify(result, null, 2);
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'business-analysis-' + Date.now() + '.txt';
            a.click();
            URL.revokeObjectURL(url);
        };

        const getTrendStyle = (trend) => {
            const t = String(trend).toLowerCase();
            if (t.includes('positive')) return { color: '#22c55e', symbol: '↑' };
            if (t.includes('negative')) return { color: '#ef4444', symbol: '↓' };
            return { color: '#f59e0b', symbol: '→' };
        };

        const getPriorityStyle = (priority) => {
            const p = String(priority).toLowerCase();
            if (p.includes('high')) return { bg: 'rgba(239,68,68,0.2)', color: '#ef4444' };
            if (p.includes('medium')) return { bg: 'rgba(245,158,11,0.2)', color: '#f59e0b' };
            return { bg: 'rgba(59,130,246,0.2)', color: '#3b82f6' };
        };

        const getRiskStyle = (level) => {
            const l = String(level).toLowerCase();
            if (l.includes('high')) return { bg: '#ef4444', color: 'white' };
            if (l.includes('medium')) return { bg: '#f59e0b', color: 'white' };
            return { bg: '#22c55e', color: 'white' };
        };

        return (
            <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
                {/* SECTION 1 — Summary Banner */}
                <div style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--card-radius)', padding: 'var(--card-padding)', marginBottom: '24px',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>{result.datasetType}</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '500px', textAlign: 'right' }}>
                            {result.plainEnglishSummary}
                        </div>
                    </div>
                    <div style={{
                        background: 'var(--danger-bg)', borderLeft: '3px solid var(--danger)',
                        padding: '16px 20px', borderRadius: '0 var(--card-radius) var(--card-radius) 0'
                    }}>
                        ⚡ <span style={{ color: 'var(--danger)', fontWeight: 500 }}>{result.urgentAction}</span>
                    </div>
                </div>

                {/* SECTION 2 — Metrics row */}
                <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', marginBottom: '24px', paddingBottom: '8px' }}>
                    {result.keyMetrics?.map((metric, i) => {
                        const trend = getTrendStyle(metric.trend);
                        return (
                            <div key={i} style={{
                                minWidth: '200px', flex: '1', background: 'var(--bg-surface)',
                                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                                borderRadius: 'var(--card-radius)', padding: 'var(--card-padding)'
                            }}>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>{metric.label}</div>
                                <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                                    {metric.value}
                                    <span style={{ fontSize: '20px', color: trend.color }}>{trend.symbol}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{metric.interpretation}</div>
                            </div>
                        );
                    })}
                </div>

                {/* SECTION 3 — Two charts side by side */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
                    <div style={{
                        flex: '1', minWidth: '300px', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: 'var(--card-padding)'
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center', color: 'var(--text-primary)' }}>
                            {result.chartData?.barChart?.title}
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={result.chartData?.barChart?.data || []}>
                                <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: 'var(--bg-surface-2)'}} contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                                <Bar dataKey="value" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{
                        flex: '1', minWidth: '300px', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: 'var(--card-padding)'
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center', color: 'var(--text-primary)' }}>
                            {result.chartData?.pieChart?.title}
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie 
                                    data={result.chartData?.pieChart?.data || []} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" cy="50%" 
                                    outerRadius={80}
                                >
                                    {(result.chartData?.pieChart?.data || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || 'var(--accent)'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                                <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {result.chartData?.secondBarChart && (
                  <div style={{
                    background: 'var(--bg-surface)', boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--card-radius)',
                    padding: 'var(--card-padding)',
                    marginBottom: '32px'
                  }}>
                    <p style={{
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      textAlign: 'center'
                    }}>
                      {result.chartData.secondBarChart.title}
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={result.chartData.secondBarChart.data}>
                        <XAxis dataKey="label" 
                          tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis 
                          tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                          }} />
                        <Bar dataKey="value" fill="#f59e0b" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* SECTION 4 — Insights tabs */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                        <button
                            onClick={() => setActiveTab('churn')}
                            style={{
                                background: activeTab === 'churn' ? 'var(--accent)' : 'transparent',
                                color: activeTab === 'churn' ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                borderBottom: activeTab === 'churn' ? 'none' : '2px solid transparent',
                                borderRadius: activeTab === 'churn' ? '4px' : '0',
                                padding: '8px 20px', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { if (activeTab !== 'churn') e.target.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={(e) => { if (activeTab !== 'churn') e.target.style.color = 'var(--text-secondary)'; }}
                        >
                            🚨 Churn Risk
                        </button>
                        <button
                            onClick={() => setActiveTab('sales')}
                            style={{
                                background: activeTab === 'sales' ? 'var(--accent)' : 'transparent',
                                color: activeTab === 'sales' ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                borderBottom: activeTab === 'sales' ? 'none' : '2px solid transparent',
                                borderRadius: activeTab === 'sales' ? '4px' : '0',
                                padding: '8px 20px', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { if (activeTab !== 'sales') e.target.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={(e) => { if (activeTab !== 'sales') e.target.style.color = 'var(--text-secondary)'; }}
                        >
                            📈 Sales Opportunities
                        </button>
                        <button
                            onClick={() => setActiveTab('explorer')}
                            style={{
                                background: activeTab === 'explorer' ? 'var(--accent)' : 'transparent',
                                color: activeTab === 'explorer' ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                borderBottom: activeTab === 'explorer' ? 'none' : '2px solid transparent',
                                borderRadius: activeTab === 'explorer' ? '4px' : '0',
                                padding: '8px 20px', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { if (activeTab !== 'explorer') e.target.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={(e) => { if (activeTab !== 'explorer') e.target.style.color = 'var(--text-secondary)'; }}
                        >
                            🔍 Data Explorer
                        </button>
                    </div>

                    {activeTab === 'explorer' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>X-Axis (Category)</label>
                                    <select 
                                        value={explorerX} 
                                        onChange={(e) => setExplorerX(e.target.value)}
                                        style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px', fontSize: '14px' }}
                                    >
                                        {dataObject.columns.allColumns.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Y-Axis (Numeric)</label>
                                    <select 
                                        value={explorerY} 
                                        onChange={(e) => setExplorerY(e.target.value)}
                                        style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px', fontSize: '14px' }}
                                    >
                                        {dataObject.columns.possibleNumeric.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div style={{ height: '300px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dataObject.sample.slice(0, 15)}>
                                        <XAxis dataKey={explorerX} stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                            cursor={{ fill: 'var(--bg-surface-2)' }}
                                        />
                                        <Bar dataKey={explorerY} fill="var(--accent)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
                                    Showing distribution for first 15 records in dataset
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'churn' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '15px', color: 'var(--text-primary)' }}>Estimated churn: {result.churnInsights?.estimatedChurnRate}</span>
                                <span style={{
                                    background: getRiskStyle(result.churnInsights?.riskLevel).bg,
                                    color: getRiskStyle(result.churnInsights?.riskLevel).color,
                                    borderRadius: '20px', padding: '4px 16px', fontSize: '13px', fontWeight: '600'
                                }}>
                                    {result.churnInsights?.riskLevel} Risk
                                </span>
                            </div>
                            
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Top Risk Factors:</div>
                                {result.churnInsights?.topRiskFactors?.map((factor, i) => (
                                    <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '6px', margin: '4px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        {i + 1}. {factor}
                                    </div>
                                ))}
                            </div>
                            
                            <div style={{ background: 'var(--warning-bg)', borderLeft: '4px solid var(--warning)', padding: '16px', borderRadius: '8px' }}>
                                <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '4px' }}>At Risk Segment:</strong>
                                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{result.churnInsights?.atRiskSegment}</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sales' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ background: 'var(--success-bg)', borderLeft: '4px solid var(--success)', padding: '16px', borderRadius: '8px' }}>
                                <strong style={{ color: 'var(--success)', display: 'block', marginBottom: '4px' }}>Top Performing Segment:</strong>
                                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{result.salesInsights?.topPerformingSegment}</span>
                            </div>
                            <div style={{ background: 'var(--warning-bg)', borderLeft: '4px solid var(--warning)', padding: '16px', borderRadius: '8px' }}>
                                <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '4px' }}>Underperforming Segment:</strong>
                                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{result.salesInsights?.underperformingSegment}</span>
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>Revenue Pattern:</strong>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{result.salesInsights?.revenuePattern}</p>
                            </div>
                            <div style={{ background: 'var(--bg-accent-light)', borderLeft: '4px solid var(--accent)', padding: '16px', borderRadius: '8px' }}>
                                <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '4px' }}>Growth Opportunity:</strong>
                                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{result.salesInsights?.growthOpportunity}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* SECTION 5 — Recommendations two columns */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                            🛡️ Reduce Churn
                        </h3>
                        {result.churnRecommendations?.map((rec, i) => {
                            const pStyle = getPriorityStyle(rec.priority);
                            return (
                                <div key={i} style={{
                                    background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                                    borderRadius: 'var(--card-radius)', padding: '20px', marginBottom: '12px', position: 'relative'
                                }}>
                                    <span style={{
                                        position: 'absolute', top: '20px', right: '20px',
                                        background: pStyle.bg, color: pStyle.color,
                                        padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600'
                                    }}>
                                        {rec.priority}
                                    </span>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px', paddingRight: '80px', marginBottom: '8px' }}>{rec.action}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '8px 0', lineHeight: '1.5' }}>{rec.detail}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                        <div style={{ color: 'var(--success)', fontSize: '12px', fontWeight: '500' }}>📈 {rec.expectedImpact}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>⏱️ {rec.timeframe}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                            📈 Boost Sales
                        </h3>
                        {result.salesRecommendations?.map((rec, i) => {
                            const pStyle = getPriorityStyle(rec.priority);
                            return (
                                <div key={i} style={{
                                    background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                                    borderRadius: 'var(--card-radius)', padding: '20px', marginBottom: '12px', position: 'relative'
                                }}>
                                    <span style={{
                                        position: 'absolute', top: '20px', right: '20px',
                                        background: pStyle.bg, color: pStyle.color,
                                        padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600'
                                    }}>
                                        {rec.priority}
                                    </span>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px', paddingRight: '80px', marginBottom: '8px' }}>{rec.action}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '8px 0', lineHeight: '1.5' }}>{rec.detail}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                        <div style={{ color: 'var(--success)', fontSize: '12px', fontWeight: '500' }}>📈 {rec.expectedImpact}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>⏱️ {rec.timeframe}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SECTION 6 — Download button */}
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                        onClick={handleDownload}
                        style={{
                            background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)',
                            borderRadius: '8px', padding: '12px 24px', cursor: 'pointer', fontSize: '15px', fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'var(--bg-accent-light)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                        📥 Download Analysis Report
                    </button>
                </div>
            </div>
        );
    };

    if (analysisResult) {
        return renderDashboard();
    }

    const stepLabels = [
        "Reading your data structure...",
        "Identifying business patterns...",
        "Running AI analysis...",
        "Generating recommendations..."
    ];

    const Spinner = () => (
        <div style={{
            width: '16px', height: '16px', borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid #3b82f6',
            animation: 'spin 1s linear infinite'
        }} />
    );

    return (
        <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--card-radius)', padding: '40px', maxWidth: '700px', margin: '0 auto'
        }}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: '700', marginBottom: '32px', textAlign: 'center' }}>
                AI Analysis in Progress
            </h2>

            {/* ERROR STATE */}
            {error && (
                <div style={{
                    background: 'var(--danger-bg)', border: '1px solid var(--danger)',
                    borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '24px'
                }}>
                    <div style={{ color: 'var(--danger)', fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>
                        ⚠️ Analysis failed: {error}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button onClick={() => setRetryCount(c => c + 1)} style={{
                            background: 'var(--accent)', color: 'white', border: 'none',
                            borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                        }}>
                            Retry
                        </button>
                        <button style={{
                            background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)',
                            borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontSize: '14px'
                        }}>
                            Try Demo Data
                        </button>
                    </div>
                </div>
            )}

            {/* LOADING STATE */}
            {!error && (
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    {/* Progress Bar */}
                    <div style={{
                        background: 'var(--border)', height: '4px', width: '100%',
                        borderRadius: '4px', marginBottom: '32px', overflow: 'hidden'
                    }}>
                        <div style={{
                            background: 'var(--accent)', height: '100%', width: `${progress}%`,
                            transition: 'width 0.2s linear'
                        }} />
                    </div>

                    {/* Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {stepLabels.map((label, index) => {
                            const isCurrent = index === stepsCompleted;
                            const isDone = index < stepsCompleted;

                            let icon = null;
                            if (isDone) icon = <span style={{ color: 'var(--success)', fontSize: '16px' }}>✅</span>;
                            else if (isCurrent) icon = <Spinner />;
                            else icon = <div style={{ width: '16px', height: '16px' }} />;

                            let textColor = 'var(--text-muted)';
                            if (isDone) textColor = 'var(--success)';
                            if (isCurrent) textColor = 'var(--accent)';

                            return (
                                <div key={index} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0',
                                    transition: 'color 0.3s ease', color: textColor, fontSize: '14px',
                                    fontWeight: isCurrent ? 500 : 400
                                }}>
                                    <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                                        {icon}
                                    </div>
                                    <span>{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
