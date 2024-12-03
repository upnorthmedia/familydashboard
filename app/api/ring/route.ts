import { RingApi } from 'ring-client-api';
import { NextResponse } from 'next/server';

let ringApi: RingApi | null = null;

// List of camera names we want to show
const ALLOWED_CAMERAS = ['Front Door', 'Back Yard'];

async function getRingApi() {
  if (!ringApi) {
    console.log('Initializing Ring API...');
    ringApi = new RingApi({
      refreshToken: process.env.RING_REFRESH_TOKEN!,
      debug: true,
      cameraStatusPollingSeconds: 20,
    });
    
    ringApi.onRefreshTokenUpdated.subscribe(({ newRefreshToken, oldRefreshToken }) => {
      console.log('Refresh Token Updated:', { oldRefreshToken, newRefreshToken });
    });
  }
  return ringApi;
}

export async function GET() {
  try {
    console.log('Fetching Ring cameras...');
    const api = await getRingApi();
    const cameras = await api.getCameras();
    
    // Filter for only the cameras we want
    const filteredCameras = cameras.filter(camera => 
      ALLOWED_CAMERAS.includes(camera.name)
    );
    
    console.log(`Found ${filteredCameras.length} matching cameras`);

    const cameraData = await Promise.all(filteredCameras.map(async (camera) => {
      console.log(`Processing camera: ${camera.name}`);
      let snapshot;
      try {
        snapshot = await camera.getSnapshot();
        console.log(`Successfully got snapshot for ${camera.name}`);
      } catch (snapshotError) {
        console.error(`Failed to get snapshot for ${camera.name}:`, snapshotError);
        snapshot = null;
      }

      // Get device health info
      const health = await camera.getHealth();
      const deviceStatus = health ? 'online' : 'offline';

      return {
        id: camera.id,
        name: camera.name,
        isDoorbell: camera.isDoorbot,
        snapshot: snapshot ? Buffer.from(snapshot).toString('base64') : null,
        deviceType: camera.model,
        status: deviceStatus,
      };
    }));

    return NextResponse.json(cameraData);
  } catch (error) {
    console.error('Ring API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Ring camera data', details: error.message },
      { status: 500 }
    );
  }
} 