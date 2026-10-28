import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  
  // PostgreSQL Database Configuration
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'your_secure_password',
    database: process.env.DB_NAME || 'aicte_workflow_db',
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:your_secure_password@localhost:5432/aicte_workflow_db'
  },

  // Python FastAPI AI Microservice
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',

  // Authentication & Security
  jwtSecret: process.env.JWT_SECRET || 'aicte_super_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Document Storage
  docUploadDir: process.env.DOC_UPLOAD_DIR || './uploads/documents',
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),

  // Email Notifications
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromEmail: process.env.ALERT_FROM_EMAIL || 'notifications@aicte-india.org'
  }
};
