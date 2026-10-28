import React, { useEffect, useState } from 'react';
import { Activity, WifiOff } from 'lucide-react';
import { fetchSystemHealth } from '../services/api';

type HealthState = 'CHECKING' | 'ONLINE' | 'OFFLINE';

interface ApiStatusBadgeProps {
  /** Show the resolved API host next to the label. */
  showHost?: boolean;
  className?: string;
}

/**
 * Live backend connectivity indicator.
 * Polls GET /api/health so the portal always shows whether the Express API
 * (Vercel Serverless / Render) is actually reachable from the browser.
 */
export const ApiStatusBadge: React.FC<ApiStatusBadgeProps> = ({ showHost = false, className = '' }) => {
  const [state, setState] = useState<HealthState>('CHECKING');
  const [detail, setDetail] = useState<string>('Pinging backend API…');

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      try {
        const health: any = await fetchSystemHealth();
        if (cancelled) return;
        const services = health?.services || {};
        const api = services.expressBackend?.status || 'UP';
        const uptime = health?.uptimeSeconds ?? 0;
        setState(health?.status === 'HEALTHY' ? 'ONLINE' : 'OFFLINE');
        setDetail(
          `API ${api} · env ${health?.environment || 'production'} · uptime ${uptime}s · ${
            health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : ''
          }`
        );
      } catch (err) {
        if (cancelled) return;
        setState('OFFLINE');
        setDetail('Backend API unreachable from this browser.');
      }
    };

    ping();
    const timer = window.setInterval(ping, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const host =
    typeof window !== 'undefined'
      ? import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`
      : '/api';

  // Direct link to the live backend so anyone can inspect the raw API response.
  const healthUrl = `${host.replace(/\/$/, '')}/health`;

  const styles: Record<HealthState, string> = {
    CHECKING: 'bg-slate-100 text-slate-600 border-slate-300',
    ONLINE: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    OFFLINE: 'bg-rose-50 text-rose-800 border-rose-300',
  };

  const dot: Record<HealthState, string> = {
    CHECKING: 'bg-slate-400 animate-pulse',
    ONLINE: 'bg-emerald-500 animate-pulse',
    OFFLINE: 'bg-rose-500',
  };

  return (
    <a
      href={healthUrl}
      target="_blank"
      rel="noreferrer noopener"
      title={`${detail}\n${healthUrl} — click to open the live API response`}
      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold whitespace-nowrap shrink-0 cursor-pointer hover:shadow-2xs transition ${styles[state]} ${className}`}
    >
      {state === 'OFFLINE' ? (
        <WifiOff className="h-3 w-3" />
      ) : (
        <Activity className="h-3 w-3" />
      )}
      <span className={`h-1.5 w-1.5 rounded-full ${dot[state]}`}></span>
      <span>
        {state === 'CHECKING' ? 'API …' : state === 'ONLINE' ? 'API LIVE' : 'API OFFLINE'}
      </span>
      {showHost && state === 'ONLINE' && (
        <span className="hidden xl:inline text-[9px] font-normal opacity-70">/api</span>
      )}
    </a>
  );
};
