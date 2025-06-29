import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Loader, ExternalLink, Upload, X, Plus, Globe, MessageCircle, Send, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { deployDAO, validateDAOParams, type DAODeploymentParams, type DeploymentResult } from '../utils/contracts';

interface DAOFormData {
  daoType: string;
  name: string;
  description: string;
  logo: File | null;
  tags: string[];
  social: {
    website: string;
    twitter: string;
    discord: string;
    telegram: string;
    custom: Array<{ name: string; url: string }>;
  };
  structure: 'standalone' | 'sub-dao' | 'parent-dao';
  parentDAO: string;
  tokenName: string;
  tokenSymbol: string;
  tokenLogo: File | null;
  initialSupply: string;
  governanceThreshold: string;
  votingPeriod: string;
  executionDelay: string;
  treasuryAddress: string;
  googleCalendarLink: string;
}

const CreateDAO: React.FC = () => {
  const navigate = useNavigate();
  const { account, provider, isOnPulseChain, switchToPulseChain } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newCustomSocial, setNewCustomSocial] = useState({ name: '', url: '' });
  const [showCustomSocialForm, setShowCustomSocialForm] = useState(false);
  
  const [formData, setFormData] = useState<DAOFormData>({
    daoType: '',
    name: '',
    description: '',
    logo: null,
    tags: [],
    social: {
      website: '',
      twitter: '',
      discord: '',
      telegram: '',
      custom: []
    },
    structure: 'standalone',
    parentDAO: '',
    tokenName: '',
    tokenSymbol: '',
    tokenLogo: null,
    initialSupply: '1000000',
    governanceThreshold: '4',
    votingPeriod: '7',
    executionDelay: '2',
    treasuryAddress: '',
    googleCalendarLink: ''
  });

  const daoTypes = [
    { value: 'community', label: 'Community DAO', description: 'Neighborhood groups, interest communities, social organizations' },
    { value: 'project', label: 'Project DAO', description: 'Specific initiatives, product development, collaborative projects' },
    { value: 'investment', label: 'Investment DAO', description: 'Funding pools, treasury management, investment decisions' },
    { value: 'service', label: 'Service DAO', description: 'Consulting, professional services, freelancer collectives' },
    { value: 'creator', label: 'Creator DAO', description: 'Artists, content creators, creative collaboratives' },
    { value: 'protocol', label: 'Protocol DAO', description: 'DeFi protocols, infrastructure, blockchain governance' },
    { value: 'grant', label: 'Grant DAO', description: 'Funding distribution, grant programs, ecosystem support' }
  ];

  const existingDAOs = [
    { value: 'plsdao-treasury', label: 'PLSDAO Treasury' },
    { value: 'validators-union', label: 'Validators Union' },
    { value: 'builder-collective', label: 'Builder Collective' },
    { value: 'community-grants', label: 'Community Grants' },
    { value: 'pulsegame-guild', label: 'PulseGame Guild' },
    { value: 'social-impact-dao', label: 'Social Impact DAO' }
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'DAO details and social links' },
    { number: 2, title: 'Token', description: 'Configure governance token' },
    { number: 3, title: 'Treasury', description: 'Setup treasury management' },
    { number: 4, title: 'Governance', description: 'Set voting parameters' },
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

  const updateFormData = (field: keyof DAOFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSocialData = (field: keyof DAOFormData['social'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, GIF, SVG)');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      updateFormData('logo', file);
    }
  };

  const handleTokenLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, GIF, SVG)');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      updateFormData('tokenLogo', file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && formData.tags.length < 5 && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCustomSocial = () => {
    if (newCustomSocial.name.trim() && newCustomSocial.url.trim()) {
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          custom: [...prev.social.custom, { ...newCustomSocial }]
        }
      }));
      setNewCustomSocial({ name: '', url: '' });
      setShowCustomSocialForm(false);
    }
  };

  const removeCustomSocial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        custom: prev.social.custom.filter((_, i) => i !== index)
      }
    }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.daoType !== '' && 
               formData.structure !== '' && 
               (formData.structure !== 'sub-dao' || formData.parentDAO !== '') &&
               formData.name.trim() !== '' && 
               formData.description.trim() !== '' && 
               formData.description.trim().length >= 80;
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
            {/* DAO Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                DAO Type *
              </label>
              <select
                value={formData.daoType}
                onChange={(e) => updateFormData('daoType', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              >
                <option value="">Select DAO Type</option>
                {daoTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-slate-800">
                    {type.label}
                  </option>
                ))}
              </select>
              {formData.daoType && (
                <p className="text-sm text-gray-400 mt-2">
                  {daoTypes.find(type => type.value === formData.daoType)?.description}
                </p>
              )}
            </div>

            {/* DAO Structure */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                DAO Structure *
              </label>
              <select
                value={formData.structure}
                onChange={(e) => updateFormData('structure', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              >
                <option value="standalone">Standalone DAO</option>
                <option value="sub-dao">Sub-DAO</option>
                <option value="parent-dao">Parent DAO (will have Sub-DAOs)</option>
              </select>
            </div>

            {formData.structure === 'sub-dao' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Parent DAO *
                </label>
                <select
                  value={formData.parentDAO}
                  onChange={(e) => updateFormData('parentDAO', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                >
                  <option value="">Select Parent DAO</option>
                  {existingDAOs.map((dao) => (
                    <option key={dao.value} value={dao.value} className="bg-slate-800">
                      {dao.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                DAO Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-lg bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                  {formData.logo ? (
                    <img
                      src={URL.createObjectURL(formData.logo)}
                      alt="DAO Logo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium cursor-pointer transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Logo</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    300x300px recommended. JPG, PNG, GIF, SVG. Max size: 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* DAO Name */}
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
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description * (minimum 80 characters)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                maxLength={280}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                placeholder="Describe your DAO's mission and goals..."
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${formData.description.length < 80 ? 'text-red-400' : 'text-gray-400'}`}>
                  {formData.description.length < 80 
                    ? `${80 - formData.description.length} more characters needed`
                    : `${formData.description.length}/280 characters`
                  }
                </span>
                {formData.description.length >= 80 && (
                  <Check className="h-4 w-4 text-green-400" />
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (up to 5)
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {formData.tags.length < 5 && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      placeholder="Add a tag..."
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.social.website}
                      onChange={(e) => updateSocialData('website', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      placeholder="https://your-dao.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitter/X Handle
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.social.twitter}
                      onChange={(e) => updateSocialData('twitter', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      placeholder="@yourdao"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discord Invite
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.social.discord}
                      onChange={(e) => updateSocialData('discord', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      placeholder="https://discord.gg/yourdao"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telegram Group
                  </label>
                  <div className="relative">
                    <Send className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.social.telegram}
                      onChange={(e) => updateSocialData('telegram', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      placeholder="https://t.me/yourdao"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Social Links */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Custom Social Links
                  </label>
                  <button
                    onClick={() => setShowCustomSocialForm(true)}
                    className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Custom</span>
                  </button>
                </div>

                {formData.social.custom.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {formData.social.custom.map((social, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <span className="text-white font-medium">{social.name}</span>
                          <span className="text-gray-400 text-sm ml-2">{social.url}</span>
                        </div>
                        <button
                          onClick={() => removeCustomSocial(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showCustomSocialForm && (
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newCustomSocial.name}
                        onChange={(e) => setNewCustomSocial(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        placeholder="Platform name"
                      />
                      <input
                        type="url"
                        value={newCustomSocial.url}
                        onChange={(e) => setNewCustomSocial(prev => ({ ...prev, url: e.target.value }))}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={addCustomSocial}
                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowCustomSocialForm(false)}
                        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Token Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Token Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                  {formData.tokenLogo ? (
                    <img
                      src={URL.createObjectURL(formData.tokenLogo)}
                      alt="Token Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Upload className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="token-logo-upload"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                    onChange={handleTokenLogoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="token-logo-upload"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium cursor-pointer transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Token Logo</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    100x100px recommended. JPG, PNG, GIF, SVG. Max size: 5MB
                  </p>
                </div>
              </div>
            </div>

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
          <div className="space-y-6">
            {/* Snapshot Setup Section */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-white mb-3">Voting Platform Setup</h3>
              <p className="text-gray-300 text-sm mb-4">
                Use Snapshot for gasless off-chain voting with your governance token
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="https://snapshot.org/#/setup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  <span>Setup Snapshot Space</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">
                    Create your Snapshot space for community voting and proposals
                  </p>
                </div>
              </div>
            </div>

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

      case 5:
        return (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-pink-500/10 border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Calendar Integration</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                In the "Calendar" section, we track DAO activities, keeping users informed for seamless participation.
              </p>
              <p className="text-gray-300 text-sm">
                Currently, we aggregate <span className="text-blue-300 font-medium">DAO Google Calendar schedules</span>, <span className="text-purple-300 font-medium">proposal alerts</span>, and <span className="text-pink-300 font-medium">Twitter Space events</span>. The latter two are automated, and for Google Calendar, share the public link below for integration.
              </p>
            </div>

            {/* Google Calendar Link */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <label className="block text-lg font-medium text-white">
                  Google Calendar Link
                </label>
                <span className="text-sm text-pink-400 font-medium">
                  (You need to set the calendar permissions to public.)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="url"
                  value={formData.googleCalendarLink}
                  onChange={(e) => updateFormData('googleCalendarLink', e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  placeholder="https://calendar.google.com/calendar/embed?src=example"
                />
                <button
                  onClick={() => {
                    if (formData.googleCalendarLink.trim()) {
                      alert('Calendar link added successfully!');
                    } else {
                      alert('Please enter a valid Google Calendar link');
                    }
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium transition-all"
                >
                  + Add
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Share your public Google Calendar link to integrate DAO events and meetings
              </p>
            </div>

            {/* Features List */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <h4 className="text-blue-300 font-medium">Google Calendar</h4>
                </div>
                <p className="text-blue-200 text-sm">
                  Sync your DAO's meeting schedule and important events
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-purple-400" />
                  <h4 className="text-purple-300 font-medium">Proposal Alerts</h4>
                </div>
                <p className="text-purple-200 text-sm">
                  Automated notifications for new proposals and voting deadlines
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-pink-400" />
                  <h4 className="text-pink-300 font-medium">Twitter Spaces</h4>
                </div>
                <p className="text-pink-200 text-sm">
                  Automatic tracking of DAO-related Twitter Space events
                </p>
              </div>
            </div>

            {/* Review Section */}
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Review Your DAO</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{daoTypes.find(type => type.value === formData.daoType)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Structure:</span>
                  <span className="text-white capitalize">{formData.structure.replace('-', ' ')}</span>
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
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center flex-1 min-w-0">
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
                  <div className="text-xs text-gray-500 mt-1 hidden sm:block whitespace-pre-line">
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