import React from 'react';
import { BookOpen, Users, Coins, Shield, ArrowRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Learn: React.FC = () => {
  const guides = [
    {
      title: 'What is a DAO?',
      description: 'Learn the fundamentals of Decentralized Autonomous Organizations and how they enable community governance.',
      icon: Users,
      readTime: '5 min read',
      category: 'Basics'
    },
    {
      title: 'Token Distribution Strategies',
      description: 'Critical guide to fair token distribution methods and avoiding common pitfalls that create governance problems.',
      icon: Coins,
      readTime: '10 min read',
      category: 'Governance'
    },
    {
      title: 'Treasury Management Best Practices',
      description: 'Security, diversification, and spending guidelines for managing DAO treasuries effectively.',
      icon: Shield,
      readTime: '8 min read',
      category: 'Security'
    },
    {
      title: 'PulseChain for DAOs',
      description: 'Why PulseChain\'s fast, low-cost infrastructure is ideal for launching and operating your DAO.',
      icon: BookOpen,
      readTime: '6 min read',
      category: 'Platform'
    }
  ];

  const distributionMethods = [
    {
      title: 'Contribution-Based Distribution',
      description: 'Reward early contributors, developers, and community builders based on actual value creation.',
      icon: CheckCircle,
      type: 'recommended'
    },
    {
      title: 'Work-to-Earn Programs',
      description: 'Create tasks and bounties that earn governance tokens for ongoing community participation.',
      icon: CheckCircle,
      type: 'recommended'
    },
    {
      title: 'Anti-Whale Caps',
      description: 'Limit maximum tokens per address to prevent concentration during initial distribution.',
      icon: CheckCircle,
      type: 'recommended'
    },
    {
      title: 'Large Founder Allocations',
      description: 'Avoid giving large token allocations to founders/team as this creates centralization.',
      icon: XCircle,
      type: 'avoid'
    }
  ];

  const governanceParams = [
    {
      param: 'Governance Threshold',
      recommended: '3-5%',
      tooLow: '1-2% (spam proposals)',
      tooHigh: '10%+ (only whales can propose)'
    },
    {
      param: 'Voting Period',
      recommended: '5-10 days',
      tooLow: '1-3 days (excludes members)',
      tooHigh: '30+ days (slows decisions)'
    },
    {
      param: 'Execution Delay',
      recommended: '2-7 days',
      tooLow: '0 days (security risk)',
      tooHigh: '14+ days (too slow)'
    }
  ];

  const faqs = [
    {
      question: 'How do I prevent whale dominance in my DAO?',
      answer: 'Focus on fair initial distribution, contribution-based allocations, anti-whale caps during token creation, and community education. Consider quadratic voting or reputation-based systems for more balanced governance.'
    },
    {
      question: 'What makes PulseChain ideal for DAOs?',
      answer: 'PulseChain offers extremely low transaction costs (under $1 for DAO creation), making it affordable for frequent governance activities like voting and proposal creation. High throughput ensures fast transaction processing for active communities.'
    },
    {
      question: 'What voting threshold should I set?',
      answer: '3-5% for most communities. Too low (1-2%) causes spam proposals, too high (10%+) prevents participation and only allows whales to create proposals.'
    },
    {
      question: 'How much does it cost to create a DAO?',
      answer: 'Creating a DAO on PulseChain typically costs under $1 in network fees, compared to hundreds of dollars on other networks. This includes deploying governance contracts, token contracts, and treasury setup.'
    },
    {
      question: 'Can I modify my DAO after deployment?',
      answer: 'Yes! Our DAO contracts are designed to be upgradeable through governance proposals. Your community can vote to modify parameters like voting thresholds, proposal requirements, and treasury management rules.'
    },
    {
      question: 'What happens to the initial token supply?',
      answer: 'The initial token supply is distributed according to your specifications during creation. You can allocate tokens to founders, reserve them for treasury, or distribute them to early community members through various fair distribution methods.'
    }
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Learn About DAOs</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about creating and managing decentralized 
            autonomous organizations on PulseChain.
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-8 mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Quick Start Guide</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Connect MetaMask to PulseChain (Chain ID: 369)' },
              { step: '2', title: 'Plan Your DAO', desc: 'Define purpose, members, and token distribution strategy' },
              { step: '3', title: 'Configure Governance', desc: 'Set voting rules, thresholds, and treasury parameters' },
              { step: '4', title: 'Deploy & Launch', desc: 'One-click deployment using audited OpenZeppelin contracts' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-300 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Planning Your DAO */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Planning Your DAO</h2>
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8 mb-8">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">Critical Questions to Ask Before Building</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="text-blue-300 font-medium mb-2">What is your DAO's purpose?</h4>
                  <p className="text-blue-200 text-sm">Protocol governance, community fund, project coordination, or social impact?</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="text-green-300 font-medium mb-2">Who are your initial members?</h4>
                  <p className="text-green-200 text-sm">Developers, users, investors, community contributors, or domain experts?</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h4 className="text-purple-300 font-medium mb-2">How will you distribute tokens fairly?</h4>
                  <p className="text-purple-200 text-sm">Contribution-based, work-to-earn, merit airdrops, or time-locked distributions?</p>
                </div>
                <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <h4 className="text-pink-300 font-medium mb-2">What decisions require voting?</h4>
                  <p className="text-pink-200 text-sm">Treasury spending, protocol changes, partnerships, or governance parameter updates?</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Distribution Strategies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Token Distribution Strategies</h2>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-300 font-semibold mb-2">The Most Critical Decision</h3>
                <p className="text-yellow-200">
                  How you distribute governance tokens determines whether your DAO becomes a thriving community 
                  or a plutocracy controlled by whales. Choose your distribution method carefully.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-green-300 mb-6 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Recommended Methods</span>
              </h3>
              <div className="space-y-4">
                {distributionMethods.filter(method => method.type === 'recommended').map((method, index) => (
                  <div key={index} className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-start space-x-3">
                      <method.icon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-green-300 font-medium mb-1">{method.title}</h4>
                        <p className="text-green-200 text-sm">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-red-300 mb-6 flex items-center space-x-2">
                <XCircle className="h-5 w-5" />
                <span>Common Mistakes to Avoid</span>
              </h3>
              <div className="space-y-4">
                {distributionMethods.filter(method => method.type === 'avoid').map((method, index) => (
                  <div key={index} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start space-x-3">
                      <method.icon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-red-300 font-medium mb-1">{method.title}</h4>
                        <p className="text-red-200 text-sm">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-300 font-medium mb-1">ICO/IDO Style Sales</h4>
                      <p className="text-red-200 text-sm">Favors capital over contribution and attracts speculators rather than community builders.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-300 font-medium mb-1">No Sybil Resistance</h4>
                      <p className="text-red-200 text-sm">Allowing one person to control multiple wallets undermines fair distribution.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Governance Parameters */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Setting Effective Governance Parameters</h2>
          <div className="space-y-6">
            {governanceParams.map((param, index) => (
              <div key={index} className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{param.param}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <h4 className="text-red-300 font-medium mb-2">Too Low</h4>
                    <p className="text-red-200 text-sm">{param.tooLow}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="text-green-300 font-medium mb-2">Recommended</h4>
                    <p className="text-green-200 text-sm font-semibold">{param.recommended}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <h4 className="text-red-300 font-medium mb-2">Too High</h4>
                    <p className="text-red-200 text-sm">{param.tooHigh}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Learning Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <guide.icon className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300">
                    {guide.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {guide.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{guide.readTime}</span>
                  <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your DAO?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the decentralized future and launch your organization on PulseChain today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/create"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all transform hover:scale-105"
            >
              <span>Launch Your DAO</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/browse"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl border border-white/20 text-white hover:bg-white/5 font-semibold transition-all"
            >
              <Users className="h-5 w-5" />
              <span>Explore Existing DAOs</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;