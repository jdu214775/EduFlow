import { useState } from 'react';
import { mongoV1Collections, mongoV2Collections } from '../data/initialData';
import { Database, ArrowRight, Check, AlertTriangle, Key, Layers, Compass, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface DatabaseVisualizerProps {
  lang: Language;
  t: Record<string, string>;
}

export default function DatabaseVisualizer({ lang, t }: DatabaseVisualizerProps) {
  const [activeSchema, setActiveSchema] = useState<'v1' | 'v2'>('v2');

  const collections = activeSchema === 'v1' ? mongoV1Collections : mongoV2Collections;

  return (
    <div className="space-y-8">
      {/* DB Design Introduction */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.dbDesignTitle}</h2>
            <p className="text-sm text-indigo-600 font-semibold font-mono mt-0.5">📂 Mongoose ODM & MongoDB Atlas</p>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
          {t.dbDescription}
        </p>

        {/* Schema Switcher */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl max-w-md">
          <button
            id="btn-schema-v1"
            onClick={() => setActiveSchema('v1')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSchema === 'v1'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ❌ {t.v1Design}
          </button>
          <button
            id="btn-schema-v2"
            onClick={() => setActiveSchema('v2')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSchema === 'v2'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ✅ {t.v2Design}
          </button>
        </div>
      </div>

      {/* Main Structural Visualizer */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Collection Blocks */}
        <div className="xl:col-span-2 space-y-6">
          {collections.map((coll, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                activeSchema === 'v1' 
                  ? 'bg-red-50/50 border-red-100' 
                  : 'bg-indigo-50/50 border-indigo-100'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${activeSchema === 'v1' ? 'bg-red-500' : 'bg-indigo-500'}`} />
                  <h3 className="font-bold text-slate-900 text-sm tracking-wide font-mono">
                    collections.{coll.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
                  BSON Document
                </span>
              </div>

              {/* Description */}
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 leading-relaxed">
                {coll.description}
              </div>

              {/* Fields Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      <th className="px-6 py-3">Field Name</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Constraint</th>
                      <th className="px-6 py-3">Purpose / Relationship</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coll.fields.map((field, fIdx) => (
                      <tr key={fIdx} className="hover:bg-slate-50/30 font-mono">
                        <td className="px-6 py-3.5 font-semibold text-slate-800 flex items-center gap-1.5">
                          {field.name === '_id' ? (
                            <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : field.isRef ? (
                            <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          ) : (
                            <span className="w-1 h-1 rounded-full bg-slate-300 inline-block shrink-0" />
                          )}
                          {field.name}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            field.type.includes('ObjectId')
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : field.type.includes('Array')
                                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {field.type}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-slate-400">
                          {field.required ? (
                            <span className="text-red-500 font-bold text-[10px] uppercase">Required</span>
                          ) : (
                            <span className="text-slate-300">Optional</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500 font-sans leading-relaxed text-[11px]">
                          {field.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Lessons & Explanatory Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white space-y-4 shadow-xl">
            <h4 className="font-bold text-sm text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Database Architecture Notes
            </h4>

            {activeSchema === 'v1' ? (
              <div className="space-y-4">
                <div className="bg-red-500/10 p-4 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="block font-bold text-red-300 text-xs">Monolithic Nesting Downsides</span>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      Nesting arrays inside a single parent document locks the entire project upon any task update. It limits the ability to assign individual indexes or query independent tasks directly.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-white">Issues Detected:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Document size maximum 16MB limitation of MongoDB could easily be exceeded for long-lived group projects.</li>
                    <li>Updating nested task arrays requires complex mongo aggregate syntax or inefficient pull/push operations.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-indigo-500/10 p-4 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="block font-bold text-indigo-300 text-xs">Referential Modeling Advantages</span>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      By breaking structures into distinct Users, Projects, and Tasks collections tied by MongoDB references (ObjectIds), data is fully normalized.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-white">Improvements Realized:</p>
                  <ul className="list-disc pl-4 space-y-1.5">
                    <li>Each task is an independent document with its own `_id`, allowing fast lookups.</li>
                    <li>Fast index matching on `projectId` and `dueDate` allows our cron daemon to audit looming deadlines instantly.</li>
                    <li>Scales perfectly for student teams with thousands of assignments.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">💡 DB Normalization Summary</h4>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2 font-mono whitespace-pre-line">
              {t.relationDoc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
