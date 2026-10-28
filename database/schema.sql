-- =========================================================================================
-- INTEGRATED AICTE APPROVAL WORKFLOW AUTOMATION, COMPLIANCE MONITORING & ALERT SYSTEM
-- PostgreSQL Normalized Database Schema
-- =========================================================================================

-- 1. Roles & Permissions (RBAC Matrix)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- ADMINISTRATOR, INSTITUTION_USER, REVIEWING_OFFICIAL, EVC_COORDINATOR
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL, -- e.g., app:create, app:transition, compliance:evaluate, evc:schedule
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL REFERENCES roles(name),
    institution_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Institutions Table
CREATE TABLE IF NOT EXISTS institutions (
    id SERIAL PRIMARY KEY,
    aicte_permanent_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL, -- Southern, Western, Northern, Eastern, Central, etc.
    category VARCHAR(100) NOT NULL, -- Engineering, Pharmacy, Management, Architecture
    institution_type VARCHAR(100) DEFAULT 'PRIVATE_SELF_FINANCING', -- GOVT, GOVT_AIDED, PRIVATE_SELF_FINANCING, DEEMED_UNIV
    total_approved_intake INT DEFAULT 0,
    faculty_count INT DEFAULT 0,
    total_land_acres NUMERIC(8,2) DEFAULT 0.0,
    cad_labs_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    institution_id INT REFERENCES institutions(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    approval_type VARCHAR(100) NOT NULL, -- EXTENSION_OF_APPROVAL, NEW_COURSE, INTAKE_INCREASE, NEW_INSTITUTE
    current_stage VARCHAR(100) NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, REGIONAL_SCRUTINY, EVC_INSPECTION, COMMITTEE_VERIFICATION, APPELLATE_REVIEW, FINAL_APPROVAL, REJECTED
    status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    stage_entered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Workflow Stage History & Auditable Trail
CREATE TABLE IF NOT EXISTS workflow_stage_history (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    from_stage VARCHAR(100),
    to_stage VARCHAR(100) NOT NULL,
    performed_by_user_id INT REFERENCES users(id),
    performed_by_role VARCHAR(50) NOT NULL,
    action_remarks TEXT,
    transition_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Pending Actions Tracker
CREATE TABLE IF NOT EXISTS pending_actions (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    action_title VARCHAR(255) NOT NULL,
    assigned_role VARCHAR(50) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, OVERDUE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Configurable Handbook-Based Compliance Rules (AICTE Handbook 2024–2027)
CREATE TABLE IF NOT EXISTS compliance_rules (
    id SERIAL PRIMARY KEY,
    rule_code VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- FACULTY_RATIO, LAND_INFRASTRUCTURE, CAD_LAB, SAFETY_NOC, EVC_CHECKLIST
    source_handbook VARCHAR(255) NOT NULL DEFAULT 'AICTE Approval Process Handbook 2024-2027',
    source_section VARCHAR(100) NOT NULL, -- e.g. "Section 2.4.1", "Appendix 4"
    applicable_year VARCHAR(20) NOT NULL DEFAULT '2024-2027',
    is_verified_official BOOLEAN DEFAULT TRUE, -- Differentiates official verified rules from prototype rules
    threshold_value NUMERIC(10,2),
    threshold_unit VARCHAR(50),
    severity_level VARCHAR(50) DEFAULT 'HIGH', -- CRITICAL, HIGH, MEDIUM, LOW
    version_number INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Application Compliance Audit Results
CREATE TABLE IF NOT EXISTS application_compliance_results (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    rule_id INT REFERENCES compliance_rules(id) ON DELETE CASCADE,
    evaluation_status VARCHAR(50) NOT NULL, -- COMPLIANT, DEFICIENT, EXEMPT, DATA_MISSING
    observed_value VARCHAR(255),
    required_value VARCHAR(255),
    deficiency_description TEXT,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Documents Management Table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    institution_id INT REFERENCES institutions(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- LAND_NOC, FIRE_SAFETY_NOC, BUILDING_SAFETY, FACULTY_CADRE_MATRIX, AUDITED_FINANCE
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_mime_type VARCHAR(100) DEFAULT 'application/pdf',
    checksum_sha256 VARCHAR(64) NOT NULL,
    uploaded_by_user_id INT REFERENCES users(id),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_from TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    verification_status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION' -- PENDING_VERIFICATION, VERIFIED, EXPIRED, REJECTED
);

-- 10. EVC (Expert Visit Committee) Schedules & Progress
CREATE TABLE IF NOT EXISTS evc_schedules (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    institution_id INT REFERENCES institutions(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue_address TEXT NOT NULL,
    assigned_experts TEXT, -- JSON or comma-separated names
    evc_status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, IN_PROGRESS, COMPLETED, POSTPONED, CANCELLED
    preparation_checklist_completed BOOLEAN DEFAULT FALSE,
    has_scheduling_conflict BOOLEAN DEFAULT FALSE,
    conflict_reason TEXT,
    report_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Alerts & Notifications Table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    institution_id INT REFERENCES institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO')),
    reason VARCHAR(100) NOT NULL, -- MISSING_DOCUMENT, EXPIRED_DOCUMENT, COMPLIANCE_FAILURE, STAGE_DELAY, EVC_UPCOMING
    recommended_action TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, ACKNOWLEDGED, RESOLVED
    deduplication_hash VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 12. Alert History / Notification Audit
CREATE TABLE IF NOT EXISTS alert_history (
    id SERIAL PRIMARY KEY,
    alert_id INT REFERENCES alerts(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- GENERATED, ACKNOWLEDGED, RESOLVED, EMAIL_SENT
    performed_by_user_id INT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. AI Prediction Results & Model Metadata
CREATE TABLE IF NOT EXISTS ai_predictions (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL DEFAULT 'v1.0.0-scikit-learn',
    delay_risk_category VARCHAR(50) NOT NULL, -- HIGH_DELAY_RISK, MODERATE_DELAY_RISK, LOW_DELAY_RISK, INSUFFICIENT_DATA
    calibrated_delay_probability NUMERIC(5,2), -- 0-100%
    predicted_days_overdue INT DEFAULT 0,
    contributing_factors TEXT, -- JSON formatted array of key factors
    is_synthetic_prototype BOOLEAN DEFAULT TRUE,
    prediction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Intelligent Priority Scores
CREATE TABLE IF NOT EXISTS priority_scores (
    id SERIAL PRIMARY KEY,
    application_id INT UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    overall_priority_score NUMERIC(5,2) NOT NULL, -- 0 - 100 scale
    priority_level VARCHAR(50) NOT NULL, -- URGENT, HIGH, MEDIUM, LOW
    compliance_severity_weight NUMERIC(5,2) DEFAULT 0.0,
    deadline_urgency_weight NUMERIC(5,2) DEFAULT 0.0,
    ai_delay_risk_weight NUMERIC(5,2) DEFAULT 0.0,
    document_expiry_weight NUMERIC(5,2) DEFAULT 0.0,
    score_explanation TEXT,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- APPLICATION, COMPLIANCE, DOCUMENT, EVC, ALERT
    entity_id INT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    changes_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Helpful Performance Indexes
CREATE INDEX IF NOT EXISTS idx_apps_institution ON applications(institution_id);
CREATE INDEX IF NOT EXISTS idx_apps_stage ON applications(current_stage);
CREATE INDEX IF NOT EXISTS idx_docs_app ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_alerts_app ON alerts(application_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_compliance_app ON application_compliance_results(application_id);
