# FinSight AI - Student Financial Decision Simulator Backend

This is the production-ready Python ML backend for the FinSight AI platform.

## Architecture & Tech Stack
- **Python 3.12**
- **FastAPI** & **Uvicorn** for REST API
- **Scikit-Learn** & **XGBoost** & **Random Forest** for ML models
- **SHAP** for Explainable AI
- **Pandas** & **NumPy** for Data Manipulation
- **Pytest** for testing

## Folder Structure
```
backend-ai/
├── app/
│   ├── api/             # FastAPI routes
│   ├── schemas/         # Pydantic models for validation
│   ├── services/        # Business logic and Model Loader
│   ├── models/          # Saved model files (.pkl)
│   ├── training/        # Scripts to train each ML model
│   ├── dataset/         # Synthetic dataset generator
│   ├── explainability/  # SHAP explainer
│   ├── utils/           # Feature engineering pipeline
│   ├── tests/           # Pytest suite
│   ├── main.py          # FastAPI application entry point
├── Dockerfile           # Docker container configuration
├── docker-compose.yml   # Docker Compose for API service
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
└── README.md            # This file
```

## Setup & Installation

1. **Clone the repository and enter the directory**:
   ```bash
   cd backend-ai
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**:
   Copy `.env.example` to `.env`.

## Dataset Generation
Since real student finance datasets are private, run the generator to create synthetic data:
```bash
python app/dataset/generate_dataset.py
```
This generates `dataset/student_finance_dataset.csv`.

## Training Models
Train each model individually:
```bash
python app/training/train_financial_health.py
python app/training/train_purchase_risk.py
python app/training/train_goal_delay.py
python app/training/train_course_affordability.py
python app/training/train_subscription_burden.py
```
This will save `.pkl` files in `app/models/`.

## Running the API

Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

Swagger Documentation is at: `http://localhost:8000/docs`.

## Docker Deployment

Build and run using Docker Compose:
```bash
docker-compose up -d --build
```

## Testing

Run the test suite using pytest:
```bash
pytest app/tests/
```

## Future Improvements
- Integrate with a PostgreSQL/MongoDB database for persistence.
- Add authentication (JWT) for secure endpoints.
- Deploy to AWS/GCP using Kubernetes or App Runner.
- Expand dataset features and fine-tune hyperparameters via Optuna.
