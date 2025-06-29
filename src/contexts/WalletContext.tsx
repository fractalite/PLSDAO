import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToPulseChain: () => Promise<boolean>;
  isOnPulseChain: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

const PULSECHAIN_CONFIG = {
  chainId: '0x171', // 369 in hex
  chainName: 'PulseChain',
  nativeCurrency: {
    name: 'PLS',
    symbol: 'PLS',
    decimals: 18
  },
  rpcUrls: ['https://rpc.pulsechain.com'],
  blockExplorerUrls: ['https://scan.pulsechain.com']
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOnPulseChain, setIsOnPulseChain] = useState(false);

  const checkNetwork = async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork();
      const isPulseChain = network.chainId === 369n;
      setIsOnPulseChain(isPulseChain);
      return isPulseChain;
    } catch (error) {
      console.error('Error checking network:', error);
      setIsOnPulseChain(false);
      return false;
    }
  };

  const switchToPulseChain = async (): Promise<boolean> => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature');
      return false;
    }

    try {
      // Try to switch to PulseChain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: PULSECHAIN_CONFIG.chainId }],
      });
      
      if (provider) {
        await checkNetwork(provider);
      }
      return true;
    } catch (switchError: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [PULSECHAIN_CONFIG]
          });
          
          if (provider) {
            await checkNetwork(provider);
          }
          return true;
        } catch (addError) {
          console.error('Failed to add PulseChain network:', addError);
          return false;
        }
      } else {
        console.error('Failed to switch to PulseChain:', switchError);
        return false;
      }
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            checkNetwork(provider);
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        if (provider) {
          checkNetwork(provider);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to connect your wallet');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      setAccount(accounts[0]);
      setProvider(provider);
      
      // Check if on PulseChain, if not, try to switch
      const isPulseChain = await checkNetwork(provider);
      if (!isPulseChain) {
        await switchToPulseChain();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setIsOnPulseChain(false);
  };

  return (
    <WalletContext.Provider value={{
      account,
      provider,
      isConnecting,
      connectWallet,
      disconnectWallet,
      switchToPulseChain,
      isOnPulseChain
    }}>
      {children}
    </WalletContext.Provider>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
}