import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint for Personalized Nutrition Suggestion with Gemini
app.post('/api/ai/nutrition-plan', async (req, res) => {
  try {
    const { medication, dosage, weight, targetWeight, symptoms, appetite, waterIntake, notes } = req.body;

    const prompt = `
Você é uma inteligência artificial nutricional especializada em pacientes em terapia com agonistas dos receptores de GLP-1 (${medication || 'Semaglutida/Tirzepatida'}, dose atual: ${dosage || 'não informada'}).
Dados do paciente:
- Peso atual: ${weight || 'Não informado'} kg (Meta: ${targetWeight || 'Não informado'} kg)
- Sintomas recentes / Efeitos colaterais: ${symptoms && symptoms.length > 0 ? symptoms.join(', ') : 'Nenhum sintoma adverso relatado'}
- Nível de apetite: ${appetite || 'Reduzido'}
- Ingestão atual de água: ${waterIntake || '2000'} ml
- Observações adicionais: ${notes || 'Nenhuma'}

Gere um plano nutricional e orientações personalizadas para o dia de hoje focando em:
1. Prevenção de perda de massa magra (alta densidade proteica fracionada, visando meta de proteína).
2. Estratégias práticas para mitigar efeitos colaterais (náusea, refluxo, plenitude gástrica precoce, constipação).
3. Hidratação e eletrólitos adequados.
4. Sugestão prática de 4 a 5 refeições compactas e fáceis de digerir.

Responda em formato JSON com a seguinte estrutura:
{
  "focusSummary": "Frase de foco do dia e por que essa estratégia foi escolhida",
  "dailyTargetProteinGrams": 95,
  "dailyTargetCalories": 1600,
  "dailyWaterTargetMl": 2800,
  "clinicalTips": ["Dica 1 para náusea/digestão", "Dica 2 para saciedade", "Dica 3 hidratação"],
  "meals": [
    {
      "time": "08:00",
      "name": "Café da Manhã",
      "items": ["Iogurte proteico (160g)", "Morangos picados", "1 col. sobremesa de sementes de chia hidratadas"],
      "proteinGrams": 22,
      "tip": "Mastigue devagar e evite beber líquidos junto com a refeição"
    },
    {
      "time": "12:30",
      "name": "Almoço Equilibrado",
      "items": ["Filé de frango grelhado ou peixe branco (120g)", "Legumes cozidos no vapor (abobrinha, cenoura)", "2 colheres de arroz integral ou purê de mandioquinha"],
      "proteinGrams": 34,
      "tip": "Pare assim que sentir os primeiros sinais de saciedade"
    },
    {
      "time": "16:00",
      "name": "Lanche da Tarde Proteico",
      "items": ["Whey protein batido com leite vegetal ou água gelada", "1 fatia de melão ou maçã cozida"],
      "proteinGrams": 24,
      "tip": "Líquidos frescos ajudam se houver leve náusea"
    },
    {
      "time": "19:30",
      "name": "Jantar Leve",
      "items": ["Omelete de 2 ovos com espinafre e queijo cottage", "Folhas verdes leves com gotas de azeite"],
      "proteinGrams": 20,
      "tip": "Jantar com pelo menos 2h30 antes de deitar para evitar refluxo"
    }
  ],
  "foodsToAvoidToday": ["Alimentos fritos ou ultraprocessados gordurosos", "Bebidas gaseificadas que aumentam estufamento", "Doces concentrados"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um nutricionista clínico especialista em pacientes em uso de medicamentos agonistas de GLP-1 (Ozempic, Wegovy, Mounjaro, Zepbound, Saxenda). Forneça conselhos seguros, embasados e práticos em JSON estrito.',
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Error generating nutrition plan:', error);
    res.status(500).json({
      error: 'Não foi possível gerar a recomendação no momento.',
      fallback: {
        focusSummary: 'Priorize proteínas magras, hidratação constante e refeições de baixo volume para evitar desconforto.',
        dailyTargetProteinGrams: 90,
        dailyTargetCalories: 1550,
        dailyWaterTargetMl: 2600,
        clinicalTips: [
          'Beba água em pequenos goles entre as refeições, nunca durante.',
          'Consuma primeiro a fonte de proteína do prato antes dos carboidratos.',
          'Evite deitar-se antes de 2 a 3 horas após o jantar.'
        ],
        meals: [
          { time: '08:00', name: 'Café da Manhã', items: ['Ovos mexidos com ricota', 'Mamão com aveia'], proteinGrams: 20, tip: 'Fácil digestão' },
          { time: '12:30', name: 'Almoço', items: ['Peito de frango grelhado', 'Purê de abóbora', 'Brócolis'], proteinGrams: 32, tip: 'Mastigação cuidadosa' },
          { time: '16:00', name: 'Lanche', items: ['Iogurte grego natural com canela', 'Castanhas'], proteinGrams: 18, tip: 'Sustentação proteica' },
          { time: '19:30', name: 'Jantar', items: ['Sopa cremosa de legumes com carne magra desfiada'], proteinGrams: 22, tip: 'Leve para a noite' }
        ],
        foodsToAvoidToday: ['Frituras e empanados', 'Refrigerantes e bebidas com gás', 'Alimentos muito condimentados']
      }
    });
  }
});

// Endpoint for AI Symptom Management and Doctor Summary
app.post('/api/ai/symptom-advice', async (req, res) => {
  try {
    const { symptomName, severity, hoursSinceDose, medication, currentDose } = req.body;

    const prompt = `
O paciente relata o sintoma: "${symptomName}" (Intensidade: ${severity}/5, Tempo após aplicação da dose: ${hoursSinceDose || 'Recente'} horas).
Medicamento: ${medication || 'GLP-1'}, Dose: ${currentDose || 'Padrão'}.

Forneça orientações imediatas de alívio seguras para efeitos colaterais comuns de agonistas de GLP-1, sinais de alerta médicos (red flags) e perguntas sugeridas para levar ao médico na próxima consulta.

Responda em formato JSON com:
{
  "immediateRelief": ["Medida 1", "Medida 2", "Medida 3"],
  "nutritionalAdjustment": "Ajuste na dieta imediato",
  "hydrationTip": "Dica específica de hidratação",
  "redFlags": ["Sinal de alerta para buscar pronto-socorro imediato"],
  "doctorQuestion": "Pergunta formulada para o médico sobre este sintoma"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um assistente médico de apoio clínico para pacientes em tratamento com GLP-1. Seja acolhedor, objetivo, científico e priorize a segurança do paciente.',
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error('Error generating symptom advice:', error);
    res.status(500).json({
      error: 'Não foi possível analisar o sintoma com IA.',
      fallback: {
        immediateRelief: ['Permaneça na posição vertical após comer', 'Beba chá de gengibre morno ou água fresca em pequenos goles', 'Divida a alimentação em porções menores'],
        nutritionalAdjustment: 'Evite alimentos gordurosos, café excessivo e doces concentrados hoje.',
        hydrationTip: 'Adicione uma pitada de sais de hidratação oral se houve vômito ou diarreia.',
        redFlags: ['Dor abdominal intensa irradiando para as costas', 'Vômitos incontroláveis que impedem hidratação por mais de 12h'],
        doctorQuestion: 'Doutor(a), notei pico de desconforto cerca de 24h após a dose; devemos manter ou fracionar a progressão?'
      }
    });
  }
});

// Endpoint for Doctor Clinical Report Synthesis
app.post('/api/ai/doctor-report', async (req, res) => {
  try {
    const { userProfile, doseHistory, symptomHistory, weightHistory } = req.body;

    const prompt = `
Sintetize um relatório clínico profissional para ser entregue ao médico endocrinologista no retorno da consulta do paciente.
Dados clínicos:
- Paciente: ${userProfile?.name || 'Paciente'} (Início: ${userProfile?.startDate || 'Recente'})
- Medicamento atual: ${userProfile?.medication || 'GLP-1'} (Dose: ${userProfile?.currentDose || 'Em titulação'})
- Histórico de Doses recentes: ${JSON.stringify(doseHistory?.slice(0, 8) || [])}
- Histórico de Sintomas relatados: ${JSON.stringify(symptomHistory?.slice(0, 10) || [])}
- Histórico de Peso e IMC: ${JSON.stringify(weightHistory?.slice(0, 8) || [])}

Gere um resumo médico formal contendo:
1. Resumo da adesão e posologia
2. Curva ponderal e resposta clínica
3. Tolerabilidade gastrointestinal e principais eventos adversos
4. Observações para a tomada de decisão médica (ex: titulação de dose, manutenção, solicitação de exames)

Retorne em formato JSON:
{
  "reportTitle": "Relatório de Evolução Clínica - Terapia Agonista GLP-1",
  "executiveSummary": "Texto formal médico resumindo a evolução do paciente...",
  "adherenceRate": "98%",
  "weightLossKg": "-4.2 kg",
  "weightLossPercentage": "-4.8%",
  "predominantSymptoms": ["Náusea leve no dia D+1", "Constipação transitória resolvida com hidratação"],
  "clinicalRecommendationsForMD": [
    "Considerar manutenção da dose atual por mais 4 semanas devido a boa resposta ponderal e tolerância adequada",
    "Monitorar enzimas hepáticas e função renal de rotina",
    "Reforçar preservação de massa magra via treinamento resistido e meta proteica de 1.5g/kg"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um assistente de documentação médica e farmacovigilância. Produza resumos clínicos precisos, éticos e elegantes para endocrinologistas.',
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error('Error generating doctor report:', error);
    res.status(500).json({
      error: 'Erro ao gerar resumo para o médico.',
      fallback: {
        reportTitle: 'Relatório de Evolução Clínica - Terapia Agonista GLP-1',
        executiveSummary: 'Paciente em tratamento regular com adesão satisfatória às doses semanais. Observa-se evolução ponderal progressiva com tolerância gastrointestinal monitorada.',
        adherenceRate: '100%',
        weightLossKg: 'Evolução registrada',
        weightLossPercentage: 'Progresso constante',
        predominantSymptoms: ['Sintomas leves registrados nos primeiros dias pós-aplicação'],
        clinicalRecommendationsForMD: [
          'Avaliar progressão de dose conforme tolerância digestiva',
          'Acompanhar marcadores glicêmicos e perfil lipídico',
          'Estimular ingesta hídrica superior a 2.5L/dia'
        ]
      }
    });
  }
});

// Setup Vite middlewares for development, or serve dist in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`GLP360 App server listening on http://localhost:${port}`);
});
