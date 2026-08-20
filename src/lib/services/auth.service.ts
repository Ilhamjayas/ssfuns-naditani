import { User, UserRole } from '../types';
import { DEMO_CREDENTIALS } from '../utils/constants';
import { updateDemoState } from '../demo/demo-store';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const REGISTERED_ACCOUNTS_KEY = 'nadi_registered_accounts';
const PASSWORD_OVERRIDES_KEY = 'nadi_password_overrides';
const DEMO_ACCOUNT_STATUS_KEY = 'nadi_demo_account_status';

export type AccountVerificationStatus = 'pending' | 'approved' | 'rejected';

export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

interface RegisteredAccount extends RegisterInput {
  id: string;
  createdAt: string;
  isActive?: boolean;
  verificationStatus?: AccountVerificationStatus;
}

export interface RegisteredAccountSummary {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
  verificationStatus: AccountVerificationStatus;
}

function getRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) as RegisteredAccount[] : [];
  } catch {
    return [];
  }
}

function saveSession(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nadi_user', JSON.stringify(user));
  }
}

function saveRegisteredAccounts(accounts: RegisteredAccount[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

function getPasswordOverrides(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(PASSWORD_OVERRIDES_KEY);
    return stored ? JSON.parse(stored) as Record<string, string> : {};
  } catch {
    return {};
  }
}

function getDemoAccountStatus(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(DEMO_ACCOUNT_STATUS_KEY) || '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

export const authService = {
  async login(identifier: string, password: string): Promise<User> {
    await delay(500);

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const passwordOverrides = getPasswordOverrides();
    const demoAccount = DEMO_CREDENTIALS.find(credential => {
      const userId = `user-${credential.role}-1`;
      return (credential.username.toLowerCase() === normalizedIdentifier || credential.email.toLowerCase() === normalizedIdentifier) &&
        (passwordOverrides[userId] || credential.password) === password;
    });
    const registeredAccount = getRegisteredAccounts().find(account =>
      (account.username.toLowerCase() === normalizedIdentifier || account.email.toLowerCase() === normalizedIdentifier) &&
      account.password === password
    );

    const account = demoAccount || registeredAccount;
    if (!account) {
      throw new Error('Username, email, atau kata sandi tidak sesuai');
    }
    const verificationStatus = registeredAccount?.verificationStatus || 'approved';
    if (registeredAccount && verificationStatus === 'pending') {
      throw new Error('Pendaftaran Anda masih menunggu verifikasi administrator');
    }
    if (registeredAccount && verificationStatus === 'rejected') {
      throw new Error('Pendaftaran perlu diperbaiki. Hubungi administrator NADI-TANI');
    }
    if (registeredAccount?.isActive === false) {
      throw new Error('Akun ini sedang dinonaktifkan. Hubungi admin NADI-TANI');
    }
    if (demoAccount) {
      const demoUserId = `user-${demoAccount.role}-1`;
      if (getDemoAccountStatus()[demoUserId] === false) {
        throw new Error('Akun demo ini sedang dinonaktifkan oleh administrator');
      }
    }

    const user: User = {
      id: registeredAccount ? registeredAccount.id : `user-${account.role}-1`,
      name: account.name,
      username: account.username,
      email: account.email,
      role: account.role,
      createdAt: registeredAccount ? registeredAccount.createdAt : new Date().toISOString(),
    };

    saveSession(user);
    return user;
  },

  async register(input: RegisterInput): Promise<User> {
    await delay(650);
    if (!['petani', 'mitra'].includes(input.role)) {
      throw new Error('Pendaftaran mandiri hanya tersedia untuk Petani dan Mitra Industri');
    }
    const accounts = getRegisteredAccounts();
    const normalizedUsername = input.username.trim().toLowerCase();
    const normalizedEmail = input.email.trim().toLowerCase();
    const usernameExists = DEMO_CREDENTIALS.some(account => account.username === normalizedUsername) || accounts.some(account => account.username.toLowerCase() === normalizedUsername);
    const emailExists = DEMO_CREDENTIALS.some(account => account.email === normalizedEmail) || accounts.some(account => account.email.toLowerCase() === normalizedEmail);

    if (usernameExists) throw new Error('Username sudah digunakan');
    if (emailExists) throw new Error('Email sudah terdaftar');

    const newAccount: RegisteredAccount = {
      ...input,
      id: `user-${input.role}-${Date.now()}`,
      name: input.name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      isActive: false,
      verificationStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    saveRegisteredAccounts([...accounts, newAccount]);

    const user: User = {
      id: newAccount.id,
      name: newAccount.name,
      username: newAccount.username,
      email: newAccount.email,
      role: newAccount.role,
      createdAt: newAccount.createdAt,
    };
    return user;
  },

  async logout(): Promise<void> {
    await delay(300);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nadi_user');
    }
  },

  getRegisteredAccountSummaries(): RegisteredAccountSummary[] {
    return getRegisteredAccounts().map(({ id, name, username, email, role, createdAt, isActive, verificationStatus }) => ({
      id,
      name,
      username,
      email,
      role,
      createdAt,
      isActive: isActive !== false,
      verificationStatus: verificationStatus || 'approved',
    }));
  },

  setAccountActive(id: string, isActive: boolean): void {
    const accounts = getRegisteredAccounts();
    const account = accounts.find(item => item.id === id);
    if (account) {
      if (isActive && (account.verificationStatus || 'approved') !== 'approved') {
        throw new Error('Akun harus diverifikasi sebelum dapat diaktifkan');
      }
      account.isActive = isActive;
      saveRegisteredAccounts(accounts);
    } else {
      const demoExists = DEMO_CREDENTIALS.some(item => `user-${item.role}-1` === id);
      if (!demoExists) throw new Error('Akun tidak ditemukan');
      localStorage.setItem(DEMO_ACCOUNT_STATUS_KEY, JSON.stringify({ ...getDemoAccountStatus(), [id]: isActive }));
    }

    const currentUser = this.getCurrentUser();
    if (!isActive && currentUser?.id === id) localStorage.removeItem('nadi_user');
    updateDemoState(state => {
      state.auditLogs.unshift({
        id: `AUD-ACCOUNT-${Date.now()}`,
        userId: currentUser?.id || 'system',
        action: isActive ? 'ACTIVATE_ACCOUNT' : 'DEACTIVATE_ACCOUNT',
        entityType: 'UserAccount',
        entityId: id,
        details: `Akun ${id} ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        timestamp: new Date().toISOString(),
      });
    });
  },

  isAccountActive(id: string): boolean {
    const account = getRegisteredAccounts().find(item => item.id === id);
    if (account) return account.isActive !== false;
    return getDemoAccountStatus()[id] !== false;
  },

  setRegisteredAccountVerification(id: string, status: AccountVerificationStatus): void {
    const accounts = getRegisteredAccounts();
    const account = accounts.find(item => item.id === id);
    if (!account) throw new Error('Akun pendaftar tidak ditemukan');
    account.verificationStatus = status;
    account.isActive = status === 'approved';
    saveRegisteredAccounts(accounts);
    const currentUser = this.getCurrentUser();
    updateDemoState(state => {
      const timestamp = new Date().toISOString();
      state.auditLogs.unshift({
        id: `AUD-VERIFY-${Date.now()}`,
        userId: currentUser?.id || 'system',
        action: status === 'approved' ? 'APPROVE_ACCOUNT' : 'REJECT_ACCOUNT',
        entityType: 'UserAccount',
        entityId: id,
        details: `Pendaftaran ${account.name} ${status === 'approved' ? 'disetujui' : 'dikembalikan untuk diperbaiki'}`,
        timestamp,
      });
      state.notifications.unshift({
        id: `NOTIF-VERIFY-${Date.now()}`,
        userId: id,
        title: status === 'approved' ? 'Akun Telah Diverifikasi' : 'Pendaftaran Perlu Diperbaiki',
        message: status === 'approved'
          ? 'Akun NADI-TANI Anda sudah aktif dan siap digunakan.'
          : 'Pendaftaran Anda belum dapat disetujui. Silakan hubungi administrator untuk memperbarui data.',
        type: status === 'approved' ? 'success' : 'warning',
        category: 'sistem',
        isRead: false,
        createdAt: timestamp,
        link: status === 'approved'
          ? account.role === 'mitra' ? '/dashboard/mitra' : '/dashboard/petani'
          : '/masuk',
      });
    });
  },

  async changePassword(user: User, currentPassword: string, newPassword: string): Promise<void> {
    await delay(350);
    if (!currentPassword) throw new Error('Password saat ini wajib diisi');
    if (newPassword.length < 8) throw new Error('Password baru minimal 8 karakter');
    if (currentPassword === newPassword) throw new Error('Password baru harus berbeda dari password saat ini');

    const accounts = getRegisteredAccounts();
    const registeredAccount = accounts.find(account => account.id === user.id);
    if (registeredAccount) {
      if (registeredAccount.password !== currentPassword) throw new Error('Password saat ini tidak sesuai');
      registeredAccount.password = newPassword;
      saveRegisteredAccounts(accounts);
      return;
    }

    const demoAccount = DEMO_CREDENTIALS.find(account => `user-${account.role}-1` === user.id);
    if (!demoAccount) throw new Error('Akun tidak ditemukan');
    const overrides = getPasswordOverrides();
    if ((overrides[user.id] || demoAccount.password) !== currentPassword) throw new Error('Password saat ini tidak sesuai');
    overrides[user.id] = newPassword;
    localStorage.setItem(PASSWORD_OVERRIDES_KEY, JSON.stringify(overrides));
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem('nadi_user');
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        return null;
      }
    }
    return null;
  }
};
