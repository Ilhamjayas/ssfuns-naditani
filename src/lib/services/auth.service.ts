import { User, UserRole } from '../types';
import { DEMO_CREDENTIALS } from '../utils/constants';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string): Promise<User> {
    await delay(500);
    
    const cred = DEMO_CREDENTIALS.find(c => c.email === email && c.password === password);
    
    if (!cred) {
      throw new Error('Email atau kata sandi salah');
    }
    
    const user: User = {
      id: `user-${cred.role}-1`,
      name: cred.name,
      email: cred.email,
      role: cred.role,
      createdAt: new Date().toISOString(),
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('nadi_user', JSON.stringify(user));
    }
    
    return user;
  },
  
  async logout(): Promise<void> {
    await delay(300);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nadi_user');
    }
  },
  
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('nadi_user');
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};
