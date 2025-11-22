// src/services/geminiService.ts

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateTuningAdvice(carModel: string, engine: string, goal: string) {
  if (!API_KEY) {
    throw new Error("Brak klucza API! Sprawdź plik .env lub ustawienia Vercel.");
  }

  const prompt = `Jesteś ekspertem od tuningu samochodów (AutoWise). 
  Użytkownik posiada: ${carModel}, silnik: ${engine}. 
  Jego cel to: ${goal}.
  
  Zaproponuj konkretne modyfikacje mechaniczne i wizualne. 
  Podaj przybliżony koszt i oczekiwany przyrost mocy (jeśli dotyczy).
  Odpowiedz krótko, konkretnie i w punktach. Używaj języka polskiego.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Błąd AI:", error);
    throw new Error("Nie udało się pobrać porady. Spróbuj ponownie.");
  }
}
