import {
  UserProfile,
  DoseRecord,
  SymptomRecord,
  WeightRecord,
  HydrationDay,
  CalendarEvent,
  GoalItem,
  NutritionPlan,
} from '../types';

const STORAGE_KEYS = {
  USER: 'glp1_user_profile',
  DOSES: 'glp1_doses',
  SYMPTOMS: 'glp1_symptoms',
  WEIGHTS: 'glp1_weights',
  HYDRATION: 'glp1_hydration',
  CALENDAR: 'glp1_calendar',
  GOALS: 'glp1_goals',
  NUTRITION: 'glp1_nutrition',
};

export const defaultUser: UserProfile = {
  id: 'usr_01',
  name: 'Fernanda Barreto',
  email: 'fsbar79@gmail.com',
  isAuthenticated: true,
  medication: 'Ozempic / Wegovy (Semaglutida)',
  currentDose: '0.5mg',
  applicationDayOfWeek: 2, // Terça-feira
  heightCm: 168,
  initialWeightKg: 89.4,
  currentWeightKg: 83.2,
  targetWeightKg: 70.0,
  dailyWaterGoalMl: 2800,
  dailyProteinGoalGrams: 95,
  startDate: '2026-09-15',
  doctorName: 'Dra. Camila Ramos - Endocrinologista',
  crm: 'CRM/SP 148.920',
};

export const defaultDoses: DoseRecord[] = [
  {
    id: 'dose_01',
    date: '2026-10-20',
    time: '08:30',
    medication: 'Ozempic / Wegovy (Semaglutida)',
    dosage: '0.5mg',
    injectionSite: 'abdomen_right',
    needleChanged: true,
    painLevel: 1,
    notes: 'Aplicação indolor no quadrante inferior direito.',
  },
  {
    id: 'dose_02',
    date: '2026-10-27',
    time: '09:00',
    medication: 'Ozempic / Wegovy (Semaglutida)',
    dosage: '0.5mg',
    injectionSite: 'thigh_left',
    needleChanged: true,
    painLevel: 1,
    notes: 'Rotação para coxa esquerda conforme orientação médica.',
  },
  {
    id: 'dose_03',
    date: '2026-11-03',
    time: '08:15',
    medication: 'Ozempic / Wegovy (Semaglutida)',
    dosage: '0.5mg',
    injectionSite: 'abdomen_left',
    needleChanged: true,
    painLevel: 1,
    notes: 'Dose da semana realizada com sucesso.',
  },
];

export const defaultWeights: WeightRecord[] = [
  { id: 'w_01', date: '2026-09-15', weightKg: 89.4, waistCm: 96, hipCm: 112, abdominalCm: 101, notes: 'Início do tratamento' },
  { id: 'w_02', date: '2026-09-29', weightKg: 87.8, waistCm: 94, hipCm: 110, abdominalCm: 99, notes: '2 semanas de uso' },
  { id: 'w_03', date: '2026-10-13', weightKg: 86.1, waistCm: 92, hipCm: 108, abdominalCm: 97, notes: 'Primeiro mês completo' },
  { id: 'w_04', date: '2026-10-27', weightKg: 84.5, waistCm: 90, hipCm: 106, abdominalCm: 95, notes: 'Ajuste de dose para 0.5mg' },
  { id: 'w_05', date: '2026-11-07', weightKg: 83.2, waistCm: 88, hipCm: 105, abdominalCm: 93, notes: 'Menos retenção de líquidos' },
];

export const defaultSymptoms: SymptomRecord[] = [
  {
    id: 'sym_01',
    date: '2026-11-04',
    time: '14:20',
    symptomType: 'nausea',
    symptomName: 'Náusea leve pós-almoço',
    severity: 2,
    mood: 3,
    physicalWellbeing: 3,
    hoursAfterDose: 30,
    notes: 'Aliviou após chá de gengibre e caminhada leve.',
    aiAdvice: {
      immediateRelief: ['Evite deitar-se nas próximas 2 horas', 'Beba água fresca em pequenos goles', 'Mantenha a refeição seguinte fria e leve'],
      nutritionalAdjustment: 'Reduza a porção de gorduras no almoço.',
      hydrationTip: 'Chá de hortelã ou gengibre sem açúcar ajuda no esvaziamento gástrico.',
      doctorQuestion: 'Comente com a Dra. Camila se o pico ocorre sempre cerca de 24h a 36h após a injeção.'
    }
  },
  {
    id: 'sym_02',
    date: '2026-11-06',
    time: '18:00',
    symptomType: 'early_satiety',
    symptomName: 'Saciedade precoce acentuada',
    severity: 3,
    mood: 4,
    physicalWellbeing: 4,
    hoursAfterDose: 72,
    notes: 'Me senti satisfeita com metade do prato habitual.',
  },
  {
    id: 'sym_03',
    date: '2026-11-08',
    time: '10:00',
    symptomType: 'constipation',
    symptomName: 'Ritmo intestinal lentificado',
    severity: 2,
    mood: 4,
    physicalWellbeing: 4,
    notes: 'Aumentando consumo de água e fibras solúveis (psyllium).',
  }
];

export const defaultHydration: HydrationDay[] = [
  {
    date: '2026-11-08',
    totalMl: 2100,
    goalMl: 2800,
    entries: [
      { id: 'h_1', timestamp: '08:10', amountMl: 400, type: 'water' },
      { id: 'h_2', timestamp: '10:30', amountMl: 500, type: 'water' },
      { id: 'h_3', timestamp: '13:00', amountMl: 300, type: 'tea' },
      { id: 'h_4', timestamp: '15:30', amountMl: 500, type: 'water' },
      { id: 'h_5', timestamp: '17:00', amountMl: 400, type: 'electrolyte' },
    ]
  },
  {
    date: '2026-11-07',
    totalMl: 2800,
    goalMl: 2800,
    entries: [
      { id: 'h_prev_1', timestamp: '08:00', amountMl: 500, type: 'water' },
      { id: 'h_prev_2', timestamp: '11:00', amountMl: 500, type: 'water' },
      { id: 'h_prev_3', timestamp: '14:00', amountMl: 600, type: 'water' },
      { id: 'h_prev_4', timestamp: '17:00', amountMl: 600, type: 'water' },
      { id: 'h_prev_5', timestamp: '20:00', amountMl: 600, type: 'tea' },
    ]
  }
];

export const defaultCalendar: CalendarEvent[] = [
  {
    id: 'cal_01',
    date: '2026-11-10',
    time: '08:00',
    title: '💉 Próxima Dose GLP-1 (0.5mg)',
    type: 'dose',
    completed: false,
    notes: 'Rotação sugerida: Coxa Direita ou Abdômen Esquerdo.',
  },
  {
    id: 'cal_02',
    date: '2026-11-12',
    time: '07:30',
    title: '⚖️ Pesagem Semanal em Jejum',
    type: 'weigh_in',
    completed: false,
    notes: 'Anotar peso e medidas abdominais.',
  },
  {
    id: 'cal_03',
    date: '2026-11-17',
    time: '08:00',
    title: '💉 Aplicação Semanal GLP-1',
    type: 'dose',
    completed: false,
  },
  {
    id: 'cal_04',
    date: '2026-11-20',
    time: '15:00',
    title: '🩺 Consulta Retorno Endocrinologista',
    type: 'doctor',
    completed: false,
    notes: 'Levar relatório gerado no app em PDF/Excel.',
  },
  {
    id: 'cal_05',
    date: '2026-11-25',
    time: '10:00',
    title: '💊 Renovação da Receita / Farmácia',
    type: 'refill',
    completed: false,
    notes: 'Garantir agulhas 32G 4mm e álcool 70%.',
  }
];

export const defaultGoals: GoalItem[] = [
  {
    id: 'goal_01',
    title: 'Meta de Perda de Peso',
    currentValue: 6.2,
    targetValue: 19.4,
    unit: 'kg eliminados',
    category: 'weight',
    description: 'De 89.4 kg para 70.0 kg com preservação muscular.',
  },
  {
    id: 'goal_02',
    title: 'Proteína Diária',
    currentValue: 88,
    targetValue: 95,
    unit: 'g / dia',
    category: 'protein',
    description: 'Fundamental para prevenir perda de massa magra no GLP-1.',
  },
  {
    id: 'goal_03',
    title: 'Hidratação Diária',
    currentValue: 2.1,
    targetValue: 2.8,
    unit: 'L / dia',
    category: 'hydration',
    description: 'Essencial para evitar constipação e facilitar depuração.',
  },
  {
    id: 'goal_04',
    title: 'Adesão Contínua às Doses',
    currentValue: 4,
    targetValue: 8,
    unit: 'semanas sem falha',
    category: 'streak',
    description: 'Pontualidade na aplicação semanal.',
  }
];

export const defaultNutritionPlan: NutritionPlan = {
  focusSummary: 'Foco do dia: Proteção muscular e refeições de baixo volume digestivo para prevenir plenitude e náusea.',
  dailyTargetProteinGrams: 95,
  dailyTargetCalories: 1550,
  dailyWaterTargetMl: 2800,
  clinicalTips: [
    'Coma primeiro a proteína do prato (frango, peixe, ovos) antes do carboidrato.',
    'Beba líquidos 30 minutos antes ou 45 minutos após as refeições, nunca junto.',
    'Chá de gengibre fresco ou menta pode ser tomado nos horários de maior desconforto digestivo.',
    'Caminhe 10 a 15 minutos em ritmo leve após o almoço para acelerar o trânsito digestivo.'
  ],
  meals: [
    {
      time: '08:00',
      name: 'Café da Manhã Proteico',
      items: ['Iogurte grego natural proteico (150g)', '1 colher de sementes de chia hidratadas', 'Morangos frescos picados'],
      proteinGrams: 22,
      tip: 'Mastigação lenta para digestão suave.'
    },
    {
      time: '12:30',
      name: 'Almoço Digestivo',
      items: ['Filé de peito de frango grelhado em tiras (120g)', 'Purê de abóbora cabotiá cozida', 'Abobrinha e brócolis ao vapor'],
      proteinGrams: 35,
      tip: 'Evite frituras e molhos cremosos pesados.'
    },
    {
      time: '16:00',
      name: 'Lanche da Tarde Nutritivo',
      items: ['Whey protein batido com água gelada e gelo', '1 punhado pequeno de castanhas'],
      proteinGrams: 24,
      tip: 'Refresca e combate a sensação de estômago pesado.'
    },
    {
      time: '19:30',
      name: 'Jantar Leve Noturno',
      items: ['Omelete de 2 ovos com espinafre e queijo minas frescal', 'Salada morna de cenoura cozida'],
      proteinGrams: 18,
      tip: 'Terminar 3 horas antes de dormir para evitar refluxo noturno.'
    }
  ],
  foodsToAvoidToday: [
    'Carnes ultra gordurosas e embutidos (bacon, linguiça)',
    'Frituras e empanados de imersão',
    'Refrigerantes e bebidas gaseificadas'
  ]
};

// Storage Helpers with localStorage fallback
export function getStoredUser(): UserProfile {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : defaultUser;
}

export function saveStoredUser(user: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getStoredDoses(): DoseRecord[] {
  const data = localStorage.getItem(STORAGE_KEYS.DOSES);
  return data ? JSON.parse(data) : defaultDoses;
}

export function saveStoredDoses(doses: DoseRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doses));
}

export function getStoredWeights(): WeightRecord[] {
  const data = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
  return data ? JSON.parse(data) : defaultWeights;
}

export function saveStoredWeights(weights: WeightRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
}

export function getStoredSymptoms(): SymptomRecord[] {
  const data = localStorage.getItem(STORAGE_KEYS.SYMPTOMS);
  return data ? JSON.parse(data) : defaultSymptoms;
}

export function saveStoredSymptoms(symptoms: SymptomRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(symptoms));
}

export function getStoredHydration(): HydrationDay[] {
  const data = localStorage.getItem(STORAGE_KEYS.HYDRATION);
  return data ? JSON.parse(data) : defaultHydration;
}

export function saveStoredHydration(hydration: HydrationDay[]): void {
  localStorage.setItem(STORAGE_KEYS.HYDRATION, JSON.stringify(hydration));
}

export function getStoredCalendar(): CalendarEvent[] {
  const data = localStorage.getItem(STORAGE_KEYS.CALENDAR);
  return data ? JSON.parse(data) : defaultCalendar;
}

export function saveStoredCalendar(calendar: CalendarEvent[]): void {
  localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendar));
}

export function getStoredGoals(): GoalItem[] {
  const data = localStorage.getItem(STORAGE_KEYS.GOALS);
  return data ? JSON.parse(data) : defaultGoals;
}

export function saveStoredGoals(goals: GoalItem[]): void {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

export function getStoredNutrition(): NutritionPlan {
  const data = localStorage.getItem(STORAGE_KEYS.NUTRITION);
  return data ? JSON.parse(data) : defaultNutritionPlan;
}

export function saveStoredNutrition(nutrition: NutritionPlan): void {
  localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(nutrition));
}
