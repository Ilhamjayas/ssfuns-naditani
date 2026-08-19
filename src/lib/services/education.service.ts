import { getDemoState, updateDemoState } from '@/lib/demo/demo-store';

export const educationService = {
  getCompletedModules(userId?: string): number[] {
    return [...(getDemoState().learningProgress[userId || 'guest'] || [])];
  },

  markModuleCompleted(moduleId: number, userId?: string): number[] {
    const progressKey = userId || 'guest';
    let completed: number[] = [];
    updateDemoState(state => {
      const current = state.learningProgress[progressKey] || [];
      state.learningProgress[progressKey] = current.includes(moduleId) ? current : [...current, moduleId];
      completed = [...state.learningProgress[progressKey]];
    });
    return completed;
  },
};
