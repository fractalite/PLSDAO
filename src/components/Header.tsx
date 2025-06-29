import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Wallet, ChevronDown } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { 
    account, 
    connectWallet, 
    disconnectWallet, 
    isConnecting, 
    connectedWallet,
    switchToPulseChain,
    isOnPulseChain 
  } = useWallet();

  const isActive = (path: string) => location.pathname === path;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletDisplayName = (walletType: string | null) => {
    switch (walletType) {
      case 'metamask':
        return 'MetaMask';
      case 'walletconnect':
        return 'WalletConnect';
      case 'coinbase':
        return 'Coinbase Wallet';
      case 'injected':
        return 'Wallet';
      default:
        return 'Wallet';
    }
  };

  const getWalletIcon = (walletType: string | null) => {
    switch (walletType) {
      case 'metamask':
        return '🦊';
      case 'walletconnect':
        return '📱';
      case 'coinbase':
        return '🔵';
      default:
        return '🔗';
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-200">
              <Zap className="h-5 w-5 text-white" />
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
                {/* Network Status */}
                {!isOnPulseChain && (
                  <button
                    onClick={switchToPulseChain}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-300 hover:bg-orange-500/30 transition-all text-xs"
                  >
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <span>Switch to PulseChain</span>
                  </button>
                )}

                {/* Connected Wallet Info */}
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getWalletIcon(connectedWallet)}</span>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        {isOnPulseChain ? (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        )}
                        <span className="text-sm text-white font-medium">
                          {formatAddress(account)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {getWalletDisplayName(connectedWallet)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Disconnect Button */}
                <div className="relative group">
                  <button className="text-xs text-gray-400 hover:text-white transition-colors p-2">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-lg border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <button
                        onClick={disconnectWallet}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => connectWallet()}
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