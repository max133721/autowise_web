
import React, { useState } from 'react';
import { TuningResponse } from '../types';
import { Gauge, Zap, DollarSign, ArrowUpCircle, ThumbsUp, ThumbsDown, ShoppingBag, RefreshCw, PlusCircle, AlertOctagon } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface TuningResultCardProps {
  data: TuningResponse;
  onReset: () => void;
  onRefine: (additionalDetails: string) => void;
  language: Language;
}

export const TuningResultCard: React.FC<TuningResultCardProps> = ({ data, onReset, onRefine, language }) => {
  const [refinementText, setRefinementText] = useState('');
  const [showRefine, setShowRefine] = useState(false);
  const t = translations[language].tuningResults;

  const handleSubmitRefinement = (e: React.FormEvent) => {
    e.preventDefault();
    if (refinementText.trim()) {
        onRefine(refinementText);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-6 pb-12">
      
      {/* Header / Stats Board */}
      <div className="bg-slate-900 rounded-xl border border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)] overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Zap className="w-32 h-32 text-violet-500" />
        </div>
        
        <div className="p-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-violet-600 p-2 rounded-lg">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">{t.reportTitle}</h2>
          </div>
          
          <p className="text-lg text-slate-300 mb-6 max-w-2xl">
            {data.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-lg border border-violet-500/30">
              <div className="text-slate-400 text-xs uppercase font-bold mb-1">{t.powerGain}</div>
              <div className="text-2xl font-bold text-violet-400 flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5" /> {data.expectedPowerIncrease}
              </div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-lg border border-violet-500/30">
              <div className="text-slate-400 text-xs uppercase font-bold mb-1">{t.estCost}</div>
              <div className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> {data.estimatedTotalCost}
              </div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-lg border border-violet-500/30">
              <div className="text-slate-400 text-xs uppercase font-bold mb-1">{t.durability}</div>
              <div className="text-lg font-medium text-orange-400 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5" /> {data.reliabilityImpact}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-violet-900/20 p-4 border-t border-violet-500/30">
           <h4 className="text-violet-300 text-sm font-bold uppercase mb-2">{t.drivingExp}</h4>
           <p className="text-slate-300 text-sm italic">"{data.drivingCharacteristics}"</p>
        </div>
      </div>

      {/* Parts Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-200 px-1 flex items-center gap-2">
           <ShoppingBag className="w-5 h-5 text-violet-400" />
           {t.recommendations}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {data.partsRecommendation.map((part, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-violet-500/50 transition-all shadow-lg group">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-slate-700 text-violet-300 text-xs font-bold px-2 py-1 rounded uppercase">{part.type}</span>
                <span className="text-emerald-400 font-mono font-bold">{part.estimatedPrice}</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">{part.name}</h4>
              <p className="text-slate-400 text-sm mb-3">{part.description}</p>
              <div className="text-xs font-semibold text-violet-300 bg-violet-900/30 inline-block px-2 py-1 rounded">
                {t.gain}: {part.powerGain}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pros and Cons */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-green-900/50">
          <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5" /> {t.pros}
          </h3>
          <ul className="space-y-2">
            {data.pros.map((item, i) => (
              <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 border border-red-900/50">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <ThumbsDown className="w-5 h-5" /> {t.cons}
          </h3>
          <ul className="space-y-2">
            {data.cons.map((item, i) => (
              <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Refinement Section */}
      <div className="pt-6 border-t border-slate-800">
        {!showRefine ? (
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <button 
                    onClick={() => setShowRefine(true)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-violet-400 hover:text-violet-300 rounded-lg font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" />
                    {t.refineButton}
                </button>
                <button 
                    onClick={onReset}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    {t.newProject}
                </button>
             </div>
        ) : (
            <form onSubmit={handleSubmitRefinement} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 animate-fade-in">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-violet-500" />
                    {t.refineTitle}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    {t.refineDesc}
                </p>
                <textarea
                    value={refinementText}
                    onChange={(e) => setRefinementText(e.target.value)}
                    placeholder={t.refinePlaceholder}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none placeholder-slate-600 mb-4"
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
                        className="px-6 py-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-violet-900/20"
                    >
                        {t.updateProject}
                    </button>
                </div>
            </form>
        )}
      </div>

    </div>
  );
};
