import React, { useState } from 'react';
import { loginUser } from '../../services/api';
import { RoleName, UserSession } from '../../types';
import { Key, Shield, User, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserSession) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('admin_aicte');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState<RoleName>('ADMINISTRATOR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickSelect = (role: RoleName, user: string) => {
    setSelectedRole(role);
    setUsername(user);
    setPassword('password123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser({
        username,
        password,
        role: selectedRole
      });
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl text-slate-100 space-y-4">
        
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-2 bg-blue-700 text-white rounded-lg">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">AICTE Web Portal Authentication</h2>
            <p className="text-[11px] text-slate-400">JWT Sign-in & Role-Based Access Control</p>
          </div>
        </div>

        {/* Quick Role Selectors */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Select Preset Role:
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickSelect('ADMINISTRATOR', 'admin_aicte')}
              className={`p-2 rounded border text-left cursor-pointer transition ${
                selectedRole === 'ADMINISTRATOR' ? 'bg-blue-900/60 border-blue-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              ⚡ Administrator
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('INSTITUTION_USER', 'principal_apex')}
              className={`p-2 rounded border text-left cursor-pointer transition ${
                selectedRole === 'INSTITUTION_USER' ? 'bg-blue-900/60 border-blue-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              🎓 Institution User
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('REVIEWING_OFFICIAL', 'ro_viswanathan')}
              className={`p-2 rounded border text-left cursor-pointer transition ${
                selectedRole === 'REVIEWING_OFFICIAL' ? 'bg-blue-900/60 border-blue-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              🏛️ Reviewing Official
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('EVC_COORDINATOR', 'evc_coord_ananya')}
              className={`p-2 rounded border text-left cursor-pointer transition ${
                selectedRole === 'EVC_COORDINATOR' ? 'bg-blue-900/60 border-blue-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              📋 EVC Coordinator
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-lg text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Username or Email</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 pl-8 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
              <User className="h-4 w-4 text-slate-500 absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 pl-8 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
              <Lock className="h-4 w-4 text-slate-500 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold shadow cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
