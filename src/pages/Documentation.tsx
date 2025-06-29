import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Wallet, 
  Settings, 
  Coins, 
  Rocket, 
  HelpCircle, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Code,
  Users,
  DollarSign,
  Lock,
  ExternalLink,
  Github,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

const Documentation: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    quickStart: true,
    planning: false,
    distribution: false,
    governance: false,
    treasury: false,
    technical: false,
    legal: false,
    faq: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const quickStartSteps = [
    {
      icon: Wallet,
      title: 'Connect Wallet',
      description: 'Connect MetaMask to PulseChain (Chain ID: 369)'
    },
    {
      icon: Settings,
      title: 'Plan Your DAO',
      description: 'Define purpose, members, and governance structure'
    },
    {
      icon: Rocket,
      title: 'Deploy',
      description: 'One-click deployment using audited contracts'
    },
    {
      icon: Users,
      title: 'Govern',
      description: 'Start creating proposals and managing community'
    }
  ];

  const distributionMethods = [
    {
      title: 'Contribution-Based Distribution',
      description: 'Reward early contributors, developers, community builders',
      example: '50% to active community members based on 6 months of participation',
      type: 'good'
    },
    {
      title: 'Work-to-Earn Programs',
      description: 'Create tasks and bounties that earn governance tokens',
      example: 'Earn 100 tokens per month for active community moderation',
      type: 'good'
    },
    {
      title: 'Anti-Whale Caps',
      description: 'Limit maximum tokens any single address can receive',
      example: 'Maximum 1% of supply per address in first 30 days',
      type: 'good'
    },
    {
      title: 'Large Founder Allocations',
      description: 'Giving large token allocations to founders/team',
      example: 'Avoid: 30%+ to founders creates centralization',
      type: 'bad'
    }
  ];

  const governanceTypes = [
    {
      title: 'Token-Weighted Voting',
      description: 'Each token = one vote',
      benefits: [
        'Best for projects with token economics',
        'Prevents spam and ensures skin in the game',
        'Aligns voting power with investment'
      ],
      drawbacks: [
        'Wealthy participants have more influence',
        'Vulnerable to whale manipulation',
        'Can become plutocratic over time'
      ]
    },
    {
      title: 'Quadratic Voting',
      description: 'Voting power = √(token holdings)',
      benefits: [
        'Reduces whale advantage significantly',
        'More democratic than linear voting',
        'Encourages broader participation'
      ],
      drawbacks: [
        'More complex to implement',
        'Harder for users to understand',
        'Still requires Sybil resistance'
      ]
    }
  ];

  const treasuryBestPractices = [
    {
      category: 'Security',
      practices: [
        'Use multi-signature wallets for large amounts',
        'Require governance approval for all spending',
        'Implement time-locked execution for major decisions',
        'Regular security audits and reviews'
      ]
    },
    {
      category: 'Diversification',
      practices: [
        'Mix of stablecoins, major cryptos, protocol tokens',
        'Don\'t hold all treasury in governance tokens',
        'Consider DeFi yield generation for inactive funds',
        'Geographic and asset class diversification'
      ]
    },
    {
      category: 'Spending Guidelines',
      practices: [
        'Set clear budgets for different categories',
        'Require proposals for spending above thresholds',
        'Regular financial reporting to community',
        'Milestone-based releases for large grants'
      ]
    }
  ];

  const technicalSpecs = [
    {
      component: 'Governor Contract',
      description: 'Core governance logic and voting mechanisms',
      features: ['Proposal creation and voting', 'Execution delays', 'Quorum requirements']
    },
    {
      component: 'ERC20Votes Token',
      description: 'Governance token with voting capabilities',
      features: ['Delegation support', 'Historical balance tracking', 'Snapshot functionality']
    },
    {
      component: 'TimelockController',
      description: 'Execution delays for security',
      features: ['Configurable delays', 'Emergency pause', 'Role-based access']
    },
    {
      component: 'Treasury Contract',
      description: 'Multi-signature treasury management',
      features: ['Multi-sig requirements', 'Spending limits', 'Asset management']
    }
  ];

  const faqs = [
    {
      question: 'What makes PLSDAO different from other DAO platforms?',
      answer: 'Built specifically for PulseChain\'s fast, low-cost infrastructure. Focus on accessibility and education rather than complex financial instruments. Uses battle-tested OpenZeppelin contracts adapted for PulseChain.'
    },
    {
      question: 'How much does it cost to create a DAO?',
      answer: 'Only PulseChain gas fees - typically under $1 USD. No platform fees or subscriptions. This includes deploying governance contracts, token contracts, and treasury setup.'
    },
    {
      question: 'How do I prevent whale dominance in my DAO?',
      answer: 'Focus on fair initial distribution, contribution-based allocations, anti-whale caps during token creation, and community education. Consider quadratic voting or reputation-based systems for more balanced governance.'
    },
    {
      question: 'What voting threshold should I set?',
      answer: '3-5% for most communities. Too low (1-2%) causes spam proposals, too high (10%+) prevents participation and only allows whales to create proposals.'
    },
    {
      question: 'Can governance tokens be traded?',
      answer: 'Yes, by default they\'re standard ERC20 tokens. Some DAOs choose to restrict transfers through custom implementations or vesting schedules to encourage long-term participation.'
    },
    {
      question: 'How do I add members to my DAO?',
      answer: 'Members join by acquiring governance tokens through distribution, purchase, or earning them through contributions. You can also create membership NFTs or use other token-gating mechanisms.'
    },
    {
      question: 'Is my DAO\'s treasury secure?',
      answer: 'Yes, all funds are controlled by on-chain governance requiring community approval. We recommend using multi-sig wallets for additional security and implementing spending limits.'
    },
    {
      question: 'What networks does PLSDAO support?',
      answer: 'Currently PulseChain mainnet only. Cross-chain support may be added based on community demand and technical feasibility.'
    }
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">PLSDAO Documentation</span>
          </h1>
          <p className="text-xl text-gray-300">
            Comprehensive guide to creating and managing DAOs on PulseChain
          </p>
        </motion.div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('quickStart')}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all"
          >
            <h2 className="text-2xl font-bold text-white">Quick Start Guide</h2>
            {openSections.quickStart ? (
              <ChevronDown className="h-6 w-6 text-purple-400" />
            ) : (
              <ChevronRight className="h-6 w-6 text-purple-400" />
            )}
          </button>
          
          {openSections.quickStart && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStartSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Planning Your DAO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('planning')}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold text-white">Planning Your DAO</h2>
            {openSections.planning ? (
              <ChevronDown className="h-6 w-6 text-purple-400" />
            ) : (
              <ChevronRight className="h-6 w-6 text-purple-400" />
            )}
          </button>
          
          {openSections.planning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10"
            >
              <div className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-yellow-300 font-medium mb-2">Critical Questions Before Building</h4>
                      <div className="space-y-2 text-yellow-200 text-sm">
                        <p>• <strong>What is your DAO's purpose?</strong> (Protocol governance, community fund, project coordination)</p>
                        <p>• <strong>Who are your initial members?</strong> (Developers, users, investors, community)</p>
                        <p>• <strong>How will you distribute tokens fairly?</strong> (Contribution-based, work-to-earn, merit airdrops)</p>
                        <p>• <strong>What decisions will require voting?</strong> (Treasury spending, protocol changes, partnerships)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h4 className="text-blue-300 font-medium mb-3">DAO Creation Steps</h4>
                    <ol className="text-blue-200 text-sm space-y-2">
                      <li>1. <strong>DAO Details:</strong> Choose name and description</li>
                      <li>2. <strong>Token Setup:</strong> Create governance token or use existing</li>
                      <li>3. <strong>Governance Rules:</strong> Set voting thresholds and periods</li>
                      <li>4. <strong>Treasury Setup:</strong> Configure fund management</li>
                      <li>5. <strong>Deploy:</strong> Review and deploy to PulseChain</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="text-green-300 font-medium mb-3">Success Factors</h4>
                    <ul className="text-green-200 text-sm space-y-2">
                      <li>• Clear mission and value proposition</li>
                      <li>• Fair and transparent token distribution</li>
                      <li>• Active and engaged community</li>
                      <li>• Robust governance processes</li>
                      <li>• Sustainable treasury management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Token Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('distribution')}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold text-white">Token Distribution Strategies</h2>
            {openSections.distribution ? (
              <ChevronDown className="h-6 w-6 text-purple-400" />
            ) : (
              <ChevronRight className="h-6 w-6 text-purple-400" />
            )}
          </button>
          
          {openSections.distribution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10"
            >
              <div className="space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-300 font-medium mb-2">The Most Critical Decision</h4>
                      <p className="text-red-200 text-sm">
                        How you distribute governance tokens determines whether your DAO becomes a thriving community 
                        or a plutocracy controlled by whales. Choose your distribution method carefully.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Recommended Methods</span>
                    </h3>
                    <div className="space-y-4">
                      {distributionMethods.filter(method => method.type === 'good').map((method, index) => (
                        <div key={index} className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <h4 className="text-green-300 font-medium mb-2">{method.title}</h4>
                          <p className="text-green-200 text-sm mb-2">{method.description}</p>
                          <p className="text-green-100 text-xs italic">Example: {method.example}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center space-x-2">
                      <XCircle className="h-5 w-5" />
                      <span>Patterns to Avoid</span>
                    </h3>
                    <div className="space-y-4">
                      {distributionMethods.filter(method => method.type === 'bad').map((method, index) => (
                        <div key={index} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                          <h4 className="text-red-300 font-medium mb-2">{method.title}</h4>
                          <p className="text-red-200 text-sm mb-2">{method.description}</p>
                          <p className="text-red-100 text-xs italic">{method.example}</p>
                        </div>
                      ))}
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <h4 className="text-red-300 font-medium mb-2">ICO/IDO Style Sales</h4>
                        <p className="text-red-200 text-sm mb-2">Favors capital over contribution</p>
                        <p className="text-red-100 text-xs italic">Avoid: Public token sales that attract speculators</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Governance Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('governance')}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold text-white">Governance Models & Best Practices</h2>
            {openSections.governance ? (
              <ChevronDown className="h-6 w-6 text-purple-400" />
            ) : (
              <ChevronRight className="h-6 w-6 text-purple-400" />
            )}
          </button>
          
          {openSections.governance && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10"
            >
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {governanceTypes.map((type, index) => (
                    <div key={index} className="p-6 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <Coins className="h-6 w-6 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">{type.title}</h3>
                      </div>
                      <p className="text-purple-300 mb-4">{type.description}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-green-300 font-medium mb-2">Benefits:</h4>
                          <ul className="text-gray-300 space-y-1">
                            {type.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-sm">• {benefit}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-red-300 font-medium mb-2">Considerations:</h4>
                          <ul className="text-gray-300 space-y-1">
                            {type.drawbacks.map((drawback, idx) => (
                              <li key={idx} className="text-sm">• {drawback}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                  <h3 className="text-blue-300 font-semibold mb-4">Recommended Governance Parameters</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-white/5">
                      <h4 className="text-white font-medium mb-2">Governance Threshold</h4>
                      <div className="text-2xl font-bold text-blue-400 mb-1">3-5%</div>
                      <p className="text-gray-400 text-xs">of total supply to create proposals</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/5">
                      <h4 className="text-white font-medium mb-2">Voting Period</h4>
                      <div className="text-2xl font-bold text-blue-400 mb-1">5-10 days</div>
                      <p className="text-gray-400 text-xs">for community participation</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/5">
                      <h4 className="text-white font-medium mb-2">Execution Delay</h4>
                      <div className="text-2xl font-bold text-blue-400 mb-1">2-7 days</div>
                      <p className="text-gray-400 text-xs">for security and review</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Treasury Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('treasury')}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold text-white">Treasury Management</h2>
            {openSections.treasury ? (
              <ChevronDown className="h-6 w-6 text-purple-400" />
            ) : (
              <ChevronRight className="h-6 w-6 text-purple-400" />
            )}
          </button>
          
          {openSections.treasury && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10"
            >
              <div className="space-y-6">
                {treasuryBestPractices.map((category, index) => (
                  <div key={index} className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      {category.category === 'Security' && <Shield className="h-6 w-6 text-green-400" />}
                      {category.category === 'Diversification' && <DollarSign className="h-6 w-6 text-blue-400" />}
                      {category.category === 'Spending Guidelines' && <Settings className="h-6 w-6 text-purple-400" />}
                      <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                    </div>
                    <ul className="text-gray-300 space-y-2">
                      {category.practices.map((practice, idx) => (
                        <li key={idx} className="text-sm">• {practice}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-yellow-300 font-medium mb-2">Multi-Signature Security</h4>
                      <p className="text-yellow-200 text-sm">
                        PLSDAO supports multi-signature treasury management requiring multiple community members 
                        to approve spending. This prevents single points of failure and ensures community oversight.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Technical Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('technical')}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold text-white">Technical Architecture</h2>
            {openSections.technical ? (
              <ChevronDown className="h-6 w-6 text-purple-400" />
            ) : (
              <ChevronRight className="h-6 w-6 text-purple-400" />
            )}
          </button>
          
          {openSections.technical && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10"
            >
              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-green-300 font-medium mb-2">OpenZeppelin Governor Suite</h4>
                      <p className="text-green-200 text-sm">
                        PLSDAO uses battle-tested, audited contracts from OpenZeppelin adapted for PulseChain. 
                        Same contracts used by major DeFi protocols like Uniswap and Compound.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {technicalSpecs.map((spec, index) => (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center space-x-3 mb-3">
                        <Code className="h-5 w-5 text-purple-400" />
                        <h4 className="text-white font-medium">{spec.component}</h4>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{spec.description}</p>
                      <ul className="text-gray-400 text-xs space-y-1">
                        {spec.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-300 font-medium mb-3">Integration Example</h4>
                  <pre className="text-blue-200 text-xs bg-black/20 p-3 rounded overflow-x-auto">
{`// Reading DAO data
const daoInfo = await contract.methods.daoInfo().call();
const votingPower = await token.methods.getVotes(address).call();

// Creating and voting on proposals
await governor.methods.propose(targets, values, calldatas, description);
await governor.methods.castVote(proposalId, support);`}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Legal Considerations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('legal')}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold text-white">Legal & Compliance</h2>
            {openSections.legal ? (
              <ChevronDown className="h-6 w-6 text-purple-400" />
            ) : (
              <ChevronRight className="h-6 w-6 text-purple-400" />
            )}
          </button>
          
          {openSections.legal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10"
            >
              <div className="space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-300 font-medium mb-2">Important Disclaimer</h4>
                      <p className="text-red-200 text-sm">
                        This is not legal advice. DAOs exist in regulatory gray areas in most jurisdictions. 
                        Consult qualified attorneys familiar with blockchain and securities law.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <h4 className="text-yellow-300 font-medium mb-3">Key Considerations</h4>
                    <ul className="text-yellow-200 text-sm space-y-2">
                      <li>• DAOs exist in regulatory gray areas</li>
                      <li>• Token sales may be securities offerings</li>
                      <li>• Different countries have different rules</li>
                      <li>• Legal frameworks are rapidly evolving</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="text-green-300 font-medium mb-3">Risk Mitigation</h4>
                    <ul className="text-green-200 text-sm space-y-2">
                      <li>• Focus on utility tokens, not securities</li>
                      <li>• Emphasize governance, not profits</li>
                      <li>• Ensure true decentralization</li>
                      <li>• Document community purposes</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-300 font-medium mb-3">Token Classification Best Practices</h4>
                  <div className="text-blue-200 text-sm space-y-2">
                    <p>• <strong>Utility Focus:</strong> Clearly define tokens as governance tools, not investments</p>
                    <p>• <strong>Avoid Profit Promises:</strong> Don't promise returns or profits from others' efforts</p>
                    <p>• <strong>Actual Utility:</strong> Ensure tokens have real governance functionality</p>
                    <p>• <strong>Decentralized Launch:</strong> Maintain community control from day one</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('faq')}
            className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            {openSections.faq ? (
              <ChevronDown className="h-6 w-6 text-purple-400" />
            ) : (
              <ChevronRight className="h-6 w-6 text-purple-400" />
            )}
          </button>
          
          {openSections.faq && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10"
            >
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-white/10 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Community Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Community & Support</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                <MessageCircle className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Discord Community</h3>
                <p className="text-gray-300 text-sm mb-4">Join our active community for support and discussions</p>
                <a
                  href="https://discord.gg/kabwVT4j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300"
                >
                  <span>Join Discord</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                <Github className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Open Source</h3>
                <p className="text-gray-300 text-sm mb-4">Contribute to the platform development</p>
                <a
                  href="https://github.com/fractalite/PLSDAO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300"
                >
                  <span>View GitHub</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                <Users className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Follow Updates</h3>
                <p className="text-gray-300 text-sm mb-4">Stay updated with latest features and news</p>
                <a
                  href="https://x.com/PLSDAO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300"
                >
                  <span>Follow @PLSDAO</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                Last Updated: January 2025 • This documentation is continuously updated based on community feedback
              </p>
              <p className="text-gray-500 text-xs">
                This documentation is for educational purposes only and does not constitute legal, financial, or investment advice.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-6">
            Follow our comprehensive guide to launch your DAO today
          </p>
          <a
            href="/create"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all transform hover:scale-105"
          >
            <span>Create Your DAO</span>
            <ArrowRight className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Documentation;