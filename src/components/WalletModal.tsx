import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Smartphone, Globe, Shield, AlertCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletModal: React.FC = () => {
  const { showWalletModal, setShowWalletModal, connectWallet, isConnecting } = useWallet();

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect using browser extension',
      icon: '🦊',
      type: 'browser',
      available: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
      downloadUrl: 'https://metamask.io/download/'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Connect with mobile wallets',
      icon: '📱',
      type: 'mobile',
      available: true,
      downloadUrl: null
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect using Coinbase Wallet',
      icon: '🔵',
      type: 'browser',
      available: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet,
      downloadUrl: 'https://wallet.coinbase.com/'
    },
    {
      id: 'injected',
      name: 'Other Wallet',
      description: 'Connect any injected wallet',
      icon: '🔗',
      type: 'browser',
      available: typeof window !== 'undefined' && window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet,
      downloadUrl: null
    }
  ];

  const handleWalletConnect = async (walletId: string) => {
    try {
      await connectWallet(walletId);
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      alert(error.message || 'Failed to connect wallet');
    }
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'browser':
        return <Globe className="h-5 w-5 text-blue-400" />;
      case 'mobile':
        return <Smartphone className="h-5 w-5 text-green-400" />;
      default:
        return <Wallet className="h-5 w-5 text-purple-400" />;
    }
  };

  if (!showWalletModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
            <button
              onClick={() => setShowWalletModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-300 font-medium mb-1">Secure Connection</h4>
                <p className="text-blue-200 text-sm">
                  Your wallet will be connected securely. PLSDAO never stores your private keys.
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Options */}
          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <div key={wallet.id}>
                {wallet.available ? (
                  <button
                    onClick={() => handleWalletConnect(wallet.id)}
                    disabled={isConnecting}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
                        {wallet.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                            {wallet.name}
                          </h3>
                          {getWalletIcon(wallet.type)}
                        </div>
                        <p className="text-gray-400 text-sm">{wallet.description}</p>
                      </div>
                      {isConnecting && (
                        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </button>
                ) : (
                  <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
                          {wallet.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-gray-400 font-semibold">{wallet.name}</h3>
                            {getWalletIcon(wallet.type)}
                          </div>
                          <p className="text-gray-500 text-sm">Not installed</p>
                        </div>
                      </div>
                      {wallet.downloadUrl && (
                        <a
                          href={wallet.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Wallet Info */}
          <div className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-start space-x-3">
              <Smartphone className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-purple-300 font-medium mb-1">Mobile Wallets</h4>
                <p className="text-purple-200 text-sm">
                  Use WalletConnect to connect mobile wallets like Trust Wallet, Rainbow, 
                  Coinbase Wallet, and many others.
                </p>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-green-300 font-medium mb-1">PulseChain Network</h4>
                <p className="text-green-200 text-sm">
                  You'll be prompted to switch to PulseChain network after connecting. 
                  The network will be added automatically if not present.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs">
              By connecting a wallet, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WalletModal;