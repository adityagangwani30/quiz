import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Landing from './pages/Landing';

import Level1 from './pages/Level1';
import Level2 from './pages/Level2';
import ResultScreen from './pages/ResultScreen';
import Leaderboard from './pages/Leaderboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameProvider><Landing /></GameProvider>} />

        <Route path="/level1" element={<GameProvider><Level1 /></GameProvider>} />
        <Route path="/level2" element={<GameProvider><Level2 /></GameProvider>} />
        <Route path="/result" element={<GameProvider><ResultScreen /></GameProvider>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
