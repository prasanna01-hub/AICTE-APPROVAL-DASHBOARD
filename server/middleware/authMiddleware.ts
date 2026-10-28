import { Request, Response, NextFunction } from 'express';
import { decodeJwtToken, RoleName } from '../services/authService.js';

/** Canonical portal roles (kept in sync with src/types/index.ts). */
export type UserRole = RoleName;

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Legacy aliases used by older route definitions and by external API consumers.
 * Everything is normalised to the canonical four portal roles.
 */
const ROLE_ALIASES: Record<string, UserRole> = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  SYSTEM_ADMIN: 'ADMINISTRATOR',
  ADMIN: 'ADMINISTRATOR',
  INSTITUTION_USER: 'INSTITUTION_USER',
  INSTITUTE_ADMIN: 'INSTITUTION_USER',
  REVIEWING_OFFICIAL: 'REVIEWING_OFFICIAL',
  AICTE_REGIONAL_OFFICER: 'REVIEWING_OFFICIAL',
  SCRUTINY_COMMITTEE: 'REVIEWING_OFFICIAL',
  EVC_COORDINATOR: 'EVC_COORDINATOR',
};

export function normalizeRole(role?: string | null): UserRole | undefined {
  if (!role) return undefined;
  return ROLE_ALIASES[String(role).trim().toUpperCase()];
}

const ROLE_PROFILES: Record<UserRole, { id: number; name: string; email: string }> = {
  ADMINISTRATOR: { id: 1, name: 'System Administrator', email: 'admin@aicte-india.org' },
  INSTITUTION_USER: { id: 2, name: 'Dr. S. K. Sharma (Principal)', email: 'principal@apextech.edu.in' },
  REVIEWING_OFFICIAL: { id: 3, name: 'Er. R. K. Viswanathan (Reviewing Official)', email: 'ro.southern@aicte-india.org' },
  EVC_COORDINATOR: { id: 4, name: 'Prof. Ananya Roy (EVC Chair)', email: 'evc.coord@aicte-india.org' },
};

/**
 * JWT authentication middleware.
 * Accepts either a signed bearer token or the prototype `x-user-role` header,
 * normalising both into a canonical portal role.
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = decodeJwtToken(token);
    if (decoded) {
      const role = normalizeRole(decoded.role) || 'INSTITUTION_USER';
      req.user = {
        id: decoded.userId,
        name: ROLE_PROFILES[role].name,
        email: decoded.email,
        role,
        institutionId: decoded.institutionId,
      };
      next();
      return;
    }
  }

  const role = normalizeRole(req.headers['x-user-role'] as string) || 'INSTITUTION_USER';
  req.user = {
    ...ROLE_PROFILES[role],
    role,
    institutionId: role === 'INSTITUTION_USER' ? 1 : undefined,
  };
  next();
}

/**
 * Role-Based Access Control (RBAC) authorization middleware.
 * Accepts canonical roles and legacy aliases.
 */
export function authorizeRoles(...allowedRoles: Array<UserRole | string>) {
  const allowed = new Set(
    allowedRoles.map((role) => normalizeRole(role) || (role as UserRole))
  );

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized: Authentication required.' });
      return;
    }

    if (!allowed.has(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' lacks permission for this action. Allowed: ${[...allowed].join(', ')}`,
      });
      return;
    }

    next();
  };
}
