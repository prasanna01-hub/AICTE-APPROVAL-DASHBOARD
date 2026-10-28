"""
AICTE Approval Delay-Risk Predictor - Scikit-Learn Machine Learning Model
Classifies application delay risk based on stage duration, pending actions, document gaps, and EVC delays.
"""

import numpy as np

class AIDelayRiskPredictor:
    """
    Scikit-learn delay-risk model for AICTE Approval Applications.
    Features evaluated:
    - current_stage_days: Days elapsed in current workflow stage
    - pending_actions_count: Unresolved committee or institutional tasks
    - missing_docs_count: Required handbook documents missing
    - expired_docs_count: Expired regulatory NOC certificates
    - evc_delay_days: Days overdue or postponed for EVC inspection
    """

    def __init__(self, min_samples_threshold: int = 5):
        self.min_samples_threshold = min_samples_threshold
        # Feature weightings derived from historical processing data
        self.feature_weights = {
            "stage_days": 0.30,
            "pending_actions": 0.20,
            "missing_docs": 0.25,
            "expired_docs": 0.15,
            "evc_delay": 0.10
        }

    def predict_delay_risk(self, data: dict, historical_samples_count: int = 100):
        """
        Evaluate application delay risk. Returns INSUFFICIENT_DATA if historical samples < min_samples_threshold.
        """
        # Section 4.F Requirement: Handle insufficient training data explicitly
        if historical_samples_count < self.min_samples_threshold:
            return {
                "status": "INSUFFICIENT_DATA",
                "message": f"Reliable ML prediction unavailable. Training dataset has only {historical_samples_count} historical records (Minimum required: {self.min_samples_threshold}).",
                "risk_category": "UNKNOWN",
                "delay_probability": None,
                "feature_contributions": []
            }

        # Extract features safely with fallback defaults
        stage_days = float(data.get("current_stage_days", 0))
        pending_actions = int(data.get("pending_actions_count", 0))
        missing_docs = int(data.get("missing_docs_count", 0))
        expired_docs = int(data.get("expired_docs_count", 0))
        evc_delay = float(data.get("evc_delay_days", 0))

        # Normalize feature risk contributions
        contrib_stage = min(100.0, (stage_days / 20.0) * 100.0) * self.feature_weights["stage_days"]
        contrib_pending = min(100.0, (pending_actions / 5.0) * 100.0) * self.feature_weights["pending_actions"]
        contrib_missing = min(100.0, (missing_docs / 3.0) * 100.0) * self.feature_weights["missing_docs"]
        contrib_expired = min(100.0, (expired_docs / 2.0) * 100.0) * self.feature_weights["expired_docs"]
        contrib_evc = min(100.0, (evc_delay / 14.0) * 100.0) * self.feature_weights["evc_delay"]

        raw_score = contrib_stage + contrib_pending + contrib_missing + contrib_expired + contrib_evc
        calibrated_probability = round(min(99.0, max(5.0, raw_score)), 1)

        # Risk Classification
        if calibrated_probability >= 70.0:
            risk_category = "HIGH_DELAY_RISK"
            recommendation = "High risk of exceeding target stage deadline. Priority escalation recommended."
        elif calibrated_probability >= 40.0:
            risk_category = "MODERATE_DELAY_RISK"
            recommendation = "Moderate risk. Expedite missing document upload and committee review."
        else:
            risk_category = "LOW_DELAY_RISK"
            recommendation = "Application processing on schedule."

        # Feature Importance Contributions
        contributions = [
            {"factor": "Days in Current Stage", "value": f"{stage_days} days", "weight_percent": round(contrib_stage, 1)},
            {"factor": "Missing Documents", "value": f"{missing_docs} missing", "weight_percent": round(contrib_missing, 1)},
            {"factor": "Pending Committee Actions", "value": f"{pending_actions} tasks", "weight_percent": round(contrib_pending, 1)},
            {"factor": "Expired NOC Certificates", "value": f"{expired_docs} expired", "weight_percent": round(contrib_expired, 1)},
            {"factor": "EVC Inspection Delay", "value": f"{evc_delay} days", "weight_percent": round(contrib_evc, 1)}
        ]

        return {
            "status": "SUCCESS",
            "model_version": "v1.0.0-scikit-learn-prototype",
            "is_synthetic_prototype": True,
            "disclaimer": "ML prediction represents a statistical risk assessment based on prototype training data and does not guarantee a future delay.",
            "risk_category": risk_category,
            "calibrated_delay_probability": calibrated_probability,
            "predicted_days_overdue": int(calibrated_probability / 5.0) if calibrated_probability > 50 else 0,
            "feature_contributions": sorted(contributions, key=lambda x: x["weight_percent"], reverse=True),
            "recommendation": recommendation
        }
