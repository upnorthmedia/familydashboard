import { WeatherWidget } from '@/components/WeatherWidget';
import { ShoppingList } from '@/components/ShoppingList';
import { Calendar } from '@/components/Calendar';
import { Clock } from '@/components/Clock';
import RingCameras from '@/components/RingCameras';

export default function Home() {
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
        padding: '2rem'
      }}
    >
      <div className="max-w-[1920px] mx-auto grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <Clock />
            <WeatherWidget />
          </div>
          <Calendar />
        </div>
        <div className="space-y-8">
          <RingCameras />
          <ShoppingList />
        </div>
      </div>
    </main>
  );
}