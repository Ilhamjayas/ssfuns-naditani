import { DemoUserProfile, getDemoState, updateDemoState } from '@/lib/demo/demo-store';

export const profileService = {
  getProfile(userId: string): DemoUserProfile | null {
    return getDemoState().profiles[userId] || null;
  },

  saveProfile(userId: string, profile: DemoUserProfile): DemoUserProfile {
    updateDemoState(state => {
      state.profiles[userId] = profile;
      state.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        userId,
        action: 'UPDATE_PROFILE',
        entityType: 'UserProfile',
        entityId: userId,
        details: 'Data profil demo diperbarui',
        timestamp: new Date().toISOString(),
      });
    });
    return profile;
  },
};
