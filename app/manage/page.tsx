'use client';

import { ShoppingList } from '@/components/ShoppingList';

export default function ManagePage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-[1920px] mx-auto">
        <div className="max-w-xl mx-auto">
          <ShoppingList />
        </div>
      </div>
    </main>
  );
}
