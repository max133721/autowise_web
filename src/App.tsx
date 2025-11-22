import React, { useState } from 'react';
import { generateTuningAdvice } from './services/geminiService';
import { Car, Zap, Settings, Loader2, Globe, CheckCircle } from 'lucide-react';

// Słownik tłumaczeń (zdefiniowany tutaj, aby uniknąć błędów importu)
const translations = {
  pl: {
    title: "AutoWise",
    subtitle: "Twój asystent tuningu AI",
    modelLabel: "Model Samochodu",
    modelPlaceholder: "np. Audi A4 B8",
    engineLabel: "Silnik",
    enginePlaceholder: "np. 2.0 TDI",
    goalLabel: "Cel Modyfikacji",
    goalPlaceholder: "np. Chcę bezpiecznie podnieść moc do 200KM...",
    button: "Generuj Plan Tuningu",
    loading: "Analizowanie...",
    resultTitle: "Twój Plan Tuningu:",
    error: "Wystąpił błąd. Sprawdź klucz API lub spróbuj ponownie."
  },
  en: {
    title: "AutoWise",
    subtitle: "Your AI Tuning Assistant",
    modelLabel: "Car Model",
    modelPlaceholder: "e.g. BMW E46",
    engineLabel: "Engine",
    enginePlaceholder: "e.g. 3.0 Petrol",
    goalLabel: "Modification Goal",
    goalPlaceholder: "e.g. I want to increase power for drifting...",
    button: "Generate Tuning Plan",
    loading: "Analyzing...",
    resultTitle: "Your Tuning Plan:",
    error: "An error occurred. Check API Key or try again."
  }
};

function App() {
  // Stan języka (domyślnie Polski)
  const [lang, setLang] = useState<'pl' | 'en'>('pl');
  const t = translations[lang];

  // Stany formularza
  const [carModel, setCarModel] = useState('');
  const [engine, setEngine] = useState('');
  const [goal, setGoal] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja zmiany języka
  const toggleLanguage = () => {
    setLang(prev => prev === 'pl' ? 'en' : 'pl');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Wywołanie Twojego serwisu AI
      const advice = await generateTuningAdvice(carModel, engine, goal);
      setResult(advice);
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Pasek nawigacyjny */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Car size={24} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AutoWise</span>
          </div>
          
          {/* Przycisk zmiany języka */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition text-sm font-medium"
          >
            <Globe size={16} className="text-blue-400" />
            {lang === 'pl' ? 'PL' : 'EN'}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 text-transparent bg-clip-text">
            {t.title}
          </h1>
          <p className="text-slate-400 text-lg">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Lewa kolumna: Formularz */}
          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.modelLabel}</label>
                  <input 
                    type="text" 
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder={t.modelPlaceholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.engineLabel}</label>
                  <input 
                    type="text" 
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    placeholder={t.enginePlaceholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.goalLabel}</label>
                  <textarea 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={t.goalPlaceholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                {loading ? t.loading : t.button}
              </button>
            </form>
          </div>

          {/* Prawa kolumna: Wyniki */}
          <div className="md:col-span-3">
            {error && (
               <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
                 {error}
               </div>
            )}

            {result ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Settings className="text-green-400" size={24} />
                  </div>
                  {t.resultTitle}
                </h2>
                
                <div className="prose prose-invert prose-blue max-w-none">
                  {/* Renderowanie tekstu z AI z zachowaniem nowych linii */}
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {result}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle size={16} />
                  <span>Wygenerowano przez Gemini AI</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 p-12 border-2 border-dashed border-slate-800 rounded-2xl">
                <Settings size={48} className="mb-4 opacity-20" />
                <p>Wypełnij formularz, aby otrzymać poradę.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
