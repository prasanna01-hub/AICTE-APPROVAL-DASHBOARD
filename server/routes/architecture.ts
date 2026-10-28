import { Router, Request, Response } from 'express';

const router = Router();

const FOLDER_TREE_EXPLANATION = {
  projectTitle: "Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System",
  structure: [
    {
      name: "frontend (src/)",
      purpose: "React.js client application containing UI components, approval workflow tracker, compliance calculator, AI risk predictor, and dashboard.",
      files: [
        "src/App.tsx - Main application layout, header, navigation tabs & role switcher",
        "src/components/Navbar.tsx - Portal header displaying active institutional user & service health indicators",
        "src/components/WorkflowTracker.tsx - Multi-stage AICTE approval workflow automation viewer",
        "src/components/ComplianceChecker.tsx - Real-time AICTE handbook norm auditor (Faculty ratio, Land, Lab)",
        "src/components/AIPredictorCard.tsx - Scikit-learn machine learning risk prediction simulator",
        "src/components/AlertManager.tsx - Email draft generator and in-app alert notification center",
        "src/components/FolderTreeViewer.tsx - Interactive project structure breakdown & beginner setup guide",
        "src/components/ServiceHealthCard.tsx - Real-time REST API health probe for Express, DB, and FastAPI"
      ]
    },
    {
      name: "backend (server/)",
      purpose: "Node.js + Express.js API server orchestrating approval requests, RBAC authorization, and microservice integration.",
      files: [
        "server.ts - Express server entry point configured with Vite dev middleware on port 3000",
        "server/config/env.ts - Centralized configuration loader for environment variables",
        "server/config/db.ts - PostgreSQL connection client setup & health probe",
        "server/middleware/authMiddleware.ts - JWT verification & Role-Based Access Control (RBAC)",
        "server/routes/health.ts - Multi-service system health monitoring endpoint (/api/health)",
        "server/routes/applications.ts - AICTE application CRUD & approval stage state machine (/api/applications)",
        "server/routes/compliance.ts - AICTE handbook norm evaluation engine (/api/compliance)",
        "server/routes/ai.ts - Proxy connection to Python FastAPI ML microservice (/api/ai-service/predict)",
        "server/routes/notifications.ts - Automated email & alert management endpoints (/api/notifications)"
      ]
    },
    {
      name: "database (database/)",
      purpose: "PostgreSQL relational schema scripts defining tables for users, institutions, applications, compliance audits, documents, and alerts.",
      files: [
        "database/schema.sql - Standard DDL script to create tables with foreign keys and insert seed test data"
      ]
    },
    {
      name: "ai_service (ai_service/)",
      purpose: "Python + FastAPI microservice powering Scikit-learn Machine Learning deficiency & approval probability predictions.",
      files: [
        "ai_service/main.py - FastAPI application defining REST endpoints (/predict-approval)",
        "ai_service/ml_model.py - Scikit-learn AICTE compliance evaluator model",
        "ai_service/requirements.txt - Python package dependencies (fastapi, uvicorn, scikit-learn)"
      ]
    },
    {
      name: "document_storage (uploads/documents/)",
      purpose: "Secure document repository structure for institutional proof uploads (Land NOC, Fire Safety, Faculty matrix).",
      files: [
        "server/services/docStorageService.ts - Document upload, verification checksum, and metadata manager"
      ]
    },
    {
      name: "notifications (server/services/notificationService.ts)",
      purpose: "In-app alert engine and automated email draft builder using SMTP credentials.",
      files: [
        "server/services/notificationService.ts - Alert creator and email template renderer"
      ]
    },
    {
      name: "configuration & env (.env.example)",
      purpose: "Environment variable template storing database connection strings, JWT secrets, and API ports safely without hardcoding.",
      files: [
        ".env.example - Documented configuration template for Node, PostgreSQL, FastAPI, and JWT"
      ]
    }
  ]
};

router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: FOLDER_TREE_EXPLANATION
  });
});

export default router;
