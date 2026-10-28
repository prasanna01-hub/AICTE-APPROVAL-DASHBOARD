import { Router, Request, Response } from 'express';
import { generateJwtToken, decodeJwtToken, hasPermission, verifyPassword, RoleName } from '../services/authService.js';

const router = Router();

const MOCK_USERS = [
  { id: 1, username: 'admin_aicte', email: 'admin@aicte-india.org', role: 'ADMINISTRATOR' as RoleName, name: 'System Admin' },
  { id: 2, username: 'principal_apex', email: 'principal@apextech.edu.in', role: 'INSTITUTION_USER' as RoleName, institutionId: 1, name: 'Dr. S. K. Sharma (Principal)' },
  { id: 3, username: 'ro_viswanathan', email: 'ro.southern@aicte-india.org', role: 'REVIEWING_OFFICIAL' as RoleName, name: 'Er. R. K. Viswanathan (Regional Officer)' },
  { id: 4, username: 'evc_coord_ananya', email: 'evc.coord@aicte-india.org', role: 'EVC_COORDINATOR' as RoleName, name: 'Prof. Ananya Roy (EVC Chair)' }
];

/**
 * POST /api/auth/login
 * User authentication returning JWT token & RBAC permissions
 */
router.post('/login', (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  const user = MOCK_USERS.find(u => u.username === username || u.email === email || u.role === role) || MOCK_USERS[0];

  const token = generateJwtToken({
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    institutionId: user.institutionId
  });

  res.json({
    success: true,
    message: `Authenticated successfully as ${user.role}`,
    token,
    user
  });
});

/**
 * GET /api/auth/me
 * Active session verification endpoint
 */
router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const reqRole = (req.headers['x-user-role'] as RoleName) || 'INSTITUTION_USER';

  if (token) {
    const decoded = decodeJwtToken(token);
    if (decoded) {
      return res.json({ success: true, user: decoded });
    }
  }

  const defaultUser = MOCK_USERS.find(u => u.role === reqRole) || MOCK_USERS[1];
  res.json({
    success: true,
    user: defaultUser,
    availableRoles: MOCK_USERS.map(u => ({ role: u.role, name: u.name, email: u.email }))
  });
});

export default router;
