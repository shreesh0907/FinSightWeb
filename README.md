# FinSight AI – Student Financial Decision Simulator

FinSight AI is a comprehensive full-stack application designed to help students and young professionals make better financial decisions. It uses Machine Learning to predict the impact of purchases on financial health, savings goals, and emergency funds.

## 🏗️ System Architecture

This project is built using a modern 3-tier microservice architecture:

1. **Frontend (`FinSightWeb/frontend`)**: A responsive, dynamic React application built with Vite and TailwindCSS.
2. **API Gateway (`Kira-s-logic`)**: A Node.js & Express server that handles user authentication (via Supabase), profile management, and routes prediction requests.
3. **AI Backend (`backend-ai`)**: A Python FastAPI server hosting 5 independent Machine Learning models (XGBoost, Random Forest, Gradient Boosting) that perform financial calculations and SHAP explainability.

---

## 🚀 Getting Started

To run this project locally, you will need to start all three services.

### 1. Database Setup (Supabase)
The Node.js backend requires Supabase for authentication and database management. 
Create a `.env` file inside `Kira-s-logic/` and configure your credentials:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

### 2. Start the AI Backend (Python)
Navigate to the `backend-ai` directory, install the Python dependencies, and start the FastAPI server:
```bash
cd backend-ai
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
*The AI backend will run on `http://localhost:8000`*

### 3. Start the API Gateway (Node.js)
Open a new terminal, navigate to the `Kira-s-logic` directory, install dependencies, and start the Express server:
```bash
cd Kira-s-logic
npm install
npm run dev
```
*The Node.js API Gateway will run on `http://localhost:5000`*

### 4. Start the Frontend (React/Vite)
Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite dev server:
```bash
cd FinSightWeb/frontend
npm install
npm run dev
```
*The Frontend will run on `http://localhost:5173`*

---

## 🧠 Machine Learning Models

The AI backend features a synthetic dataset generator that trains 5 distinct ML models. To retrain the models from scratch:

```bash
cd backend-ai
python app/dataset/generate_dataset.py

# Train models
python app/training/train_financial_health.py
python app/training/train_purchase_risk.py
python app/training/train_goal_delay.py
python app/training/train_course_affordability.py
python app/training/train_subscription_burden.py
```

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend API**: Node.js, Express.js
- **AI/ML Service**: Python 3.12, FastAPI, Scikit-Learn, XGBoost, Pandas
- **Database & Auth**: Supabase, JWT
