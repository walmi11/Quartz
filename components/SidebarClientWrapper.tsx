"use client";
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SidebarClientWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  // Ne pas afficher la barre latérale sur la page d'accueil / welcome
  if (pathname === '/welcome' || pathname === '/landing') {
    return null;
  }

  return (
    <div className={`transition-all duration-300 relative ${isOpen ? 'w-64' : 'w-0 md:w-16'} h-full border-r border-white/10 bg-black/20 backdrop-blur-md z-20 flex flex-col`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="absolute -right-3 top-6 bg-indigo-600 rounded-full p-1 z-30 hover:bg-indigo-500 shadow-lg"
      >
        <Menu size={14} className="text-white" />
      </button>
      <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-64 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
