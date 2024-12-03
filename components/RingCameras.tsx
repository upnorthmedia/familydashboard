'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Camera as CameraIcon } from 'lucide-react';

interface RingCamera {
  id: string;
  name: string;
  isDoorbell: boolean;
  snapshot: string | null;
  deviceType: string;
  status: 'online' | 'offline';
}

export default function RingCameras() {
  const [cameras, setCameras] = useState<RingCamera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchCameras = async () => {
    try {
      setLoading(true);
      console.log('Fetching cameras...');
      const response = await fetch('/api/ring');
      if (!response.ok) throw new Error('Failed to fetch cameras');
      const data = await response.json();
      console.log('Received camera data:', data);
      setCameras(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching cameras:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cameras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
    // Refresh every 60 seconds
    const interval = setInterval(fetchCameras, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && cameras.length === 0) {
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-indigo-100/20 dark:border-indigo-800/20 shadow-xl">
        <div className="text-center text-indigo-600/70 dark:text-indigo-400/70 py-8">
          Loading cameras...
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-indigo-100/20 dark:border-indigo-800/20 shadow-xl">
        <div className="text-center text-red-500 dark:text-red-400 py-8">
          Error: {error}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-indigo-100/20 dark:border-indigo-800/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CameraIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
            Cameras
          </h2>
        </div>
        <div className="text-sm text-indigo-600/70 dark:text-indigo-400/70">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameras.map((camera) => (
          <Card key={camera.id} className="bg-white/90 dark:bg-gray-800/90 border-indigo-100/20 dark:border-indigo-800/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">{camera.name}</CardTitle>
              <div className="text-sm text-indigo-600 dark:text-indigo-400">
                {camera.deviceType && camera.deviceType !== 'Unknown Model' ? camera.deviceType : 'Ring Doorbell'} - {camera.status}
              </div>
            </CardHeader>
            <CardContent>
              {camera.snapshot ? (
                <div className="relative aspect-video w-full">
                  <Image
                    src={`data:image/jpeg;base64,${camera.snapshot}`}
                    alt={camera.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400">
                  No preview available
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  );
} 