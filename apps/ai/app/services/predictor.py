
from app.schemas.prediction import (
    PredictionPoint,
    PredictionResponse,
)


def predict_next_7_days(symbol: str, historical_prices: list[float]):
    if not historical_prices:
        historical_prices = [100]

    last_price = historical_prices[-1]

    predictions = []

    for day in range(1, 8):
        growth_factor = 1 + (0.005 * day)
        predicted_price = round(last_price * growth_factor, 2)

        predictions.append(
            PredictionPoint(
                day=day,
                predicted_price=predicted_price,
            )
        )

    return PredictionResponse(
        symbol=symbol,
        predictions=predictions,
    )
