import { FileText, Award, HelpCircle, BookOpen, ExternalLink, Calendar } from 'lucide-react';
import { Language } from '../types';

interface StrugglesReflectionsProps {
  lang: Language;
  t: Record<string, string>;
}

export default function StrugglesReflections({ lang, t }: StrugglesReflectionsProps) {
  return (
    <div className="space-y-8">
      {/* Report Header Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-mono font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-200 border border-indigo-400/20 rounded-lg">
              Theme ④ Semester Assignment
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3 h-3" /> Submitted: June 29, 2026
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {t.reportTitle}
          </h2>
          <p className="text-indigo-200/80 text-sm leading-relaxed font-sans">
            本アプリは、苦労した「多言語対応」「締切通知」「データベース再設計」および「JWT認証」の実装プロセスを完全網羅した、体験型のショーケース一体型ポートフォリオです。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Struggles Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.struggles}</h3>
              <p className="text-xs text-slate-400 font-sans">Overcoming implementation bottlenecks</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Struggle 1 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 hover:border-red-100 transition-colors">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-red-600 bg-red-50 rounded font-mono uppercase">
                Challenge 1: i18n
              </span>
              <p className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
                {t.struggle1}
              </p>
              <span className="block text-xs text-indigo-600 font-medium font-sans cursor-pointer hover:underline">
                → View Multi-language Switcher in top navigation
              </span>
            </div>

            {/* Struggle 2 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 hover:border-red-100 transition-colors">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-red-600 bg-red-50 rounded font-mono uppercase">
                Challenge 2: node-cron
              </span>
              <p className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
                {t.struggle2}
              </p>
              <span className="block text-xs text-indigo-600 font-medium font-sans cursor-pointer hover:underline">
                → Experience Simulator in &quot;{t.cronSim}&quot; tab
              </span>
            </div>

            {/* Struggle 3 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 hover:border-red-100 transition-colors">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-red-600 bg-red-50 rounded font-mono uppercase">
                Challenge 3: Database Design
              </span>
              <p className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
                {t.struggle3}
              </p>
              <span className="block text-xs text-indigo-600 font-medium font-sans cursor-pointer hover:underline">
                → Check Schema comparison in &quot;{t.dbDesign}&quot; tab
              </span>
            </div>
          </div>
        </div>

        {/* Learnings Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.learnings}</h3>
              <p className="text-xs text-slate-400 font-sans">Acquired technical domain knowledge</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Learning 1 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 hover:border-emerald-100 transition-colors">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded font-mono uppercase">
                Learning 1: Frontend-Backend Integration
              </span>
              <p className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
                {t.learning1}
              </p>
            </div>

            {/* Learning 2 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 hover:border-emerald-100 transition-colors">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded font-mono uppercase">
                Learning 2: JWT Architecture
              </span>
              <p className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
                {t.learning2}
              </p>
              <span className="block text-xs text-indigo-600 font-medium font-sans cursor-pointer hover:underline">
                → Test step-by-step handshake in &quot;{t.jwtAuth}&quot; tab
              </span>
            </div>

            {/* Learning 3 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 hover:border-emerald-100 transition-colors">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded font-mono uppercase">
                Learning 3: MongoDB Schema Design
              </span>
              <p className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
                {t.learning3}
              </p>
            </div>

            {/* Learning 4 */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 hover:border-emerald-100 transition-colors">
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded font-mono uppercase">
                Learning 4: Localization Mechanics
              </span>
              <p className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
                {t.learning4}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
