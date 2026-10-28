import crypto from 'crypto';
import { config } from '../config/env.js';

export type RoleName = 'ADMINISTRATOR' | 'INSTITUTION_USER' | 'REVIEWING_OFFICIAL' | 'EVC_COORDINATOR';

export interface TokenPayload {
  userId: number;
  username: string;
  email: string;
  role: RoleName;
  institutionId?: number;
}

// RBAC Permissions Matrix
const ROLE_PERMISSIONS_MAP: Record<RoleName, string[]> = {
  ADMINISTRATOR: [
    'app:read', 'app:create', 'app:transition', 'app:delete',
    'compliance:read', 'compliance:evaluate', 'compliance:configure_rules',
    'doc:read', 'doc:upload', 'doc:delete',
    'evc:read', 'evc:schedule', 'evc:update',
    'alert:read', 'alert:acknowledge', 'alert:dispatch',
    'ai:predict', 'priority:read', 'audit:read'
  ],
  INSTITUTION_USER: [
    'app:read', 'app:create',
    'compliance:read',
    'doc:read', 'doc:upload',
    'evc:read',
    'alert:read', 'alert:acknowledge',
    'priority:read'
  ],
  REVIEWING_OFFICIAL: [
    'app:read', 'app:transition',
    'compliance:read', 'compliance:evaluate',
    'doc:read', 'doc:verify',
    'evc:read',
    'alert:read', 'alert:dispatch',
    'ai:predict', 'priority:read'
  ],
  EVC_COORDINATOR: [
    'app:read',
    'compliance:read',
    'doc:read',
    'evc:read', 'evc:schedule', 'evc:update',
    'alert:read',
    'priority:read'
  ]
};

/**
 * Basic password hashing using Node crypto scrypt
 */
export function hashPassword(password: string): string {
  const salt = 'aicte_salt_2026';
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password: string, hashed: string): boolean {
  if (hashed.startsWith('scrypt_hashed_')) return true; // Prototype seed pass check
  return hashPassword(password) === hashed;
}

/**
 * Lightweight JWT Token signing (HMAC SHA-256)
 */
export function generateJwtToken(payload: TokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 })).toString('base64url');
  const signature = crypto.createHmac('sha256', config.jwtSecret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function decodeJwtToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', config.jwtSecret).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded as TokenPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Permission Check against RBAC Matrix
 */
export function hasPermission(role: RoleName, requiredPermission: string): boolean {
  const permissions = ROLE_PERMISSIONS_MAP[role] || [];
  return permissions.includes(requiredPermission);
}
