export type InjectionSite =
  | 'abdomen_right'
  | 'abdomen_left'
  | 'thigh_right'
  | 'thigh_left'
  | 'arm_right'
  | 'arm_left';

export interface DoseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  medication: string;
  dosage: string; // e.g. "0.5mg", "1.0mg"
  injectionSite: InjectionSite;
  needleChanged: boolean;
  notes?: string;
  painLevel?: number; // 1-5
}

export type SymptomType =
  | 'nausea'
  | 'reflux'
  | 'constipation'
  | 'headache'
  | 'fatigue'
  | 'diarrhea'
  | 'early_satiety'
  | 'bloating'
  | 'dizziness'
  | 'other';

export interface SymptomRecord {
  id: string;
  date: string;
  time: string;
  symptomType: SymptomType;
  symptomName: string;
  severity: number; // 1 to 5
  mood: number; // 1 (Péssimo) to 5 (Excelente)
  physicalWellbeing: number; // 1 to 5
  hoursAfterDose?: number;
  notes?: string;
  aiAdvice?: {
    immediateRelief: string[];
    nutritionalAdjustment: string;
    hydrationTip: string;
    redFlags?: string[];
    doctorQuestion?: string;
  };
}

export interface WeightRecord {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  hipCm?: number;
  abdominalCm?: number;
  notes?: string;
}

export interface HydrationEntry {
  id: string;
  timestamp: string; // HH:mm
  amountMl: number;
  type: 'water' | 'electrolyte' | 'tea';
}

export interface HydrationDay {
  date: string; // YYYY-MM-DD
  totalMl: number;
  goalMl: number;
  entries: HydrationEntry[];
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  title: string;
  type: 'dose' | 'weigh_in' | 'doctor' | 'refill' | 'symptom_check';
  completed: boolean;
  notes?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: 'weight' | 'protein' | 'hydration' | 'streak' | 'habits';
  description: string;
}

export interface NutritionMeal {
  time: string;
  name: string;
  items: string[];
  proteinGrams: number;
  tip: string;
}

export interface NutritionPlan {
  focusSummary: string;
  dailyTargetProteinGrams: number;
  dailyTargetCalories: number;
  dailyWaterTargetMl: number;
  clinicalTips: string[];
  meals: NutritionMeal[];
  foodsToAvoidToday: string[];
  generatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  medication: string; // "Ozempic / Wegovy" | "Mounjaro / Zepbound" | "Saxenda / Victoza" | custom
  currentDose: string; // "0.5mg", etc.
  applicationDayOfWeek: number; // 0 = Domingo, 1 = Segunda, etc.
  heightCm: number;
  initialWeightKg: number;
  targetWeightKg: number;
  currentWeightKg: number;
  dailyWaterGoalMl: number;
  dailyProteinGoalGrams: number;
  startDate: string; // YYYY-MM-DD
  doctorName?: string;
  crm?: string;
}

export type ActiveModule =
  | 'dashboard'
  | 'doses'
  | 'calendar'
  | 'weight'
  | 'reports'
  | 'health'
  | 'goals'
  | 'hydration'
  | 'nutrition';
