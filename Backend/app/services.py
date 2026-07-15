import json
import redis
import yfinance as yf
import logging
from app.config import settings
logger = logging.getLogger(__name__)
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
class StockService:
    @staticmethod
    def get_historical_data(ticker: str) -> list:
        cache_key = f"stock:{ticker}:data"
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
        logger.info(f"Mengambil data {ticker} dari Yahoo Finance.")
        stock = yf.Ticker(ticker)
        df = stock.history(period="1mo") 
        if df.empty:
            raise ValueError(f"Kode saham '{ticker}' tidak ditemukan.")
        prices = df['Close'].values.astype(float).tolist()
        redis_client.setex(cache_key, 3600, json.dumps(prices))
        return prices