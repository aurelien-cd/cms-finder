import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Settings from './pages/settings';
import Libraries from './pages/libraries';
import Search from './pages/search';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/libraries" element={<Libraries />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}
