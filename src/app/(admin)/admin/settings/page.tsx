'use client';

import { NotificationEmailsManagement } from '@/adminpanel/components/notification-emails-management';

export default function SettingsPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-6 lg:mb-8">
        <div>
          <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-light">
            Settings
          </h1>
          <p className="mt-0.5 sm:mt-2 text-xs sm:text-sm text-gray-400">Manage your application settings</p>
        </div>
      </div>
      <NotificationEmailsManagement />
    </div>
  );
}
