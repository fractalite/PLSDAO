import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, TrendingUp } from 'lucide-react';

const Browse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'DeFi', 'Infrastructure', 'Development', 'Funding', 'Gaming', 'Social'];

  const daos = [
    {
      id: 1,
      name: 'PLSDAO Treasury',
      description: 'Community-driven treasury management for PulseChain ecosystem development and growth.',
      members: 1247,
      tvl: '$2.4M',
      category: 'DeFi',
      status: 'Active',
      proposals: 23,
      contractAddress: '0x1234567890123456789012345678901234567890'
    },
    {
      id: 2,
      name: 'Validators Union',
      description: 'Coordinating PulseChain validators for optimal network security and performance.',
      members: 89,
      tvl: '$850K',
      category: 'Infrastructure',
      status: 'Active',
      proposals: 7,
      contractAddress: '0x2345678901234567890123456789012345678901'
    },
    {
      id: 3,
      name: 'Builder Collective',
      description: 'Supporting and funding innovative developers building on PulseChain.',
      members: 334,
      tvl: '$1.2M',
      category: 'Development',
      status: 'Active',
      proposals: 15,
      contractAddress: '0x3456789012345678901234567890123456789012'
    },
    {
      id: 4,
      name: 'Community Grants',
      description: 'Distributing grants to promising PulseChain projects and initiatives.',
      members: 567,
      tvl: '$3.1M',
      category: 'Funding',
      status: 'Active',
      proposals: 31,
      contractAddress: '0x4567890123456789012345678901234567890123'
    },
    {
      id: 5,
      name: 'PulseGame Guild',
      description: 'Gaming-focused DAO for play-to-earn and GameFi projects on PulseChain.',
      members: 892,
      tvl: '$1.8M',
      category: 'Gaming',
      status: 'Active',
      proposals: 12,
      contractAddress: '0x5678901234567890123456789012345678901234'
    },
    {
      id: 6,
      name: 'Social Impact DAO',
      description: 'Funding social impact initiatives and charitable causes through blockchain.',
      members: 445,
      tvl: '$950K',
      category: 'Social',
      status: 'Active',
      proposals: 8,
      contractAddress: '0x6789012345678901234567890123456789012345'
    }
  ];

  const filteredDAOs = daos.filter(dao => {
    const matchesSearch = dao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dao.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || dao.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Browse DAOs</h1>
          <p className="text-xl text-gray-300">
            Discover and join decentralized organizations on PulseChain
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search DAOs..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">{daos.length}</div>
            <div className="text-gray-400 text-sm">Total DAOs</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">
              {daos.reduce((acc, dao) => acc + dao.members, 0).toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Members</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">$10.2M</div>
            <div className="text-gray-400 text-sm">Total TVL</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">
              {daos.reduce((acc, dao) => acc + dao.proposals, 0)}
            </div>
            <div className="text-gray-400 text-sm">Total Proposals</div>
          </div>
        </div>

        {/* DAO Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDAOs.map((dao) => (
            <div
              key={dao.id}
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                  {dao.category}
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-400">{dao.status}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {dao.name}
              </h3>
              <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                {dao.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">{dao.members.toLocaleString()} members</span>
                  </div>
                  <span className="text-green-400 font-medium">{dao.tvl}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">{dao.proposals} proposals</span>
                  </div>
                  <Link
                    to={`/dao/${dao.contractAddress}`}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDAOs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No DAOs found</div>
            <p className="text-gray-500">Try adjusting your search terms or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;