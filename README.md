# ReGainer — E-Commerce Customer Churn Prediction & Retention Analytics

> [!NOTE]
> **Core Data Science Sandbox**: All of the exploratory data analysis, predictive modeling (SMOTE, Logistic Regression, Random Forest, XGBoost), customer clustering (K-Means), and NLP sentiment feature engineering were developed and validated in this **[Google Colab Notebook](https://colab.research.google.com/drive/1XjBqiq6-fVrTxc1O5qSTjIU-vf0w0x8e?usp=sharing)**.
>
> This web application serves as the interactive **presentation portfolio and insights dashboard** designed to showcase the results, parameters, segments, and business impact estimates derived directly from the Colab notebook.

ReGainer is an end-to-end Machine Learning and AI-powered analytics platform designed to identify at-risk e-commerce customers and enable proactive retention strategies. By combining predictive modeling (Random Forest / XGBoost), unsupervised customer segmentation (K-Means Clustering), NLP sentiment engineering, and Large Language Models (LLMs via Gemini and Groq), ReGainer turns raw customer data into actionable revenue-saving strategies.

---

## 🚀 Key Features

ReGainer operates in two distinct, interactive modes:

### 1.  Interactive Case Study Mode
Deep dive into a pre-computed analysis of **5,630 customer records** with rich visualization and ROI modeling:
- **Exploratory Data Analysis (EDA)**: Interactive Recharts visualizations showcasing churn distribution, top churn drivers, and customer segment metrics.
- **Model Performance Dashboard**: Comparative analysis of evaluation metrics across Logistic Regression, Random Forest, and XGBoost.
- **K-Means Customer Segmentation**: Categorization of customers into 4 distinct segments (Mid-Value Observers, At-Risk New Joiners, Active Regulars, Loyal High-Value) with tailored retention strategies for each.
- **Business Impact & ROI Calculator**: An interactive simulator that allows stakeholders to adjust business parameters (customer count, average customer revenue, churn rate, retention costs) and calculate the projected Net Business Value and ROI of deploying ReGainer.
- **NLP Sentiment Analysis**: Highlights NLP feature engineering that mapped Complaint and Satisfaction scores into synthetic reviews, ran TextBlob polarity scoring, and demonstrated a **3.8x higher churn risk** for negative-sentiment customers.
- **Interactive Live Predictor**: Predict individual customer churn risk by filling out a customer profile. Powered by LLM inference (via the Groq API) that outputs JSON structure for risk probability, confidence, key risk factors, and recommended action.

### 2. Business Data Analyzer Mode
Allows business owners to upload their own datasets and generate automated, AI-driven insights:
- **CSV Upload & Parser**: Integrated client-side parsing using `PapaParse`.
- **Data Previewer**: Interactive grid showing uploaded data types, missing values, and data statistics.
- **AI-Powered Insights Dashboard**: Integrates LLMs to analyze custom datasets, scoring data quality, calculating key metrics, and generating tailored retention recommendations and dynamic charts.

---

##  Technology Stack

- **Frontend**: React 19, Vite 8, Vanilla CSS (with Tailwind CSS setup)
- **Data Visualization**: Recharts (for interactive line, bar, pie, and scatter charts)
- **Data Parsing**: PapaParse (CSV parser)
- **AI / LLM Integrations**: 
  - **Groq API**: For instant real-time individual customer churn predictions
  - **Gemini API / Generative AI SDK**: For batch processing and generating the automated Business Data Analyzer dashboard
- **Machine Learning & NLP (Background Pipeline)**:
  - **Python**: Pandas, NumPy, Scikit-learn, XGBoost
  - **Unsupervised Learning**: K-Means Clustering
  - **Imbalanced Learning**: SMOTE (Synthetic Minority Over-sampling Technique)
  - **NLP Feature Engineering**: TextBlob Sentiment Analysis

---

##  Machine Learning Performance Summary

The underlying predictive models were trained on a Kaggle E-Commerce Churn dataset consisting of 5,630 records:

| Model | ROC-AUC | F1-Score | Accuracy | Production Status |
| :--- | :---: | :---: | :---: | :---: |
| **Random Forest (Tuned)** | **99.63%** | **97.14%** | **99.02%** | 🏆 **Deploy Candidate** |
| **XGBoost (Baseline)** | 99.56% | 97.14% | 99.02% | Alternative |
| **XGBoost (Tuned)** | 99.62% | 91.22% | 96.80% | Alternative |
| **Logistic Regression** | 82.94% | ~71.00% | ~85.00% | Baseline |

### Key Model Insights:
1. **Tenure** (customer relationship duration) is the single strongest predictor of retention.
2. **SMOTE** was successfully utilized to address severe class imbalance (only 16.8% of the dataset represented churned customers).
3. The **Optimal Decision Threshold** was set at **0.40** to prioritize high Recall, reducing costly false negatives (missed at-risk customers).

---

##  Customer Segmentation Breakdown

Unsupervised K-Means clustering identified 4 key buyer profiles:

| Segment ID | Profile Name | Churn Rate | Avg. Tenure | Avg. Cashback | Retention Strategy |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **0** | Mid-Value Observers | 17% | 8.15 mo | ₹155 | Push notifications with loyalty points offer |
| **1** | At-Risk New Joiners | 34% | 8.88 mo | ₹151 | Personalised coupon + Support agent assignment |
| **2** | Active Regulars | 16% | 12.04 mo | ₹199 | Monthly reward emails to maintain engagement |
| **3** | Loyal High-Value | 9% | 16.01 mo | ₹249 | VIP program enrollment + early access to sales |

---

## ⚙️ Getting Started & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A **Groq API Key** and/or **Gemini API Key** (optional, for running live predictions and custom data analyzer tools)

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aakashamy777/Churn-Data-analysis-.git
   cd Churn-Data-analysis-
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_GROQ_KEY=your_groq_api_key_here
   VITE_GEMINI_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
├── public/
│   └── regainer-logo.jpg      # Embedded application logo
├── src/
│   ├── components/
│   │   ├── BusinessAnalyzer/  # CSV Upload, Preview, and Gemini dashboard components
│   │   ├── BusinessImpact.jsx # ROI & Business value calculator
│   │   ├── ChurnPredictor.jsx # Individual churn prediction (Groq LLM)
│   │   ├── CustomerSegments.jsx # K-Means segments summary and details
│   │   ├── EDAInsights.jsx     # Charts representing EDA, CV, and threshold analysis
│   │   ├── ModelDashboard.jsx  # ML model comparison tables and metrics
│   │   ├── SentimentAnalysis.jsx # NLP review pipeline and sentiment charts
│   │   └── ResumeFooter.jsx   # Portfolio footer detailing technical stack
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── App.jsx                # Main entry point & routing between Case Study and Analyzer
├── index.html
├── package.json
└── README.md
```

---

##  Contributing
Contributions, issues, and feature requests are welcome. Feel free to open a pull request or submit an issue to make ReGainer even more powerful!

---

*ReGainer is developed as a Data Science & AI Portfolio Project.*
