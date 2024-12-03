import { ShoppingList } from '@/components/ShoppingList';

export default function AdminPage() {
  return (
    <main 
      style={{
        backgroundImage: `url('/winter2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backgroundBlendMode: 'overlay',
        minHeight: '100vh',
        padding: '1rem'
      }}
    >
      <div className="max-w-lg mx-auto">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            Family Dashboard Admin
          </h1>
          <ShoppingList />
        </div>
      </div>
    </main>
  );
}
