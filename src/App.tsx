/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  DoseRecord,
  WeightRecord,
  SymptomRecord,
  HydrationDay,
  CalendarEvent,
  GoalItem,
  NutritionPlan,
  ActiveModule,
} from './types';
import {
  getStoredUser,
  saveStoredUser,
  getStoredDoses,
  saveStoredDoses,
  getStoredWeights,
  saveStoredWeights,
  getStoredSymptoms,
  saveStoredSymptoms,
  getStoredHydration,
  saveStoredHydration,
  getStoredCalendar,
  saveStoredCalendar,
  getStoredGoals,
  saveStoredGoals,
  getStoredNutrition,
  saveStoredNutrition,
} from './utils/storage';
import { Header } from './components/Header';
import { BottomNav, SecondaryModuleBar } from './components/BottomNav';
import { MedicationSelectorModal } from './components/MedicationSelectorModal';
import { AuthScreen } from './components/AuthScreen';
import { ProfileModal } from './components/ProfileModal';
import { DashboardModule } from './components/modules/DashboardModule';
import { DosesModule } from './components/modules/DosesModule';
import { HydrationModule } from './components/modules/HydrationModule';
import { HealthSymptomsModule } from './components/modules/HealthSymptomsModule';
import { NutritionAiModule } from './components/modules/NutritionAiModule';
import { WeightModule } from './components/modules/WeightModule';
import { CalendarModule } from './components/modules/CalendarModule';
import { ReportsExportModule } from './components/modules/ReportsExportModule';
import { GoalsModule } from './components/modules/GoalsModule';

export default function App() {
  const [user, setUser] = useState<UserProfile>(getStoredUser);
  const [doses, setDoses] = useState<DoseRecord[]>(getStoredDoses);
  const [weights, setWeights] = useState<WeightRecord[]>(getStoredWeights);
  const [symptoms, setSymptoms] = useState<SymptomRecord[]>(getStoredSymptoms);
  const [hydration, setHydration] = useState<HydrationDay[]>(getStoredHydration);
  const [calendar, setCalendar] = useState<CalendarEvent[]>(getStoredCalendar);
  const [goals, setGoals] = useState<GoalItem[]>(getStoredGoals);
  const [nutrition, setNutrition] = useState<NutritionPlan>(getStoredNutrition);

  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Persistence hooks
  useEffect(() => {
    saveStoredUser(user);
  }, [user]);

  useEffect(() => {
    saveStoredDoses(doses);
  }, [doses]);

  useEffect(() => {
    saveStoredWeights(weights);
  }, [weights]);

  useEffect(() => {
    saveStoredSymptoms(symptoms);
  }, [symptoms]);

  useEffect(() => {
    saveStoredHydration(hydration);
  }, [hydration]);

  useEffect(() => {
    saveStoredCalendar(calendar);
  }, [calendar]);

  useEffect(() => {
    saveStoredGoals(goals);
  }, [goals]);

  useEffect(() => {
    saveStoredNutrition(nutrition);
  }, [nutrition]);

  // Handlers
  const handleUpdateMedication = (medication: string, dose: string) => {
    setUser((prev) => ({
      ...prev,
      medication,
      currentDose: dose,
    }));
  };

  const handleAddDose = (newDose: DoseRecord) => {
    setDoses((prev) => [...prev, newDose]);
    // Also create next week calendar event automatically
    const nextDate = new Date(newDose.date);
    nextDate.setDate(nextDate.getDate() + 7);
    const dateStr = nextDate.toISOString().slice(0, 10);

    const autoEvent: CalendarEvent = {
      id: `cal_dose_${Date.now()}`,
      date: dateStr,
      time: newDose.time,
      title: `💉 Dose Programada (${newDose.dosage})`,
      type: 'dose',
      completed: false,
      notes: 'Lembrete automático para alternar o sítio de aplicação.',
    };
    setCalendar((prev) => [...prev, autoEvent]);
  };

  const handleDeleteDose = (id: string) => {
    setDoses((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddWeight = (record: WeightRecord) => {
    setWeights((prev) => [...prev, record]);
    setUser((prev) => ({
      ...prev,
      currentWeightKg: record.weightKg,
    }));
  };

  const handleDeleteWeight = (id: string) => {
    setWeights((prev) => prev.filter((w) => w.id !== id));
  };

  const handleAddSymptom = (symptom: SymptomRecord) => {
    setSymptoms((prev) => [...prev, symptom]);
  };

  const handleDeleteSymptom = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
  };

  const handleQuickAddWater = (ml: number) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setHydration((prev) => {
      const existing = prev.find((h) => h.date === todayStr);
      const newEntry = {
        id: `h_${Date.now()}`,
        timestamp: timeStr,
        amountMl: ml,
        type: 'water' as const,
      };

      if (existing) {
        return prev.map((h) =>
          h.date === todayStr
            ? {
                ...h,
                totalMl: h.totalMl + ml,
                entries: [...h.entries, newEntry],
              }
            : h
        );
      } else {
        return [
          {
            date: todayStr,
            totalMl: ml,
            goalMl: user.dailyWaterGoalMl,
            entries: [newEntry],
          },
          ...prev,
        ];
      }
    });
  };

  const handleAddWaterEntry = (entry: {
    amountMl: number;
    type: 'water' | 'electrolyte' | 'tea';
  }) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setHydration((prev) => {
      const existing = prev.find((h) => h.date === todayStr);
      const newEntryItem = {
        id: `h_${Date.now()}`,
        timestamp: timeStr,
        amountMl: entry.amountMl,
        type: entry.type,
      };

      if (existing) {
        return prev.map((h) =>
          h.date === todayStr
            ? {
                ...h,
                totalMl: h.totalMl + entry.amountMl,
                entries: [...h.entries, newEntryItem],
              }
            : h
        );
      } else {
        return [
          {
            date: todayStr,
            totalMl: entry.amountMl,
            goalMl: user.dailyWaterGoalMl,
            entries: [newEntryItem],
          },
          ...prev,
        ];
      }
    });
  };

  const handleDeleteHydrationEntry = (date: string, entryId: string) => {
    setHydration((prev) =>
      prev.map((day) => {
        if (day.date === date) {
          const removed = day.entries.find((e) => e.id === entryId);
          const deduct = removed ? removed.amountMl : 0;
          return {
            ...day,
            totalMl: Math.max(0, day.totalMl - deduct),
            entries: day.entries.filter((e) => e.id !== entryId),
          };
        }
        return day;
      })
    );
  };

  const handleUpdateWaterGoal = (newGoal: number) => {
    setUser((prev) => ({ ...prev, dailyWaterGoalMl: newGoal }));
    const todayStr = new Date().toISOString().slice(0, 10);
    setHydration((prev) =>
      prev.map((h) => (h.date === todayStr ? { ...h, goalMl: newGoal } : h))
    );
  };

  const handleAddCalendarEvent = (event: CalendarEvent) => {
    setCalendar((prev) => [...prev, event]);
  };

  const handleToggleCalendarEvent = (id: string) => {
    setCalendar((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendar((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddGoal = (goal: GoalItem) => {
    setGoals((prev) => [...prev, goal]);
  };

  const handleUpdateGoalProgress = (id: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              currentValue: Math.max(0, Math.round((g.currentValue + delta) * 10) / 10),
            }
          : g
      )
    );
  };

  const handleLoginSuccess = (authData: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...authData,
      isAuthenticated: true,
    }));
  };

  const handleLogout = () => {
    setUser((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  // If user is not authenticated, show initial screen with Logo, Email and Password
  if (!user.isAuthenticated) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        defaultEmail={user.email}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 flex justify-center selection:bg-[#00C9D7]/20 selection:text-[#082B55]">
      {/* Mobile-centric frame container (fluid & responsive on all viewports) */}
      <div className="w-full max-w-lg bg-slate-50 min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200/60">
        {/* Top Header */}
        <Header
          user={user}
          onOpenMedicationModal={() => setIsMedicationModalOpen(true)}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Quick Module Navigation Ribbon */}
        <SecondaryModuleBar
          activeModule={activeModule}
          onSelectModule={(m) => setActiveModule(m)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeModule === 'dashboard' && (
            <DashboardModule
              user={user}
              doses={doses}
              weights={weights}
              symptoms={symptoms}
              hydration={hydration}
              nutrition={nutrition}
              onNavigate={(mod) => setActiveModule(mod)}
              onQuickAddWater={handleQuickAddWater}
              onOpenMedicationModal={() => setIsMedicationModalOpen(true)}
            />
          )}

          {activeModule === 'doses' && (
            <DosesModule
              user={user}
              doses={doses}
              onAddDose={handleAddDose}
              onDeleteDose={handleDeleteDose}
              onOpenMedicationModal={() => setIsMedicationModalOpen(true)}
            />
          )}

          {activeModule === 'hydration' && (
            <HydrationModule
              user={user}
              hydration={hydration}
              onAddWater={handleAddWaterEntry}
              onDeleteEntry={handleDeleteHydrationEntry}
              onUpdateGoal={handleUpdateWaterGoal}
            />
          )}

          {activeModule === 'health' && (
            <HealthSymptomsModule
              user={user}
              symptoms={symptoms}
              onAddSymptom={handleAddSymptom}
              onDeleteSymptom={handleDeleteSymptom}
            />
          )}

          {activeModule === 'nutrition' && (
            <NutritionAiModule
              user={user}
              nutrition={nutrition}
              symptoms={symptoms}
              onUpdateNutrition={(plan) => setNutrition(plan)}
            />
          )}

          {activeModule === 'weight' && (
            <WeightModule
              user={user}
              weights={weights}
              onAddWeight={handleAddWeight}
              onDeleteWeight={handleDeleteWeight}
            />
          )}

          {activeModule === 'calendar' && (
            <CalendarModule
              user={user}
              events={calendar}
              onAddEvent={handleAddCalendarEvent}
              onToggleEvent={handleToggleCalendarEvent}
              onDeleteEvent={handleDeleteCalendarEvent}
            />
          )}

          {activeModule === 'reports' && (
            <ReportsExportModule
              user={user}
              doses={doses}
              weights={weights}
              symptoms={symptoms}
              hydration={hydration}
            />
          )}

          {activeModule === 'goals' && (
            <GoalsModule
              user={user}
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoalProgress={handleUpdateGoalProgress}
            />
          )}
        </main>

        {/* Mobile Ergonomic Bottom Bar */}
        <BottomNav
          activeModule={activeModule}
          onSelectModule={(m) => setActiveModule(m)}
        />
      </div>

      {/* Medication Selector Modal (3 buttons + custom name) */}
      <MedicationSelectorModal
        isOpen={isMedicationModalOpen}
        onClose={() => setIsMedicationModalOpen(false)}
        currentMedication={user.medication}
        currentDose={user.currentDose}
        onSave={handleUpdateMedication}
      />

      {/* Patient Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSaveUser={(updated) => setUser(updated)}
        onLogout={handleLogout}
      />
    </div>
  );
}
