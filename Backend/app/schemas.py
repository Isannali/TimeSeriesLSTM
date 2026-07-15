from pydantic import BaseModel
from typing import List
class PredictionResponse(BaseModel):
    ticker: str
    last_close_price: float
    predicted_next_price: float
    historical_prices: List[float]
    status: str