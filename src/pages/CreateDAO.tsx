import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  Loader, 
  ExternalLink,
  Upload,
  X,
  Plus,
  Search,
  Users,
  Briefcase,
  TrendingUp,
  Settings,
  Palette,
  Code,
  Gift,
  Globe,
  MessageCircle,
  Send,
  FileText,
  Info,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { deployDAO, validateDAOParams, type DAODeploymentParams, type DeploymentResult } from '../utils/contracts';

interface DAOFormData {
  // Type Selection
  daoType: string;
  
  // Structure
  structure: 'standalone' | 'sub-dao' | 'parent-dao';
  parentDAO: string;
  
  // Basic Info
  name: string;
  description: string;
  logo: File | null;
  tags: string[];
  
  // Social Media
  website: string;
  twitter: string;
  discord: string;
  telegram: string;
  customSocials: { name: string; url: string }[];
  
  // Token Configuration
  tokenLogo: File | null;
  tokenName: string;
  tokenSymbol: string;
  initialSupply: string;
  
  // Governance
  governanceThreshold: string;
  votingPeriod: string;
  executionDelay: string;
  
  // Treasury
  treasuryAddress: string;
}

const CreateDAO: React.FC = () => {
  const navigate = useNavigate();
  const { account, provider, isOnPulseChain, switchToPulseChain } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [parentDAOSearch, setParentDAOSearch] = useState('');

  const [formData, setFormData] = useState<DAOFormData>({
    // Type Selection
    daoType: '',
    
    // Structure
    structure: 'standalone',
    parentDAO: '',
    
    // Basic Info
    name: '',
    description: '',
    logo: null,
    tags: [],
    
    // Social Media
    website: '',
    twitter: '',
    discord: '',
    telegram: '',
    customSocials: [],
    
    // Token Configuration
    tokenLogo: null,
    tokenName: '',
    tokenSymbol: '',
    initialSupply: '1000000',
    
    // Governance
    governanceThreshold: '4',
    votingPeriod: '7',
    executionDelay: '2',
    
    // Treasury
    treasuryAddress: ''
  });

  const steps = [
    { number: 1, title: 'DAO Type', description: 'Choose your DAO category' },
    { number: 2, title: 'Structure', description: 'Define DAO relationships' },
    { number: 3, title: 'Basic Info', description: 'Name and describe your DAO' },
    { number: 4, title: 'Social Media', description: 'Connect your community' },
    { number: 5, title: 'Token', description: 'Configure governance token' },
    { number: 6, title: 'Governance', description: 'Set voting parameters' },
    { number: 7, title: 'Treasury', description: 'Configure treasury management' },
    { number: 8, title: 'Deploy', description: 'Review and deploy your DAO' }
  ];

  const daoTypes = [
    {
      id: 'community',
      name: 'Community DAO',
      description: 'Neighborhood groups, interest communities, social organizations',
      icon: Users,
      examples: ['Local communities', 'Hobby groups', 'Social clubs']
    },
    {
      id: 'project',
      name: 'Project DAO',
      description: 'Specific initiatives, product development, collaborative projects',
      icon: Briefcase,
      examples: ['Product launches', 'Research projects', 'Event planning']
    },
    {
      id: 'investment',
      name: 'Investment DAO',
      description: 'Funding pools, treasury management, investment decisions',
      icon: TrendingUp,
      examples: ['Venture capital', 'Asset management', 'Funding pools']
    },
    {
      id: 'service',
      name: 'Service DAO',
      description: 'Consulting, professional services, skill-based organizations',
      icon: Settings,
      examples: ['Consulting firms', 'Freelancer collectives', 'Professional services']
    },
    {
      id: 'creator',
      name: 'Creator DAO',
      description: 'Artists, content creators, creative collaborations',
      icon: Palette,
      examples: ['Artist collectives', 'Content creators', 'Media production']
    },
    {
      id: 'protocol',
      name: 'Protocol DAO',
      description: 'DeFi protocols, infrastructure, blockchain governance',
      icon: Code,
      examples: ['DeFi protocols', 'Infrastructure projects', 'Blockchain governance']
    },
    {
      id: 'grant',
      name: 'Grant DAO',
      description: 'Funding distribution, grant programs, ecosystem support',
      icon: Gift,
      examples: ['Grant programs', 'Ecosystem funding', 'Public goods funding']
    }
  ];

  // Mock existing DAOs for parent selection
  const existingDAOs = [
    { id: '1', name: 'PLSDAO Treasury', type: 'Investment DAO' },
    { id: '2', name: 'Validators Union', type: 'Protocol DAO' },
    { id: '3', name: 'Builder Collective', type: 'Service DAO' },
    { id: '4', name: 'Community Grants', type: 'Grant DAO' },
    { id: '5', name: 'PulseGame Guild', type: 'Community DAO' },
    { id: '6', name: 'Social Impact DAO', type: 'Community DAO' }
  ];

  const filteredDAOs = existingDAOs.filter(dao => 
    dao.name.toLowerCase().includes(parentDAOSearch.toLowerCase()) ||
    dao.type.toLowerCase().includes(parentDAOSearch.toLowerCase())
  );

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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPG, PNG, GIF, or SVG file');
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
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPG, PNG, GIF, or SVG file');
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
      updateFormData('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addCustomSocial = () => {
    if (newSocialName.trim() && newSocialUrl.trim()) {
      updateFormData('customSocials', [
        ...formData.customSocials,
        { name: newSocialName.trim(), url: newSocialUrl.trim() }
      ]);
      setNewSocialName('');
      setNewSocialUrl('');
    }
  };

  const removeCustomSocial = (index: number) => {
    updateFormData('customSocials', formData.customSocials.filter((_, i) => i !== index));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.daoType !== '';
      case 2:
        return formData.structure === 'standalone' || formData.parentDAO !== '';
      case 3:
        return formData.name.trim() !== '' && formData.description.trim() !== '';
      case 4:
        return true; // Social media is optional
      case 5:
        return formData.tokenName.trim() !== '' && formData.tokenSymbol.trim() !== '';
      case 6:
        return true; // Default values are valid
      case 7:
        return true; // Treasury address is optional
      case 8:
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
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">What type of DAO are you creating?</h3>
              <p className="text-gray-400">Choose the category that best describes your organization</p>
            </div>
            
            <div className="space-y-4">
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
                  <option key={type.id} value={type.id} className="bg-slate-800">
                    {type.name}
                  </option>
                ))}
              </select>
              
              {formData.daoType && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
                >
                  {(() => {
                    const selectedType = daoTypes.find(type => type.id === formData.daoType);
                    if (!selectedType) return null;
                    
                    return (
                      <div className="flex items-start space-x-3">
                        <selectedType.icon className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-purple-300 font-medium mb-2">{selectedType.name}</h4>
                          <p className="text-purple-200 text-sm mb-3">{selectedType.description}</p>
                          <div>
                            <p className="text-purple-300 text-sm font-medium mb-1">Examples:</p>
                            <ul className="text-purple-200 text-sm">
                              {selectedType.examples.map((example, index) => (
                                <li key={index}>• {example}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">DAO Structure</h3>
              <p className="text-gray-400">Define how your DAO relates to other organizations</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  DAO Structure Type *
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'standalone', label: 'Standalone DAO', description: 'Independent organization' },
                    { value: 'sub-dao', label: 'Sub-DAO', description: 'Part of a larger organization' },
                    { value: 'parent-dao', label: 'Parent DAO', description: 'Will have sub-organizations' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.structure === option.value
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/20 hover:border-white/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="structure"
                        value={option.value}
                        checked={formData.structure === option.value}
                        onChange={(e) => updateFormData('structure', e.target.value)}
                        className="text-purple-500 focus:ring-purple-500"
                      />
                      <div>
                        <div className="text-white font-medium">{option.label}</div>
                        <div className="text-gray-400 text-sm">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.structure === 'sub-dao' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-medium text-gray-300">
                    Parent DAO *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={parentDAOSearch}
                      onChange={(e) => setParentDAOSearch(e.target.value)}
                      placeholder="Search for parent DAO..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    />
                  </div>
                  
                  {parentDAOSearch && (
                    <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      {filteredDAOs.map((dao) => (
                        <button
                          key={dao.id}
                          onClick={() => {
                            updateFormData('parentDAO', dao.id);
                            setParentDAOSearch(dao.name);
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            formData.parentDAO === dao.id
                              ? 'bg-purple-500/20 border border-purple-500/50'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="text-white font-medium">{dao.name}</div>
                          <div className="text-gray-400 text-sm">{dao.type}</div>
                        </button>
                      ))}
                      {filteredDAOs.length === 0 && (
                        <div className="text-gray-400 text-center py-4">No DAOs found</div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Basic Information</h3>
              <p className="text-gray-400">Tell us about your DAO</p>
            </div>
            
            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Logo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center overflow-hidden">
                    {formData.logo ? (
                      <img
                        src={URL.createObjectURL(formData.logo)}
                        alt="DAO Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 cursor-pointer transition-all"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Logo</span>
                    </label>
                    <p className="text-gray-400 text-xs mt-2">
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
                  Description * ({formData.description.length}/280)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 280) {
                      updateFormData('description', e.target.value);
                    }
                  }}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none"
                  placeholder="Describe your DAO's mission and goals..."
                />
                <div className={`text-xs mt-1 ${formData.description.length > 250 ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {280 - formData.description.length} characters remaining
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Tags (2-5 tags)
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
                        placeholder="Add a tag..."
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                      />
                      <button
                        onClick={addTag}
                        disabled={!newTag.trim() || formData.tags.includes(newTag.trim())}
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Social Media & Links</h3>
              <p className="text-gray-400">Connect your community (all optional)</p>
            </div>
            
            <div className="space-y-6">
              {/* Standard Social Media Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe className="inline h-4 w-4 mr-2" />
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MessageCircle className="inline h-4 w-4 mr-2" />
                    Twitter/X Handle
                  </label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => updateFormData('twitter', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="@yourdao"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MessageCircle className="inline h-4 w-4 mr-2" />
                    Discord Invite
                  </label>
                  <input
                    type="url"
                    value={formData.discord}
                    onChange={(e) => updateFormData('discord', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="https://discord.gg/invite"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Send className="inline h-4 w-4 mr-2" />
                    Telegram Group
                  </label>
                  <input
                    type="url"
                    value={formData.telegram}
                    onChange={(e) => updateFormData('telegram', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="https://t.me/yourgroup"
                  />
                </div>
              </div>

              {/* Custom Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Custom Links
                </label>
                
                {formData.customSocials.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {formData.customSocials.map((social, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex-1">
                          <div className="text-white font-medium">{social.name}</div>
                          <div className="text-gray-400 text-sm">{social.url}</div>
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
                
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newSocialName}
                    onChange={(e) => setNewSocialName(e.target.value)}
                    placeholder="Platform name"
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                  <input
                    type="url"
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    placeholder="https://..."
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  />
                  <button
                    onClick={addCustomSocial}
                    disabled={!newSocialName.trim() || !newSocialUrl.trim()}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Governance Token</h3>
              <p className="text-gray-400">Configure your DAO's governance token</p>
            </div>
            
            <div className="space-y-6">
              {/* Token Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Token Logo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center overflow-hidden">
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
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                      onChange={handleTokenLogoUpload}
                      className="hidden"
                      id="token-logo-upload"
                    />
                    <label
                      htmlFor="token-logo-upload"
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 cursor-pointer transition-all"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Token Logo</span>
                    </label>
                    <p className="text-gray-400 text-xs mt-2">
                      100x100px recommended. JPG, PNG, GIF, SVG. Max size: 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Token Name and Symbol */}
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

              {/* Initial Supply */}
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
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Governance Parameters</h3>
              <p className="text-gray-400">Set voting rules and thresholds</p>
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

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Treasury Setup</h3>
              <p className="text-gray-400">Configure treasury management</p>
            </div>
            
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

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">Review & Deploy</h3>
              <p className="text-gray-400">Review your DAO configuration</p>
            </div>
            
            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">DAO Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{daoTypes.find(t => t.id === formData.daoType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Structure:</span>
                  <span className="text-white capitalize">{formData.structure.replace('-', ' ')}</span>
                </div>
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
                {formData.tags.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tags:</span>
                    <span className="text-white">{formData.tags.join(', ')}</span>
                  </div>
                )}
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
              <div key={step.number} className="flex flex-col items-center flex-shrink-0 min-w-0">
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
                  <div className={`hidden lg:block absolute h-0.5 w-16 mt-5 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-600'
                  }`} style={{ 
                    left: `calc(${((index + 1) / steps.length) * 100}% - 2rem)`,
                    top: '20px'
                  }} />
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