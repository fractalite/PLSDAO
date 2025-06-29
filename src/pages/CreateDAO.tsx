import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Loader, ExternalLink, ChevronDown, Upload, X, Copy, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { deployDAO, validateDAOParams, type DAODeploymentParams, type DeploymentResult } from '../utils/contracts';

interface DAOFormData {
  name: string;
  description: string;
  tokenName: string;
  tokenSymbol: string;
  initialSupply: string;
  governanceThreshold: string;
  votingPeriod: string;
  executionDelay: string;
  treasuryAddress: string;
  governanceIntro: string;
  governanceImage: File | null;
  tokenType: string;
  network: string;
  tokenAddress: string;
  votingPlatform: string;
  votingUrl: string;
  administrators: Array<{
    id: string;
    address: string;
    identity: 'Administrator' | 'Editor';
    addedTime: Date;
    isCreator?: boolean;
  }>;
  calendarUrl: string;
}

const CreateDAO: React.FC = () => {
  const navigate = useNavigate();
  const { account, provider, isOnPulseChain, switchToPulseChain } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [newAdminIdentity, setNewAdminIdentity] = useState<'Administrator' | 'Editor'>('Administrator');
  
  const [formData, setFormData] = useState<DAOFormData>({
    name: '',
    description: '',
    tokenName: '',
    tokenSymbol: '',
    initialSupply: '1000000',
    governanceThreshold: '4',
    votingPeriod: '7',
    executionDelay: '2',
    treasuryAddress: '',
    governanceIntro: '',
    governanceImage: null,
    tokenType: 'ERC20',
    network: 'PulseChain',
    tokenAddress: '',
    votingPlatform: 'Snapshot',
    votingUrl: '',
    administrators: [],
    calendarUrl: ''
  });

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Name and describe your DAO' },
    { number: 2, title: 'Token', description: 'Configure your governance token' },
    { number: 3, title: 'Treasury', description: 'Configure treasury management' },
    { number: 4, title: 'Governance', description: 'Set voting and parameters' },
    { number: 5, title: 'Calendar', description: 'Track DAO activities' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: keyof DAOFormData, value: string | File | null) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-populate administrators when treasury address is set
      if (field === 'treasuryAddress' && value && typeof value === 'string') {
        const existingCreator = updated.administrators.find(admin => admin.isCreator);
        if (!existingCreator) {
          updated.administrators = [{
            id: '1',
            address: value,
            identity: 'Administrator' as const,
            addedTime: new Date(),
            isCreator: true
          }];
        }
      }
      
      return updated;
    });
  };

  const handleAddAdmin = () => {
    if (!newAdminAddress.trim()) return;
    
    const newAdmin = {
      id: Date.now().toString(),
      address: newAdminAddress,
      identity: newAdminIdentity,
      addedTime: new Date(),
      isCreator: false
    };
    
    setFormData(prev => ({
      ...prev,
      administrators: [...prev.administrators, newAdmin]
    }));
    
    setNewAdminAddress('');
    setNewAdminIdentity('Administrator');
    setShowAddAdmin(false);
  };

  const handleRemoveAdmin = (id: string) => {
    setFormData(prev => ({
      ...prev,
      administrators: prev.administrators.filter(admin => admin.id !== id)
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.description.trim() !== '';
      case 2:
        return formData.tokenName.trim() !== '' && formData.tokenSymbol.trim() !== '';
      case 3:
        return true; // Treasury address is optional
      case 4:
        return true; // Default values are valid
      case 5:
        return account !== null && isOnPulseChain;
      default:
        return false;
    }
  };

  const handleDeploy = async () => {
    if (!account || !provider || !isOnPulseChain) {
      if (!isOnPulseChain) {
        const switched = await switchToPulseChain();
        if (!switched) {
          return;
        }
      }
      return;
    }

    // Validate form data
    const deploymentParams: DAODeploymentParams = {
      name: formData.name,
      description: formData.description,
      tokenName: formData.tokenName,
      tokenSymbol: formData.tokenSymbol,
      initialSupply: formData.initialSupply,
      governanceThreshold: formData.governanceThreshold,
      votingPeriod: formData.votingPeriod,
      executionDelay: formData.executionDelay
    };

    const validationErrors = validateDAOParams(deploymentParams);
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'));
      return;
    }

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      const signer = await provider.getSigner();
      const result = await deployDAO(provider, signer, deploymentParams);
      setDeploymentResult(result);
      
      // Redirect to DAO dashboard after successful deployment
      if (result.success && result.daoAddress) {
        setTimeout(() => {
          navigate(`/dao/${result.daoAddress}`);
        }, 3000); // Wait 3 seconds to show success message
      }
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentResult({
        success: false,
        error: 'Failed to deploy DAO. Please try again.'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                DAO Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                placeholder="e.g., PulseChain Builders DAO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                placeholder="Describe your DAO's mission and goals..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Token Name *
                </label>
                <input
                  type="text"
                  value={formData.tokenName}
                  onChange={(e) => updateFormData('tokenName', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  placeholder="e.g., Builders Token"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Token Symbol *
                </label>
                <input
                  type="text"
                  value={formData.tokenSymbol}
                  onChange={(e) => updateFormData('tokenSymbol', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  placeholder="e.g., BUILD"
                  maxLength={5}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Initial Supply
              </label>
              <input
                type="number"
                value={formData.initialSupply}
                onChange={(e) => updateFormData('initialSupply', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                placeholder="1000000"
              />
              <p className="text-sm text-gray-400 mt-2">
                Total number of governance tokens to mint initially
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Treasury Address (optional)
              </label>
              <input
                type="text"
                value={formData.treasuryAddress}
                onChange={(e) => updateFormData('treasuryAddress', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                placeholder="0x..."
              />
              <p className="text-sm text-gray-400 mt-2">
                Leave empty to create a new treasury contract, or provide an existing address
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-300 font-medium mb-1">Treasury Management</h4>
                  <p className="text-blue-200 text-sm">
                    The treasury will be controlled by the DAO governance. Members can propose 
                    and vote on how to spend treasury funds through the governance process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            {/* Introduction to Governance Members */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-6 mb-8">
              <div className="text-center text-white mb-4">
                Want to Aggregate or Create Governance on plsdao.xyz?
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Introduction to Governance Members</h3>
              <textarea
                value={formData.governanceIntro}
                onChange={(e) => updateFormData('governanceIntro', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                placeholder="For example, our XX DAO primarily uses the Snapshot platform for proposal submissions.

Proposal Process:
Users share their ideas on Discord and the forum, after which admins create Snapshot proposals for voting.

Governance Model:
XX is our governance token, and voting power is primarily determined by the XX strategy.

Core Contributors:
Our core contributors also serve as multisig wallet members, namely AAA, BBB, CCC, and DDD."
              />
              <p className="text-sm text-gray-400 mt-2 italic">
                Uploading profiles or images helps provide a clearer understanding of the governance framework.
              </p>
              
              {/* Image Upload */}
              <div className="mt-4 p-8 border-2 border-dashed border-white/20 rounded-lg text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Upload governance framework image</p>
                <p className="text-xs text-gray-500">
                  File types Supported: JPG, PNG, GIF, SVG. Max size: 100 M
                </p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.svg"
                  onChange={(e) => updateFormData('governanceImage', e.target.files?.[0] || null)}
                  className="hidden"
                  id="governance-image"
                />
                <label
                  htmlFor="governance-image"
                  className="inline-block mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer transition-colors"
                >
                  Choose File
                </label>
              </div>
            </div>

            {/* Governance Token Contract */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Governance Token Contract:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="relative">
                  <select
                    value={formData.tokenType}
                    onChange={(e) => updateFormData('tokenType', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none"
                  >
                    <option value="ERC20">ERC20</option>
                    <option value="NFT">NFT</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={formData.network}
                    onChange={(e) => updateFormData('network', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none"
                  >
                    <option value="PulseChain">PulseChain</option>
                    <option value="Ethereum">Ethereum</option>
                    <option value="Polygon">Polygon</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.tokenAddress}
                    onChange={(e) => updateFormData('tokenAddress', e.target.value)}
                    placeholder="address"
                    className="flex-1 px-4 py-3 rounded-l-lg bg-white/5 border border-white/20 border-r-0 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                  <button className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-r-lg transition-all">
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Set Up Voting Page */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Set Up Voting Page:</h3>
              <p className="text-gray-400 mb-4">Already have a voting page? Share your link down below.</p>
              
              <div className="flex mb-6">
                <div className="relative flex-shrink-0">
                  <select
                    value={formData.votingPlatform}
                    onChange={(e) => updateFormData('votingPlatform', e.target.value)}
                    className="px-4 py-3 rounded-l-lg bg-white/5 border border-white/20 border-r-0 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all appearance-none pr-8"
                  >
                    <option value="Snapshot">Snapshot</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <input
                  type="url"
                  value={formData.votingUrl}
                  onChange={(e) => updateFormData('votingUrl', e.target.value)}
                  placeholder="https://snapshot.org/#/example"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 border-l-0 border-r-0 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
                <button className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-r-lg transition-all">
                  + Add
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-4">Don't have a voting page yet? Click below to create one:</p>
              <a
                href="https://v1.snapshot.box/#/setup?step=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
              >
                NEW Create Voting Right Now
              </a>
              
              <p className="text-gray-400 text-sm mt-4">
                Tip: plsdao.xyz offers full support for creating proposals, voting, and delegation, integrated with Snapshot's backend.
              </p>
            </div>

            {/* DAO Profile Administrator */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">DAO Profile Administrator</h3>
              <p className="text-gray-400 mb-6">
                You can add operational roles or additional administrators to help manage your DAO page on plsdao.xyz. Simply fill in the information below!
              </p>
              
              {/* Administrator Table */}
              <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden mb-4">
                <div className="grid grid-cols-4 gap-4 p-4 bg-white/5 border-b border-white/10 text-gray-400 text-sm font-medium">
                  <div>Added Time</div>
                  <div>Address</div>
                  <div>Identity</div>
                  <div>Operations</div>
                </div>
                
                {formData.administrators.map((admin) => (
                  <div key={admin.id} className="grid grid-cols-4 gap-4 p-4 border-b border-white/10 last:border-b-0">
                    <div className="text-white text-sm">
                      {admin.addedTime.toLocaleDateString()} {admin.addedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm font-mono">
                        {admin.address.slice(0, 10)}...{admin.address.slice(-8)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(admin.address)}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-white text-sm">
                      {admin.isCreator ? 'Creator' : admin.identity}
                    </div>
                    <div>
                      {!admin.isCreator && (
                        <button
                          onClick={() => handleRemoveAdmin(admin.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowAddAdmin(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all"
              >
                + Add
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-6 mb-8">
              <p className="text-white text-center">
                In the "Calendar" section, we track DAO activities, keeping users informed for seamless participation.
              </p>
              <p className="text-white text-center mt-4">
                Currently, we aggregate <strong>DAO Google Calendar schedules</strong>, <strong>proposal alerts</strong>, and <strong>Twitter Space events</strong>. The latter two are automated, and for Google Calendar, share the public link below for integration.
              </p>
            </div>

            {/* Google Calendar Link */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-xl font-semibold text-white">Google Calendar Link</h3>
                <span className="text-red-400 text-sm">(You need to set the calendar permissions to public.)</span>
              </div>
              
              <div className="flex">
                <input
                  type="url"
                  value={formData.calendarUrl}
                  onChange={(e) => updateFormData('calendarUrl', e.target.value)}
                  placeholder="https://calendar.google.com/calendar/embed?src=example"
                  className="flex-1 px-4 py-3 rounded-l-lg bg-white/5 border border-white/20 border-r-0 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-r-lg transition-all">
                  + Add
                </button>
              </div>
            </div>

            {/* Deployment Section */}
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Review Your DAO</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Token:</span>
                  <span className="text-white">{formData.tokenName} ({formData.tokenSymbol})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Initial Supply:</span>
                  <span className="text-white">{formData.initialSupply.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Governance Threshold:</span>
                  <span className="text-white">{formData.governanceThreshold}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Voting Period:</span>
                  <span className="text-white">{formData.votingPeriod} days</span>
                </div>
              </div>
            </div>

            {!account && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <p className="text-yellow-200 text-sm">
                    Please connect your wallet to deploy your DAO
                  </p>
                </div>
              </div>
            )}

            {account && !isOnPulseChain && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                    <p className="text-orange-200 text-sm">
                      Please switch to PulseChain network to deploy your DAO
                    </p>
                  </div>
                  <button
                    onClick={switchToPulseChain}
                    className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-colors"
                  >
                    Switch Network
                  </button>
                </div>
              </div>
            )}

            {deploymentResult && (
              <div className={`p-4 rounded-lg border ${
                deploymentResult.success 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className="flex items-start space-x-3">
                  {deploymentResult.success ? (
                    <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h4 className={`font-medium mb-2 ${
                      deploymentResult.success ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {deploymentResult.success ? 'DAO Deployed Successfully!' : 'Deployment Failed'}
                    </h4>
                    
                    {deploymentResult.success && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-200">Transaction Hash:</span>
                          <a
                            href={`https://scan.pulsechain.com/tx/${deploymentResult.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 flex items-center space-x-1"
                          >
                            <span className="font-mono text-xs">{deploymentResult.transactionHash?.slice(0, 10)}...</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-200">DAO Address:</span>
                          <span className="text-green-400 font-mono text-xs">{deploymentResult.daoAddress}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-200">Token Address:</span>
                          <span className="text-green-400 font-mono text-xs">{deploymentResult.tokenAddress}</span>
                        </div>
                        <p className="text-green-200 text-sm mt-3">
                          Redirecting to your DAO dashboard in 3 seconds...
                        </p>
                      </div>
                    )}
                    
                    {deploymentResult.error && (
                      <p className="text-red-200 text-sm">{deploymentResult.error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Create Your DAO</h1>
          <p className="text-xl text-gray-300">
            Launch your decentralized organization in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all ${
                  currentStep > step.number
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === step.number
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : 'border-gray-600 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden md:block h-0.5 flex-1 mt-5 mx-4 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-600'
                  }`} style={{ position: 'absolute', top: '20px', left: '50%', right: '-50%', width: 'calc(100% - 40px)', marginLeft: '20px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {steps[currentStep - 1].title}
            </h2>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-4">
            {currentStep === 4 && (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
              >
                Skip
              </button>
            )}
            
            {currentStep === steps.length ? (
              <button
                onClick={handleDeploy}
                disabled={!isStepValid(currentStep) || isDeploying}
                className="flex items-center space-x-2 px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isDeploying ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Deploying...</span>
                  </>
                ) : (
                  <span>Deploy DAO</span>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span>NEXT</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Add Administrator Modal */}
        {showAddAdmin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">DAO Profile Administrator</h2>
                <button
                  onClick={() => setShowAddAdmin(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Add DAO member</h3>
                  <input
                    type="text"
                    value={newAdminAddress}
                    onChange={(e) => setNewAdminAddress(e.target.value)}
                    placeholder="Address"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Identity</h3>
                  <div className="space-y-3">
                    <div
                      onClick={() => setNewAdminIdentity('Administrator')}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        newAdminIdentity === 'Administrator'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <h4 className="font-medium mb-2">Administrator</h4>
                      <p className="text-sm">
                        Any information in DAO can be adjusted, except for receiving PASS income
                      </p>
                    </div>
                    
                    <div
                      onClick={() => setNewAdminIdentity('Editor')}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        newAdminIdentity === 'Editor'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <h4 className="font-medium mb-2">Editor</h4>
                      <p className="text-sm">
                        The basic information of DAO and treasury information can be edited but not the member
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowAddAdmin(false)}
                  className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddAdmin}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all"
                >
                  SAVE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDAO;