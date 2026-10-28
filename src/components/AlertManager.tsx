import React, { useState } from 'react';
import { AlertItem } from '../types';
import { Bell, Mail, Send, AlertTriangle, Info, Clock, CheckCircle2, FileText } from 'lucide-react';

interface AlertManagerProps {
  alerts: AlertItem[];
  onSendAlert: (payload: any) => Promise<any>;
}

export const AlertManager: React.FC<AlertManagerProps> = ({ alerts, onSendAlert }) => {
  const [title, setTitle] = useState('Urgent: Fire Safety NOC Certificate Renewal Required');
  const [message, setMessage] = useState('Your Fire Safety NOC Certificate is expiring in 10 days. Please upload the renewed certificate to prevent application rejection.');
  const [type, setType] = useState<'WARNING' | 'CRITICAL' | 'INFO' | 'DEADLINE'>('CRITICAL');
  const [channel, setChannel] = useState<'IN_APP' | 'EMAIL' | 'BOTH'>('BOTH');

  const [sending, setSending] = useState(false);
  const [generatedEmailDraft, setGeneratedEmailDraft] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await onSendAlert({
        title,
        message,
        type,
        channel,
        institutionName: 'Apex Institute of Technology & Engineering'
      });
      if (res && res.data && res.data.emailDraft) {
        setGeneratedEmailDraft(res.data.emailDraft);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-rose-400" />
          <h1 className="text-xl font-bold text-white">Compliance Alert Management & Automated Email Dispatch</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Multi-channel alert dispatcher sending automated email notifications and in-app compliance deadline warnings to institution principals and AICTE officers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Create Alert & Draft Email */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Mail className="h-4 w-4 text-indigo-400" />
            <span>Dispatch Compliance Alert & Draft Email</span>
          </h2>

          <form onSubmit={handleSend} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Alert Subject / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Severity Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="WARNING">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="DEADLINE">DEADLINE</option>
                  <option value="INFO">INFO</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Notification Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="BOTH">Email + In-App Alert</option>
                  <option value="EMAIL">Email Only</option>
                  <option value="IN_APP">In-App Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Compliance Warning Message</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow transition cursor-pointer flex items-center justify-center space-x-2 text-xs disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{sending ? 'Dispatching Alert...' : 'Dispatch Alert & Generate Email Draft'}</span>
            </button>
          </form>

          {/* Generated Email Preview Box */}
          {generatedEmailDraft && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-indigo-300 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Generated SMTP Email Body Preview</span>
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto max-h-48">
                {generatedEmailDraft}
              </pre>
            </div>
          )}

        </div>

        {/* Right Column: Live Alerts Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Active In-App & System Alerts ({alerts.length})
          </h2>

          <div className="space-y-3">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {alt.type === 'CRITICAL' ? (
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                    ) : (
                      <Info className="h-4 w-4 text-amber-400" />
                    )}
                    <span className="font-semibold text-xs text-slate-200">{alt.title}</span>
                  </div>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                    alt.type === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {alt.type}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{alt.message}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>Channel: {alt.channel}</span>
                  <span>{new Date(alt.timestamp || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
