
export type Language = 'pl' | 'en' | 'de';

export enum VehicleType {
  CAR = 'Car',
  MOTORCYCLE = 'Motorcycle',
  TRUCK = 'Truck',
  OTHER = 'Other'
}

export enum EngineType {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
  LPG = 'Petrol + LPG',
  HYBRID = 'Hybrid',
  ELECTRIC = 'Electric'
}

export enum SeverityLevel {
  LOW = 'Niski', // Note: These will be overwritten by AI response in target language, 
                 // but kept as string types. The UI will display whatever AI returns.
  MEDIUM = 'Średni',
  HIGH = 'Wysoki',
  CRITICAL = 'Krytyczny'
}

export enum DifficultyLevel {
  EASY = 'Łatwy',
  MODERATE = 'Średni',
  EXPERT = 'Ekspert'
}

export enum AppMode {
  DIAGNOSIS = 'Diagnosis',
  TUNING = 'Tuning'
}

// --- Diagnosis Types ---

export interface PotentialCause {
  name: string;
  description: string;
  solution: string;
  likelihood: number; // 0-100
  estimatedCost: string;
  difficulty: string; // Changed from Enum to string to allow AI translated values
}

export interface DiagnosisResponse {
  type: 'diagnosis';
  summary: string;
  severity: string; // Changed from Enum to string to allow AI translated values
  safetyWarning: string;
  potentialCauses: PotentialCause[];
  maintenanceTip: string;
  partIdentification?: string;
}

// --- Tuning Types ---

export interface TuningPart {
  name: string;
  type: string;
  description: string;
  estimatedPrice: string;
  powerGain: string;
}

export interface TuningResponse {
  type: 'tuning';
  summary: string;
  expectedPowerIncrease: string;
  drivingCharacteristics: string;
  estimatedTotalCost: string;
  reliabilityImpact: string;
  partsRecommendation: TuningPart[];
  pros: string[];
  cons: string[];
  partIdentification?: string;
}

// --- State ---

export interface AppState {
  isLoading: boolean;
  error: string | null;
  data: DiagnosisResponse | TuningResponse | null;
}
