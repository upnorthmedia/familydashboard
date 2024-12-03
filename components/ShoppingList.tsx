'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';
import useSWR, { mutate } from 'swr';
import { ShoppingItem } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ShoppingList() {
  const [newItem, setNewItem] = useState('');
  const { data: items, error } = useSWR<ShoppingItem[]>('/api/shopping', fetcher);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    await fetch('/api/shopping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newItem }),
    });

    setNewItem('');
    mutate('/api/shopping');
  };

  const toggleItem = async (id: string, completed: boolean) => {
    await fetch('/api/shopping', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    });
    mutate('/api/shopping');
  };

  const deleteItem = async (id: string) => {
    await fetch('/api/shopping', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    mutate('/api/shopping');
  };

  if (error) return <div>Failed to load shopping list</div>;
  if (!items) return <div>Loading...</div>;

  const pendingItems = items.filter(item => !item.completed);

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-indigo-100/20 dark:border-indigo-800/20 shadow-xl">
       <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
            Shopping List
        </h2>
      </div>
      
      <div className="space-y-6">
        {pendingItems.length > 0 && (
          <div className="space-y-4">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                    className="h-5 w-5"
                  />
                  <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    {item.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={addItem} className="flex gap-2 mt-6">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add to shopping list..."
            className="text-xl bg-white/90 dark:bg-gray-800/90 border-indigo-100/20 dark:border-indigo-800/20 backdrop-blur-sm"
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-indigo-600/90 hover:bg-indigo-700/90 text-white shadow-md h-12 w-12 rounded-xl transition-all hover:scale-105 backdrop-blur-sm"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </Card>
  );
}