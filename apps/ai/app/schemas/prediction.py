
from pydantic import BaseModel
from typing import List


class PredictionRequest(BaseModel):
    symbol: str
    historical_prices: List[float]


class PredictionPoint(BaseModel):
    day: int
    predicted_price: float


class PredictionResponse(BaseModel):
    symbol: str
    predictions: List[PredictionPoint]
