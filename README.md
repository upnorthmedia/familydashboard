# Family Dashboard

A modern, real-time family dashboard designed to run on a Raspberry Pi connected to a TV display. Built with Next.js 13, TypeScript, and Tailwind CSS, featuring a beautiful dark theme and glass-morphism design.

![alt text](https://i.imgur.com/UlgzvN0.png)

## Features

### 🕒 Real-Time Clock & Date
- Large format digital clock
- Full date display with weekday
- Automatic updates every second

### 🌤 Weather Widget
- Current temperature and conditions
- Location-based weather data
- Hourly forecast
- Real-time updates
- Humidity and "feels like" temperature

### 📅 Apple Calendar Integration
- Today's and tomorrow's events
- Real-time schedule updates
- Clean event display with timing
- Automatic refresh

### 🛒 Shopping List
- Add/remove items
- Real-time sync across devices
- Mark items as complete
- Mobile-optimized interface
- SQLite backend storage

### 📹 Ring Camera Integration
- Live camera feeds
- Doorbell status
- Device health monitoring
- Automatic snapshot updates
- Multiple camera support

## Technology Stack

### Frontend
- Next.js 13
- TypeScript
- Tailwind CSS
- Radix UI Components
- Lucide Icons
- SWR for data fetching
- Glass-morphism design system

### Backend
- Next.js API Routes
- SQLite Database
- Ring Client API
- Weather API Integration

### UI Components
- Shadcn/ui component library
- Custom themed components
- Responsive design
- Dark mode support

## Installation

1. Clone the repository
```bash
git clone https://github.com/upnorthmedia/family-dashboard.git
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Required environment variables:
- `RING_EMAIL`
- `RING_PASSWORD`
- `WEATHER_API_KEY`
- `DATABASE_URL`

4. Run the development server
```bash
npm run dev
```

## Deployment on Raspberry Pi

1. Install Node.js on Raspberry Pi
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Build the application
```bash
npm run build
```

3. Set up PM2 for process management
```bash
npm install -g pm2
pm2 start npm --name "family-dashboard" -- start
```

4. Configure auto-start on boot
```bash
pm2 startup
pm2 save
```

## Project Structure

- `/app` - Next.js 13 app directory structure
- `/components` - Reusable React components
- `/lib` - Utility functions and database setup
- `/public` - Static assets
- `/api` - Backend API routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - feel free to use this project for your own family dashboard!

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Weather data provided by OpenWeather API
- Camera integration powered by Ring API
- Icons by Lucide

## Screenshots
### Dashboard
![alt text](https://i.imgur.com/ttNy6Nv.jpeg)

### Real Running Dashboard
![alt text](https://i.imgur.com/tqJ4toP.jpeg)

### Mobile Admin App
![alt text](https://i.imgur.com/DGxOhDn.png)


---

This dashboard is designed to be displayed 24/7 on a TV screen, providing your family with important information at a glance. The glass-morphism design ensures it looks great in any room, while the dark theme prevents screen burn-in on TV displays.
