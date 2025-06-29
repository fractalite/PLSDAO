import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

interface WalletContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  isConnecting: boolean;
  connectWallet: (walletType?: string) => Promise<void>;
  disconnectWallet: () => void;
  switchToPulseChain: () => Promise<boolean>;
  isOnPulseChain: boolean;
  connectedWallet: string | null;
  showWalletModal: boolean;
  setShowWalletModal: (show: boolean) => void;
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

// WalletConnect Project ID - Replace with your actual project ID
const WALLETCONNECT_PROJECT_ID = 'your-walletconnect-project-id';

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOnPulseChain, setIsOnPulseChain] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletConnectProvider, setWalletConnectProvider] = useState<EthereumProvider | null>(null);

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
    if (!provider) {
      console.error('No provider available');
      return false;
    }

    try {
      // For WalletConnect, we need to handle network switching differently
      if (connectedWallet === 'walletconnect' && walletConnectProvider) {
        try {
          await walletConnectProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: PULSECHAIN_CONFIG.chainId }],
          });
          await checkNetwork(provider);
          return true;
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await walletConnectProvider.request({
              method: 'wallet_addEthereumChain',
              params: [PULSECHAIN_CONFIG]
            });
            await checkNetwork(provider);
            return true;
          }
          throw switchError;
        }
      }

      // For MetaMask and other injected wallets
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: PULSECHAIN_CONFIG.chainId }],
          });
          
          if (provider) {
            await checkNetwork(provider);
          }
          return true;
        } catch (switchError: any) {
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
      }

      return false;
    } catch (error) {
      console.error('Network switching error:', error);
      return false;
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    setAccount(accounts[0]);
    setProvider(provider);
    setConnectedWallet('metamask');
    
    // Store connection preference
    localStorage.setItem('lastConnectedWallet', 'metamask');
    
    // Check if on PulseChain
    const isPulseChain = await checkNetwork(provider);
    if (!isPulseChain) {
      await switchToPulseChain();
    }
  };

  const connectWalletConnect = async () => {
    try {
      const wcProvider = await EthereumProvider.init({
        projectId: WALLETCONNECT_PROJECT_ID,
        chains: [369], // PulseChain
        showQrModal: true,
        qrModalOptions: {
          themeMode: 'dark',
          themeVariables: {
            '--wcm-z-index': '1000',
            '--wcm-accent-color': '#8b5cf6',
            '--wcm-background-color': '#1e293b'
          }
        },
        metadata: {
          name: 'PLSDAO',
          description: 'PulseChain DAO Launcher',
          url: 'https://plsdao.com',
          icons: ['https://plsdao.com/icon.png']
        }
      });

      await wcProvider.enable();
      
      const ethersProvider = new ethers.BrowserProvider(wcProvider);
      const accounts = await ethersProvider.listAccounts();
      
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        setProvider(ethersProvider);
        setWalletConnectProvider(wcProvider);
        setConnectedWallet('walletconnect');
        
        // Store connection preference
        localStorage.setItem('lastConnectedWallet', 'walletconnect');
        
        // Check network
        await checkNetwork(ethersProvider);
        
        // Set up event listeners
        wcProvider.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            disconnectWallet();
          }
        });

        wcProvider.on('chainChanged', () => {
          if (ethersProvider) {
            checkNetwork(ethersProvider);
          }
        });

        wcProvider.on('disconnect', () => {
          disconnectWallet();
        });
      }
    } catch (error) {
      console.error('WalletConnect connection failed:', error);
      throw error;
    }
  };

  const connectCoinbaseWallet = async () => {
    // Check if Coinbase Wallet is available
    if (window.ethereum?.isCoinbaseWallet) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      setAccount(accounts[0]);
      setProvider(provider);
      setConnectedWallet('coinbase');
      
      // Store connection preference
      localStorage.setItem('lastConnectedWallet', 'coinbase');
      
      // Check if on PulseChain
      const isPulseChain = await checkNetwork(provider);
      if (!isPulseChain) {
        await switchToPulseChain();
      }
    } else {
      throw new Error('Coinbase Wallet is not installed');
    }
  };

  const connectInjectedWallet = async () => {
    if (!window.ethereum) {
      throw new Error('No wallet detected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    setAccount(accounts[0]);
    setProvider(provider);
    setConnectedWallet('injected');
    
    // Store connection preference
    localStorage.setItem('lastConnectedWallet', 'injected');
    
    // Check if on PulseChain
    const isPulseChain = await checkNetwork(provider);
    if (!isPulseChain) {
      await switchToPulseChain();
    }
  };

  const connectWallet = async (walletType?: string) => {
    if (!walletType) {
      setShowWalletModal(true);
      return;
    }

    setIsConnecting(true);
    try {
      switch (walletType) {
        case 'metamask':
          await connectMetaMask();
          break;
        case 'walletconnect':
          await connectWalletConnect();
          break;
        case 'coinbase':
          await connectCoinbaseWallet();
          break;
        case 'injected':
          await connectInjectedWallet();
          break;
        default:
          throw new Error('Unsupported wallet type');
      }
      setShowWalletModal(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    // Disconnect WalletConnect if connected
    if (walletConnectProvider) {
      walletConnectProvider.disconnect();
      setWalletConnectProvider(null);
    }

    setAccount(null);
    setProvider(null);
    setIsOnPulseChain(false);
    setConnectedWallet(null);
    
    // Clear stored preference
    localStorage.removeItem('lastConnectedWallet');
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const autoConnect = async () => {
      const lastWallet = localStorage.getItem('lastConnectedWallet');
      
      if (lastWallet === 'metamask' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet('metamask');
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      } else if (lastWallet === 'walletconnect') {
        // WalletConnect auto-reconnection is handled by the provider itself
        try {
          await connectWallet('walletconnect');
        } catch (error) {
          console.error('WalletConnect auto-connect failed:', error);
        }
      }
    };

    autoConnect();
  }, []);

  // Set up MetaMask event listeners
  useEffect(() => {
    if (window.ethereum && connectedWallet === 'metamask') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = () => {
        if (provider) {
          checkNetwork(provider);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [provider, connectedWallet]);

  return (
    <WalletContext.Provider value={{
      account,
      provider,
      isConnecting,
      connectWallet,
      disconnectWallet,
      switchToPulseChain,
      isOnPulseChain,
      connectedWallet,
      showWalletModal,
      setShowWalletModal
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