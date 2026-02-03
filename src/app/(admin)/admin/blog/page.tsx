'use client';

import { BlogManagement } from '@/adminpanel/components/blog-management';

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="px-4 py-6 sm:px-0">
        <BlogManagement />
      </div>
    </div>
  );
}
