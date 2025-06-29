import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Target, Heart } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'Every community deserves sovereign governance without complexity'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Deploy governance-enabled organizations in under 5 minutes'
    },
    {
      icon: Target,
      title: 'Purpose Built',
      description: 'Built specifically for PulseChain\'s fast, low-cost infrastructure'
    },
    {
      icon: Heart,
      title: 'Accessible',
      description: 'Make decentralized governance accessible to everyone, not just experts'
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
            About <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">PLSDAO</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            The easiest way to launch decentralized autonomous organizations on PulseChain
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            PLSDAO is the easiest way to launch decentralized autonomous organizations (DAOs) on PulseChain. 
            We believe every community deserves sovereign governance without the complexity of traditional smart contract deployment.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Built specifically for PulseChain's fast, low-cost infrastructure, PLSDAO enables projects, communities, 
            and tribes to deploy governance-enabled organizations in under 5 minutes. From meme coin communities to 
            serious DeFi protocols, we provide the tools for collective decision-making.
          </p>
          <p className="text-lg text-purple-300 font-medium">
            Our mission is simple: make decentralized governance accessible to everyone on PulseChain, not just technical experts.
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Who We Serve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Who We Serve</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Projects</h3>
              <p className="text-gray-300 text-sm">DeFi protocols and innovative blockchain projects</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Communities</h3>
              <p className="text-gray-300 text-sm">Online communities seeking decentralized governance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Tribes</h3>
              <p className="text-gray-300 text-sm">Meme coin communities and cultural movements</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Build Your DAO?</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of communities already governing on PulseChain
          </p>
          <a
            href="/create"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all transform hover:scale-105"
          >
            <span>Start Building</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default About;