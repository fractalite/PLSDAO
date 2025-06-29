import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Loader, ExternalLink } from 'lucide-react';
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
}

const CreateDAO: React.FC = () => {
  const navigate = useNavigate();
  const { account, provider, isOnPulseChain, switchToPulseChain } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [formData, setFormData] = useState<DAOFormData>({
    name: '',
    description: '',
    tokenName: '',
    tokenSymbol: '',
    initialSupply: '1000000',
    governanceThreshold: '4',
    votingPeriod: '7',
    executionDelay: '2',
    treasuryAddress: ''
  });

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Name and describe your DAO' },
    { number: 2, title: 'Governance Token', description: 'Configure your governance token' },
    { number: 3, title: 'Governance Rules', description: 'Set voting and execution parameters' },
    { number: 4, title: 'Treasury Setup', description: 'Configure treasury management' },
    { number: 5, title: 'Review & Deploy', description: 'Review and deploy your DAO' }
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

  const updateFormData = (field: keyof DAOFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.description.trim() !== '';
      case 2:
        return formData.tokenName.trim() !== '' && formData.tokenSymbol.trim() !== '';
      case 3:
        return true; // Default values are valid
      case 4:
        return true; // Treasury address is optional
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
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Governance Threshold (%)
                </label>
                <input
                  type="number"
                  value={formData.governanceThreshold}
                  onChange={(e) => updateFormData('governanceThreshold', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  min="1"
                  max="100"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Minimum % of tokens needed to pass proposals
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Voting Period (days)
                </label>
                <input
                  type="number"
                  value={formData.votingPeriod}
                  onChange={(e) => updateFormData('votingPeriod', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  min="1"
                  max="30"
                />
                <p className="text-sm text-gray-400 mt-2">
                  How long members have to vote on proposals
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Execution Delay (days)
              </label>
              <input
                type="number"
                value={formData.executionDelay}
                onChange={(e) => updateFormData('executionDelay', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                min="0"
                max="14"
              />
              <p className="text-sm text-gray-400 mt-2">
                Delay between proposal approval and execution
              </p>
            </div>
          </div>
        );

      case 4:
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

      case 5:
        return (
          <div className="space-y-6">
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
            <span>Previous</span>
          </button>

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
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDAO;