
from fastapi import APIRouter
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.predictor import predict_next_7_days

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    return predict_next_7_days(payload.symbol, payload.historical_prices)
