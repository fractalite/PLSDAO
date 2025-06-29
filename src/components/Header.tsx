import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const NetworkLightningIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Lightning bolt */}
    <path
      d="M13 2L3 14h6l-2 8 10-12h-6l2-8z"
      fill="currentColor"
      fillOpacity="0.9"
    />
    {/* Network nodes */}
    <circle cx="18" cy="6" r="2" fill="currentColor" fillOpacity="0.8" />
    <circle cx="20" cy="12" r="1.5" fill="currentColor" fillOpacity="0.7" />
    <circle cx="18" cy="18" r="1.5" fill="currentColor" fillOpacity="0.7" />
    <circle cx="6" cy="20" r="1.5" fill="currentColor" fillOpacity="0.7" />
    
    {/* Connection lines */}
    <line x1="16" y1="7" x2="13" y2="10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="19" y1="11" x2="16" y2="14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="17" y1="17" x2="14" y2="14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="7" y1="19" x2="10" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

const Header: React.FC = () => {
  const location = useLocation();
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const isActive = (path: string) => location.pathname === path;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-200">
              <NetworkLightningIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PLSDAO
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/create"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/create')
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Create
            </Link>
            <Link
              to="/browse"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/browse')
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Browse
            </Link>
            <Link
              to="/learn"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/learn')
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Learn
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {account ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white">{formatAddress(account)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet className="h-4 w-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;