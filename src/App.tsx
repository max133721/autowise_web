// src/App.tsx
import React, { useState } from 'react';
import { generateTuningAdvice } from './services/geminiService';
import { Car, Zap, Settings, Loader2 } from 'lucide-react';

function App() {
  const [carModel, setCarModel] = useState('');
  const [engine, setEngine] = useState('');
  const [goal, setGoal] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const advice = await generateTuningAdvice(carModel, engine, goal);
      setResult(advice);
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas łączenia z AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Nagłówek */}
        <header className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Car size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AutoWise
            </h1>
            <p className="text-slate-400">Twój asystent tuningu AI</p>
          </div>
        </header>

        {/* Formularz */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Model Samochodu</label>
                <input
                  type="text"
                  required
                  placeholder="np. Audi A4 B8"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Silnik</label>
                <input
                  type="text"
                  required
                  placeholder="np. 2.0 TDI"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Cel Modyfikacji</label>
              <textarea
                required
                placeholder="np. Chcę bezpiecznie podnieść moc do 200KM i poprawić wygląd zewnętrzny."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Analizowanie...
                </>
              ) : (
                <>
                  <Zap /> Generuj Plan Tuningu
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-900/30 border border-red-800 text-red-300 rounded-lg">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Wyniki */}
        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-400">
              <Settings className="w-5 h-5" /> Proponowane modyfikacje:
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
