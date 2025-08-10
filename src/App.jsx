import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ListeningModule from './pages/ListeningModule.jsx';
import SpeakingModule from './pages/SpeakingModule.jsx';
import ReadingModule from './pages/ReadingModule.jsx';
import MockInterview from './pages/MockInterview.jsx';
import Progress from './pages/Progress.jsx';
import Login from './pages/Login.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState({
    listening: { completed: 0, total: 10, score: 0 },
    speaking: { completed: 0, total: 8, score: 0 },
    reading: { completed: 0, total: 12, score: 0 },
    mockInterviews: { completed: 0, total: 5, score: 0 }
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('lsrUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load user progress
    const storedProgress = localStorage.getItem('userProgress');
    if (storedProgress) {
      setUserProgress(JSON.parse(storedProgress));
    }
  }, []);

  const updateProgress = (module, data) => {
    const newProgress = {
      ...userProgress,
      [module]: { ...userProgress[module], ...data }
    };
    setUserProgress(newProgress);
    localStorage.setItem('userProgress', JSON.stringify(newProgress));
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={() => setUser(null)} />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Dashboard progress={userProgress} />} />
          <Route path="/listening" element={<ListeningModule onProgress={(data) => updateProgress('listening', data)} />} />
          <Route path="/speaking" element={<SpeakingModule onProgress={(data) => updateProgress('speaking', data)} />} />
          <Route path="/reading" element={<ReadingModule onProgress={(data) => updateProgress('reading', data)} />} />
          <Route path="/mock-interview" element={<MockInterview onProgress={(data) => updateProgress('mockInterviews', data)} />} />
          <Route path="/progress" element={<Progress progress={userProgress} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;