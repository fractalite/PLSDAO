export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  downloadUrl?: string;
  deepLink?: string;
}

export const detectAvailableWallets = (): WalletInfo[] => {
  const wallets: WalletInfo[] = [];

  // MetaMask
  if (typeof window !== 'undefined' && window.ethereum?.isMetaMask) {
    wallets.push({
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      available: true
    });
  } else {
    wallets.push({
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      available: false,
      downloadUrl: 'https://metamask.io/download/'
    });
  }

  // Coinbase Wallet
  if (typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet) {
    wallets.push({
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      available: true
    });
  } else {
    wallets.push({
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      available: false,
      downloadUrl: 'https://wallet.coinbase.com/'
    });
  }

  // WalletConnect (always available)
  wallets.push({
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '📱',
    available: true
  });

  // Other injected wallets
  if (typeof window !== 'undefined' && window.ethereum && 
      !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet) {
    wallets.push({
      id: 'injected',
      name: 'Other Wallet',
      icon: '🔗',
      available: true
    });
  }

  return wallets;
};

export const isMobile = (): boolean => {
  return typeof window !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getMobileWalletDeepLink = (walletId: string, uri: string): string => {
  const deepLinks: { [key: string]: string } = {
    'trust': `trust://wc?uri=${encodeURIComponent(uri)}`,
    'rainbow': `rainbow://wc?uri=${encodeURIComponent(uri)}`,
    'metamask': `metamask://wc?uri=${encodeURIComponent(uri)}`,
    'coinbase': `cbwallet://wc?uri=${encodeURIComponent(uri)}`,
    'imtoken': `imtokenv2://wc?uri=${encodeURIComponent(uri)}`,
    'tokenpocket': `tpoutside://wc?uri=${encodeURIComponent(uri)}`
  };

  return deepLinks[walletId] || uri;
};

export const getWalletConnectMobileWallets = () => [
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '🛡️',
    downloadUrl: 'https://trustwallet.com/download'
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '🌈',
    downloadUrl: 'https://rainbow.me/download'
  },
  {
    id: 'metamask-mobile',
    name: 'MetaMask Mobile',
    icon: '🦊',
    downloadUrl: 'https://metamask.io/download/'
  },
  {
    id: 'coinbase-mobile',
    name: 'Coinbase Wallet',
    icon: '🔵',
    downloadUrl: 'https://wallet.coinbase.com/'
  },
  {
    id: 'imtoken',
    name: 'imToken',
    icon: '💎',
    downloadUrl: 'https://token.im/download'
  },
  {
    id: 'tokenpocket',
    name: 'TokenPocket',
    icon: '🎒',
    downloadUrl: 'https://tokenpocket.pro/download'
  }
];