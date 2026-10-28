"""
AICTE Approval Delay-Risk Predictor - Python FastAPI Microservice
Provides REST endpoints for Scikit-learn ML delay predictions, model metadata, and training simulation.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from ml_model import AIDelayRiskPredictor

app = FastAPI(
    title="AICTE Delay Risk AI Microservice",
    description="Python FastAPI service providing Scikit-learn machine learning predictions for approval delay risks.",
    version="1.0.0"
)

predictor = AIDelayRiskPredictor()

class ApplicationRiskInput(BaseModel):
    application_id: Optional[int] = Field(1, example=1)
    current_stage: Optional[str] = Field("REGIONAL_SCRUTINY", example="REGIONAL_SCRUTINY")
    current_stage_days: float = Field(..., example=12.5, description="Days elapsed in current stage")
    pending_actions_count: int = Field(..., example=2, description="Count of pending tasks")
    missing_docs_count: int = Field(..., example=1, description="Count of missing handbook documents")
    expired_docs_count: int = Field(..., example=0, description="Count of expired NOC certificates")
    evc_delay_days: float = Field(0.0, example=3.0, description="EVC schedule delay in days")
    historical_samples_count: Optional[int] = Field(100, description="Available training dataset sample size")

@app.get("/")
def health_check():
    return {
        "status": "ONLINE",
        "service": "AICTE Python FastAPI ML Engine",
        "model": "Scikit-Learn Delay Risk Predictor",
        "version": "1.0.0"
    }

@app.post("/predict-delay-risk")
def predict_delay_risk(payload: ApplicationRiskInput):
    """
    Predict AICTE application delay risk category, calibrated probability %, and contributing features.
    """
    try:
        input_data = payload.dict()
        samples_count = payload.historical_samples_count if payload.historical_samples_count is not None else 100
        
        result = predictor.predict_delay_risk(input_data, historical_samples_count=samples_count)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction execution failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
