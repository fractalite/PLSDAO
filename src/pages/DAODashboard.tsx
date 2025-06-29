import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Coins, 
  TrendingUp, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  Vote,
  DollarSign,
  Activity,
  ExternalLink,
  Send,
  Shield,
  Settings,
  Eye,
  Download,
  Upload,
  Lock,
  Unlock,
  AlertTriangle,
  Copy
} from 'lucide-react';

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'failed' | 'executed';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endTime: Date;
  executionTime?: Date;
  category: 'treasury' | 'governance' | 'membership' | 'other';
  amount?: string;
  recipient?: string;
}

interface TreasuryTransaction {
  id: string;
  type: 'incoming' | 'outgoing' | 'swap' | 'stake';
  amount: string;
  token: string;
  from?: string;
  to?: string;
  timestamp: Date;
  txHash: string;
  status: 'completed' | 'pending' | 'failed';
  proposalId?: number;
}

interface DAOData {
  name: string;
  description: string;
  tokenSymbol: string;
  tokenName: string;
  memberCount: number;
  treasuryBalance: {
    pls: string;
    tokens: string;
    usd: string;
  };
  totalSupply: string;
  governanceThreshold: number;
  votingPeriod: number;
  multiSigEnabled: boolean;
  requiredSignatures: number;
  treasuryAddress: string;
}

const DAODashboard: React.FC = () => {
  const { contractAddress } = useParams<{ contractAddress: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'treasury' | 'create'>('overview');
  const [treasuryTab, setTreasuryTab] = useState<'overview' | 'transactions' | 'send' | 'settings'>('overview');
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [showSendFunds, setShowSendFunds] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'other' as const,
    amount: '',
    recipient: ''
  });
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    token: 'PLS',
    description: ''
  });

  // Enhanced DAO data with treasury management - Updated to PLSDAO Treasury
  const [daoData] = useState<DAOData>({
    name: 'PLSDAO Treasury',
    description: 'Community-driven treasury management for PulseChain ecosystem development and growth',
    tokenSymbol: 'PLSDAO',
    tokenName: 'PLSDAO Token',
    memberCount: 1247,
    treasuryBalance: {
      pls: '12,450.5',
      tokens: '50,000',
      usd: '24,901'
    },
    totalSupply: '1,000,000',
    governanceThreshold: 4,
    votingPeriod: 7,
    multiSigEnabled: true,
    requiredSignatures: 3,
    treasuryAddress: '0x742d35Cc6634C0532925a3b8D4C9db96'
  });

  const [proposals] = useState<Proposal[]>([
    {
      id: 1,
      title: 'Fund Development of PulseChain DEX',
      description: 'Proposal to allocate 5,000 PLS from treasury to fund the development of a new decentralized exchange on PulseChain.',
      proposer: '0x1234...5678',
      status: 'active',
      votesFor: 15420,
      votesAgainst: 3200,
      totalVotes: 18620,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      category: 'treasury',
      amount: '5,000 PLS',
      recipient: '0x9876...4321'
    },
    {
      id: 2,
      title: 'Update Governance Threshold to 5%',
      description: 'Increase the minimum threshold required to pass proposals from 4% to 5% to ensure better consensus.',
      proposer: '0x9876...4321',
      status: 'active',
      votesFor: 8900,
      votesAgainst: 12100,
      totalVotes: 21000,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      category: 'governance'
    },
    {
      id: 3,
      title: 'Community Grant Program Launch',
      description: 'Establish a monthly grant program of 1,000 PLS to support community developers and projects.',
      proposer: '0x5555...7777',
      status: 'passed',
      votesFor: 25600,
      votesAgainst: 4400,
      totalVotes: 30000,
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      executionTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      category: 'treasury',
      amount: '1,000 PLS',
      recipient: 'Grant Pool'
    }
  ]);

  const [treasuryTransactions] = useState<TreasuryTransaction[]>([
    {
      id: '1',
      type: 'incoming',
      amount: '2,500',
      token: 'PLS',
      from: '0x1234...5678',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      txHash: '0xabc123...def456',
      status: 'completed'
    },
    {
      id: '2',
      type: 'outgoing',
      amount: '1,000',
      token: 'PLS',
      to: '0x9876...4321',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      txHash: '0xdef456...abc123',
      status: 'completed',
      proposalId: 3
    },
    {
      id: '3',
      type: 'incoming',
      amount: '10,000',
      token: 'PLSDAO',
      from: '0x5555...7777',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      txHash: '0x789abc...123def',
      status: 'completed'
    },
    {
      id: '4',
      type: 'outgoing',
      amount: '500',
      token: 'PLS',
      to: '0x1111...2222',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      txHash: '0x123def...789abc',
      status: 'pending',
      proposalId: 1
    }
  ]);

  const [recentActivity] = useState([
    { type: 'vote', user: '0x1234...5678', action: 'voted FOR', proposal: 'Fund Development of PulseChain DEX', time: '2 hours ago' },
    { type: 'treasury', user: 'Treasury', action: 'received', proposal: '2,500 PLS from community donation', time: '2 hours ago' },
    { type: 'proposal', user: '0x9876...4321', action: 'created proposal', proposal: 'Update Governance Threshold to 5%', time: '1 day ago' },
    { type: 'treasury', user: 'Treasury', action: 'sent', proposal: '1,000 PLS to Grant Pool', time: '1 day ago' },
    { type: 'execution', user: 'System', action: 'executed', proposal: 'Community Grant Program Launch', time: '2 days ago' },
    { type: 'vote', user: '0x5555...7777', action: 'voted AGAINST', proposal: 'Update Governance Threshold to 5%', time: '3 days ago' }
  ]);

  const handleCreateProposal = () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    console.log('Creating proposal:', newProposal);
    
    setNewProposal({ title: '', description: '', category: 'other', amount: '', recipient: '' });
    setShowCreateProposal(false);
    setActiveTab('proposals');
    
    alert('Proposal created successfully! (This is a demo)');
  };

  const handleSendFunds = () => {
    if (!sendForm.recipient.trim() || !sendForm.amount.trim()) {
      alert('Please fill in recipient and amount');
      return;
    }

    console.log('Creating treasury proposal:', sendForm);
    
    // Create a treasury proposal instead of direct send
    const treasuryProposal = {
      title: `Send ${sendForm.amount} ${sendForm.token} to ${sendForm.recipient.slice(0, 10)}...`,
      description: sendForm.description || `Treasury transfer of ${sendForm.amount} ${sendForm.token}`,
      category: 'treasury' as const,
      amount: `${sendForm.amount} ${sendForm.token}`,
      recipient: sendForm.recipient
    };

    setSendForm({ recipient: '', amount: '', token: 'PLS', description: '' });
    setShowSendFunds(false);
    
    alert('Treasury proposal created! Community voting required. (This is a demo)');
  };

  const handleVote = (proposalId: number, support: boolean) => {
    console.log(`Voting ${support ? 'FOR' : 'AGAINST'} proposal ${proposalId}`);
    alert(`Vote submitted! (This is a demo)`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-500/20';
      case 'passed': return 'text-green-400 bg-green-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      case 'executed': return 'text-purple-400 bg-purple-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'executed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <Download className="h-4 w-4 text-green-400" />;
      case 'outgoing': return <Upload className="h-4 w-4 text-red-400" />;
      case 'swap': return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case 'stake': return <Lock className="h-4 w-4 text-purple-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60 * 1000) return 'Just now';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* DAO Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-white mb-2">{daoData.name}</h1>
                <p className="text-gray-300 mb-4">{daoData.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-400">Contract:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-400 font-mono">{contractAddress?.slice(0, 10)}...{contractAddress?.slice(-8)}</span>
                    <button
                      onClick={() => copyToClipboard(contractAddress || '')}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={`https://scan.pulsechain.com/address/${contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">{daoData.memberCount}</div>
                  <div className="text-gray-400 text-sm">Members</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">{daoData.treasuryBalance.pls}</div>
                  <div className="text-gray-400 text-sm">PLS Treasury</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">${daoData.treasuryBalance.usd}</div>
                  <div className="text-gray-400 text-sm">USD Value</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">{proposals.filter(p => p.status === 'active').length}</div>
                  <div className="text-gray-400 text-sm">Active Proposals</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'proposals', label: 'Proposals', icon: Vote },
            { id: 'treasury', label: 'Treasury', icon: DollarSign },
            { id: 'create', label: 'Create Proposal', icon: Plus }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'create') {
                  setShowCreateProposal(true);
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Active Proposals */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-6">Active Proposals</h2>
                <div className="space-y-4">
                  {proposals.filter(p => p.status === 'active').map((proposal) => (
                    <div key={proposal.id} className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
                          <p className="text-gray-300 text-sm mb-3">{proposal.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>By {proposal.proposer}</span>
                            <span>{formatTimeRemaining(proposal.endTime)}</span>
                            {proposal.amount && <span className="text-green-400">{proposal.amount}</span>}
                          </div>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {getStatusIcon(proposal.status)}
                          <span className="capitalize">{proposal.status}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">For: {proposal.votesFor.toLocaleString()}</span>
                          <span className="text-gray-400">Against: {proposal.votesAgainst.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(proposal.votesFor / proposal.totalVotes) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleVote(proposal.id, true)}
                            className="flex-1 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                          >
                            Vote For
                          </button>
                          <button
                            onClick={() => handleVote(proposal.id, false)}
                            className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                          >
                            Vote Against
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start space-x-3">
                        <Activity className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                            <span className="text-purple-300">{activity.proposal}</span>
                          </p>
                          <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'proposals' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">All Proposals</h2>
                <button
                  onClick={() => setShowCreateProposal(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Proposal</span>
                </button>
              </div>
              
              <div className="space-y-6">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{proposal.title}</h3>
                          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                            {getStatusIcon(proposal.status)}
                            <span className="capitalize">{proposal.status}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-3">{proposal.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Proposed by {proposal.proposer}</span>
                          <span>Category: {proposal.category}</span>
                          {proposal.amount && <span className="text-green-400">{proposal.amount}</span>}
                          {proposal.status === 'active' && <span>{formatTimeRemaining(proposal.endTime)}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <div className="text-green-400 font-semibold">{proposal.votesFor.toLocaleString()}</div>
                          <div className="text-gray-400">For</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <div className="text-red-400 font-semibold">{proposal.votesAgainst.toLocaleString()}</div>
                          <div className="text-gray-400">Against</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <div className="text-white font-semibold">{proposal.totalVotes.toLocaleString()}</div>
                          <div className="text-gray-400">Total</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full" 
                          style={{ width: `${(proposal.votesFor / proposal.totalVotes) * 100}%` }}
                        ></div>
                      </div>
                      
                      {proposal.status === 'active' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleVote(proposal.id, true)}
                            className="flex-1 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                          >
                            Vote For
                          </button>
                          <button
                            onClick={() => handleVote(proposal.id, false)}
                            className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                          >
                            Vote Against
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'treasury' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Treasury Management</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowSendFunds(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Funds</span>
                  </button>
                </div>
              </div>

              {/* Treasury Sub-tabs */}
              <div className="flex space-x-2 mb-8">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'transactions', label: 'Transactions', icon: Activity },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTreasuryTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      treasuryTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {treasuryTab === 'overview' && (
                <div className="space-y-8">
                  {/* Balance Cards */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <Coins className="h-6 w-6 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">PLS Balance</h3>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{daoData.treasuryBalance.pls} PLS</div>
                      <p className="text-gray-400 text-sm">Native PulseChain tokens</p>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <Coins className="h-6 w-6 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">{daoData.tokenSymbol} Balance</h3>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{daoData.treasuryBalance.tokens} {daoData.tokenSymbol}</div>
                      <p className="text-gray-400 text-sm">Governance tokens</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <DollarSign className="h-6 w-6 text-yellow-400" />
                        <h3 className="text-lg font-semibold text-white">Total Value</h3>
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">${daoData.treasuryBalance.usd}</div>
                      <p className="text-gray-400 text-sm">USD equivalent</p>
                    </div>
                  </div>

                  {/* Treasury Address */}
                  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Treasury Address</h3>
                      {daoData.multiSigEnabled && (
                        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                          <Shield className="h-4 w-4" />
                          <span>Multi-Sig Protected</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-purple-400 font-mono">{daoData.treasuryAddress}</span>
                      <button
                        onClick={() => copyToClipboard(daoData.treasuryAddress)}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <a
                        href={`https://scan.pulsechain.com/address/${daoData.treasuryAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <Shield className="h-6 w-6 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Security Features</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Multi-Signature</span>
                          <div className="flex items-center space-x-2">
                            {daoData.multiSigEnabled ? (
                              <Lock className="h-4 w-4 text-green-400" />
                            ) : (
                              <Unlock className="h-4 w-4 text-red-400" />
                            )}
                            <span className={daoData.multiSigEnabled ? 'text-green-400' : 'text-red-400'}>
                              {daoData.multiSigEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                        {daoData.multiSigEnabled && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Required Signatures</span>
                            <span className="text-white">{daoData.requiredSignatures} of 5</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Governance Required</span>
                          <span className="text-green-400">Yes</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <Settings className="h-6 w-6 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Governance Rules</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Threshold</span>
                          <span className="text-white">{daoData.governanceThreshold}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Voting Period</span>
                          <span className="text-white">{daoData.votingPeriod} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Execution Delay</span>
                          <span className="text-white">2 days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {treasuryTab === 'transactions' && (
                <div>
                  <div className="space-y-4">
                    {treasuryTransactions.map((tx) => (
                      <div key={tx.id} className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getTransactionIcon(tx.type)}
                            <div>
                              <div className="flex items-center space-x-3">
                                <span className="text-white font-medium">
                                  {tx.type === 'incoming' ? 'Received' : 'Sent'} {tx.amount} {tx.token}
                                </span>
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                                  {getStatusIcon(tx.status)}
                                  <span className="capitalize">{tx.status}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                                {tx.from && <span>From: {tx.from}</span>}
                                {tx.to && <span>To: {tx.to}</span>}
                                <span>{formatTimestamp(tx.timestamp)}</span>
                                {tx.proposalId && <span>Proposal #{tx.proposalId}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => copyToClipboard(tx.txHash)}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <a
                              href={`https://scan.pulsechain.com/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {treasuryTab === 'settings' && (
                <div className="space-y-8">
                  <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-yellow-300 font-medium mb-2">Treasury Settings</h4>
                        <p className="text-yellow-200 text-sm">
                          All treasury settings changes require governance proposals and community approval.
                          These settings control how funds can be managed and spent.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">Multi-Signature Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Status</span>
                          <span className={daoData.multiSigEnabled ? 'text-green-400' : 'text-red-400'}>
                            {daoData.multiSigEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Required Signatures</span>
                          <span className="text-white">{daoData.requiredSignatures} of 5</span>
                        </div>
                        <button className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                          Propose Changes
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">Spending Limits</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Daily Limit</span>
                          <span className="text-white">1,000 PLS</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Monthly Limit</span>
                          <span className="text-white">10,000 PLS</span>
                        </div>
                        <button className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                          Propose Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Create Proposal Modal */}
        {showCreateProposal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Proposal</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Proposal Title *
                  </label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="Enter proposal title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newProposal.category}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  >
                    <option value="treasury">Treasury</option>
                    <option value="governance">Governance</option>
                    <option value="membership">Membership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {newProposal.category === 'treasury' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount
                      </label>
                      <input
                        type="text"
                        value={newProposal.amount}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        placeholder="e.g., 1000 PLS"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        value={newProposal.recipient}
                        onChange={(e) => setNewProposal(prev => ({ ...prev, recipient: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        placeholder="0x..."
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                    placeholder="Describe your proposal in detail..."
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowCreateProposal(false)}
                  className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProposal}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
                >
                  Create Proposal
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Send Funds Modal */}
        {showSendFunds && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Send Treasury Funds</h2>
              
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-blue-300 font-medium mb-1">Governance Required</h4>
                    <p className="text-blue-200 text-sm">
                      This will create a governance proposal that requires community voting before funds can be sent.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient Address *
                  </label>
                  <input
                    type="text"
                    value={sendForm.recipient}
                    onChange={(e) => setSendForm(prev => ({ ...prev, recipient: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="0x..."
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      value={sendForm.amount}
                      onChange={(e) => setSendForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Token
                    </label>
                    <select
                      value={sendForm.token}
                      onChange={(e) => setSendForm(prev => ({ ...prev, token: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    >
                      <option value="PLS">PLS</option>
                      <option value={daoData.tokenSymbol}>{daoData.tokenSymbol}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={sendForm.description}
                    onChange={(e) => setSendForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                    placeholder="Reason for this transfer..."
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowSendFunds(false)}
                  className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendFunds}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
                >
                  Create Treasury Proposal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DAODashboard;