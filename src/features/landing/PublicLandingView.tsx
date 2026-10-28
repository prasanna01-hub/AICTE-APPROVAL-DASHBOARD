import React from 'react';
import { Building2, Award, GraduationCap, FileSpreadsheet, ArrowRight, ShieldCheck, ExternalLink, ChevronRight, Search, Smartphone, Download } from 'lucide-react';
import { ApiStatusBadge } from '../../components/ApiStatusBadge';

interface PublicLandingViewProps {
  onOpenLogin: () => void;
  onNavigateToGovPortal: () => void;
  onNavigateToExecutiveDashboard: () => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({
  onOpenLogin,
  onNavigateToGovPortal,
  onNavigateToExecutiveDashboard
}) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      
      {/* Official Government Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        
        {/* Top Government Ribbon */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 text-[11px] text-slate-600">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800">GOVERNMENT OF INDIA</span>
              <span>•</span>
              <span>Ministry of Education | All India Council for Technical Education</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4 text-[10px] text-slate-500 font-medium">
              <span>Approval Process Handbook 2024–2027</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Portal Status: Active</span>
            </div>
          </div>
        </div>

        {/* Main Header Lockup */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateToGovPortal}>
            <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
              <Building2 className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 tracking-wide leading-tight">AICTE</div>
              <div className="text-[12px] font-extrabold text-[#1e3a8a] leading-tight">All India Council for Technical Education</div>
              <div className="text-[10px] text-slate-500 leading-tight">Ministry of Education, Government of India</div>
            </div>
          </div>

          {/* Nav Items matching Reference Image 2 Top-Left */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-slate-700">
            <a href="#home" className="text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5">Home</a>
            <a href="#about" className="hover:text-blue-900 transition">About Us</a>
            <a href="#approval" className="hover:text-blue-900 transition">Approval</a>
            <a href="#programs" className="hover:text-blue-900 transition">Programs</a>
            <a href="#institutions" className="hover:text-blue-900 transition">Institutions</a>
            <a href="#student" className="hover:text-blue-900 transition">Student</a>
            <a href="#research" className="hover:text-blue-900 transition">Research</a>
          </nav>

          {/* Actions & Login */}
          <div className="flex items-center space-x-3">
            <ApiStatusBadge className="hidden sm:flex" />
            <button
              onClick={onNavigateToGovPortal}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg shadow-2xs transition cursor-pointer flex items-center space-x-1"
            >
              <span>Gov Portal (Landing 2)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={onOpenLogin}
              className="px-4 py-1.5 text-xs font-bold bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg shadow-sm transition cursor-pointer flex items-center space-x-1"
            >
              <span>Login</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section - Matching Reference Image 2 Top-Left */}
      <section className="relative bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 text-white py-16 lg:py-24 border-b border-slate-200 overflow-hidden shadow-inner">
        
        {/* Architectural Image Backdrop / Scrim Overlay */}
        <div className="absolute inset-0 opacity-25 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-[#0f172a]/80 to-slate-950/70"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white text-xs font-medium backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Official AICTE Approval Process Portal AY 2024–25</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Quality Technical Education for a Better Tomorrow
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              AICTE is committed to the development and regulation of technical education in India, ensuring excellence, innovation, and equity in education across technical institutions nationwide.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToExecutiveDashboard}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-[#1e3a8a] text-sm font-bold rounded-lg shadow-lg transition cursor-pointer flex items-center space-x-2"
              >
                <span>Know More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateToGovPortal}
                className="px-6 py-3 bg-blue-900/80 hover:bg-blue-800 text-white border border-blue-400/40 text-sm font-semibold rounded-lg shadow-md transition cursor-pointer flex items-center space-x-2"
              >
                <span>Open Official Gov Dashboard</span>
              </button>
              <a
                href="/download/aicte-portal.apk"
                download="AICTE-Portal-v1.0.0.apk"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md transition cursor-pointer flex items-center space-x-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Download Android App (APK)</span>
                <Download className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Feature Cards Grid Below Hero - Matching Reference Image 2 Top-Left */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Approved Institutions */}
          <div 
            onClick={onNavigateToExecutiveDashboard}
            className="bg-white border border-slate-200 hover:border-blue-400 p-6 rounded-xl shadow-2xs hover:shadow-md transition cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Approved Institutions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Search and verify AICTE approved technical colleges, polytechnics, and universities across India for AY 2024–25.
            </p>
            <div className="text-xs font-bold text-[#1e3a8a] flex items-center space-x-1 pt-1 group-hover:translate-x-1 transition">
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: AICTE Approvals */}
          <div 
            onClick={onNavigateToGovPortal}
            className="bg-white border border-slate-200 hover:border-emerald-400 p-6 rounded-xl shadow-2xs hover:shadow-md transition cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AICTE Approvals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Streamlined online application submission, handbook compliance verification, and EVC committee inspection tracking.
            </p>
            <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1 pt-1 group-hover:translate-x-1 transition">
              <span>Application Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Student Schemes */}
          <div 
            onClick={onNavigateToExecutiveDashboard}
            className="bg-white border border-slate-200 hover:border-amber-400 p-6 rounded-xl shadow-2xs hover:shadow-md transition cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Student Schemes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              National scholarship portals, Pragati, Saksham, Swanath, PMSSS Jammu & Kashmir, and student welfare grants.
            </p>
            <div className="text-xs font-bold text-amber-700 flex items-center space-x-1 pt-1 group-hover:translate-x-1 transition">
              <span>Explore Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Notices & Circulars */}
          <div 
            onClick={onNavigateToGovPortal}
            className="bg-white border border-slate-200 hover:border-purple-400 p-6 rounded-xl shadow-2xs hover:shadow-md transition cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Notices & Circulars</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Latest gazette notifications, handbook revisions, cut-off calendar announcements, and regulatory alerts.
            </p>
            <div className="text-xs font-bold text-purple-700 flex items-center space-x-1 pt-1 group-hover:translate-x-1 transition">
              <span>Read Circulars</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © 2025 All India Council for Technical Education (AICTE), New Delhi. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <a href="#terms" className="hover:text-white transition">Terms of Service</a>
            <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
            <a href="#contact" className="hover:text-white transition">Contact Bureau</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
