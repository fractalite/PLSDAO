import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const featuredDAOs = [
    {
      name: 'PLSDAO Treasury',
      description: 'Community-driven treasury management for PulseChain ecosystem',
      members: 1247,
      tvl: '$2.4M',
      category: 'DeFi'
    },
    {
      name: 'Validators Union',
      description: 'Coordinating PulseChain validators for network security',
      members: 89,
      tvl: '$850K',
      category: 'Infrastructure'
    },
    {
      name: 'Builder Collective',
      description: 'Funding and supporting developers on PulseChain',
      members: 334,
      tvl: '$1.2M',
      category: 'Development'
    },
    {
      name: 'Community Grants',
      description: 'Distributing grants to promising PulseChain projects',
      members: 567,
      tvl: '$3.1M',
      category: 'Funding'
    }
  ];

  const stats = [
    { label: 'DAOs Created', value: '127' },
    { label: 'Total Value Locked', value: '$12.8M' },
    { label: 'Active Members', value: '4,829' },
    { label: 'Proposals Voted', value: '2,341' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Deploy Your DAO
              </span>
              <br />
              <span className="text-white">on PulseChain</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create powerful decentralized organizations with our intuitive wizard. 
              Launch governance tokens, manage treasury, and coordinate your community 
              in minutes, not months.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              to="/create"
              className="group flex items-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              <span>Launch Your DAO</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/browse"
              className="flex items-center space-x-3 px-8 py-4 rounded-xl border border-white/20 text-white hover:bg-white/5 font-semibold text-lg transition-all duration-300"
            >
              <Users className="h-5 w-5" />
              <span>Explore DAOs</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose PLSDAO?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built specifically for PulseChain, our platform offers the most 
              efficient and cost-effective way to launch your DAO.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Deploy your DAO in under 5 minutes with our guided wizard'
              },
              {
                icon: Shield,
                title: 'Battle-Tested Security',
                description: 'Audited smart contracts with industry-standard security practices'
              },
              {
                icon: TrendingUp,
                title: 'Cost Efficient',
                description: 'Leverage PulseChain\'s low fees for affordable governance'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured DAOs */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured DAOs
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover successful DAOs already thriving on PulseChain
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDAOs.map((dao, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                    {dao.category}
                  </span>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {dao.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {dao.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {dao.members} members
                  </span>
                  <span className="text-green-400 font-medium">
                    {dao.tvl} TVL
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/browse"
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              <span>View All DAOs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;