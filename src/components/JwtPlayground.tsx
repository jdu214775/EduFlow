import { useState } from 'react';
import { ShieldCheck, Lock, Unlock, ArrowRight, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { jwtFlowSteps } from '../data/initialData';
import { Language } from '../types';

interface JwtPlaygroundProps {
  lang: Language;
  t: Record<string, string>;
}

export const simulatedToken = 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + // Header (Red)
  "eyJzdWJpZCI6IjIwMjYtNDA0NCIsIiAgdXNlcm5hbWUiOiJyaWt1X3dhdGFuYWJlIiwiICByb2xlIjoic3R1ZGVudF9sZWFkZXIiLCIgIGlhdCI6MTc4MjcyMTgyMCwiICBleHAiOjE3ODI4MDg2MjB9." + // Payload (Blue)
  "M2ZmYmIxZDBmNjJmZWFmNmJkMjM0YTM3NWM0NzBlYTEzNWNiNDg4NWZjOWIxZg"; // Signature (Green)

export default function JwtPlayground({ lang, t }: JwtPlaygroundProps) {
  const [token, setToken] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [apiResponse, setApiResponse] = useState<{ status: number; message: string; data?: any } | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isTampered, setIsTampered] = useState(false);

  const handleLogin = () => {
    // Run step by step
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setToken(simulatedToken);
          return prev;
        }
      });
    }, 600);
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentStep(-1);
    setApiResponse(null);
    setIsTampered(false);
  };

  const simulateApiCall = () => {
    setIsRequesting(true);
    setApiResponse(null);

    setTimeout(() => {
      if (!token) {
        setApiResponse({
          status: 401,
          message: lang === 'ja' ? '未認証：Authorization ヘッダーが不足しているか無効です。' : lang === 'uz' ? 'Ruxsat berilmagan: Authorization sarlavhasi topilmadi.' : 'Unauthorized: Authorization header is missing or empty.',
        });
      } else if (isTampered) {
        setApiResponse({
          status: 403,
          message: lang === 'ja' ? '拒否：JWT署名の検証に失敗しました！トークンが改ざんされています。' : lang === 'uz' ? 'Taqiqlangan: JWT imzo tekshiruvi muvaffaqiyatsiz tugadi!' : 'Forbidden: JWT Signature verification failed! The token has been tampered with.',
        });
      } else {
        setApiResponse({
          status: 200,
          message: lang === 'ja' ? '認証成功！' : lang === 'uz' ? 'Muvaffaqiyatli autentifikatsiya!' : 'Authenticated successfully!',
          data: {
            studentId: '2026-4044',
            name: lang === 'ja' ? '渡辺 陸 (Riku)' : 'Riku Watanabe',
            authorizedProjects: ['p1', 'p2', 'p3'],
            claims: { role: 'student_leader', department: 'Database Systems' }
          }
        });
      }
      setIsRequesting(false);
    }, 1000);
  };

  const handleTamperToken = () => {
    if (!token) return;
    setIsTampered(true);
    setToken(token.substring(0, token.length - 15) + "TAMPERED_SIGNATURE");
  };

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.jwtTitle}</h2>
            <p className="text-sm text-emerald-600 font-semibold font-mono mt-0.5">🔒 HMAC SHA-256 Stateless Token Exchange</p>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
          {t.jwtDescription}
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          {!token ? (
            <button
              id="btn-jwt-login"
              onClick={handleLogin}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-sm"
            >
              <Lock className="w-4 h-4" />
              {t.loginSim}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                id="btn-jwt-logout"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <Unlock className="w-4 h-4" />
                {t.logoutSim}
              </button>
              
              {!isTampered && (
                <button
                  id="btn-jwt-tamper"
                  onClick={handleTamperToken}
                  className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-semibold transition-colors"
                  title="Simulate a hacker altering the client-side token"
                >
                  ⚠️ Simulate Token Tampering
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step-by-step timeline animation */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-sm tracking-wide uppercase">{t.jwtFlow}</h3>
          
          <div className="relative pl-6 border-l border-slate-100 space-y-6">
            {jwtFlowSteps.map((step, idx) => {
              const isActive = currentStep === idx;
              const isPast = currentStep > idx;
              return (
                <div key={idx} className="relative">
                  {/* Indicator Dot */}
                  <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    isActive 
                      ? 'bg-indigo-600 border-indigo-600 scale-120 animate-pulse' 
                      : isPast
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'bg-white border-slate-200'
                  }`}>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </span>

                  <div className={`space-y-1 transition-all ${isActive ? 'scale-102 font-medium' : 'opacity-70'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold font-mono ${
                        step.sender === 'client' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {step.sender}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decoder and API response */}
        <div className="lg:col-span-7 space-y-6">
          {/* JWT Visual Parser */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              {t.tokenView}
            </h3>

            {token ? (
              <div className="space-y-4">
                {/* Colored Token Parts */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-xs break-all leading-relaxed whitespace-pre-wrap select-all">
                  <span className="text-red-500 font-bold">{token.split('.')[0]}</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-blue-500 font-bold">{token.split('.')[1]}</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-emerald-500 font-bold">{token.split('.')[2]}</span>
                </div>

                {/* Legend/Decoded Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Header (Alg) */}
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">Header (Metadata)</span>
                    <pre className="text-xs text-slate-700 font-mono leading-relaxed">
                      {`{\n  "alg": "HS256",\n  "typ": "JWT"\n}`}
                    </pre>
                  </div>

                  {/* Payload (Claims) */}
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Payload (Claims)</span>
                    <pre className="text-[11px] text-slate-700 font-mono leading-relaxed">
                      {`{\n  "studentId": "2026-4044",\n  "username": "riku_watanabe",\n  "role": "student_leader",\n  "iat": 1782721820\n}`}
                    </pre>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Signature Status</span>
                    <span className="font-semibold text-slate-700">
                      {isTampered ? '❌ HMAC-SHA256 Signature CORRUPTED' : '✅ HMAC-SHA256 Signature VERIFIED'}
                    </span>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${isTampered ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs italic bg-slate-50 border border-slate-100 rounded-xl">
                {t.notLoggedIn}
              </div>
            )}
          </div>

          {/* Simulated API request tester */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">🔗 Request Playground</h3>
            
            <div className="flex gap-3">
              <button
                id="btn-jwt-request"
                onClick={simulateApiCall}
                disabled={isRequesting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:bg-slate-300"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRequesting ? 'animate-spin' : ''}`} />
                {t.simulatedRequest}
              </button>
            </div>

            {apiResponse && (
              <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 ${
                apiResponse.status === 200 
                  ? 'bg-emerald-50 border-emerald-100 text-slate-800' 
                  : 'bg-red-50/60 border-red-100 text-red-950'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>HTTP Response Status: {apiResponse.status}</span>
                  <span className={apiResponse.status === 200 ? 'text-emerald-600' : 'text-red-500'}>
                    {apiResponse.status === 200 ? 'OK' : 'Error'}
                  </span>
                </div>
                <p className="text-xs">{apiResponse.message}</p>
                {apiResponse.data && (
                  <pre className="mt-2 p-2 bg-white rounded-lg border border-emerald-100 text-[10px] leading-relaxed max-h-[160px] overflow-y-auto">
                    {JSON.stringify(apiResponse.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
