import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
          <div className="dashboard-content mx-auto w-full max-w-7xl px-3 py-4 min-[380px]:px-4 sm:px-5 sm:py-6 lg:px-7 xl:px-8">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
