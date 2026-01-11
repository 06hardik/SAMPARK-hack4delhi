import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Scale, FileText, BarChart3, ChevronRight, X, Shield, Activity, Camera, Database, Zap, Lock } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      navigate('/overview');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex flex-col">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm z-10">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-30" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <div className="text-white text-2xl font-bold">S</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                SAMPARK
              </h1>
              <p className="text-xs font-medium text-slate-500 tracking-wider uppercase">
                Smart Automated Municipal Parking & Regulation Kernel
              </p>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-grow w-full px-8 py-20 flex flex-col items-center text-center gap-8">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-blue-400/20 blur-2xl" />
          <div className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/50 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-slate-700">Real-time Monitoring System</span>
          </div>
        </div>

        <h2 className="relative text-6xl font-extrabold max-w-6xl leading-[1.1] tracking-tight">
          <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
            Smart Automated Parking
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Compliance System
          </span>
          <br />
          <span className="text-slate-700 text-5xl">
            for Municipal Governance
          </span>
        </h2>

        <p className="text-xl text-slate-600 max-w-3xl leading-relaxed font-medium">
          Real-time capacity monitoring, automated enforcement, and audit-ready reporting 
          for city parking infrastructure.
        </p>

        <div className="flex items-center gap-4 mt-4">
          <Button 
            size="lg" 
            className="px-10 py-7 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105"
            onClick={() => setShowLogin(true)}
          >
            Login to Dashboard
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 grid grid-cols-3 gap-8 max-w-4xl w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">24/7</div>
            <div className="text-sm font-semibold text-slate-600 mt-1">Real-time Updates</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">100%</div>
            <div className="text-sm font-semibold text-slate-600 mt-1">Audit Compliance</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">AI</div>
            <div className="text-sm font-semibold text-slate-600 mt-1">Powered Detection</div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative w-full px-8 py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Core Capabilities
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Enterprise-grade monitoring and enforcement powered by cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CapabilityCard 
              icon={<Eye />} 
              title="Real-Time Occupancy Monitoring" 
              desc="Live tracking of parking lot utilization with instant updates"
              accent="blue"
            />
            <CapabilityCard 
              icon={<Scale />} 
              title="Automated Rule-Based Enforcement" 
              desc="Automatic violation detection and penalty calculation"
              accent="indigo"
            />
            <CapabilityCard 
              icon={<FileText />} 
              title="Tamper-Proof Audit Logs" 
              desc="Complete timestamped records with blockchain verification"
              accent="violet"
            />
            <CapabilityCard 
              icon={<BarChart3 />} 
              title="Policy Simulation & Analytics" 
              desc="Scenario modeling for impact assessment and planning"
              accent="purple"
            />
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="relative w-full px-8 py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1600px] mx-auto text-center">
          <div className="mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">System Architecture</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              End-to-end traceable compliance pipeline with enterprise security
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50/50 border border-slate-200 rounded-3xl p-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <FlowStep label="Cameras / Sensors" icon={<Camera />} />
              <FlowArrow />
              <FlowStep label="Event Processing" icon={<Database />} />
              <FlowArrow />
              <FlowStep label="Enforcement Engine" icon={<Shield />} />
              <FlowArrow />
              <FlowStep label="Municipal Dashboard" icon={<Activity />} />
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Real-time Processing</div>
                  <div className="text-sm text-slate-600">&lt; 100ms latency</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Enterprise Security</div>
                  <div className="text-sm text-slate-600">End-to-end encryption</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">99.9% Uptime</div>
                  <div className="text-sm text-slate-600">Highly available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="relative w-full px-8 py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Why SAMPARK?
            </h3>
            <p className="text-lg text-slate-600">
              Built for modern municipal governance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureHighlight 
              title="Prevent Illegal Over-parking"
              description="Automatically detect when parking operators exceed authorized capacity"
              icon="🚫"
            />
            <FeatureHighlight 
              title="Reduce Traffic Congestion"
              description="Stop overflow parking from spilling onto streets and blocking traffic"
              icon="🚦"
            />
            <FeatureHighlight 
              title="Data-Driven Decisions"
              description="Make policy changes based on real patterns, not guesswork"
              icon="📊"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full border-t border-slate-200 bg-white py-12">
        <div className="max-w-[1600px] mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900">SAMPARK</span>
          </div>
          <p className="text-base text-slate-600 font-medium mb-2">
            Developed for Municipal Corporations & Urban Governance
          </p>
          <p className="text-sm text-slate-500">
            © 2025 Municipal Corporation of Delhi. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Enhanced Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-center">
              <button
                onClick={() => setShowLogin(false)}
                className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Admin Login</h3>
              <p className="text-blue-100 text-sm">Access your SAMPARK dashboard</p>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Username
                  </label>
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button 
                  className="w-full text-base py-6 font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300"
                  onClick={handleLogin}
                >
                  Login to Dashboard
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-500">
                  Authorized personnel only
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Enhanced Components */

function CapabilityCard({ 
  icon, 
  title, 
  desc, 
  accent 
}: { 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  accent: string;
}) {
  const accentColors = {
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    violet: 'from-violet-500 to-violet-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <Card className="group bg-white border-slate-200 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
      <CardContent className="p-8 text-center flex flex-col items-center gap-5 relative">
        <div className={`w-16 h-16 bg-gradient-to-br ${accentColors[accent as keyof typeof accentColors]} rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h4 className="text-xl font-bold text-slate-900 leading-tight">{title}</h4>
        <p className="text-base text-slate-600 leading-relaxed">{desc}</p>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </CardContent>
    </Card>
  );
}

function FlowStep({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl px-8 py-6 min-w-[200px] text-center shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
      {icon && (
        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}
      <div className="font-semibold text-slate-900">{label}</div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden lg:block">
      <ChevronRight className="w-8 h-8 text-slate-400" />
    </div>
  );
}

function FeatureHighlight({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
