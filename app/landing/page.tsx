"use client";

import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    let fadeState: 'in' | 'playing' | 'out' | 'waiting' = 'in';
    let waitStartTime = 0;

    const DURATION_FADE = 0.5; // 0.5s fade-in/out
    const WAIT_TIME = 100; // 100ms reset

    const updateOpacity = () => {
      if (!video) return;

      const currentTime = video.currentTime;
      const duration = video.duration || 1;

      if (fadeState === 'waiting') {
        if (performance.now() - waitStartTime >= WAIT_TIME) {
          fadeState = 'in';
          video.currentTime = 0;
          video.play().catch(e => console.error('Playback failed:', e));
        }
      } else if (currentTime <= DURATION_FADE) {
        fadeState = 'in';
        video.style.opacity = (currentTime / DURATION_FADE).toString();
      } else if (duration - currentTime <= DURATION_FADE) {
        fadeState = 'out';
        video.style.opacity = ((duration - currentTime) / DURATION_FADE).toString();
      } else {
        fadeState = 'playing';
        video.style.opacity = '1';
      }

      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      fadeState = 'waiting';
      video.style.opacity = '0';
      waitStartTime = performance.now();
    };

    video.addEventListener('ended', handleEnded);
    
    video.play().then(() => {
      animationFrameId = requestAnimationFrame(updateOpacity);
    }).catch(e => console.error('Auto-play blocked', e));

    return () => {
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const universities = ['Oxford', 'Stanford', 'MIT', 'Sorbonne', 'Harvard', 'Cambridge'];
  const logos = [...universities, ...universities];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[hsl(260,87%,3%)] text-[hsl(40,6%,95%)] font-sans mt-0">
      <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" />

      <div className="absolute inset-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          style={{ opacity: 0 }}
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[984px] h-[527px] opacity-90 bg-gray-950 blur-[82px] rounded-full pointer-events-none -z-10" />

      <nav className="w-full flex items-center justify-between py-5 px-8 relative z-20">
        <div className="flex items-center">
          {/* Use standard img for now to match exactly */}
          <img src="/logo.png" alt="Logo" className="h-[32px] w-auto" />
        </div>

        <div className="flex items-center gap-8">
          <button className="flex items-center gap-1.5 text-current/90 hover:text-current transition-colors font-medium">
            Matières <ChevronDown className="w-4 h-4 opacity-70" />
          </button>
          <button className="text-current/90 hover:text-current transition-colors font-medium">Notes</button>
          <button className="text-current/90 hover:text-current transition-colors font-medium">Révisions</button>
          <button className="flex items-center gap-1.5 text-current/90 hover:text-current transition-colors font-medium">
            Ressources <ChevronDown className="w-4 h-4 opacity-70" />
          </button>
        </div>

        <div>
          <button className="bg-white/10 hover:bg-white/20 text-current border border-white/10 rounded-full px-4 py-2 transition-all font-medium backdrop-blur-sm">
            Commencer
          </button>
        </div>
      </nav>

      <div className="w-full h-[1px] mt-[3px] bg-gradient-to-r from-transparent via-white/20 to-transparent relative z-20" />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-4 overflow-visible">
        <h1 className="text-[220px] leading-[1.02] tracking-[-0.024em] font-normal" style={{ fontFamily: "'General Sans', sans-serif" }}>
          <span>Study </span>
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to left, #6366f1, #a855f7, #fcd34d)' }}>AI</span>
        </h1>
        
        <p className="text-[hsl(40,6%,82%)] text-lg leading-8 max-w-md text-center mt-[9px] opacity-80">
          The most powerful environment ever built<br />for writing and organizing your courses
        </p>

        <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-current rounded-full px-[29px] py-[24px] mt-[25px] font-medium text-lg transition-all backdrop-blur-sm">
          Start Writing
        </button>
      </main>

      <div className="w-full max-w-5xl mx-auto pb-10 relative z-20">
        <div className="flex items-center gap-12 overflow-hidden">
          <span className="text-current/50 text-sm whitespace-nowrap shrink-0 leading-snug">
            Trusted by students<br />across universities
          </span>
          <div className="flex-1 overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex items-center gap-16 animate-marquee w-max">
              {logos.map((name, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg liquid-glass flex items-center justify-center text-xs font-bold shrink-0">
                    {name.charAt(0)}
                  </div>
                  <span className="text-base font-semibold text-current">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
