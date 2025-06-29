import Moralis from 'moralis';

// Moralis configuration for PulseChain
export const MORALIS_CONFIG = {
  apiKey: process.env.VITE_MORALIS_API_KEY || 'your-moralis-api-key',
  serverUrl: process.env.VITE_MORALIS_SERVER_URL || 'your-moralis-server-url',
  appId: process.env.VITE_MORALIS_APP_ID || 'your-moralis-app-id'
};

// PulseChain network configuration for Moralis
export const PULSECHAIN_MORALIS_CONFIG = {
  chainId: 369,
  name: 'PulseChain',
  currency: 'PLS',
  rpcUrl: 'https://rpc.pulsechain.com',
  blockExplorerUrl: 'https://scan.pulsechain.com'
};

let moralisInitialized = false;

export const initializeMoralis = async () => {
  if (moralisInitialized) return;

  try {
    await Moralis.start({
      apiKey: MORALIS_CONFIG.apiKey
    });
    
    moralisInitialized = true;
    console.log('Moralis initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Moralis:', error);
    throw error;
  }
};

export const authenticateWithMoralis = async (provider: any, account: string) => {
  try {
    await initializeMoralis();
    
    // Create authentication message
    const message = `Welcome to PLSDAO!\n\nPlease sign this message to authenticate your wallet.\n\nWallet: ${account}\nTimestamp: ${Date.now()}`;
    
    // Sign message with wallet
    const signature = await provider.getSigner().signMessage(message);
    
    // Authenticate with Moralis
    const user = await Moralis.Auth.requestMessage({
      address: account,
      chain: PULSECHAIN_MORALIS_CONFIG.chainId,
      networkType: 'evm'
    });

    const authData = await Moralis.Auth.verify({
      message: user.message,
      signature: signature
    });

    return authData;
  } catch (error) {
    console.error('Moralis authentication failed:', error);
    throw error;
  }
};

export const getUserNFTs = async (address: string) => {
  try {
    await initializeMoralis();
    
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain: PULSECHAIN_MORALIS_CONFIG.chainId
    });

    return response.toJSON();
  } catch (error) {
    console.error('Failed to fetch NFTs:', error);
    return [];
  }
};

export const getUserTokenBalances = async (address: string) => {
  try {
    await initializeMoralis();
    
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain: PULSECHAIN_MORALIS_CONFIG.chainId
    });

    return response.toJSON();
  } catch (error) {
    console.error('Failed to fetch token balances:', error);
    return [];
  }
};

export const getTransactionHistory = async (address: string) => {
  try {
    await initializeMoralis();
    
    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      address,
      chain: PULSECHAIN_MORALIS_CONFIG.chainId,
      limit: 100
    });

    return response.toJSON();
  } catch (error) {
    console.error('Failed to fetch transaction history:', error);
    return [];
  }
};