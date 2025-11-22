
import React, { useState } from 'react';
import { DiagnosisResponse } from '../types';
import { AlertTriangle, Wrench, DollarSign, CheckCircle2, ShieldAlert, PlusCircle, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ResultCardProps {
  data: DiagnosisResponse;
  onReset: () => void;
  onRefine: (additionalDetails: string) => void;
  language: Language;
}

const getSeverityColor = (severity: string) => {
  // Basic heuristic matching since AI returns translated strings
  const s = severity.toLowerCase();
  if (s.includes('krytyczny') || s.includes('critical') || s.includes('kritisch')) return 'bg-red-500/20 text-red-400 border-red-500/50';
  if (s.includes('wysoki') || s.includes('high') || s.includes('hoch')) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
  if (s.includes('średni') || s.includes('medium') || s.includes('mittel')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
  return 'bg-green-500/20 text-green-400 border-green-500/50';
};

const getDifficultyColor = (difficulty: string) => {
  const d = difficulty.toLowerCase();
  if (d.includes('ekspert') || d.includes('expert')) return 'text-red-400';
  if (d.includes('średni') || d.includes('medium') || d.includes('mittel')) return 'text-yellow-400';
  return 'text-green-400';
};

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset, onRefine, language }) => {
  const [refinementText, setRefinementText] = useState('');
  const [showRefine, setShowRefine] = useState(false);
  const t = translations[language].results;

  const handleSubmitRefinement = (e: React.FormEvent) => {
    e.preventDefault();
    if (refinementText.trim()) {
        onRefine(refinementText);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-6 pb-12">
      
      {/* Header Summary */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-blue-500" />
            {t.diagnosisTitle}
          </h2>
          <span className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${getSeverityColor(data.severity)}`}>
            <AlertTriangle className="w-4 h-4" />
            {t.severity}: {data.severity}
          </span>
        </div>
        
        <p className="text-lg text-slate-300 mb-4 leading-relaxed">
          {data.summary}
        </p>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
            <div>
                <h3 className="font-semibold text-orange-500 text-sm uppercase tracking-wide">{t.safety}</h3>
                <p className="text-slate-400 text-sm mt-1">{data.safetyWarning}</p>
            </div>
        </div>
      </div>

      {/* Potential Causes List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-200 px-1">{t.causes}</h3>
        {data.potentialCauses.map((cause, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/30 transition-colors shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">#{index + 1}</span>
                    <h4 className="text-lg font-bold text-white">{cause.name}</h4>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                        {t.probability}: 
                        <span className="font-semibold text-blue-400">{cause.likelihood}%</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full ml-1 overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${cause.likelihood}%`}}></div>
                        </div>
                    </span>
                </div>
              </div>
              
              <div className="flex gap-2 shrink-0">
                 <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-500 uppercase font-semibold">{t.difficulty}</span>
                    <span className={`text-sm font-medium flex items-center gap-1 ${getDifficultyColor(cause.difficulty)}`}>
                        <Wrench className="w-3 h-3" /> {cause.difficulty}
                    </span>
                 </div>
                 <div className="w-px h-8 bg-slate-700 mx-2 hidden md:block"></div>
                 <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-500 uppercase font-semibold">{t.cost}</span>
                    <span className="text-sm font-medium text-slate-300 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-500" /> {cause.estimatedCost}
                    </span>
                 </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-slate-700/50">
                <div>
                    <h5 className="text-sm font-semibold text-slate-400 mb-1">{t.problemDesc}</h5>
                    <p className="text-slate-300 text-sm leading-relaxed">{cause.description}</p>
                </div>
                <div>
                    <h5 className="text-sm font-semibold text-green-400 mb-1">{t.solution}</h5>
                    <p className="text-slate-300 text-sm leading-relaxed">{cause.solution}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance Tip */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 rounded-xl p-6 border border-blue-800/30">
        <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
            <span className="text-xl">💡</span> {t.expertTip}
        </h3>
        <p className="text-slate-300 text-sm italic">"{data.maintenanceTip}"</p>
      </div>

      {/* Refinement Section */}
      <div className="pt-6 border-t border-slate-800">
        {!showRefine ? (
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <button 
                    onClick={() => setShowRefine(true)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-lg font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" />
                    {t.refineButton}
                </button>
                <button 
                    onClick={onReset}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    {t.newDiagnosis}
                </button>
             </div>
        ) : (
            <form onSubmit={handleSubmitRefinement} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 animate-fade-in">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-blue-500" />
                    {t.refineTitle}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    {t.refineDesc}
                </p>
                <textarea
                    value={refinementText}
                    onChange={(e) => setRefinementText(e.target.value)}
                    placeholder={t.refinePlaceholder}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder-slate-600 mb-4"
                    autoFocus
                />
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={() => setShowRefine(false)}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors font-medium"
                    >
                        {t.cancel}
                    </button>
                    <button 
                        type="submit"
                        disabled={!refinementText.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20"
                    >
                        {t.update}
                    </button>
                </div>
            </form>
        )}
      </div>

    </div>
  );
};
