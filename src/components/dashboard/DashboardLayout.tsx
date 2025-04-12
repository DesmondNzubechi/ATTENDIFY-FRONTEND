
import React from 'react';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { PrivateRoute } from '@/components/auth/PrivateRoute';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <PrivateRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div 
          className={cn(
            "flex-1 overflow-auto",
            isMobile ? "w-full" : ""
          )}
        >
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
}
