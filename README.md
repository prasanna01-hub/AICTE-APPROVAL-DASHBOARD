# Integrated AICTE Approval Workflow Automation, Compliance Monitoring & Alert System
## Smart India Hackathon Project - Backend Prototype Architecture

A connected, modular, backend-first prototype integrating AICTE Approval Process Handbook (2024–2027) rules, multi-stage workflow state machine, document expiry tracking, EVC visit scheduling, Python FastAPI Scikit-learn delay risk predictor, intelligent priority scoring, and event-driven alerts.

---

## 1. Technology Stack

- **Main Backend & REST APIs**: Node.js + Express.js (Port 3000)
- **Relational Database**: PostgreSQL (`database/schema.sql`, `database/seed.sql`)
- **AI / ML Microservice**: Python + FastAPI + Scikit-learn (Port 8000)
- **Authentication & RBAC**: JWT + Role-Based Access Control (`ADMINISTRATOR`, `INSTITUTION_USER`, `REVIEWING_OFFICIAL`, `EVC_COORDINATOR`)
- **Document Management**: SHA-256 Checksum Verification & Validity Monitoring
- **Alerts & Notifications**: Event-Driven Alert Engine & SMTP Email Templates

---

## 2. Shared Data Integration Architecture

All system modules work together through shared database relations and event orchestrations:

```text
Application Data
  └── Approval Workflow State Machine (server/services/workflowService.ts)
        └── AICTE Handbook 2024–2027 Compliance Engine (server/services/complianceEngine.ts)
              ├── Document Expiry & Validity Monitor (server/services/documentService.ts)
              └── EVC Visit Schedule & Conflict Detector (server/services/evcService.ts)
                    └── Python FastAPI ML Delay-Risk Predictor (ai_service/main.py)
                          └── Intelligent Priority Scoring Engine (server/services/priorityService.ts)
                                └── Event-Driven Alert Engine (server/services/alertEngine.ts)
                                      └── Auditable Trail & REST APIs (server/services/integratedWorkflow.ts)
```

**Integrated Event Trigger Example**:
1. A document expires or is flagged as missing by `documentService.ts`.
2. `complianceEngine.ts` re-evaluates the application against AICTE Handbook 2024–2027 Rules (e.g. `RULE-FSR-115`, `RULE-NOC-FIRE`).
3. `ml_model.py` (FastAPI) recalculates the application delay risk probability.
4. `priorityService.ts` computes the updated Priority Score and explainable contributing factors.
5. `alertEngine.ts` generates a deduplicated actionable alert and formats an SMTP email draft.
6. `integratedWorkflow.ts` writes a timestamped entry to the `audit_logs` table.

---

## 3. Database Schema Overview (`database/schema.sql`)

The normalised PostgreSQL schema contains 15 relational tables:

1. `roles`: RBAC roles (`ADMINISTRATOR`, `INSTITUTION_USER`, `REVIEWING_OFFICIAL`, `EVC_COORDINATOR`)
2. `permissions`: System action permissions (`app:create`, `compliance:evaluate`, `evc:schedule`, etc.)
3. `role_permissions`: Junction table mapping permissions to roles
4. `users`: User credentials with hashed passwords and assigned roles
5. `institutions`: AICTE institution profiles, category, intake, and infrastructure metrics
6. `applications`: AICTE approval applications with state machine stage
7. `workflow_stage_history`: Auditable trail of stage transitions with remarks and user IDs
8. `pending_actions`: Active tasks requiring action by reviewing officials or applicants
9. `compliance_rules`: Verified AICTE Handbook 2024–2027 rules with source section citations
10. `application_compliance_results`: Application compliance evaluation records
11. `documents`: Document metadata, upload checksums, validity periods, and expiry dates
12. `evc_schedules`: Expert Visit Committee schedules, conflict flags, and checklist progress
13. `alerts`: Deduplicated actionable alerts with severity levels and recommended actions
14. `ai_predictions`: Scikit-learn model prediction results and feature importance
15. `priority_scores`: Transparent priority scores (0-100) with factor breakdowns
16. `audit_logs`: Central audit logging table

---

## 4. Key Backend API REST Endpoints

### Authentication & RBAC
- `POST /api/auth/login`: User sign-in returning JWT token and assigned permissions
- `GET /api/auth/me`: Verify token and active user session

### Applications & Approval Workflow
- `GET /api/applications`: List applications (Filtered by RBAC user role)
- `POST /api/applications`: Submit new AICTE approval application
- `PATCH /api/applications/:id/stage`: Advance workflow stage with validation checks

### Handbook Compliance Monitoring
- `GET /api/compliance/rules`: Fetch verified AICTE Handbook 2024–2027 rules
- `POST /api/compliance/audit`: Evaluate application against handbook rules

### Document Management
- `GET /api/documents/application/:appId`: List uploaded proof documents
- `GET /api/documents/expiry-monitor/:appId`: Monitor missing, expired, and soon-to-expire documents
- `POST /api/documents`: Register document metadata and SHA-256 checksum

### EVC Scheduling & Progress
- `GET /api/evc/schedules`: Fetch EVC inspection visit schedules
- `POST /api/evc/schedules`: Schedule EVC visit with double-booking conflict detection
- `PATCH /api/evc/schedules/:id/status`: Update EVC visit status and report summary

### AI Delay Risk & Priority Scoring
- `POST /api/ai-service/predict-delay`: Microservice proxy to Python FastAPI Scikit-learn ML predictor
- `GET /api/priority/calculate/:appId`: Calculate priority score with transparent factor breakdown
- `GET /api/priority/ranked-queue`: Get ranked queue of applications sorted by priority

### Alerts & System Tests
- `GET /api/alerts`: List active and historic alerts
- `POST /api/alerts/dispatch`: Dispatch actionable alert and generate email draft
- `GET /api/tests/run`: **Automated Backend Test Suite** executing 9 backend integration tests in real-time!

---

## 5. Running the Backend & Automated Tests on Windows

### Prerequisites
- Node.js (v18+)
- Python (v3.10+) with `pip`
- PostgreSQL (v14+)

### Commands

1. **Install Node Dependencies**:
   ```cmd
   npm install
   ```

2. **Prepare Environment File**:
   ```cmd
   copy .env.example .env
   ```

3. **Initialize PostgreSQL Database**:
   ```cmd
   psql -U postgres -d postgres -c "CREATE DATABASE aicte_workflow_db;"
   psql -U postgres -d aicte_workflow_db -f database/schema.sql
   psql -U postgres -d aicte_workflow_db -f database/seed.sql
   ```

4. **Start Python FastAPI ML Microservice**:
   ```cmd
   cd ai_service
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

5. **Start Express API Backend**:
   ```cmd
   npm run dev
   ```

6. **Execute Automated Integration Tests**:
   Open browser or Postman to:
   `http://localhost:3000/api/tests/run`

---

## 6. Live Deployment (Production)

| Component | Platform | Live URL |
|-----------|----------|----------|
| **Frontend (React + Vite SPA)** | Vercel | https://aicte-approval-dashboard.vercel.app |
| **Backend (Express REST API)** | Vercel Serverless | https://aicte-approval-api.vercel.app |
| **API health check** | — | https://aicte-approval-api.vercel.app/api/health |
| **Dashboard KPIs (live JSON)** | — | https://aicte-approval-api.vercel.app/api/dashboard/stats |
| **Android APK (TWA / PWA)** | Direct download | https://aicte-approval-dashboard.vercel.app/download/aicte-portal.apk |

The frontend proxies every `/api/*` call to the backend through a Vercel rewrite
(`vercel.json`), so the browser never hits CORS and the backend can be moved to Render
later by changing **one** URL.

**How to confirm the API is really connected:** the portal header shows a green
`API LIVE` badge (polls `GET /api/health` every 30 s). It is clickable and opens the raw
live JSON. The dashboard KPI cards, stage roadmap, bar chart and status donut are all
computed by the backend from the shared application store
(`server/data/applicationStore.ts`) — the same store the workflow endpoints mutate, so
approving an application immediately changes the dashboard numbers.

The Vercel frontend project is linked to this GitHub repo: **every push to `main`
rebuilds and redeploys the site automatically.** The API is redeployed manually with the
two commands below (its bundle lives in the git-ignored `deploy/` folder).

### 6.1 Build & redeploy

```bash
npm install

# 1. Backend API (serverless bundle)
npm run build:api
cd deploy/aicte-approval-api && vercel deploy --prod --yes --name aicte-approval-api && cd ../..

# 2. Frontend (static bundle, proxied to the API)
API_PROXY_URL="https://aicte-approval-api.vercel.app" npm run build:web
cd deploy/aicte-approval-portal && vercel deploy --prod --yes --name aicte-approval-dashboard
```

### 6.2 Deploy the backend on Render instead

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/prasanna01-hub/AICTE-APPROVAL-DASHBOARD)

`render.yaml` is a ready Render Blueprint (health check `/api/health`, `npm start`).
Either connect the GitHub repo in the Render dashboard, or run the Dockerfile:

```bash
docker build -t aicte-api .
docker run -p 3000:3000 -e CORS_ORIGINS="*" aicte-api
```

Then point the frontend at it: `API_PROXY_URL="https://<your-service>.onrender.com" npm run build:web`
and redeploy the frontend. No code changes required.

### 6.3 Android APK

- Package id: `com.aicte.approvalportal` — minSdk 24, targetSdk 36, version 1.0.0 (code 3)
- Type: **Trusted Web Activity** (Bubblewrap) — fullscreen wrapper around the live site
- Keystore: `mobile/android.keystore` (alias `android`, store/key password `aictePortal2026`)
- Signing certificate SHA-256:
  `81:6E:F8:FC:6C:0E:0E:57:C5:69:D3:95:2A:0B:FA:74:AF:87:A8:F7:A1:A0:28:E6:A7:DC:D0:FC:66:3E:FE:40`
- Digital Asset Links: `https://aicte-approval-dashboard.vercel.app/.well-known/assetlinks.json`
  (already published, so the app opens without a browser address bar)

Rebuild the APK after a new web release:

```bash
cd mobile
export JAVA_HOME="C:\Program Files\Android\Android Studio1\jbr"
export ANDROID_HOME="$LOCALAPPDATA/Android/Sdk"
export BUBBLEWRAP_KEYSTORE_PASSWORD=aictePortal2026
export BUBBLEWRAP_KEY_PASSWORD=aictePortal2026
npx @bubblewrap/cli update     # regenerate the Android project from twa-manifest.json
npx @bubblewrap/cli build --skipPwaValidation
# then sign (bubblewrap's apksigner step breaks on JDK paths containing spaces):
java -jar "$ANDROID_HOME/build-tools/36.1.0/lib/apksigner.jar" sign \
  --ks android.keystore --ks-key-alias android \
  --ks-pass pass:aictePortal2026 --key-pass pass:aictePortal2026 \
  --out AICTE-Portal-v1.0.0.apk app-release-unsigned-aligned.apk
```

### 6.4 Demo accounts (prototype RBAC)

| Role | Username | Sees |
|------|----------|------|
| Administrator | `admin_aicte` | everything |
| Institution | `principal_apex` | own applications only |
| Reviewing Official | `ro_viswanathan` | all, can advance workflow stages |
| EVC Coordinator | `evc_coord_ananya` | EVC scheduling |

### 6.5 API smoke test

`GET /api/tests/run` executes the built-in 9-test backend suite and returns `allPassed: true`.