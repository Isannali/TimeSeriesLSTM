import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services import StockService
from app.ml_model import PredictionModel
from app.schemas import PredictionResponse
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        PredictionModel.initialize()
        logger.info("Sistem startup: Model ML dimuat ke RAM.")
    except Exception as e:
        logger.error(f"Gagal memuat infrastruktur ML: {e}")
    yield

app = FastAPI(title="Saham Forecasting Core API", version="1.2", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "healthy", "core": "running smoothly"}

@app.get("/predict/{ticker}",response_model=PredictionResponse)
def get_stock_prediction(ticker: str):
    try:
        prices = StockService.get_historical_data(ticker.upper())
        predicted_price = PredictionModel.predict_next_price(prices)
        return {
            "ticker": ticker.upper(),
            "last_close_price": round(prices[-1], 2),
            "predicted_next_price": predicted_price,
            "historical_prices": [round(float(p), 2) for p in prices],
            "status": "success"
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error pada {ticker}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")