# Time Series Stock Prediction Dashboard

This repository contains a React frontend dashboard and a FastAPI backend for stock prediction.

## Local development

### Frontend
- `cd frontend`
- `npm install`
- `npm run dev`

### Backend
- `cd Backend`
- `python -m pip install -r requirements.txt`
- `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

## Testing

### Frontend
- `cd frontend`
- `npm test`
- `npm run test:coverage`

### Backend
- `cd Backend`
- `pytest -q test/test_backend.py`

## CI/CD

A GitHub Actions workflow is configured in `.github/workflows/ci.yml` to:
- install backend dependencies and run backend tests
- install frontend dependencies and run frontend unit tests
- build the frontend for production

## Security and source control

- Sensitive data and secret configuration values should never be committed directly.
- Use `.env` files locally and add them to `.gitignore`.
- Example environment templates are provided in `frontend/.env.example` and `Backend/.env.example`.
