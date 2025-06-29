import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WalletModal from './components/WalletModal';
import Landing from './pages/Landing';
import CreateDAO from './pages/CreateDAO';
import Browse from './pages/Browse';
import Learn from './pages/Learn';
import About from './pages/About';
import Documentation from './pages/Documentation';
import DAODashboard from './pages/DAODashboard';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/create" element={<CreateDAO />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/about" element={<About />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/dao/:contractAddress" element={<DAODashboard />} />
            </Routes>
          </main>
          <Footer />
          <WalletModal />
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;