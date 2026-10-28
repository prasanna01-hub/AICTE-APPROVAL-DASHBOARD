import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

export type UserRole = 'INSTITUTE_ADMIN' | 'AICTE_REGIONAL_OFFICER' | 'SCRUTINY_COMMITTEE' | 'SYSTEM_ADMIN';

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: number;
}

// Extend Express Request type
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Basic JWT Authentication Middleware
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For prototype demonstration, assign default active session user if token absent
    const defaultRole = (req.headers['x-user-role'] as UserRole) || 'INSTITUTE_ADMIN';
    req.user = {
      id: 101,
      name: 'Dr. S. K. Sharma (Principal)',
      email: 'principal@apextech.edu.in',
      role: defaultRole,
      institutionId: 1
    };
    return next();
  }

  // Token decoding simulation
  req.user = {
    id: 101,
    name: 'Authorized User',
    email: 'user@aicte-india.org',
    role: (req.headers['x-user-role'] as UserRole) || 'AICTE_REGIONAL_OFFICER',
    institutionId: 1
  };
  next();
}

/**
 * Role-Based Access Control (RBAC) authorization middleware
 */
export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' lacks permission for this action. Allowed: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}
