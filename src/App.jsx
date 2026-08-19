import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductSandbox from './components/ProductSandbox';
import ArchitectureSection from './components/ArchitectureSection';
import TechnicalSpecs from './components/TechnicalSpecs';
import DecisionsDocSection from './components/DecisionsDocSection';
import CommandPalette from './components/CommandPalette';
import EasterEggTerminal from './components/EasterEggTerminal';
import Footer from './components/Footer';

export default function App() {
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);

  const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expectedKey = konamiCode[konamiIndex].length === 1 ? konamiCode[konamiIndex].toLowerCase() : konamiCode[konamiIndex];

      if (key === expectedKey) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === konamiCode.length) {
          setIsEasterEggOpen(true);
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  return (
    <div className="min-h-screen bg-obsidian text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar */}
      <Navbar
        onOpenCommandPalette={() => setIsCmdPaletteOpen(true)}
        onTriggerEasterEgg={() => setIsEasterEggOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          onOpenSandbox={() => {
            document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <ProductSandbox />

        <ArchitectureSection />

        <TechnicalSpecs />

        <DecisionsDocSection />
      </main>

      {/* Footer */}
      <Footer
        onTriggerEasterEgg={() => setIsEasterEggOpen(true)}
      />

      {/* Modals & Overlays */}
      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        onTriggerEasterEgg={() => setIsEasterEggOpen(true)}
      />

      <EasterEggTerminal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />

    </div>
  );
}
