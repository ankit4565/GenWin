from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from flood_model import predict_risk


class FloodRiskRequest(BaseModel):
	rainfall_24h: float = Field(..., ge=0)
	rainfall_72h: float = Field(..., ge=0)
	drain_capacity: float = Field(..., ge=0)
	elevation: float = Field(...)
	soil_permeability: float = Field(..., ge=0, le=1)
	drain_condition: float = Field(..., ge=0, le=10)


class FloodRiskResponse(BaseModel):
	risk_score: float
	risk_label: str


app = FastAPI(title="Flood Risk Prediction API")


@app.get("/", tags=["health"])
def root():
	return {"message": "Flood Risk Prediction API is running"}


@app.get("/health", tags=["health"])
def health_check():
	return {"status": "ok"}


@app.post("/predict", response_model=FloodRiskResponse, tags=["prediction"])
def predict(request: FloodRiskRequest):
	try:
		result = predict_risk(
			rainfall_24h=request.rainfall_24h,
			rainfall_72h=request.rainfall_72h,
			drain_capacity=request.drain_capacity,
			elevation=request.elevation,
			soil_permeability=request.soil_permeability,
			drain_condition=request.drain_condition,
		)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail=str(exc))
	except Exception as exc:
		raise HTTPException(status_code=500, detail=f"Prediction failure: {exc}")

	return FloodRiskResponse(**result)


if __name__ == "__main__":
	import uvicorn

	uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

