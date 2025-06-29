import React from 'react';
import { Github, Twitter, FileText, Info } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'About', href: '/about', icon: Info },
    { name: 'Documentation', href: '/docs', icon: FileText },
    { name: 'GitHub', href: 'https://github.com/fractalite/PLSDAO', icon: Github, external: true },
    { name: 'Twitter', href: 'https://x.com/PLSDAO', icon: Twitter, external: true }
  ];

  return (
    <footer className="mt-auto border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Links */}
          <div className="flex items-center space-x-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors duration-200 group"
              >
                <link.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">
              © {currentYear} <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">PLSDAO</span> - Built on PulseChain
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;