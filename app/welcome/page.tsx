"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setProfilLocal } from "@/lib/localDb";
import { BookOpen, Sparkles, Plus, ArrowRight, Loader2 } from "lucide-react";

export default function WelcomePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "anim">("form");
  const [animText, setAnimText] = useState("");
  const router = useRouter();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setStep("anim");
    try {
      await setProfilLocal(name.trim());
      
      setAnimText("Création de votre espace personnel...");
      await new Promise((r) => setTimeout(r, 1200));
      
      setAnimText("Préparation de l'éditeur de cours riche...");
      await new Promise((r) => setTimeout(r, 1200));

      setAnimText("Configuration du planning intelligent...");
      await new Promise((r) => setTimeout(r, 1200));

      setAnimText(`C'est prêt, ${name.trim()} !`);
      await new Promise((r) => setTimeout(r, 1000));

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setLoading(false);
      setStep("form");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col pt-20">
      <div className="max-w-4xl mx-auto w-full px-6 flex flex-col items-center text-center space-y-12">
        {/* En-tête / Présentation */}
        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-500/20 rounded-full animate-bounce">
              <BookOpen className="text-indigo-400 w-16 h-16" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">
            Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-white">Quartz</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            L'environnement le plus puissant et le plus simple pour structurer tes cours, gérer tes révisions, et booster tes études.
          </p>
        </div>

        {/* Fonctionnalités */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-8 transition-opacity duration-500 ${step === 'anim' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl liquid-glass">
            <BookOpen className="text-indigo-400 w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cours Centralisés</h3>
            <p className="text-sm text-white/50">Organise tes matières avec un éditeur de texte ultra riche.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl liquid-glass">
            <Sparkles className="text-amber-400 w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Interface Fluide</h3>
            <p className="text-sm text-white/50">Un mode sombre immersif et performant pour rester focus.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl liquid-glass">
            <Plus className="text-green-400 w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Planification</h3>
            <p className="text-sm text-white/50">Note tes devoirs, examens et suis tes objectifs au quotidien.</p>
          </div>
        </div>

        {/* Configuration Utilisateur / Animation */}
        <div className="mt-16 w-full max-w-md bg-white/5 p-8 rounded-3xl border border-white/10 liquid-glass shadow-2xl relative overflow-hidden transition-all duration-500">
          
          {step === "form" ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">Commençons la configuration</h2>
              <form onSubmit={handleStart} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                    Comment doit-on t'appeler ?
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder=""
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-50"
                >
                  Entrer dans l'application
                  <ArrowRight size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse"></div>
                <Loader2 className="w-14 h-14 text-violet-400 animate-spin relative z-10" />
              </div>
              <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white text-center h-8">
                {animText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
